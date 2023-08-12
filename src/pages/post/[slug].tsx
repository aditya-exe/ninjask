import PageLayout from "@/components/page-layout";
import Sidebar from "@/components/sidebar";
import LoadingSpinner from "@/components/ui/Loading-Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Image from "next/image";
import Head from "next/head";
import dayjs from "dayjs";
import { Icons } from "@/components/icons";
import CommentBox from "@/components/comment-box";
import CommentList from "@/components/comment-list";
import type { NextPage } from "next";
import OptionsStrip from "@/components/options-strip";

const PostPage: NextPage = ({}) => {
  const router = useRouter();
  const { slug } = router.query;
  const postId = slug as string;
  const { data: session, status } = useSession();
  const { data: post } = api.post.getPostById.useQuery({
    postId: postId,
  });

  const { mutate: deletePost } = api.post.deleteByPostId.useMutation({
    onMutate: () => {
      router.reload();
      router.back();
    },
  });

  const { data: likesAmt } = api.like.countLikesByPostId.useQuery({ postId });
  const { data: starsAmt } = api.star.countStarsByPostId.useQuery({ postId });

  if (status === "loading" || !post) {
    return <LoadingSpinner />;
  }

  const author = post.author;

  function handleDelete(): void {
    deletePost({
      postId: post?.id ?? "",
      authorId: author.id,
    });
  }

  const isReply = !!post.parentPost;
  // console.log(isReply);

  return (
    <>
      <Head>
        <title>{`Post | @${author.name as string}`}</title>
      </Head>
      <main className="flex dark:bg-gray-900 dark:text-white">
        <Sidebar username={session?.user.name as string} />
        <PageLayout>
          <div className="flex border-b-2 border-[#685582]">
            {isReply ? (
              <div className="p-2">
              </div>
            ) : (
              <div className="flex min-h-[99.9px] w-full items-center justify-start gap-x-4 p-4">
                <button
                  onClick={() => {
                    router.back();
                  }}
                  className="cursor-pointer rounded-full p-2 hover:bg-black/10 hover:text-[#685582]"
                >
                  <Icons.back className="h-8 w-8 rounded-full" />
                </button>
                <div>
                  <span className="text-2xl font-bold">
                    Post by @{author.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col border-b-2 border-[#685582] p-4">
            <div className="flex w-full items-center justify-between gap-x-3">
              <div className="h-fit w-fit rounded-full">
                <Image
                  src={author.image as string}
                  alt={`${author.name as string}'s Profile Picture`}
                  width={20}
                  height={20}
                  className="h-12 w-12 rounded-full"
                />
              </div>
              <div className="flex grow  flex-col">
                <p className="font-bold">{author.name}</p>
                <p className="text-xs font-semibold">
                  {dayjs(post.createdAt).format("HH:MM • MMMM, D YYYY")}
                </p>
              </div>
              <div className="group relative inline-block" tabIndex={-1}>
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
            <div className="p-2">
              <p className="text-xl">{post.text}</p>
            </div>
            <div className="flex gap-x-4 p-2">
              <p>
                {likesAmt} <span className="font-bold">Likes</span>
              </p>
              <p>
                {starsAmt} <span className="font-bold">Stars</span>
              </p>
            </div>
            <OptionsStrip
              postId={postId}
              showNumbers={false}
              showModal={true}
            />
          </div>
          <CommentBox
            avatarImage={session?.user.image ?? ""}
            postId={postId}
            userId={session?.user.id ?? ""}
          />
          <div>
            <CommentList postId={postId} userId={session?.user.id as string} />
          </div>
        </PageLayout>
      </main>
    </>
  );
};

export default PostPage;
