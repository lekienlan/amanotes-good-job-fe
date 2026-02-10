import { io, type Socket } from 'socket.io-client';
import { APP_CONFIG } from 'shared/constants/app';
import type { Kudo } from 'domain/models';

/**
 * Realtime Kudo Feed WebSocket API integration.
 * Connects to Socket.io server, subscribes to kudo-feed room, and emits typed events.
 * UI layer subscribes via on* off* methods and updates its state accordingly.
 */

export const KUDO_SOCKET_EVENTS = {
  CREATED: 'kudo:created',
  UPDATED: 'kudo:updated',
  DELETED: 'kudo:deleted',
  REACTION_ADDED: 'kudo:reaction_added',
  REACTION_REMOVED: 'kudo:reaction_removed'
} as const;

type KudoCreatedHandler = (kudo: Kudo) => void;
type KudoUpdatedHandler = (kudo: Kudo) => void;
type KudoDeletedHandler = (payload: { id: string }) => void;

let socket: Socket | null = null;

/**
 * Connects to the Socket.io server for the kudo feed.
 * Sends JWT in auth so the server can associate the connection with the user.
 */
export function connectKudosSocket(accessToken: string | null): Socket | null {
  if (socket?.connected) {
    return socket;
  }

  if (!accessToken) {
    return null;
  }

  socket = io(APP_CONFIG.API_BASE_URL, {
    auth: { token: accessToken },
    path: '/socket.io'
  });

  return socket;
}

/**
 * Disconnects the kudo feed socket.
 */
export function disconnectKudosSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Returns the current socket instance, if connected.
 */
export function getKudosSocket(): Socket | null {
  return socket?.connected ? socket : null;
}

/**
 * Subscribes to kudo:created events.
 */
export function onKudoCreated(handler: KudoCreatedHandler): () => void {
  if (!socket) return () => {};
  socket.on(KUDO_SOCKET_EVENTS.CREATED, handler);
  return () => socket?.off(KUDO_SOCKET_EVENTS.CREATED, handler);
}

/**
 * Subscribes to kudo:updated events.
 */
export function onKudoUpdated(handler: KudoUpdatedHandler): () => void {
  if (!socket) return () => {};
  socket.on(KUDO_SOCKET_EVENTS.UPDATED, handler);
  return () => socket?.off(KUDO_SOCKET_EVENTS.UPDATED, handler);
}

/**
 * Subscribes to kudo:deleted events.
 */
export function onKudoDeleted(handler: KudoDeletedHandler): () => void {
  if (!socket) return () => {};
  socket.on(KUDO_SOCKET_EVENTS.DELETED, handler);
  return () => socket?.off(KUDO_SOCKET_EVENTS.DELETED, handler);
}

/**
 * Subscribes to kudo:reaction_added events.
 */
export function onKudoReactionAdded(handler: KudoUpdatedHandler): () => void {
  if (!socket) return () => {};
  socket.on(KUDO_SOCKET_EVENTS.REACTION_ADDED, handler);
  return () => socket?.off(KUDO_SOCKET_EVENTS.REACTION_ADDED, handler);
}

/**
 * Subscribes to kudo:reaction_removed events.
 */
export function onKudoReactionRemoved(handler: KudoUpdatedHandler): () => void {
  if (!socket) return () => {};
  socket.on(KUDO_SOCKET_EVENTS.REACTION_REMOVED, handler);
  return () => socket?.off(KUDO_SOCKET_EVENTS.REACTION_REMOVED, handler);
}
