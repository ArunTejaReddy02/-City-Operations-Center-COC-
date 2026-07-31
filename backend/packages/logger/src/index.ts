import { createLogger, format, transports } from "winston";
import crypto from "crypto";
export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console({ format: format.combine(format.colorize(), format.simple()) })]
});
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  res.on("finish", () => {
    logger.info({ message: "API Request", requestId, route: req.originalUrl, method: req.method, statusCode: res.statusCode, latency: Date.now() - start });
  });
  next();
};
