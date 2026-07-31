import { prisma } from "@vizagops/prisma";

/**
 * MatchingService — Core correlation engine.
 * 
 * Implements rule-based complaint-to-sensor correlation and 
 * nearest-team routing using the Haversine formula.
 */
export class MatchingService {
  /**
   * Haversine formula — calculates distance in km between two lat/lng points.
   */
  private haversineDistance(
    lat1: number, lng1: number,
    lat2: number, lng2: number
  ): number {
    const R = 6371; // Earth radius in km
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /**
   * Correlate a complaint with nearby sensor events.
   * Finds sensor events within a configurable radius (default 1km)
   * that occurred within the last 24 hours.
   */
  async correlateComplaintWithSensors(complaintId: string, radiusKm = 1) {
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) {
      const err: any = new Error("Complaint not found");
      err.code = "COMPLAINT_NOT_FOUND"; err.status = 404;
      throw err;
    }

    if (!complaint.latitude || !complaint.longitude) {
      return { complaint, correlatedSensors: [], message: "Complaint has no location data" };
    }

    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sensorEvents = await prisma.sensorEvent.findMany({
      where: { timestamp: { gte: cutoffTime } },
      orderBy: { timestamp: "desc" },
      take: 200
    });

    // Filter by geographic proximity
    const correlated = sensorEvents
      .filter((ev: any) => ev.latitude != null && ev.longitude != null)
      .map((ev: any) => ({
        ...ev,
        distanceKm: this.haversineDistance(
          complaint.latitude!, complaint.longitude!,
          ev.latitude!, ev.longitude!
        )
      }))
      .filter((ev: any) => ev.distanceKm <= radiusKm)
      .sort((a: any, b: any) => a.distanceKm - b.distanceKm);

    return {
      complaint: {
        id: complaint.id,
        title: complaint.title,
        category: complaint.category,
        location: { lat: complaint.latitude, lng: complaint.longitude }
      },
      correlatedSensors: correlated.map((ev: any) => ({
        id: ev.id,
        type: ev.type,
        severity: ev.severity,
        location: { lat: ev.latitude, lng: ev.longitude },
        distanceKm: Math.round(ev.distanceKm * 1000) / 1000,
        timestamp: ev.timestamp
      })),
      totalCorrelated: correlated.length,
      searchRadiusKm: radiusKm
    };
  }

  /**
   * Suggest the nearest available field teams for a complaint.
   * Returns top-3 ranked teams with distance and ETA.
   */
  async suggestNearestTeam(complaintId: string) {
    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) {
      const err: any = new Error("Complaint not found");
      err.code = "COMPLAINT_NOT_FOUND"; err.status = 404;
      throw err;
    }

    if (!complaint.latitude || !complaint.longitude) {
      return { complaint, suggestedTeams: [], message: "Complaint has no location data" };
    }

    const availableTeams = await prisma.fieldTeam.findMany({
      where: { availability: "AVAILABLE" }
    });

    const ranked = availableTeams
      .filter((t: any) => t.currentLat != null && t.currentLng != null)
      .map((team: any) => {
        const distKm = this.haversineDistance(
          complaint.latitude!, complaint.longitude!,
          team.currentLat!, team.currentLng!
        );
        // Estimate ETA: assume 30 km/h average speed in urban Vizag
        const etaMinutes = Math.max(3, Math.round((distKm / 30) * 60));
        return {
          teamId: team.id,
          teamName: team.name,
          location: { lat: team.currentLat, lng: team.currentLng },
          distanceKm: Math.round(distKm * 1000) / 1000,
          etaMinutes,
          members: team.members
        };
      })
      .sort((a: any, b: any) => a.distanceKm - b.distanceKm)
      .slice(0, 3); // Top 3 suggestions

    return {
      complaint: {
        id: complaint.id,
        title: complaint.title,
        category: complaint.category,
        priority: complaint.priority,
        location: { lat: complaint.latitude, lng: complaint.longitude }
      },
      suggestedTeams: ranked,
      totalAvailable: availableTeams.length
    };
  }
}
