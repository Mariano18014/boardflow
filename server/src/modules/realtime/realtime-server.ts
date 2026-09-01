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

// Notify functions call this to reach the same server instance the
// connection handlers joined sockets to rooms on. It's only ever undefined
// if a notify function runs before initializeRealtimeServer, which the
// server's own startup order (see index.ts) never allows.
export function getRealtimeServer(): SocketIoServer {
  if (realtimeServer === null) {
    throw new Error("Realtime server was not initialized yet.");
  }
  return realtimeServer;
}
