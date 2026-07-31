import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { logger } from "@vizagops/logger";

const clients = new Set<WebSocket>();

export const initWebSocketServer = (server: http.Server) => {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    clients.add(ws);
    logger.info({ message: "WebSocket client connected", count: clients.size });

    ws.on("close", () => {
      clients.delete(ws);
      logger.info({ message: "WebSocket client disconnected", count: clients.size });
    });

    ws.on("error", (err) => {
      logger.error("WebSocket client error", { error: err.message });
    });
  });
};

export const broadcastEvent = (type: string, data: any) => {
  const payload = JSON.stringify({ type, data });
  logger.info({ message: "Broadcasting WS event", type, clientsCount: clients.size });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};
