import { nanoid, z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { generate } from "random-words";
import { addDays } from "date-fns";
import { and, eq, inArray } from "drizzle-orm";

import { authMiddleware } from "@/middleware/auth";
import { db, schema } from "@/lib/db";
import { INVITE_TOKEN_EXPIRY_DAYS } from "@/lib/utils";

export const getAllRoomIds = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      cursor: z.number().optional(), // Last room ID from previous page
      limit: z.number().min(1).max(100).default(20),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const limit = data.limit;

    // Get room IDs for this user, ordered by lastMessageAt (most recent first)
    const membershipRoomIds = await db
      .select({
        roomId: schema.roomMembers.roomId,
        lastMessageAt: schema.rooms.lastMessageAt,
      })
      .from(schema.roomMembers)
      .innerJoin(schema.rooms, eq(schema.roomMembers.roomId, schema.rooms.id))
      .where(
        and(
          eq(schema.roomMembers.userId, userId),
          data.cursor ? eq(schema.rooms.id, data.cursor) : undefined
        )
      )
      .orderBy(schema.rooms.lastMessageAt)
      .limit(limit + 1); // Fetch one extra to determine if there are more

    const hasMore = membershipRoomIds.length > limit;
    const roomIds = membershipRoomIds.slice(0, limit).map(m => m.roomId);
    const nextCursor =
      hasMore && membershipRoomIds[limit] ? membershipRoomIds[limit].roomId : undefined;

    return {
      ids: roomIds,
      nextCursor,
      hasMore,
    };
  });

export const getRoomById = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      roomId: z.number(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const [membership] = await db
      .select()
      .from(schema.roomMembers)
      .where(
        and(
          eq(schema.roomMembers.roomId, data.roomId),
          eq(schema.roomMembers.userId, context.session.user.id)
        )
      )
      .limit(1);

    if (!membership) {
      throw new Error("Unauthorized: You are not a member of this room");
    }

    const room = await db.select().from(schema.rooms).where(eq(schema.rooms.id, data.roomId));

    if (!room) {
      throw new Error("Room not found");
    }

    return room;
  });

export const getRoomsByIds = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      roomIds: z.array(z.number()).min(1).max(100),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;

    // Verify user is a member of all requested rooms
    const memberships = await db
      .select({ roomId: schema.roomMembers.roomId })
      .from(schema.roomMembers)
      .where(
        and(eq(schema.roomMembers.userId, userId), inArray(schema.roomMembers.roomId, data.roomIds))
      );

    const authorizedRoomIds = memberships.map(m => m.roomId);

    // Only fetch rooms the user is authorized to see
    if (authorizedRoomIds.length === 0) {
      return [];
    }

    const rooms = await db
      .select()
      .from(schema.rooms)
      .where(inArray(schema.rooms.id, authorizedRoomIds));

    return rooms;
  });

const NewRoomPayloadSchema = z.object({
  name: z.string().min(2).max(100),
  members: z.array(z.string()).min(1).max(10),
});

export const createRoom = createServerFn({ method: "POST" })
  .inputValidator(NewRoomPayloadSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const randomWords = generate({
      exactly: 3,
      wordsPerString: 1,
      formatter: word => word.toLowerCase(),
    }) as string[];
    const publicId = `${randomWords.join("-")}-${nanoid()}`;
    return await db.transaction(async tx => {
      const [room] = await tx
        .insert(schema.rooms)
        .values({
          name: data.name,
          publicId,
          inviteToken: crypto.randomUUID(),
          tokenExpiresAt: addDays(new Date(), INVITE_TOKEN_EXPIRY_DAYS),
        })
        .returning();

      if (!room) {
        throw new Error("Failed to create room");
      }

      const [members] = await tx
        .insert(schema.roomMembers)
        .values({
          roomId: room.id,
          userId: context.session.user.id,
          role: "admin",
        })
        .returning();

      return { ...room, members: [members] };
    });
  });

export const joinRoom = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      publicId: z.string(),
      inviteToken: z.string(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const [room] = await db
      .select()
      .from(schema.rooms)
      .where(eq(schema.rooms.publicId, data.publicId))
      .limit(1);

    if (!room) {
      throw new Error("Room not found");
    }

    if (room.tokenExpiresAt < new Date()) {
      throw new Error("Invite token expired");
    }

    return await db.transaction(async tx => {
      const [member] = await tx
        .insert(schema.roomMembers)
        .values({
          roomId: room.id,
          userId: context.session.user.id,
          role: "member",
        })
        .returning();

      if (!member) {
        throw new Error("Failed to join room");
      }
    });
  });

export const leaveRoom = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      roomId: z.number(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    return await db.transaction(async tx => {
      const [room] = await db
        .select()
        .from(schema.rooms)
        .where(eq(schema.rooms.id, data.roomId))
        .limit(1);

      if (!room) {
        throw new Error("Room not found");
      }
      const [member] = await tx
        .delete(schema.roomMembers)
        .where(
          and(
            eq(schema.roomMembers.roomId, data.roomId),
            eq(schema.roomMembers.userId, context.session.user.id)
          )
        )
        .returning();

      if (!member) {
        throw new Error("Failed to leave room");
      }
    });
  });

export const updateRoom = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      roomId: z.number(),
      name: z.string().min(1).max(100),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const [membership] = await db
      .select()
      .from(schema.roomMembers)
      .where(
        and(
          eq(schema.roomMembers.roomId, data.roomId),
          eq(schema.roomMembers.userId, context.session.user.id),
          eq(schema.roomMembers.role, "admin")
        )
      )
      .limit(1);

    if (!membership) {
      throw new Error("Unauthorized: Admin access required");
    }

    try {
      return await db
        .update(schema.rooms)
        .set({
          ...data,
        })
        .where(eq(schema.roomMembers.roomId, data.roomId))
        .returning();
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update room");
    }
  });

export const deleteRoom = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      roomId: z.number(),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const [membership] = await db
      .select()
      .from(schema.roomMembers)
      .where(
        and(
          eq(schema.roomMembers.roomId, data.roomId),
          eq(schema.roomMembers.userId, context.session.user.id),
          eq(schema.roomMembers.role, "admin")
        )
      )
      .limit(1);

    if (!membership) {
      throw new Error("Unauthorized: Admin access required");
    }

    try {
      return await db.delete(schema.rooms).where(eq(schema.rooms.id, data.roomId)).returning();
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update room");
    }
  });
