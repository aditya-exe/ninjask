import PageLayout from "@/components/page-layout";
import Sidebar from "@/components/sidebar";
import LoadingSpinner from "@/components/ui/Loading-Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type FC } from "react";
import { api } from "@/utils/api";
import Image from "next/image";
import BioModal from "@/components/bio-modal";
import ProfileFeed from "@/components/profile-feed";
import Head from "next/head";

// interface ProfilePageProps {

// }

const ProfilePage: FC = ({}) => {
  const router = useRouter();
  const { slug: username } = router.query;
  const { data: session, status } = useSession();
  const { data: userToLoad } = api.profile.getUserByUsername.useQuery({
    username: username as string,
  });
  // const { data: posts, isLoading } = api.profile.getPostByUser.useQuery({
  //   userId: data?.id as string,
  // });

  if (!userToLoad) {
    //TODO
    return <LoadingSpinner size={80} />;
  }

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const canEdit = session?.user.id === userToLoad.id;

  return (
    <>
      <Head>
        <title>{`@${username as string}`}</title>
      </Head>
      <main className="flex dark:bg-gray-900 dark:text-white">
        <Sidebar username={session?.user.name as string} />
        <PageLayout>
          <div className="flex border-b-2 border-[#685582]">
            <div className="flex min-h-[99.9px] w-full items-center justify-start gap-x-4 p-4">
              <span className="text-4xl font-bold">{username}</span>
            </div>
          </div>

          <div className="flex border-b-2 border-[#685582] p-4">
            <div className="mr-3 p-2">
              <Image
                src={userToLoad.image as string}
                alt={`${userToLoad.name as string}'s Profile Image`}
                height={56}
                width={56}
                // fill
                className="h-36 w-36 rounded-full ring-2 ring-[#685582]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex w-1/2 grow items-start p-2">
              {userToLoad.bio.length > 0 ? (
                <div className="mt-4 flex flex-col gap-y-4">
                  <p className="text-xl font-bold">About @{username} :-</p>
                  <p className="ml-2 text-lg font-semibold">{userToLoad.bio}</p>
                  {canEdit && <BioModal edit={true} />}
                </div>
              ) : (
                <BioModal edit={false} />
              )}
            </div>
          </div>

          <div>
            <ProfileFeed userId={userToLoad.id} />
          </div>
        </PageLayout>
      </main>
    </>
  );
};

export default ProfilePage;
