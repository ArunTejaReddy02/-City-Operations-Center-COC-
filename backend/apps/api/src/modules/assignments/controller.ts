import { sendSuccess } from "@vizagops/api";
import { AssignmentService } from "./service";
const service = new AssignmentService();
export const createAssignment = async (req: any, res: any, next: any) => {
  try {
    const telemetry = {
      requestId: req.requestId,
      userId: req.user.id,
      userEmail: req.user.email
    };
    const assignment = await service.createAssignment(req.validatedBody, telemetry);
    sendSuccess(res, assignment, "Team assigned successfully");
  } catch (err) { next(err); }
};
export const updateAssignment = async (req: any, res: any, next: any) => {
  try {
    const telemetry = {
      requestId: req.requestId,
      userEmail: req.user.email
    };
    const assignment = await service.updateAssignmentStatus(req.params.id, req.validatedBody, telemetry);
    sendSuccess(res, assignment, "Assignment status updated successfully");
  } catch (err) { next(err); }
};
