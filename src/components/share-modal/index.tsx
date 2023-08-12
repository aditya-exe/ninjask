import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/Dialog";
import { type MouseEvent, type FC } from "react";
import { Icons } from "../icons";
import { toast } from "react-hot-toast";
import { MdWhatsapp } from "react-icons/md";

interface ShareModalProps {
  postId: string;
}

const ShareModal: FC<ShareModalProps> = ({ postId }) => {
  function handleCopyToClipboard(e: MouseEvent<HTMLDivElement>): void {
    e.preventDefault();
    try {
      void navigator.clipboard.writeText(
        `https://ninjask.vercel.app/post/${postId}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Somethin went wrong :/");
    } finally {
      toast.success("Link copied to clipboard");
    }
  }

  function handleShareWhatsapp(e: MouseEvent<HTMLDivElement>): void {
    e.preventDefault();
    window.open(
      `https://web.whatsapp.com://send?text=https://ninjask.vercel.app/post/${postId}`,
      "_blank"
    );
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex cursor-pointer items-center justify-center w-full rounded-r-lg border-2 p-2 hover:text-blue-500">
            <Icons.Share2 className="cursor-pointer hover:text-blue-500" />
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader className="text-xl dark:text-gray-400">
            Share this post!
          </DialogHeader>
          <DialogDescription className="dark:text-gray-400">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
          <div className="mt-3 flex items-center gap-x-3">
            <div
              className="w-fit cursor-pointer rounded-full p-2 hover:bg-[#e62a6f] hover:text-white dark:text-gray-400 dark:hover:text-white"
              onClick={(e) => handleCopyToClipboard(e)}
            >
              <Icons.ClipboardCopy size={36} />
            </div>
            <div
              className="w-fit cursor-pointer rounded-full p-2 text-[36px] hover:bg-[#e62a6f] hover:text-white dark:text-gray-400 dark:hover:text-white"
              onClick={(e) => handleShareWhatsapp(e)}
            >
              <MdWhatsapp />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShareModal;
