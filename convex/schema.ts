import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(v.literal("image"), v.literal("csv"), v.literal("pdf"), v.literal("word"), v.literal("excel"))

export const roles = v.union(v.literal("admin"), v.literal("member"))

export default defineSchema({
  files: defineTable({ 
    name: v.string(),
    type: fileTypes, 
    orgId: v.string(), 
    fileId: v.string(),
    shouldDelete: v.optional(v.boolean()),
    userId: v.id("users"),
  })
    .index("by_orgId", ["orgId"])
    .index("by_shouldDelete", ["shouldDelete"]),

  favorites: defineTable({
    fileId: v.id("files"),
    orgId: v.string(),
    userId: v.id("users")
  }).index("by_userId_fileId_orgId", ["userId", "orgId", "fileId"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    orgIds: v.array(v.object({
      orgId: v.string(),
      role: roles
    })),
  }).index("by_tokenIdentifier", ["tokenIdentifier"])
});