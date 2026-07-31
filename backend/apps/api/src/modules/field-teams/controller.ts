import { sendSuccess } from "@vizagops/api";
import { FieldTeamService } from "./service";
const service = new FieldTeamService();
export const getAll = async (req: any, res: any, next: any) => {
  try {
    const teams = await service.getAll();
    sendSuccess(res, teams, "Field teams retrieved");
  } catch (err) { next(err); }
};
export const create = async (req: any, res: any, next: any) => {
  try {
    const telemetry = { requestId: req.requestId, userEmail: req.user.email };
    const team = await service.create(req.validatedBody, telemetry);
    sendSuccess(res, team, "Field team created");
  } catch (err) { next(err); }
};
export const update = async (req: any, res: any, next: any) => {
  try {
    const telemetry = { requestId: req.requestId, userEmail: req.user.email };
    const team = await service.update(req.params.id, req.validatedBody, telemetry);
    sendSuccess(res, team, "Field team updated");
  } catch (err) { next(err); }
};
