import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createMessage = mutation({
  args: {
    chatId: v.id("chats"),
    userId: v.string(),
    role: v.string(),
    content: v.string(),
    code: v.optional(v.string()),
    language: v.optional(v.string()),
    files: v.optional(v.string()),
    attachments: v.optional(
      v.array(
        v.object({
          type: v.string(),
          name: v.string(),
          url: v.string(),
          contentType: v.string(),
          size: v.number(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    // Update the chat's updatedAt timestamp
    await ctx.db.patch(args.chatId, {
      updatedAt: Date.now(),
    })

    // If this is the first message and it's from the user, update the chat title
    if (args.role === "user") {
      const messagesQuery = await ctx.db
        .query("messages")
        .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
        .collect()

      // Check if this is the first message
      if (messagesQuery.length === 0) {
        // Use the first 30 characters of the message as the chat title
        const title = args.content.length > 30 ? `${args.content.substring(0, 30)}...` : args.content

        await ctx.db.patch(args.chatId, {
          title,
        })
      }
    }

    return await ctx.db.insert("messages", {
      chatId: args.chatId,
      userId: args.userId,
      role: args.role,
      content: args.content,
      code: args.code,
      language: args.language,
      files: args.files,
      attachments: args.attachments,
      createdAt: Date.now(),
    })
  },
})

export const getChatMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect()
  },
})
