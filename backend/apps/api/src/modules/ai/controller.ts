import { Request, Response, NextFunction } from "express";
import { generateComplaintSummary, calculateAIPriority } from "./service";

export const handleSummarize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, category, ward } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_REQUEST", message: "Title and description are required for AI summary." }
      });
    }

    const summary = await generateComplaintSummary({ title, description, category, ward });

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

export const handlePrioritize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { complaintTitle, complaintDescription, category, nearbySensorEvents } = req.body;

    if (!complaintTitle || !complaintDescription || !category) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_REQUEST", message: "complaintTitle, complaintDescription, and category are required." }
      });
    }

    const priorityData = await calculateAIPriority({
      complaintTitle,
      complaintDescription,
      category,
      nearbySensorEvents
    });

    return res.status(200).json({
      success: true,
      data: priorityData
    });
  } catch (error) {
    next(error);
  }
};
