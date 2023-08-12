import { useState, type FC } from "react";
import Image from "next/image";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { api } from "@/utils/api";

interface CommentBoxProps {
  avatarImage: string;
  postId: string;
  userId: string;
}

const CommentBox: FC<CommentBoxProps> = ({ avatarImage, postId, userId }) => {
  const ctx = api.useContext();
  const { mutate: postComment, isLoading } = api.post.createChild.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.post.getAllChildren.invalidate();
    },
  });

  const [input, setInput] = useState("");

  return (
    <div className="flex w-full items-center justify-between gap-x-3 border-b-2 border-[#685582] p-4">
      {userId ? (
        <>
          <div className="h-fit w-fit rounded-full">
            <Image
              src={avatarImage}
              alt={`Your Profile Picture`}
              width={20}
              height={20}
              className="h-12 w-12 rounded-full"
            />
          </div>
          <div className="flex h-fit grow">
            <Input
              className="h-11 rounded-md"
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  postComment({
                    parentPostId: postId,
                    text: input,
                  });
                }
              }}
              placeholder="Post your reply!"
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <Button
            size={"lg"}
            isLoading={isLoading}
            onClick={() =>
              postComment({
                parentPostId: postId,
                text: input,
              })
            }
          >
            Reply
          </Button>
        </>
      ) : (
        <div className="flex w-full items-center justify-center">
          <p className="text-xl font-bold italic">Sign-In to reply!</p>
        </div>
      )}
    </div>
  );
};

export default CommentBox;
