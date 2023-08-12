// import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";
// import { getServerSession } from "next-auth";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const url = new URL(req.url as string);
      // const session = await getServerSession(authOptions);
//add username 
      const { limit, page,  } = z
        .object({
          limit: z.string(),
          page: z.string(),
          username: z.string().nullish().optional(),
        })
        .parse({
          username: url.searchParams.get("username"),
          limit: url.searchParams.get("limit"),
          page: url.searchParams.get("page"),
        });

      let posts = await prisma.post.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          likes: true,
          stars: true,
        },
      });

      if (posts.length === 0) {
        posts = [];
      }

      res.json(JSON.stringify(posts));
    }
  } catch (err) {}
}
