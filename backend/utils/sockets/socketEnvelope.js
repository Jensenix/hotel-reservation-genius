/**
 * @module socketEnvelope
 * Shared Socket.IO envelope helpers.
 *
 * Responsibilities:
 * - Build a standardized realtime payload shape
 * - Keep emitted socket payloads consistent across websocket modules
 */

/**
 * Builds a standardized realtime envelope.
 *
 * Frontend useWebSocket can unwrap this shape automatically:
 * {
 *   event,
 *   timestamp,
 *   data,
 *   meta
 * }
 *
 * @param {string} event Event name
 * @param {object} [data={}] Event payload
 * @param {object} [meta={}] Event metadata
 *
 * @returns {{ event: string, timestamp: string, data: object, meta: object }}
 */
function createEnvelope(event, data = {}, meta = {}) {
  return {
    event,
    timestamp: new Date().toISOString(),
    data,
    meta,
  };
}

export { createEnvelope };