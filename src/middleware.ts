import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
    publicRoutes: [
      "/", 
      "/subscriptions/(.*)",
      "/api/checkoutwebhook", 
      "/share/(.*)", 
      "/api/clerkhook", 
      "/api/trigger"
    ],
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};