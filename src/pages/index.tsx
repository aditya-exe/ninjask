import { type NextPage } from "next";
import PageLayout from "@/components/page-layout";
import { signIn, useSession } from "next-auth/react";
import LoadingSpinner from "@/components/ui/Loading-Spinner";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import CreatePostWizard from "@/components/create-post-wizard";

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
      <PageLayout>
        <div className="flex border-b border-slate-400">
          {!session && (
            <div className="flex w-full items-center justify-center gap-x-4 p-4">
              <div className="rounded p-2 text-white">
                <Button onClick={handleSignIn}>Sign In</Button>
              </div>
              <span className="text-xl font-bold">Sign In to send emojis!</span>
            </div>
          )}
          <CreatePostWizard />
        </div>
        {/* <Feed /> */}
      </PageLayout>
    </>
  );
};

export default Home;
