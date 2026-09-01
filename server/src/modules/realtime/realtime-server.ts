import type { Server as HttpServer } from "http";
import { Server as SocketIoServer } from "socket.io";
import { authenticateSocketConnection } from "./socket-auth.middleware";
import { registerConnectionHandlers } from "./realtime-connection.handler";

let realtimeServer: SocketIoServer | null = null;

export function initializeRealtimeServer(httpServer: HttpServer): SocketIoServer {
  realtimeServer = new SocketIoServer(httpServer);
  realtimeServer.use(authenticateSocketConnection);
  realtimeServer.on("connection", registerConnectionHandlers);
  return realtimeServer;
}

export function getRealtimeServer(): SocketIoServer {
  if (realtimeServer === null) {
    throw new Error("Realtime server was not initialized yet.");
  }
  return realtimeServer;
}
