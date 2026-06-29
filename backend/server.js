/**
 * @module server
 * Application entry point.
 *
 * Creates the raw HTTP server from the Express app so that Socket.IO can be
 * attached without touching REST routing. All existing endpoints continue to
 * behave exactly as before — Socket.IO is an additive layer on the same port.
 */

import http from 'http';
import app from './app.js';
import models from './models/index.js'; // ensures Sequelize models are registered before listen
import { initializeSocketIO, closeIO } from './services/websocket/socketManager.js';
import { startListening, stopListening } from './services/websocket/eventPublisher.js';

const PORT = process.env.PORT || 3000;

/**
 * Expose the underlying HTTP server.
 *
 * Socket.IO requires a reference to this instance.
 * Previously the server was created internally by app.listen() and never
 * exposed — switching to http.createServer() has no effect on HTTP behaviour.
 */
const server = http.createServer(app);

// Attach Socket.IO to the HTTP server (does not alter Express routing).
initializeSocketIO(server);

/**
 * Start the dedicated PostgreSQL LISTEN connection used for cross-instance
 * event delivery. Failure is non-fatal: the server continues serving REST
 * requests normally; realtime updates are simply unavailable until the
 * connection recovers.
 */
startListening().catch((err) => {
  console.error('[Server] EventPublisher failed to start (non-fatal):', err.message);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * Gracefully shuts down Socket.IO and the PostgreSQL LISTEN client before
 * exiting, allowing in-flight connections and messages to complete.
 *
 * A hard timeout forces exit if teardown stalls — prevents process hangs
 * in environments like Docker where SIGTERM must complete quickly.
 *
 * @param {string} signal - OS signal that triggered shutdown
 */
async function gracefulShutdown(signal) {
  console.log(`[Server] ${signal} received — shutting down gracefully`);

  server.close(async () => {
    try {
      await closeIO();
      await stopListening();
      console.log('[Server] Clean shutdown complete');
    } catch (err) {
      console.error('[Server] Error during shutdown teardown:', err.message);
    } finally {
      process.exit(0);
    }
  });

  // Force exit if connections haven't drained within 10 seconds.
  // .unref() prevents this timer from keeping the process alive on its own.
  setTimeout(() => {
    console.error('[Server] Forced exit — shutdown exceeded 10s timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);