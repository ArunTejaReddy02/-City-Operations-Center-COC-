import { sendSuccess } from "@vizagops/api";
import { AnalyticsService } from "./service";

const service = new AnalyticsService();

/**
 * GET /api/v1/analytics/dashboard
 * Aggregated dashboard statistics.
 */
export const getDashboardStats = async (req: any, res: any, next: any) => {
  try {
    const stats = await service.getDashboardStats();
    sendSuccess(res, stats, "Dashboard analytics retrieved");
  } catch (err) { next(err); }
};

/**
 * GET /api/v1/analytics/wards
 * Ward-level complaint distribution.
 */
export const getWardDistribution = async (req: any, res: any, next: any) => {
  try {
    const wards = await service.getWardDistribution();
    sendSuccess(res, wards, "Ward distribution retrieved");
  } catch (err) { next(err); }
};
