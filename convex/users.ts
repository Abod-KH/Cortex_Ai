import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique()

    if (existingUser) {
      return existingUser._id
    }

    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
    })
  },
})

export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique()
  },
})
