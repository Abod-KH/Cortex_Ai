import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.string(),
  }).index("by_userId", ["userId"]),

  chats: defineTable({
    userId: v.string(),
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  messages: defineTable({
    chatId: v.id("chats"),
    userId: v.string(),
    role: v.string(),
    content: v.string(),
    code: v.optional(v.string()),
    language: v.optional(v.string()),
    files: v.optional(v.string()), // JSON string of file objects
    attachments: v.optional(
      v.array(
        v.object({
          type: v.string(), // "image" or "file"
          name: v.string(),
          url: v.string(),
          contentType: v.string(),
          size: v.number(),
        }),
      ),
    ),
    createdAt: v.number(),
  }).index("by_chatId", ["chatId"]),

  files: defineTable({
    userId: v.string(),
    chatId: v.id("chats"),
    messageId: v.optional(v.id("messages")),
    name: v.string(),
    url: v.string(),
    contentType: v.string(),
    size: v.number(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_chatId", ["chatId"]),
})
