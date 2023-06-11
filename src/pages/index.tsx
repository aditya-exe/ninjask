import { type NextPage } from "next";
import PageLayout from "@/components/page-layout";
import { signIn, useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/Loading-Spinner";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import CreatePostWizard from "@/components/create-post-wizard";
import Sidebar from "@/components/sidebar";
import Feed from "@/components/feed";
import Head from "next/head";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  function handleSignIn() {
    try {
      void signIn("discord");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, try again :/");
    }
  }

  return (
    <>
      <Head>
        <title>Ninjask | Home</title>
      </Head>
      <main className="flex dark:bg-gray-900 dark:text-white">
        <Sidebar username={session?.user.name as string} />
        <PageLayout>
          <div className="flex border-b-2 border-[#685582]">
            {!session && (
              <div className="flex min-h-[99.9px] w-full items-center justify-center gap-x-4 p-4">
                <div className="rounded p-2 text-white">
                  <Button onClick={handleSignIn}>Sign In</Button>
                </div>
                <span className="text-xl font-bold">
                  Sign In to send messages!
                </span>
              </div>
            )}
            {session && <CreatePostWizard />}
          </div>
          <Feed />
        </PageLayout>
      </main>
    </>
  );
};

export default Home;
