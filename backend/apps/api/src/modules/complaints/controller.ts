import { sendSuccess } from "@vizagops/api";
import { ComplaintService } from "./service";

const service = new ComplaintService();

export const createComplaint = async (req: any, res: any, next: any) => {
  try {
    const telemetry = { requestId: req.requestId };
    const complaint = await service.processComplaint(req.validatedBody, telemetry);
    sendSuccess(res, complaint, "Complaint processed and audited successfully");
  } catch (err) { next(err); }
};
