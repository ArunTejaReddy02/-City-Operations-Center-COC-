import { sendSuccess } from "@vizagops/api";
import { prisma } from "@vizagops/prisma";

/**
 * GET /api/v1/status/:complaintId
 * Public endpoint — no auth required.
 * Returns complaint status + assigned team info for citizen tracking.
 */
export const getComplaintStatus = async (req: any, res: any, next: any) => {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: req.params.complaintId }
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        error: { code: "COMPLAINT_NOT_FOUND", message: "Complaint not found" }
      });
    }

    // Find the latest active assignment for this complaint
    const assignment = await prisma.assignment.findFirst({
      where: { complaintId: complaint.id },
      include: { fieldTeam: true },
      orderBy: { assignedAt: "desc" }
    });

    const statusInfo: any = {
      complaintId: complaint.id,
      title: complaint.title,
      category: complaint.category,
      status: complaint.status,
      ward: complaint.ward,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      estimatedResolutionTime: complaint.estimatedResolutionTime,
      resolutionNotes: complaint.resolutionNotes,
    };

    if (assignment) {
      statusInfo.assignment = {
        status: assignment.status,
        assignedAt: assignment.assignedAt,
        completedAt: assignment.completedAt,
        team: {
          name: assignment.fieldTeam.name,
          members: assignment.fieldTeam.members.length,
        }
      };
    }

    sendSuccess(res, statusInfo, "Complaint status retrieved");
  } catch (err) { next(err); }
};
