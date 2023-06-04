import PageLayout from "@/components/page-layout";
import Sidebar from "@/components/sidebar";
import LoadingSpinner from "@/components/ui/Loading-Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC } from "react";

// interface ProfilePageProps {

// }

const ProfilePage: FC = ({}) => {
  const router = useRouter();
  const {slug: username} = router.query;
  const { status: session, status } = useSession();
  // const { data } = api.profile.getUserByUsername.useQuery({
  //   username: username as string,
  // });
  // const { data: posts, isLoading } = api.profile.getPostByUser.useQuery({
  //   userId: data?.id as string,
  // });
  
  // if (!data || isLoading || !posts) {
  //   return <LoadingSpinner size={80} />;
  // }
  

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Sidebar />
      <PageLayout>
        <div className="flex h-[99.9px] w-full items-center gap-x-3 p-4">
          
        </div>
      </PageLayout>
    </>
  );
};

export default ProfilePage;
