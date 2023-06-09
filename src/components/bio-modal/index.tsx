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
import { Textarea } from "../ui/textarea";
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
    <div className="flex items-center gap-x-4">
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
          <DialogHeader>{edit ? "Edit" : "Add a bio!"}</DialogHeader>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          <div className="flex flex-col items-start">
            <Label htmlFor="bio" className="mb-2 text-right">
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
