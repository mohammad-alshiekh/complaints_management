// import { COOKIE_NAME, ONE_YEAR_MS } from "./const";
// import { z } from "zod";
// import * as db from "./db";
// import { getSessionCookieOptions } from "./_core/cookies";
// import { sdk } from "./_core/sdk";
// import { systemRouter } from "./_core/systemRouter";
// import { publicProcedure, router } from "./_core/trpc";

// export const appRouter = router({
//     // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
//   system: systemRouter,
//   auth: router({
//     me: publicProcedure.query(opts => opts.ctx.user),
//     login: publicProcedure
//       .input(
//         z.object({
//           name: z.string().min(1, "Name is required"),
//           email: z.string().email("Invalid email address"),
//         })
//       )
//       .mutation(async ({ input, ctx }) => {
//         // Create a simple openId from email (for demo purposes)
//         const openId = `local_${input.email.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

//         // Create or update user
//         await db.upsertUser({
//           openId,
//           name: input.name,
//           email: input.email,
//           loginMethod: "local",
//           lastSignedIn: new Date(),
//         });

//         // Create session token
//         const sessionToken = await sdk.createSessionToken(openId, {
//           name: input.name,
//           expiresInMs: ONE_YEAR_MS,
//         });

//         // Set cookie
//         const cookieOptions = getSessionCookieOptions(ctx.req);
//         ctx.res.cookie(COOKIE_NAME, sessionToken, {
//           ...cookieOptions,
//           maxAge: ONE_YEAR_MS,
//         });

//         // Get the user
//         const user = await db.getUserByOpenId(openId);
//         if (!user) {
//           throw new Error("Failed to create user");
//         }

//         return { user, success: true };
//       }),
//     logout: publicProcedure.mutation(({ ctx }) => {
//       const cookieOptions = getSessionCookieOptions(ctx.req);
//       ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
//       return {
//         success: true,
//       } as const;
//     }),
//   }),

//   // TODO: add feature routers here, e.g.
//   // todo: router({
//   //   list: protectedProcedure.query(({ ctx }) =>
//   //     db.getUserTodos(ctx.user.id)
//   //   ),
//   // }),
// });

// export type AppRouter = typeof appRouter;
