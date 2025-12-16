import z from "zod";
import { createServerFn } from "@tanstack/react-start";
import { eq, lt, desc, and } from "drizzle-orm";

import { db, schema } from "@/lib/db";
import { authMiddleware } from "@/middleware/auth";
import { sendPartyKitEvent } from "@/lib/party";

const NewMessagePayloadSchema = z.object({
  roomId: z.number(),
  content: z.custom<any>(),
});

export const createMessage = createServerFn({ method: "POST" })
  .inputValidator(NewMessagePayloadSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { roomId, content } = data;

    // Check if user is a member of the room
    const [membership] = await db
      .select()
      .from(schema.roomMembers)
      .where(
        and(
          eq(schema.roomMembers.roomId, roomId),
          eq(schema.roomMembers.userId, context.session.user.id)
        )
      )
      .limit(1);

    if (!membership) {
      throw new Error("Unauthorized: Must be a member of the room");
    }

    // TODO - Parse TipTap JSON into plain text
    const plainText = "";

    // TODO - Parse mentions from TipTap JSON
    const mentions: string[] = [];

    try {
      const [message] = await db
        .insert(schema.messages)
        .values({
          roomId,
          content,
          plainText,
          mentions,
          senderId: context.session.user.id,
        })
        .returning();

      if (!message) {
        throw new Error("Failed to create message");
      }

      // Send realtime event via PartyKit
      await sendPartyKitEvent(context.session.user.id, {
        type: "message",
        payload: {
          id: message.id,
          roomId,
          plainText,
          mentions,
          senderId: context.session.user.id,
        },
      });

      return message;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create message");
    }
  });

export const getMessagesByRoomId = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      roomId: z.number(),
      cursor: z.number().optional(), // Message ID to start from
      limit: z.number().default(50),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { roomId, cursor, limit } = data;

    // Check if user is a member of the room
    const [membership] = await db
      .select()
      .from(schema.roomMembers)
      .where(
        and(
          eq(schema.roomMembers.roomId, roomId),
          eq(schema.roomMembers.userId, context.session.user.id)
        )
      )
      .limit(1);

    if (!membership) {
      throw new Error("Unauthorized: Must be a member of the room");
    }

    try {
      const whereClause = cursor
        ? and(eq(schema.messages.roomId, roomId), lt(schema.messages.id, cursor))!
        : eq(schema.messages.roomId, roomId);

      // Fetch messages in descending order (newest first)
      // This way, first call gets most recent 50, next call gets previous 50, etc.
      const messages = await db
        .select()
        .from(schema.messages)
        .where(whereClause)
        .orderBy(desc(schema.messages.id))
        .limit(limit + 1);

      // Determine if there's a next page (older messages exist)
      const hasNextPage = messages.length > limit;
      const items = hasNextPage ? messages.slice(0, limit) : messages;

      const nextCursor = hasNextPage ? items[items.length - 1]?.id : undefined;

      return {
        items,
        nextCursor,
        hasNextPage,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch messages");
    }
  });

const EditMessagePayloadSchema = z.object({
  messageId: z.number(),
  content: z.custom<any>(),
});

export const editMessage = createServerFn({ method: "POST" })
  .inputValidator(EditMessagePayloadSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { messageId, content } = data;

    try {
      // Fetch the message to verify ownership and get room info
      const [message] = await db
        .select()
        .from(schema.messages)
        .where(eq(schema.messages.id, messageId))
        .limit(1);

      if (!message) {
        throw new Error("Message not found");
      }

      // Verify the user is the sender of the message
      if (message.senderId !== context.session.user.id) {
        throw new Error("Unauthorized: Can only edit your own messages");
      }

      // TODO - Parse TipTap JSON into plain text
      const plainText = "";

      // TODO - Parse mentions from TipTap JSON
      const mentions: string[] = [];

      // Update the message
      const [updatedMessage] = await db
        .update(schema.messages)
        .set({
          content,
          plainText,
          mentions,
        })
        .where(eq(schema.messages.id, messageId))
        .returning();

      return updatedMessage;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to edit message");
    }
  });

const DeleteMessagePayloadSchema = z.object({
  messageId: z.number(),
});

export const deleteMessage = createServerFn({ method: "POST" })
  .inputValidator(DeleteMessagePayloadSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { messageId } = data;

    try {
      // Fetch the message to verify ownership
      const [message] = await db
        .select()
        .from(schema.messages)
        .where(eq(schema.messages.id, messageId))
        .limit(1);

      if (!message) {
        throw new Error("Message not found");
      }

      // Verify the user is the sender of the message
      if (message.senderId !== context.session.user.id) {
        throw new Error("Unauthorized: Can only delete your own messages");
      }

      // Delete the message
      await db.delete(schema.messages).where(eq(schema.messages.id, messageId));

      return { success: true, messageId };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete message");
    }
  });
