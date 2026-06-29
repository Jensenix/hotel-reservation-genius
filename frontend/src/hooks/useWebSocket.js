/**
 * @module useWebSocket
 * Subscribe to a named Socket.IO event from any component.
 *
 * Usage:
 * useWebSocket(RealtimeEvents.BOOKING.CREATED, (data, context) => {
 * console.log('Fired at:', context.timestamp);
 * setBookings(prev => [...prev, data]);
 * });
 *
 * The hook is safe to call even when the socket is not yet connected —
 * if the socket is null the subscription is a no-op and nothing errors.
 *
 * Callback changes are handled via a ref so the latest version is always
 * invoked without needing to tear down and re-register the listener.
 */

import { useContext, useEffect, useRef } from 'react';
import { WebSocketContext } from '@/context/WebSocketContext';

/**
 * Subscribes to a single Socket.IO event for the lifetime of the component.
 *
 * @param {string}   eventName - The Socket.IO event to listen for
 * (e.g. 'booking:created')
 * @param {Function} callback  - Handler invoked with the unwrapped payload `data`.
 * Also provides a second argument `context` containing
 * the timestamp, meta properties, and raw envelope.
 */
export function useWebSocket(eventName, callback) {
  const socket = useContext(WebSocketContext);

  /**
   * Store the latest callback in a ref so the stable event listener
   * (registered once in the effect below) always calls the current version.
   * This avoids the stale-closure problem without re-registering on every render.
   */
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // No socket yet (unauthenticated, connecting, or server unavailable).
    // REST API still works — we simply skip the subscription.
    if (!socket) return;

    /**
     * Stable handler that safely unwraps the new standardized envelope format
     * while remaining fully backward compatible with legacy raw payloads.
     */
    const handler = (payload) => {
      // Intelligently unwrap the standard envelope if it matches the contract.
      // If `payload.data` is missing, assume it's a legacy raw payload.
      const isEnvelope = payload && payload.timestamp && payload.data !== undefined;
      
      const data = isEnvelope ? payload.data : payload;
      const context = {
        timestamp: isEnvelope ? payload.timestamp : new Date().toISOString(),
        meta: isEnvelope && payload.meta ? payload.meta : {},
        raw: payload
      };

      callbackRef.current?.(data, context);
    };

    socket.on(eventName, handler);

    // Unsubscribe when the component unmounts or eventName / socket changes.
    return () => {
      socket.off(eventName, handler);
    };
  }, [socket, eventName]);
  // Note: `callback` is intentionally omitted — changes are handled via ref.
}