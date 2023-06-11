import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "../ui/Dialog";
import { Label } from "../ui/Label";
import { Pencil } from "lucide-react";
import { useState, type FC } from "react";
import Button from "../ui/Button";
import { DialogHeader, DialogFooter } from "../ui/Dialog";
import { Textarea } from "../ui/TextArea";
import { api } from "@/utils/api";
import LoadingSpinner from "../ui/Loading-Spinner";

interface BioModalProps {
  edit: boolean;
}

const BioModal: FC<BioModalProps> = ({ edit }) => {
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
          <Button variant={"ghost"} className="">
            <Pencil />
          </Button>
        </DialogTrigger>
        <p className="select-none text-xl  font-bold">
          {edit ? "Edit" : "Add a bio!"}
        </p>
        <DialogContent>
          <DialogHeader className="dark:text-gray-400">
            {edit ? "Edit" : "Add a bio!"}
          </DialogHeader>
          <DialogDescription className="dark:text-gray-400">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
          <div className="flex flex-col items-start">
            <Label htmlFor="bio" className="mb-2 text-right dark:text-gray-400">
              Bio
            </Label>
            <Textarea
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Edit your bio here!"}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BioModal;
