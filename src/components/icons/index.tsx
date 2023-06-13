import {
  Send,
  User,
  Star,
  Sun,
  Moon,
  LogOut,
  Trash2,
  Heart,
  MessageSquare,
  Share2,
  ClipboardCopy,
} from "lucide-react";
import Image from "next/image";

export const Icons = {
  Logo: () => (
    <Image
      src="/favicon.ico"
      className="h-14 w-14 cursor-pointer rounded-full ring-2 ring-[#685582]"
      alt="Favicon"
      height={56}
      width={56}
    />
  ),
  Send,
  User,
  Star,
  Sun,
  Moon,
  LogOut,
  Trash2,
  Heart,
  Share2,
  MessageSquare,
  ClipboardCopy,
};

export type Icon = keyof typeof Icons;
