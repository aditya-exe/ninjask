import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
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

const CommentModal: FC = () => {
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading } = api.profile.changeBio.useMutation({
    onSuccess: () => {
      void ctx.profile.getUserByUsername.invalidate();
    },
  });

  function handleSubmit() {
    mutate({ text: input });
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex items-center gap-x-4 dark:text-white">
      <Dialog>
        <DialogTrigger asChild>
          <Icons.MessageSquare className="cursor-pointer rounded-full hover:text-[#e62a6f]" />
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
