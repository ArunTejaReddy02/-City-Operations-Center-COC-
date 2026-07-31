import { sendSuccess } from "@vizagops/api";
import { AuditService } from "./service";

const service = new AuditService();

export const createLog = async (req: any, res: any, next: any) => {
  try {
    const telemetry = {
      requestId: req.requestId,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers["user-agent"],
      service: req.body.service
    };
    const log = await service.createLog(req.validatedBody, telemetry);
    sendSuccess(res, log, "Audit log created securely");
  } catch (err) { next(err); }
};

export const verifyChain = async (req: any, res: any, next: any) => {
  try {
    const result = await service.verifyChain();
    sendSuccess(res, result, "Audit chain verified");
  } catch (err) { next(err); }
};

export const getLog = async (req: any, res: any, next: any) => {
  try {
    const log = await service.getLogById(req.params.id);
    if (!log) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Audit log not found" } });
    sendSuccess(res, log, "Audit log retrieved");
  } catch (err) { next(err); }
};
