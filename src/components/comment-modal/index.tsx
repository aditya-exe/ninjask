import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "../ui/Dialog";
import { Label } from "../ui/Label";
import { useState, type FC } from "react";
import Button from "../ui/Button";
import { Textarea } from "../ui/TextArea";
import { api } from "@/utils/api";
import LoadingSpinner from "../ui/Loading-Spinner";
import { Icons } from "../icons";

interface CommentModalProps {
  postId: string;
}

const CommentModal: FC<CommentModalProps> = ({ postId }) => {
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading } = api.post.create.useMutation({
    onSuccess: ()=>{
      void ctx.post.getAllChildren.invalidate();
    }
  });

  function handleSubmit() {
    mutate({
      parentPostId: postId,
      text: input,
    });
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex items-center gap-x-4 dark:text-white">
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex w-full cursor-pointer items-center justify-center rounded-l-lg border-2 p-2 hover:text-pink-500">
            <Icons.MessageSquare className="cursor-pointer" />
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader className="dark:text-gray-400">
            Add a Comment!
          </DialogHeader>
          <div className="flex flex-col items-start">
            <Label htmlFor="bio" className="mb-2 text-right dark:text-gray-400">
              Comment
            </Label>
            <Textarea
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Type here!"}
              className="text-gray-900 dark:text-white"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentModal;
