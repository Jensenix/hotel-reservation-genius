import { useContext, useEffect, useRef } from 'react';
import { WebSocketContext } from '@/context/WebSocketContext';

/**
 * @param {string} eventName
 * @param {Function} callback
 * @returns {void}
 */
export function useWebSocket(eventName, callback) {
  const socket = useContext(WebSocketContext);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!socket) return;

    const handler = (payload, ...rest) => {
      if (payload && payload.timestamp && payload.data) {
        callbackRef.current?.(payload.data, payload, ...rest);
      } else {
        callbackRef.current?.(payload, ...rest);
      }
    };

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [socket, eventName]);
}
