import { api } from "@/utils/api";
import { type FC } from "react";
import LoadingSpinner from "../ui/Loading-Spinner";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Icons } from "../icons";
import OptionsStrip from "../options-strip";
import { useRouter } from "next/router";

dayjs.extend(relativeTime);

interface CommentListProps {
  postId: string;
  userId: string;
}

const CommentList: FC<CommentListProps> = ({ postId, userId }) => {
  const router = useRouter();
  const ctx = api.useContext();
  const { data: comments, isLoading } = api.post.getAllChildren.useQuery({
    parentPostId: postId,
  });
  const { mutate: deleteChild } = api.post.deleteByPostId.useMutation({
    onSuccess: () => {
      void ctx.post.getAllChildren.invalidate();
    },
  });

  if (isLoading || !comments) {
    return <LoadingSpinner />;
  }

  return (
    <ul>
      {comments.map((comment) => {
        return (
          <li
            key={comment.id}
            className="border-b-2 border-[#685582] p-4"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void router.push(`/post/${comment.id}`);
            }}
          >
            <div className="flex gap-x-3">
              <div className="w-fit ">
                <Image
                  src={comment.author.image as string}
                  alt={`@${comment.author.name as string}'s pfp`}
                  width={20}
                  height={20}
                  className="h-12 w-12 rounded-full"
                  onClick={() => {
                    void router.push(`/${comment.author.name as string}`);
                  }}
                />
              </div>
              <div className="flex w-full flex-col gap-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-md font-bold">
                    {`@${comment.author.name as string}`} {" • "}
                  </p>
                  <time className="grow text-xs font-semibold">
                    {dayjs(comment.createdAt).fromNow()}
                  </time>
                  <div className="group relative inline-block" tabIndex={-1}>
                    <button
                      type="button"
                      className="active:shadow-outline-pink inline-flex cursor-pointer rounded-full p-2 focus-within:border-transparent focus-within:text-[#685582] focus-within:outline focus-within:outline-2 focus-within:outline-[#685582] hover:text-[#685582]"
                    >
                      <Icons.options />
                    </button>
                    <div className="invisible origin-top-right -translate-y-2 scale-95 transform opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100 dark:bg-gray-900 dark:text-white">
                      <div
                        className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-[#685582] rounded-md border border-[#685582] bg-white shadow-lg outline-none dark:bg-gray-900"
                        role="menu"
                      >
                        <div className="py-1">
                          <button
                            className="flex w-full justify-between px-4 py-2 text-left text-sm font-bold leading-5 text-red-500 focus-visible:outline-1 focus-visible:outline-pink-500 disabled:cursor-not-allowed"
                            role="menuitem"
                            disabled={userId !== comment.authorId}
                            onClick={() =>
                              deleteChild({
                                parentPost: comment.parentPost ?? "",
                                postId: comment.id,
                                authorId: comment.authorId,
                              })
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <p className="text-md">{comment.text}</p>
                </div>
                <OptionsStrip
                  postId={comment.id}
                  showNumbers={false}
                  showModal={false}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default CommentList;
