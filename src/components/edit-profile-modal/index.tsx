import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "../ui/Dialog";
import { Label } from "../ui/Label";
import { Icons } from "../icons";
import { useState, type FC, useRef, type ChangeEvent } from "react";
import Button from "../ui/Button";
import { Textarea } from "../ui/TextArea";
import { api } from "@/utils/api";
import { Input } from "../ui/Input";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

interface EditProfileModalProps {
  edit: boolean;
  currentPicture: string;
  currentUser: string;
}

const EditProfileModal: FC<EditProfileModalProps> = ({
  edit,
  currentPicture,
  currentUser,
}) => {
  const ctx = api.useContext();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const filePickerRef = useRef<HTMLInputElement>(null);
  const { data: isAvailable } = api.profile.checkUsername.useQuery({
    newUsername: newUsername,
  });
  const { mutate: changeBio } = api.profile.changeBio.useMutation({
    onSuccess: () => {
      void ctx.profile.getUserByUsername.invalidate();
      toast.success("Bio changed successfully");
    },
    onError: () => {
      toast.error("Error changing your bio, please try again :/");
    },
  });
  const { mutate: changePfp } = api.profile.changeProfilePicture.useMutation({
    onError: () => {
      toast.error("Error changing your profile picture, please try again :/");
    },
    onSuccess: () => {
      toast.success("Profile picture changes successfully");
    },
  });
  const { mutate: changeUsername } = api.profile.changeUsername.useMutation({
    onError: () => {
      toast.error("Error changing your username, please try agian :/");
    },
    onSuccess: () => {
      void router.push(`/${newUsername}`);
      toast.success("Username changed successfully");
    },
  });

  function handleSubmit() {
    if (input) {
      changeBio({ text: input });
    }
    if (selectedFile) {
      changePfp({
        currentUser: currentUser,
        newImage: selectedFile,
      });
    }
    if (newUsername && isAvailable) {
      changeUsername({
        newUsername,
      });
    }
  }

  function convertImageToBase64(e: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();
    if (e.target.files !== null) {
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result !== undefined) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  }

  return (
    <div className="flex items-center gap-x-4 dark:text-white">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"ghost"} className="gap-2 border-2">
            <Icons.edit />
            <p className="select-none text-lg  font-bold">Edit profile</p>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="dark:text-gray-400">
            {edit ? "Edit" : "Add a bio!"}
          </DialogHeader>
          <DialogDescription className="dark:text-gray-400">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
          <div className="flex flex-col items-start gap-2">
            <div>
              <Label
                htmlFor="username"
                className=" text-right dark:text-gray-400"
              >
                Username
              </Label>
              <div className="flex items-center gap-x-3">
                <Input
                  id="username"
                  type="text"
                  className="dark:text-gray-400"
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                {isAvailable ? (
                  <div>
                    <Icons.tick className="h-5 w-5 text-green-700" />
                  </div>
                ) : (
                  <div>
                    <Icons.cross className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="bio" className=" text-right dark:text-gray-400">
                Bio
              </Label>
              <Textarea
                onChange={(e) => setInput(e.target.value)}
                placeholder={"Edit your bio here!"}
                className="text-gray-900 dark:text-gray-200"
              />
            </div>
            <div className="flex flex-col items-start">
              <Label
                htmlFor="bio"
                className="mb-2 text-right dark:text-gray-400"
              >
                Profile picture
              </Label>
              <div className="grid w-full grid-cols-3 items-center gap-4">
                <div className="mt-2 flex flex-col items-center justify-center">
                  <Image
                    src={currentPicture}
                    alt="current picture"
                    width={20}
                    height={20}
                    className="h-20 w-20 rounded-full ring-2 ring-slate-900"
                  />
                  <p className="mt-1 text-xs font-bold dark:text-gray-400">
                    Current Picture
                  </p>
                </div>
                <input
                  type="file"
                  hidden
                  ref={filePickerRef}
                  accept="image/*"
                  onChange={convertImageToBase64}
                />
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    if (filePickerRef !== null) filePickerRef.current?.click();
                  }}
                  className="border-2 px-3 dark:text-gray-400"
                >
                  Select new picture
                </Button>

                {selectedFile && (
                  <div className="mt-2 flex flex-col items-center justify-center">
                    <Image
                      src={selectedFile}
                      alt="New file"
                      width={20}
                      height={20}
                      className="h-20 w-20 rounded-full ring-2 ring-slate-900"
                    />
                    <p className="mt-1 text-xs font-bold dark:text-gray-400">
                      New Picture
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfileModal;
