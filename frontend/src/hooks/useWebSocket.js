/**
 * @module useWebSocket
 * Subscribe to a named Socket.IO event from any component.
 *
 * Usage:
 *   useWebSocket('booking_created', (data) => setBookings(prev => [...prev, data]));
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
 *                               (e.g. 'booking_created', 'room_updated')
 * @param {Function} callback  - Handler invoked with the event payload.
 *                               May change between renders; the latest
 *                               version is always used.
 *
 * @example
 * // In a bookings page component:
 * useWebSocket('booking_created', (data) => {
 *   setBookings((prev) => [data, ...prev]);
 * });
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
     * Stable handler that delegates to whatever callbackRef.current is at
     * call time. Registered once; never replaced while socket is alive.
     */
    const handler = (...args) => callbackRef.current?.(...args);

    socket.on(eventName, handler);

    // Unsubscribe when the component unmounts or eventName / socket changes.
    return () => {
      socket.off(eventName, handler);
    };
  }, [socket, eventName]);
  // Note: `callback` is intentionally omitted — changes are handled via ref.
}