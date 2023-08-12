import PageLayout from "@/components/page-layout";
import Post from "@/components/post-view";
import Sidebar from "@/components/sidebar";
import LoadingSpinner from "@/components/ui/Loading-Spinner";
import { api } from "@/utils/api";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

const StarsPage: NextPage = ({ }) => {
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
    <>
      <Head>
        <title>Your stars</title>
      </Head>
      <main className="flex dark:bg-gray-900 dark:text-white">
        <Sidebar username={session?.user.name as string} />
        <PageLayout>
          <div className="flex border-b-2 border-[#685582]">
            <div className="flex min-h-[99.9px] w-full items-center justify-start gap-x-4 p-4">
              <span className="text-4xl font-bold">Your Stars</span>
            </div>
          </div>

          {stars?.map((star) => {
            return (
              <div className="p-4" key={star.postId}>
                <Post post={star.post} />
              </div>
            );
          })}
        </PageLayout>
      </main>
    </>
  );
};

export default StarsPage;