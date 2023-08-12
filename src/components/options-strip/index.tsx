import { cn } from "@/utils";
import { Icons } from "../icons";
import ShareModal from "../share-modal";
import { useSession } from "next-auth/react";
import { type FC } from "react";
import { api } from "@/utils/api";
import CommentModal from "../comment-modal";

interface OptionStripProps {
  postId: string;
  showNumbers: boolean;
  showModal: boolean;
}

const OptionsStrip: FC<OptionStripProps> = ({
  postId,
  showNumbers,
  showModal,
}) => {
  const { data: session } = useSession();
  const ctx = api.useContext();
  const { data: likesAmt } = api.like.countLikesByPostId.useQuery({
    postId,
  });
  const { data: starsAmt } = api.star.countStarsByPostId.useQuery({
    postId,
  });
  const { data: isLiked } = api.like.isLiked.useQuery({
    postId,
  });
  const { data: isStarred } = api.star.isStarred.useQuery({
    postId,
  });
  const { data: commentsAmt } = api.post.countChildren.useQuery({
    postId,
  });
  const { mutate: toggleLike } = api.like.toggleLike.useMutation({
    onSuccess: () => {
      void ctx.like.countLikesByPostId.invalidate();
      void ctx.like.isLiked.invalidate();
    },
  });
  const { mutate: toggleStar } = api.star.toggleStar.useMutation({
    onSuccess: () => {
      void ctx.profile.getStarsByUser.invalidate();
      void ctx.star.countStarsByPostId.invalidate();
      void ctx.star.isStarred.invalidate();
    },
  });

  function handleLike(e: React.MouseEvent<HTMLButtonElement>): void {
    e.stopPropagation();
    toggleLike({
      postId,
    });
  }

  function handleStar(e: React.MouseEvent<HTMLButtonElement>): void {
    e.stopPropagation();
    toggleStar({
      postId,
    });
  }

  return (
    <div className="mt-2  grid w-full grid-cols-4">
      {showModal ? (
        <CommentModal postId={postId} />
      ) : (
        <button className="flex cursor-pointer items-center justify-center gap-x-3 rounded-l-lg border-2 p-1 hover:text-[#685582]">
          <Icons.MessageSquare />
          {showNumbers && <span>{commentsAmt}</span>}
        </button>
      )}
      <button
        onClick={handleLike}
        disabled={!session}
        className={`flex cursor-pointer items-center justify-center gap-x-3 border-2 p-2 hover:text-red-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-gray-600`}
      >
        <Icons.Heart className={cn({ "fill-red-500 text-red-500": isLiked })} />
        {showNumbers && <span>{likesAmt}</span>}
      </button>
      <button
        onClick={handleStar}
        disabled={!session}
        className="flex cursor-pointer items-center justify-center gap-x-3 border-2 p-1 hover:text-yellow-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-gray-600"
      >
        <Icons.Star
          className={cn({
            "fill-yellow-600 text-yellow-600": isStarred,
          })}
        />
        {showNumbers && <span>{starsAmt}</span>}
      </button>
      <>
        <ShareModal postId={postId} />
      </>
    </div>
  );
};

export default OptionsStrip;
