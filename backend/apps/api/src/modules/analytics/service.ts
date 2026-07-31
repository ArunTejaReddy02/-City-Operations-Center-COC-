import { prisma } from "@vizagops/prisma";

/**
 * AnalyticsService — Dashboard-grade aggregated metrics.
 * 
 * Provides real-time stats for the operator dashboard:
 * - Complaint breakdown by category, priority, status
 * - Team utilization metrics
 * - Resolution time analytics
 * - Ward-level heat data
 */
export class AnalyticsService {
  /**
   * Get full dashboard analytics snapshot.
   */
  async getDashboardStats() {
    const [
      totalComplaints,
      complaintsByStatus,
      complaintsByCategory,
      complaintsByPriority,
      totalTeams,
      teamsByAvailability,
      totalAssignments,
      assignmentsByStatus,
      recentComplaints,
      sensorEventCount
    ] = await Promise.all([
      // Total complaints
      prisma.complaint.count(),

      // Complaints grouped by status
      prisma.complaint.groupBy({
        by: ["status"],
        _count: { id: true }
      }),

      // Complaints grouped by category
      prisma.complaint.groupBy({
        by: ["category"],
        _count: { id: true }
      }),

      // Complaints grouped by priority
      prisma.complaint.groupBy({
        by: ["priority"],
        _count: { id: true }
      }),

      // Total field teams
      prisma.fieldTeam.count(),

      // Teams by availability status
      prisma.fieldTeam.groupBy({
        by: ["availability"],
        _count: { id: true }
      }),

      // Total assignments
      prisma.assignment.count(),

      // Assignments by status
      prisma.assignment.groupBy({
        by: ["status"],
        _count: { id: true }
      }),

      // Recent complaints (last 24h)
      prisma.complaint.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      }),

      // Sensor events (last 24h)
      prisma.sensorEvent.count({
        where: {
          timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      })
    ]);

    // Calculate resolution rate
    const resolvedCount = complaintsByStatus.find((s: any) => s.status === "RESOLVED")?._count.id || 0;
    const resolutionRate = totalComplaints > 0
      ? Math.round((resolvedCount / totalComplaints) * 100)
      : 0;

    // Calculate team utilization
    const availableCount = teamsByAvailability.find((t: any) => t.availability === "AVAILABLE")?._count.id || 0;
    const busyCount = teamsByAvailability.find((t: any) => t.availability === "BUSY")?._count.id || 0;
    const teamUtilization = totalTeams > 0
      ? Math.round((busyCount / totalTeams) * 100)
      : 0;

    return {
      overview: {
        totalComplaints,
        activeComplaints: totalComplaints - resolvedCount,
        resolvedComplaints: resolvedCount,
        resolutionRate,
        complaintsLast24h: recentComplaints,
        sensorEventsLast24h: sensorEventCount,
        totalAssignments
      },
      complaints: {
        byStatus: this.groupByToMap(complaintsByStatus, "status"),
        byCategory: this.groupByToMap(complaintsByCategory, "category"),
        byPriority: this.groupByToMap(complaintsByPriority, "priority")
      },
      teams: {
        total: totalTeams,
        available: availableCount,
        busy: busyCount,
        offline: teamsByAvailability.find((t: any) => t.availability === "OFFLINE")?._count.id || 0,
        utilization: teamUtilization
      },
      assignments: {
        total: totalAssignments,
        byStatus: this.groupByToMap(assignmentsByStatus, "status")
      }
    };
  }

  /**
   * Get ward-level complaint distribution.
   */
  async getWardDistribution() {
    const wardData = await prisma.complaint.groupBy({
      by: ["ward"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } }
    });

    return wardData.map((w: any) => ({
      ward: w.ward || "UNASSIGNED",
      count: w._count.id
    }));
  }

  /**
   * Helper: Convert Prisma groupBy result to { key: count } map.
   */
  private groupByToMap(groupByResult: any[], keyField: string): Record<string, number> {
    const map: Record<string, number> = {};
    for (const item of groupByResult) {
      const key = item[keyField] || "UNKNOWN";
      map[key] = item._count.id;
    }
    return map;
  }
}
