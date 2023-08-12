import { api, type RouterOutputs } from "@/utils/api";
import { type FC } from "react";
import Post from "../post-view";
// import { useSession } from "next-auth/react";
// import { useIntersection } from "@mantine/hooks";
import LoadingSpinner from "../ui/Loading-Spinner";

export type Posts = RouterOutputs["post"]["getInitialPosts"];
interface FeedProps {
  initialPosts: Posts;
}

const Feed: FC<FeedProps> = ({ }) => {
  // const { data: session } = useSession();
  // const lastPostRef = useRef<HTMLDivElement>(null);
  // const { ref, entry } = useIntersection({
    // root: lastPostRef.current,
    // threshold: 1,
  // });
  const { data: posts, isLoading } = api.post.getAll.useQuery();

  if (isLoading || !posts) {
    return <LoadingSpinner />;
  }

  // const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
  //   ["infinite-query"],
  //   async ({ pageParam = 1 }) => {
  //     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  //     const query = `api/posts?limit=3&page=${pageParam}`;

  //     const { data } = await axios.get<Posts>(query);
  //     return data;
  //   },
  //   {
  //     getNextPageParam: (_, pages) => {
  //       return pages.length + 1;
  //     },
  //     initialData: { pages: [initialPosts], pageParams: [1] },
  //   }
  // );

  // useEffect(() => {
  //   if (entry?.isIntersecting) {
  //     void fetchNextPage(); // Load more posts when the last post comes into view
  //   }
  // }, [entry, fetchNextPage]);

  // const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="col-span-2 flex h-fit flex-col">
      {posts.map((post) => {
        // if (idx === posts.length - 1) {
        //   return (
        //     <li key={post.id} className="p-4" ref={ref}>
        //       <Post post={post} />
        //     </li>
        //   );
        // } else {
        if (!post.parentPost) {
          return (
            <div className="p-4" key={post.id}>
              <Post post={post} />
            </div>
          );
        }
        // }
      })}
      {/* {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </li>
      )} */}
    </ul>
  );
};

export default Feed;
