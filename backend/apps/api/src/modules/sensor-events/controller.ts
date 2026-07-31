import { sendSuccess } from "@vizagops/api";
import { SensorEventService } from "./service";
import { broadcastEvent } from "../../ws";

const service = new SensorEventService();

export const createSensorEvent = async (req: any, res: any, next: any) => {
  try {
    const event = await service.createEvent(req.body);
    // Broadcast the new event in the format expected by the frontend
    broadcastEvent("sensor.new", {
      event_id: event.id,
      asset_id: event.id.slice(0, 8),
      event_type: event.type,
      location: { lat: event.latitude || 17.6871, lng: event.longitude || 83.2183 },
      timestamp: event.timestamp,
      confidence: 0.9,
      source: "COC"
    });
    sendSuccess(res, event, "Sensor event created and broadcasted successfully");
  } catch (err) { next(err); }
};

export const getSensorEvents = async (req: any, res: any, next: any) => {
  try {
    const events = await service.getAllEvents();
    // Map database sensor events to frontend schema
    const mapped = events.map(event => ({
      event_id: event.id,
      asset_id: event.id.slice(0, 8),
      event_type: event.type,
      location: { lat: event.latitude || 17.6871, lng: event.longitude || 83.2183 },
      timestamp: event.timestamp,
      confidence: 0.9,
      source: "COC"
    }));
    sendSuccess(res, mapped, "Sensor events retrieved successfully");
  } catch (err) { next(err); }
};
