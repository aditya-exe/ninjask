import { type NextPage } from "next";
import PageLayout from "@/components/page-layout";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/Loading-Spinner";
import CreatePostWizard from "@/components/create-post-wizard";
import Sidebar from "@/components/sidebar";
import Feed, { type Posts } from "@/components/feed";
import Head from "next/head";
import { api } from "@/utils/api";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: initialPosts } = api.post.getInitialPosts.useQuery();

  if (status === "loading") {
    return <LoadingSpinner />;
  }
  
  

  return (
    <>
      <Head>
        <title>Ninjask | Home</title>
      </Head>
      <main className="flex h-screen overflow-y-scroll dark:bg-gray-900 dark:text-white">
        <Sidebar username={session?.user.name as string} />
        <PageLayout>
          <div className="outline-r fixed z-50 flex w-[747px] border-b-2 border-[#685582] bg-white dark:bg-gray-900">
            {!session && (
              <div className="flex min-h-[99.9px] w-full items-center justify-center gap-x-4 p-4">
                <span className="text-xl font-bold">
                  Sign In to create posts!
                </span>
              </div>
            )}
            {session && <CreatePostWizard />}
          </div>
          <div className="mt-[100px]">
            <Feed initialPosts={initialPosts as Posts} />
          </div>
        </PageLayout>
      </main>
    </>
  );
};

export default Home;
