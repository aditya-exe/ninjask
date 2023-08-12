import { type FC } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { Post } from "@prisma/client";
import type { Like, User, Star } from "@prisma/client";
import OptionsStrip from "../options-strip";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";

dayjs.extend(relativeTime);

interface PostProps {
  post: Post & {
    author: User;
    likes: Like[];
    stars: Star[];
  };
}

const Post: FC<PostProps> = ({ post }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const author = post.author;

  const { mutate: deletePost } = api.post.deleteByPostId.useMutation({
    onMutate: () => {
      router.reload();
      router.back();
    },
  });

  function handleDelete(): void {
    deletePost({
      postId: post?.id ?? "",
      authorId: author.id,
    });
  }

  return (
    <div
      className="flex cursor-pointer gap-x-4 rounded-2xl border-2 border-[#e62a6f]
    bg-[#685582] bg-transparent p-4 text-black shadow-md ring-[#e62a6f]       hover:ring-2 dark:text-white"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void router.push(`/post/${post.id}`);
      }}
    >
      <div
        className="w-fit"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void router.push(`/${author.name as string}`);
        }}
      >
        <Image
          src={author.image as string}
          alt="Profile Image"
          className="h-14 w-14 cursor-pointer rounded-full ring-2 ring-[#e62a6f]"
          height={56}
          width={56}
          onClick={() => {
            void router.push(`/${author.name as string}`);
          }}
        />
      </div>
      <div className="flex grow flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href={`/${author.name as string}`}
              className="text-lg font-bold"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {`@${author.name as string} `}
            </Link>
            <span className="font-thin">
              {"\t"}• {`${dayjs(post.createdAt).fromNow()}`}
            </span>
          </div>
          <div
            className="group relative inline-block"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              className="active:shadow-outline-pink inline-flex cursor-pointer rounded-full p-2 focus-within:border-transparent focus-within:text-[#685582] focus-within:outline focus-within:outline-2 focus-within:outline-[#685582] hover:text-[#685582]"
            >
              <Icons.options />
            </button>
            <div className="invisible origin-top-right -translate-y-2 scale-95 transform opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 dark:bg-gray-900 dark:text-white">
              <div
                className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-[#685582] rounded-md border border-[#685582] bg-white shadow-lg outline-none dark:bg-gray-900"
                role="menu"
              >
                <div className="py-1">
                  <button
                    className="flex w-full justify-between px-4 py-2 text-left text-sm font-bold leading-5 text-red-500 focus-visible:outline-1 focus-visible:outline-pink-500 disabled:cursor-not-allowed"
                    role="menuitem"
                    disabled={session?.user.id !== post.authorId}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-lg">{post.text}</p>

        <OptionsStrip postId={post.id} showModal={false} showNumbers={true} />
      </div>
    </div>
  );
};

export default Post;
