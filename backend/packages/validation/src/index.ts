import { z } from "zod";

export const CreateComplaintSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const CreateAuditSchema = z.object({
  entity: z.string(),
  entityId: z.string(),
  action: z.string(),
  performedBy: z.string().optional(),
  metadata: z.any().optional()
});

export const RegisterUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "WARD_OFFICER", "FIELD_AGENT", "CITIZEN"]).optional(),
});

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const CreateFieldTeamSchema = z.object({
  name: z.string().min(1),
  members: z.array(z.string()),
  currentLat: z.number().optional(),
  currentLng: z.number().optional(),
});

export const UpdateFieldTeamSchema = z.object({
  name: z.string().optional(),
  members: z.array(z.string()).optional(),
  currentLat: z.number().optional(),
  currentLng: z.number().optional(),
  availability: z.enum(["AVAILABLE", "BUSY", "OFFLINE"]).optional(),
});

export const CreateAssignmentSchema = z.object({
  complaintId: z.string().uuid(),
  fieldTeamId: z.string().uuid(),
});

export const UpdateAssignmentSchema = z.object({
  status: z.enum(["PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});
