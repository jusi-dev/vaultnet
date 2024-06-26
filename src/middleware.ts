import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
    publicRoutes: [
      "/", 
      "/subscriptions/(.*)",
      "/subscriptions",
      "/api/checkoutwebhook", 
      "/share/(.*)", 
      "/api/clerkhook", 
      "/api/trigger",
      "/imprint",
      "/privacy",
      "/tos",
      "/about",
      "/contact",
      "/about",
    ],
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};