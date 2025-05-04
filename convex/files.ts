import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"

// Update the generateUploadUrl mutation to include proper configuration

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    // Generate a URL that allows the client to upload a file
    // with a POST request (not PUT)
    return await ctx.storage.generateUploadUrl()
  },
})

// Store file metadata after upload
export const storeFileMetadata = mutation({
  args: {
    userId: v.string(),
    chatId: v.id("chats"),
    messageId: v.optional(v.id("messages")),
    name: v.string(),
    url: v.string(),
    contentType: v.string(),
    size: v.number(),
  },
  handler: async (ctx, args) => {
    // Store file metadata in the database
    const fileId = await ctx.db.insert("files", {
      userId: args.userId,
      chatId: args.chatId,
      messageId: args.messageId,
      name: args.name,
      url: args.url,
      contentType: args.contentType,
      size: args.size,
      createdAt: Date.now(),
    })

    return fileId
  },
})

// Get files for a specific chat
export const getChatFiles = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("files")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .collect()
  },
})

// Get a file by ID
export const getFile = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId)
    if (!file) {
      throw new ConvexError("File not found")
    }
    return file
  },
})

// Delete a file
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId)
    if (!file) {
      throw new ConvexError("File not found")
    }

    // Delete the file from storage
    await ctx.storage.delete(file.url)

    // Delete the file metadata from the database
    await ctx.db.delete(args.fileId)

    return true
  },
})
