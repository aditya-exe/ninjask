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

dayjs.extend(relativeTime);

interface PostProps {
  postId: string;
  text: string;
  authorId: string;
  createdAt: Date;
  userId?: string;
}

const Post: FC<PostProps> = ({ authorId, text, createdAt, postId }) => {
  const ctx = api.useContext();
  const { data, isLoading } = api.profile.getUserByUserId.useQuery({
    userId: authorId,
  });
  const { mutate: deletePost } = api.post.deleteByPostId.useMutation({
    onSuccess: () => {
      void ctx.post.getAll.invalidate();
    },
  });
  const { mutate: starPost } = api.post.starPost.useMutation();
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

  return (
    <div
      className="flex gap-x-4 rounded-2xl border-2 border-[#e62a6f] bg-[#685582]
    bg-transparent text-black dark:text-white p-4 shadow-md"
    >
      <div className="w-fit">
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
          >
            {`@${data?.name as string} `}
          </Link>
          <span className="font-thin">{` · ${dayjs(
            createdAt
          ).fromNow()}`}</span>
        </div>
        <p className="text-lg">{text}</p>

        <div
          className="mt-1 flex justify-end gap-x-4"
          onClick={handleStar}
        >
          <Icons.Star className="cursor-pointer hover:text-[#e62a6f]" />
          {session?.user.id === authorId && (
            <Icons.Trash2
              className="cursor-pointer hover:text-red-700"
              onClick={handleDeletePost}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
