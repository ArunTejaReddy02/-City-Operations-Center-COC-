import { prisma, FieldTeamStatus, AssignmentStatus } from "@vizagops/prisma";
import axios from "axios";
export class AssignmentService {
  async createAssignment(payload: any, telemetry: any) {
    const { complaintId, fieldTeamId } = payload;
    const result = await prisma.$transaction(async (tx) => {
      const complaint = await tx.complaint.findUnique({ where: { id: complaintId } });
      if (!complaint) {
        const err: any = new Error("Complaint not found");
        err.code = "COMPLAINT_NOT_FOUND";
        err.status = 404;
        throw err;
      }
      const allowedStates = ["PENDING", "OPEN"];
      if (!allowedStates.includes(complaint.status.toUpperCase())) {
        const err: any = new Error("Complaint is not in an assignable state");
        err.code = "INVALID_ASSIGNMENT_STATE";
        err.status = 400;
        throw err;
      }
      const activeAssignment = await tx.assignment.findFirst({
        where: {
          complaintId,
          status: { in: [AssignmentStatus.PENDING, AssignmentStatus.ASSIGNED, AssignmentStatus.IN_PROGRESS] }
        }
      });
      if (activeAssignment) {
        const err: any = new Error("Complaint already has an active assignment");
        err.code = "COMPLAINT_ALREADY_ASSIGNED";
        err.status = 400;
        throw err;
      }
      const team = await tx.fieldTeam.findUnique({ where: { id: fieldTeamId } });
      if (!team) {
        const err: any = new Error("Field team not found");
        err.code = "TEAM_NOT_FOUND";
        err.status = 404;
        throw err;
      }
      if (team.availability !== FieldTeamStatus.AVAILABLE) {
        const err: any = new Error("Field team is not available");
        err.code = "TEAM_NOT_AVAILABLE";
        err.status = 400;
        throw err;
      }
      const assignment = await tx.assignment.create({
        data: {
          complaintId,
          fieldTeamId,
          assignedById: telemetry.userId,
          status: AssignmentStatus.ASSIGNED
        }
      });
      await tx.fieldTeam.update({
        where: { id: fieldTeamId },
        data: { availability: FieldTeamStatus.BUSY }
      });
      await tx.complaint.update({
        where: { id: complaintId },
        data: { status: "OPEN" }
      });
      return assignment;
    });
    try {
      await axios.post("http://localhost:3001/api/v1/audit/log", {
        entity: "Assignment",
        entityId: result.id,
        action: "CREATE",
        performedBy: telemetry.userEmail,
        metadata: { complaintId, fieldTeamId }
      }, { headers: { "x-request-id": telemetry.requestId } });
    } catch (auditErr) {
      console.error("Failed to write audit event for assignment create");
    }
    return result;
  }
  async updateAssignmentStatus(id: string, payload: any, telemetry: any) {
    const { status } = payload;
    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.findUnique({ where: { id } });
      if (!assignment) {
        const err: any = new Error("Assignment not found");
        err.code = "ASSIGNMENT_NOT_FOUND";
        err.status = 404;
        throw err;
      }
      const updated = await tx.assignment.update({
        where: { id },
        data: {
          status,
          completedAt: status === AssignmentStatus.COMPLETED ? new Date() : null
        }
      });
      if (status === AssignmentStatus.COMPLETED || status === AssignmentStatus.CANCELLED) {
        await tx.fieldTeam.update({
          where: { id: assignment.fieldTeamId },
          data: { availability: FieldTeamStatus.AVAILABLE }
        });
        if (status === AssignmentStatus.COMPLETED) {
          await tx.complaint.update({
            where: { id: assignment.complaintId },
            data: { status: "RESOLVED" }
          });
        }
      }
      return updated;
    });
    try {
      await axios.post("http://localhost:3001/api/v1/audit/log", {
        entity: "Assignment",
        entityId: result.id,
        action: "UPDATE_STATUS",
        performedBy: telemetry.userEmail,
        metadata: { status }
      }, { headers: { "x-request-id": telemetry.requestId } });
    } catch (auditErr) {
      console.error("Failed to write audit event for assignment update");
    }
    return result;
  }
}
