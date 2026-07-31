import { sendSuccess } from "@vizagops/api";
import { FieldTeamService } from "./service";
import { broadcastEvent } from "../../ws";

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

    // Broadcast WebSocket team update
    broadcastEvent("team.update", {
      team_id: team.id,
      status: team.availability?.toLowerCase() || "available",
      location: { lat: team.currentLat, lng: team.currentLng }
    });

    sendSuccess(res, team, "Field team created");
  } catch (err) { next(err); }
};

export const update = async (req: any, res: any, next: any) => {
  try {
    const telemetry = { requestId: req.requestId, userEmail: req.user.email };
    const team = await service.update(req.params.id, req.validatedBody, telemetry);

    // Broadcast WebSocket team update
    broadcastEvent("team.update", {
      team_id: team.id,
      status: team.availability?.toLowerCase() || "available",
      location: { lat: team.currentLat, lng: team.currentLng }
    });

    sendSuccess(res, team, "Field team updated");
  } catch (err) { next(err); }
};
