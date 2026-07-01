/**
 * @module UserEvents
 * Centralized realtime event publisher for user/admin management changes.
 */

import { publish, CHANNELS } from '#services/websocket/eventPublisher.js';
import { RealtimeEvents } from '#shared/eventContract.js';

class UserEvents {
  static sanitizeUser(user) {
    if (!user) {
      return null;
    }

    const plainUser = typeof user.toJSON === 'function' ? user.toJSON() : user;

    const safeUser = { ...plainUser };
    delete safeUser.password;

    return safeUser;
  }

  static async userCreated(user, actor = null) {
    try {
      await publish(CHANNELS.USER, {
        event: RealtimeEvents.USER.CREATED,
        data: {
          user: UserEvents.sanitizeUser(user),
        },
        meta: {
          actorId: actor?.id || null,
          actorRole: actor?.role || null,
        },
        rooms: ['admin:dashboard'],
      });
    } catch (err) {
      console.error(
        '[UserEvents] Failed to publish user created:',
        err.message,
      );
    }
  }

  static async userUpdated(user, actor = null) {
    try {
      await publish(CHANNELS.USER, {
        event: RealtimeEvents.USER.UPDATED,
        data: {
          user: UserEvents.sanitizeUser(user),
        },
        meta: {
          actorId: actor?.id || null,
          actorRole: actor?.role || null,
        },
        rooms: ['admin:dashboard'],
      });
    } catch (err) {
      console.error(
        '[UserEvents] Failed to publish user updated:',
        err.message,
      );
    }
  }

  static async userDeleted(userId, actor = null) {
    try {
      await publish(CHANNELS.USER, {
        event: RealtimeEvents.USER.DELETED,
        data: {
          userId,
        },
        meta: {
          actorId: actor?.id || null,
          actorRole: actor?.role || null,
        },
        rooms: ['admin:dashboard'],
      });
    } catch (err) {
      console.error(
        '[UserEvents] Failed to publish user deleted:',
        err.message,
      );
    }
  }
}

export default UserEvents;
