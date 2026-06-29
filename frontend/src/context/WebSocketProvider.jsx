/**
 * @module WebSocketProvider
 * Global Socket.IO connection manager for the frontend.
 *
 * Responsibilities:
 * - Create exactly one socket instance per authenticated session
 * - Pass JWT during Socket.IO handshake
 * - Handle custom reconnect backoff
 * - Expose socket through WebSocketContext
 * - Cleanup on logout/unmount
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';

import { useAuth } from '@/hooks/auth/useAuth';
import { WebSocketContext } from './WebSocketContext';

const RETRY_DELAYS = [1000, 2000, 5000, 10000];

export function WebSocketProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  const socketRef = useRef(null);
  const retryIndexRef = useRef(0);
  const retryTimerRef = useRef(null);
  const isUnmountedRef = useRef(false);

  const createSocketRef = useRef(null);

  const cancelRetry = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const destroySocket = useCallback(() => {
    cancelRetry();

    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setSocket(null);
  }, [cancelRetry]);

  const scheduleRetry = useCallback(
    (token) => {
      if (isUnmountedRef.current) return;

      cancelRetry();

      const delay =
        RETRY_DELAYS[Math.min(retryIndexRef.current, RETRY_DELAYS.length - 1)];

      retryIndexRef.current++;

      console.log(
        `[WebSocket] Retry in ${delay}ms (attempt ${retryIndexRef.current})`,
      );

      retryTimerRef.current = setTimeout(() => {
        retryTimerRef.current = null;

        if (isUnmountedRef.current) return;

        if (socketRef.current) {
          socketRef.current.removeAllListeners();
          socketRef.current.disconnect();

          socketRef.current = null;
          setSocket(null);
        }

        createSocketRef.current?.(token);
      }, delay);
    },
    [cancelRetry],
  );

  const createSocket = useCallback(
    (token) => {
      if (socketRef.current) return;

      const rawApiUrl =
        import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const SERVER_URL = rawApiUrl.replace(/\/api\/?$/, '');

      const newSocket = io(SERVER_URL, {
        reconnection: false,
        auth: {
          token,
        },
      });

      newSocket.on('connect', () => {
        retryIndexRef.current = 0;
        cancelRetry();

        console.log('[WebSocket] Connected:', newSocket.id);
        console.log('[WS CONNECTED FRONTEND]', newSocket.id);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('[WebSocket] Disconnected:', reason);

        if (reason === 'io server disconnect') {
          socketRef.current = null;
          setSocket(null);
          return;
        }

        scheduleRetry(token);
      });

      newSocket.on('connect_error', (error) => {
        console.warn('[WebSocket] Connection error:', error.message);
        scheduleRetry(token);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    },
    [cancelRetry, scheduleRetry],
  );

  useEffect(() => {
    createSocketRef.current = createSocket;
  }, [createSocket]);

  useEffect(() => {
    if (!socket) return;

    socket.onAny((event, ...args) => {
      console.log('[SOCKET RAW EVENT]', event, args);
    });

    return () => socket.offAny();
  }, [socket]);

  useEffect(() => {
    isUnmountedRef.current = false;

    const token = user?.token || user?.data?.token;

    if (isAuthenticated && token) {
      retryIndexRef.current = 0;
      createSocket(token);
    }

    return () => {
      isUnmountedRef.current = true;
      destroySocket();
    };
  }, [isAuthenticated, user, createSocket, destroySocket]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
