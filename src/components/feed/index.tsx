import { api } from "@/utils/api";
import { type FC } from "react";
import LoadingSpinner from "../ui/Loading-Spinner";
import Post from "../post-view";
import { useSession } from "next-auth/react";

const Feed: FC = () => {
  const { data, isLoading } = api.post.getAll.useQuery();
  const { data: session } = useSession();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {data?.map((post) => {
        return (
          <div className="p-4" key={post.id}>
            <Post
              postId={post.id}
              authorId={post.authorId}
              text={post.text}
              createdAt={post.createdAt}
              userId={session?.user.id as string}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Feed;