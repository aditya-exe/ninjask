import { api } from "@/utils/api";
import { type FC } from "react";
import LoadingSpinner from "../ui/Loading-Spinner";
import Post from "../post-view";
// import { useSession } from "next-auth/react";

interface ProfileFeedProps {
  userId: string;
}

//TODO combine feed and profile feed
const ProfileFeed: FC<ProfileFeedProps> = ({ userId }) => {
  const { data, isLoading } = api.post.getAllByUser.useQuery({ userId });
  // const { data: session } = useSession();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {data?.map((post) => {
        return (
          <div className="p-4" key={post.id}>
            <Post post={post} />
          </div>
        );
      })}
    </div>
  );
};

export default ProfileFeed;
