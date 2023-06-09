import PageLayout from "@/components/page-layout";
import Post from "@/components/post-view";
import Sidebar from "@/components/sidebar";
import LoadingSpinner from "@/components/ui/Loading-Spinner";
import { api } from "@/utils/api";
import { type Bookmark } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const StarsPage: NextPage = ({}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  const { data: stars } = api.profile.getStarsByUser.useQuery();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (session?.user.name !== slug) {
    throw new Error("UNAUTHORIZED");
  }

  return (
    <div className="flex">
      <Sidebar username={session?.user.name as string} />
      <PageLayout>
        <div className="flex border-b-2 border-[#685582]">
          <div className="flex min-h-[99.9px] w-full items-center justify-start gap-x-4 p-4">
            <span className="text-4xl font-bold">Your Stars</span>
          </div>
        </div>

        {stars?.map((star) => {
          return (
            <div className="p-4" key={star.id}>
              <StarredPost star={star} />
            </div>
          );
        })}
      </PageLayout>
    </div>
  );
};

export default StarsPage;

const StarredPost = ({ star }: { star: Bookmark }) => {
  const { data: post, isLoading } = api.post.getPostById.useQuery({
    postId: star.postId,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return <p>No stars yet!</p>;
  }

  return (
    <Post
      text={post.text}
      authorId={post.authorId}
      postId={star.postId}
      createdAt={post?.createdAt}
    />
  );
};
