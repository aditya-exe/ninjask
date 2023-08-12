import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function generateSSGHelper() {
//   return createServerSideHelpers({
//     router: appRouter,
//     ctx: { prisma, session: null },
//     transformer: superjson,
//   });
// }
