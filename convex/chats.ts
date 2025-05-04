import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createChat = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    return await ctx.db.insert("chats", {
      userId: args.userId,
      title: args.title,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const getUserChats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chats")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()
  },
})

export const getChat = query({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const updateChatTitle = mutation({
  args: {
    id: v.id("chats"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      title: args.title,
      updatedAt: Date.now(),
    })
  },
})

export const deleteChat = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  },
})
