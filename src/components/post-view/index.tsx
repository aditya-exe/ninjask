import { api } from "@/utils/api";
import { type FC } from "react";
import LoadingSpinner from "../ui/Loading-Spinner";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { cn } from "@/utils";
import CommentModal from "../comment-modal";
import ShareModal from "../share-modal";

dayjs.extend(relativeTime);

interface PostProps {
  postId: string;
  text: string;
  authorId: string;
  createdAt: Date;
  userId?: string;
  bookmark: boolean;
}

const Post: FC<PostProps> = ({
  authorId,
  text,
  createdAt,
  postId,
  bookmark,
}) => {
  const ctx = api.useContext();
  const { data, isLoading } = api.profile.getUserByUserId.useQuery({
    userId: authorId,
  });
  const { data: isBookmarked } = api.post.isBookmarked.useQuery({
    postId,
  });
  const { mutate: deletePost } = api.post.deleteByPostId.useMutation({
    onSuccess: () => {
      void ctx.post.getAll.invalidate();
    },
  });
  const { mutate: starPost } = api.post.starPost.useMutation({
    onSuccess: () => {
      // void ctx.post.getAll.invalidate();
      void ctx.post.isBookmarked.invalidate();
    },
  });
  const { mutate: unstarPost } = api.post.unstarPost.useMutation({
    onSuccess: () => {
      void ctx.profile.getStarsByUser.invalidate();
      void ctx.post.isBookmarked.invalidate();
    },
  });
  const router = useRouter();
  const { data: session } = useSession();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  function handleDeletePost() {
    deletePost({
      authorId,
      postId,
    });
  }

  function handleStar() {
    starPost({
      postId,
      authorId,
    });
  }

  function handleUnstar() {
    unstarPost({
      postId,
    });
  }

  return (
    <div
      className="flex cursor-pointer gap-x-4 rounded-2xl border-2 border-[#e62a6f]
    bg-[#685582] bg-transparent p-4 text-black shadow-md ring-[#e62a6f]       hover:ring-2 dark:text-white"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void router.push(`/post/${postId}`);
      }}
    >
      <div
        className="w-fit"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void router.push(`/${data?.name as string}`);
        }}
      >
        <Image
          src={data?.image as string}
          alt="Profile Image"
          className="h-14 w-14 cursor-pointer rounded-full ring-2 ring-[#e62a6f]"
          height={56}
          width={56}
          onClick={() => {
            void router.push(`/${data?.name as string}`);
          }}
        />
      </div>
      <div className="flex grow flex-col gap-y-2">
        <div className="flex items-center">
          <Link
            href={`/${data?.name as string}`}
            className="text-lg font-bold"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {`@${data?.name as string} `}
          </Link>
          <span className="font-thin">{` · ${dayjs(
            createdAt
          ).fromNow()}`}</span>
        </div>
        <p className="text-lg">{text}</p>

        <div className="mt-1 flex justify-end gap-x-4">
          {session && (
            <>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <CommentModal />
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Icons.Heart className="cursor-pointer rounded-full hover:text-red-500" />
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Icons.Star
                  className={cn(
                    "cursor-pointer rounded-full hover:text-yellow-600 ",
                    {
                      "text-yellow-600": isBookmarked,
                    }
                  )}
                  onClick={() => {
                    if (bookmark || isBookmarked) {
                      handleUnstar();
                    } else {
                      handleStar();
                    }
                  }}
                />
              </div>
            </>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ShareModal postId={postId} />
          </div>
          {session?.user.id === authorId && (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Icons.Trash2
                className="cursor-pointer hover:text-red-700"
                onClick={handleDeletePost}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
