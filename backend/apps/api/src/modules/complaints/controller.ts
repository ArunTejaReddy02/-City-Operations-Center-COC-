import { sendSuccess } from "@vizagops/api";
import { ComplaintService } from "./service";
import { broadcastEvent } from "../../ws";

const service = new ComplaintService();

export const createComplaint = async (req: any, res: any, next: any) => {
  try {
    const telemetry = { requestId: req.requestId };
    const complaint = await service.processComplaint(req.validatedBody, telemetry);

    // Broadcast mapped event for frontend operators
    broadcastEvent("complaint.new", {
      complaint_id: complaint.id,
      type: complaint.category?.toLowerCase() || "pothole",
      description: complaint.description || "",
      location: { lat: complaint.latitude, lng: complaint.longitude },
      ward_id: complaint.ward || "GVMC-W12",
      status: complaint.status?.toLowerCase() || "received",
      reported_at: complaint.createdAt
    });

    sendSuccess(res, complaint, "Complaint processed and audited successfully");
  } catch (err) { next(err); }
};

export const getComplaints = async (req: any, res: any, next: any) => {
  try {
    const role = req.user.role;
    let complaints;
    if (role === "CITIZEN") {
      complaints = await service.getComplaintsByCitizen(req.user.id);
    } else {
      complaints = await service.getAllComplaints();
    }
    sendSuccess(res, complaints, "Complaints retrieved successfully");
  } catch (err) { next(err); }
};
