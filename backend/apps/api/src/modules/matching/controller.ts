import { sendSuccess } from "@vizagops/api";
import { MatchingService } from "./service";

const service = new MatchingService();

/**
 * POST /api/v1/matching/correlate
 * Correlate a complaint with nearby sensor events.
 */
export const correlateComplaint = async (req: any, res: any, next: any) => {
  try {
    const { complaintId, radiusKm } = req.body;
    const result = await service.correlateComplaintWithSensors(complaintId, radiusKm);
    sendSuccess(res, result, "Correlation analysis complete");
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/matching/suggest-team/:complaintId
 * Suggest nearest available field teams for a complaint.
 */
export const suggestTeam = async (req: any, res: any, next: any) => {
  try {
    const result = await service.suggestNearestTeam(req.params.complaintId);
    sendSuccess(res, result, "Team suggestions generated");
  } catch (err) { next(err); }
};
