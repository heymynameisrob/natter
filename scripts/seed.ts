import { faker } from "@faker-js/faker";
import { db, schema } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

const EXISTING_USER_EMAIL = "robhough180@gmail.com";

interface ExistingUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

async function seed() {
  console.log("🌱 Starting seed process...\n");

  // 1. Get existing user
  console.log(`📍 Step 1: Looking for existing user (${EXISTING_USER_EMAIL})...`);
  const existingUsers = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, EXISTING_USER_EMAIL))
    .limit(1);

  let existingUser: ExistingUser | null = null;
  if (existingUsers.length > 0) {
    existingUser = existingUsers[0] as ExistingUser;
    console.log(`✅ Found existing user: ${existingUser.name} (${existingUser.id})\n`);
  } else {
    console.log(`⚠️  No existing user found with email ${EXISTING_USER_EMAIL}\n`);
  }

  // 2. Clear existing data
  console.log("🗑️  Step 2: Clearing existing data...");
  await db.delete(schema.messages);
  await db.delete(schema.roomMembers);
  await db.delete(schema.roomSubscriptions);
  await db.delete(schema.rooms);
  await db.delete(schema.userNotificationDevices);
  await db.delete(schema.verification);
  await db.delete(schema.session);
  await db.delete(schema.account);
  // Only delete users if we don't have an existing user to preserve
  if (!existingUser) {
    await db.delete(schema.user);
  } else {
    // Get all users except the existing one and delete them
    const usersToDelete = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, existingUser.id));
    
    for (const user of await db.select().from(schema.user)) {
      if (user.id !== existingUser.id) {
        await db.delete(schema.user).where(eq(schema.user.id, user.id));
      }
    }
  }
  console.log("✅ Data cleared\n");

  // 3. Create dummy users
  console.log("👥 Step 3: Creating dummy users...");
  const dummyUserIds: string[] = [];

  // Create 8 dummy users
  for (let i = 0; i < 8; i++) {
    const userId = nanoid();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    await db.insert(schema.user).values({
      id: userId,
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      emailVerified: faker.datatype.boolean({ probability: 0.8 }),
      image: faker.datatype.boolean({ probability: 0.6 })
        ? faker.image.avatar()
        : null,
      notificationsEnabled: faker.datatype.boolean({ probability: 0.9 }),
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: new Date(),
    });

    dummyUserIds.push(userId);
  }

  console.log(`✅ Created ${dummyUserIds.length} dummy users\n`);

  // All user IDs (including existing user if found)
  const allUserIds = existingUser ? [existingUser.id, ...dummyUserIds] : dummyUserIds;

  if (allUserIds.length === 0) {
    console.log("⚠️  No users available to create rooms and messages");
    return;
  }

  // 4. Create dummy rooms
  console.log("💬 Step 4: Creating dummy rooms...");
  const roomIds: number[] = [];

  const roomTopics = [
    "Team Standup",
    "Project Alpha",
    "Weekend Plans",
    "Book Club",
    "Tech Discussions",
    "Random",
    "Design Review",
    "Marketing Campaign",
  ];

  for (let i = 0; i < roomTopics.length; i++) {
    const createdAt = faker.date.past({ years: 1 });
    const inviteToken = nanoid(32);
    const tokenExpiresAt = faker.date.future({ years: 1 });

    const result = await db
      .insert(schema.rooms)
      .values({
        publicId: nanoid(),
        name: roomTopics[i],
        inviteToken,
        tokenExpiresAt,
        lastMessageAt: faker.date.recent({ days: 7 }),
        createdAt,
        updatedAt: createdAt,
      })
      .returning();

    if (!result[0]) {
      console.error("Failed to create room");
      continue;
    }

    const room = result[0];
    roomIds.push(room.id);

    // Add members to room (random 2-6 users)
    const numMembers = faker.number.int({ min: 2, max: 6 });
    const shuffledUsers = faker.helpers.shuffle([...allUserIds]);
    const roomUserIds = shuffledUsers.slice(0, numMembers);

    // Ensure existing user is in at least half of the rooms
    if (existingUser && i < roomTopics.length / 2 && !roomUserIds.includes(existingUser.id)) {
      roomUserIds[0] = existingUser.id;
    }

    for (let j = 0; j < roomUserIds.length; j++) {
      const userId = roomUserIds[j];
      if (!userId) continue;
      
      const isAdmin = j === 0; // First member is admin

      await db.insert(schema.roomMembers).values({
        roomId: room.id,
        userId,
        role: isAdmin ? "admin" : "member",
        createdAt,
      });

      // Create room subscription for each member
      await db.insert(schema.roomSubscriptions).values({
        userId,
        roomId: room.id,
        status: faker.helpers.arrayElement(["all", "mentions", "off"] as const),
        createdAt,
        updatedAt: createdAt,
      });
    }
  }

  console.log(`✅ Created ${roomIds.length} rooms with members and subscriptions\n`);

  // 5. Create dummy messages with realistic conversations
  console.log("💬 Step 5: Creating dummy messages with realistic conversations...");
  let totalMessages = 0;

  // Conversation templates - each is a realistic back-and-forth
  const conversationTemplates = [
    [
      "Hey team, just finished the wireframes for the new feature",
      "Nice! Can you share them in the design channel?",
      "Just posted them, would love to get everyone's feedback by EOD",
      "Looking at them now, really like the direction!",
      "Quick question - should the CTA button be primary or secondary color?",
      "I'd go with primary, it needs to stand out more",
      "Makes sense, updating now",
    ],
    [
      "Morning everyone! Quick standup update from me:",
      "Yesterday: finished the API integration, Today: working on error handling",
      "Sounds good! Let me know if you need help with the error states",
      "Will do, thanks!",
      "I'm wrapping up the frontend components today",
      "Perfect, that should sync up nicely with the API work",
    ],
    [
      "Has anyone looked at the performance metrics from last week?",
      "Yeah, I noticed page load times increased by about 15%",
      "Any ideas what's causing it?",
      "Probably the new image carousel, it's loading all images at once",
      "Ah that makes sense. Should we implement lazy loading?",
      "Definitely. I can tackle that this afternoon",
      "Awesome, let's sync up after you push the changes",
    ],
    [
      "Reminder: client demo is tomorrow at 2pm",
      "Thanks for the reminder! Are we using the staging environment?",
      "Yep, I just updated it with the latest changes",
      "Great. Do we have the slide deck ready?",
      "I'm finishing it up now, will share in an hour",
      "Perfect, I'll review it before the demo",
    ],
    [
      "Quick poll: what should we order for the team lunch?",
      "I'm voting for pizza 🍕",
      "Mexican food would be great!",
      "I'm good with either",
      "Let's do pizza, we did Mexican last time",
      "Works for me!",
      "Alright, I'll place the order for 12:30",
    ],
    [
      "Found a bug in the checkout flow - payments aren't processing",
      "Oh no! Is this in production?",
      "Thankfully no, caught it in staging",
      "What's the error message?",
      "It's throwing a 500 error when submitting the payment form",
      "Let me check the server logs",
      "Found it - missing API key in the staging env",
      "Ah, adding it now",
      "All fixed! Thanks for the quick turnaround",
    ],
    [
      "Anyone free for a quick code review?",
      "Sure, what's the PR number?",
      "#247 - just refactored the auth middleware",
      "Taking a look now",
      "Left a few comments, mostly minor stuff",
      "Thanks! Addressing them now",
      "Approved and merged 🚀",
    ],
    [
      "Heads up: database migration scheduled for tonight at 11pm",
      "How long do you expect it to take?",
      "Should be about 30 minutes",
      "Will there be any downtime?",
      "Minimal, maybe 2-3 minutes during the switch",
      "Sounds good, I'll update the status page",
      "Thanks! I'll send an update once it's complete",
    ],
    [
      "Just deployed the new landing page to production",
      "Nice! How's it looking?",
      "Pretty good, but I'm seeing some layout issues on mobile",
      "What browser?",
      "Safari on iOS, the hero section is getting cut off",
      "Ah, probably the safe area insets. Let me push a fix",
      "That would be great, thanks!",
      "Fixed and deployed. Can you check now?",
      "Perfect! Looks great now",
    ],
    [
      "Who's available for the sprint planning meeting?",
      "I can join",
      "Same here",
      "I have a conflict at 2pm, can we do 3pm instead?",
      "3pm works for me",
      "Same",
      "Alright, moving it to 3pm. I'll send updated calendar invite",
    ],
    [
      "The test suite is failing on CI",
      "Which tests?",
      "Looks like the integration tests for the new API endpoints",
      "Did we update the test fixtures?",
      "Oh good catch, I forgot to commit those",
      "That'll do it 😄",
      "Pushing the fixtures now",
      "All green now!",
    ],
    [
      "Happy Friday everyone! 🎉",
      "Can't believe the week went by so fast",
      "Right? Feels like Monday was yesterday",
      "Any fun weekend plans?",
      "Going hiking if the weather holds up",
      "Nice! I'm just catching up on some reading",
      "Enjoy your weekend everyone!",
    ],
    [
      "I'm getting a CORS error when calling the API from localhost",
      "Did you add localhost to the allowed origins?",
      "Where do I do that?",
      "Check the .env.development file, there's a CORS_ORIGINS variable",
      "Found it! Adding localhost:3000 now",
      "You'll need to restart the server for it to take effect",
      "Restarted, working now. Thanks!",
    ],
    [
      "Does anyone have experience with WebSockets?",
      "Yeah, what do you need help with?",
      "I'm trying to implement real-time notifications",
      "Are you using Socket.io or native WebSockets?",
      "Native WebSockets, trying to keep dependencies minimal",
      "Smart. The main thing is handling reconnection logic properly",
      "Any libraries you'd recommend for that?",
      "Check out reconnecting-websocket, it's lightweight and works well",
      "Perfect, exactly what I needed. Thanks!",
    ],
    [
      "Sharing an article I found about database indexing strategies",
      "Oh this is great, we were just discussing this yesterday",
      "The section on composite indexes is particularly useful",
      "Agreed, I'm going to apply some of these to our user queries",
      "Let me know how much it improves performance",
      "Will do! I'll run some benchmarks before and after",
    ],
    [
      "Quick heads up - I'll be OOO next Monday",
      "Thanks for letting us know! Anything we need to cover?",
      "Just the usual monitoring, everything should be stable",
      "No problem, we've got it covered",
      "Appreciate it! I'll be back Tuesday",
    ],
  ];

  for (const roomId of roomIds) {
    // Get room members
    const members = await db
      .select()
      .from(schema.roomMembers)
      .where(eq(schema.roomMembers.roomId, roomId));

    const memberUserIds = members.map((m) => m.userId);

    if (memberUserIds.length === 0) continue;

    // Create 2-4 conversation threads per room
    const numConversations = faker.number.int({ min: 2, max: 4 });

    for (let convIdx = 0; convIdx < numConversations; convIdx++) {
      // Pick a random conversation template
      const template = faker.helpers.arrayElement(conversationTemplates);
      
      // Start time for this conversation (randomly in the past 30 days)
      const baseTime = faker.date.recent({ days: 30 });
      
      let lastSenderId: string | null = null;
      
      for (let msgIdx = 0; msgIdx < template.length; msgIdx++) {
        const plainText = template[msgIdx];
        if (!plainText) continue;
        
        // Different users participate in the conversation
        // Try to alternate speakers for more realistic flow
        let senderId: string;
        if (msgIdx === 0) {
          // First message from random member
          senderId = faker.helpers.arrayElement(memberUserIds);
        } else {
          // Subsequent messages from different people (80% chance of different speaker)
          const otherUsers = lastSenderId 
            ? memberUserIds.filter((id) => id !== lastSenderId)
            : memberUserIds;
          if (otherUsers.length > 0 && faker.datatype.boolean({ probability: 0.8 })) {
            senderId = faker.helpers.arrayElement(otherUsers);
          } else {
            senderId = faker.helpers.arrayElement(memberUserIds);
          }
        }
        
        lastSenderId = senderId;

        // Create a simple Tiptap JSON structure
        const content = {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: plainText,
                },
              ],
            },
          ],
        };

        // Random mentions (15% chance, higher than before)
        const mentions: string[] = [];
        if (faker.datatype.boolean({ probability: 0.15 })) {
          const otherUsers = memberUserIds.filter((id) => id !== senderId);
          if (otherUsers.length > 0) {
            mentions.push(faker.helpers.arrayElement(otherUsers));
          }
        }

        // Random reactions (40% chance, especially on first and last messages)
        const reactions: Array<{ userId: string; emoji: string }> = [];
        const isFirstOrLast = msgIdx === 0 || msgIdx === template.length - 1;
        if (faker.datatype.boolean({ probability: isFirstOrLast ? 0.6 : 0.4 })) {
          const numReactions = faker.number.int({ min: 1, max: 4 });
          const emojis = ["👍", "❤️", "😂", "🎉", "🔥", "👏", "✅", "👀"];

          const reactedUsers = new Set<string>();
          for (let j = 0; j < numReactions; j++) {
            const reactorId = faker.helpers.arrayElement(memberUserIds);
            if (!reactedUsers.has(reactorId)) {
              reactedUsers.add(reactorId);
              reactions.push({
                userId: reactorId,
                emoji: faker.helpers.arrayElement(emojis),
              });
            }
          }
        }

        // Messages spaced 1-15 minutes apart within conversation
        const createdAt = new Date(baseTime.getTime() + msgIdx * faker.number.int({ min: 60000, max: 900000 }));

        await db.insert(schema.messages).values({
          roomId,
          senderId,
          content,
          plainText,
          mentions,
          reactions,
          createdAt,
          updatedAt: createdAt,
        });

        totalMessages++;
      }
      
      // Add some spacing between conversations (1-6 hours)
      baseTime.setTime(baseTime.getTime() + faker.number.int({ min: 3600000, max: 21600000 }));
    }

    // Update room's lastMessageAt to most recent message time
    const lastMessages = await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.roomId, roomId))
      .orderBy(desc(schema.messages.createdAt))
      .limit(1);

    if (lastMessages.length > 0 && lastMessages[0]) {
      await db
        .update(schema.rooms)
        .set({ lastMessageAt: lastMessages[0].createdAt })
        .where(eq(schema.rooms.id, roomId));
    }
  }

  console.log(`✅ Created ${totalMessages} messages across all rooms\n`);

  // Summary
  console.log("🎉 Seed complete!\n");
  console.log("📊 Summary:");
  console.log(`   - Users: ${allUserIds.length} (${existingUser ? "1 existing + " : ""}${dummyUserIds.length} new)`);
  console.log(`   - Rooms: ${roomIds.length}`);
  console.log(`   - Messages: ${totalMessages}`);
  console.log(`   - Existing user: ${existingUser ? `${existingUser.name} (${existingUser.email})` : "None found"}\n`);
}

// Run seed
seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .then(() => {
    console.log("✅ Seed script completed");
    process.exit(0);
  });
