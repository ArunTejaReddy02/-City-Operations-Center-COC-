import { ApiResponse } from "@vizagops/types";
import { logger } from "@vizagops/logger";
import { prisma, Role, User } from "@vizagops/prisma";
import { config } from "@vizagops/config";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      requestId?: string;
      validatedBody?: any;
    }
  }
}

export const sendSuccess = (res: any, data: any, message = "Success") => {
  res.json({ success: true, data, message } as ApiResponse);
};

export const globalErrorHandler = (err: any, req: any, res: any, next: any) => {
  logger.error("Unhandled Error", { error: err.message, stack: err.stack, requestId: req.requestId });
  
  const errorCode = err.code || "INTERNAL_ERROR";
  const errorStatus = err.status || 500;
  
  res.status(errorStatus).json({ 
    success: false, 
    error: { 
      code: errorCode, 
      message: err.message || "An unexpected error occurred",
      details: err.details 
    } 
  } as ApiResponse);
};

export const validateRequest = (schema: any) => (req: any, res: any, next: any) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      success: false, 
      error: { 
        code: "VALIDATION_ERROR", 
        message: "Invalid request body", 
        details: result.error.errors 
      } 
    } as ApiResponse);
  }
  req.validatedBody = result.data;
  next();
};

export const authenticateJWT = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      error: { code: "UNAUTHORIZED", message: "Authorization token missing" } 
    } as ApiResponse);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as { userId: string; role: Role; email: string };
    
    // DB Check: Verify user exists, is active and not soft-deleted
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive || user.deletedAt !== null) {
      return res.status(401).json({ 
        success: false, 
        error: { code: "UNAUTHORIZED", message: "User account is suspended or deleted" } 
      } as ApiResponse);
    }

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ 
      success: false, 
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" } 
    } as ApiResponse);
  }
};

export const requireRole = (allowedRoles: Role[]) => (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: { code: "UNAUTHORIZED", message: "Authentication required" } 
    } as ApiResponse);
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      error: { code: "USER_NOT_AUTHORIZED", message: "Access forbidden for this user role" } 
    } as ApiResponse);
  }

  next();
};
