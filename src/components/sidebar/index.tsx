/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type FC } from "react";
import Link from "next/link";
import { Icons } from "../icons";
import { type SidebarOption } from "@/types";
import { Switch } from "../ui/Switch";
import Button from "../ui/Button";
import { signOut, useSession } from "next-auth/react";
import LoadingSpinner from "../ui/Loading-Spinner";
import Image from "next/image";
import useDarkMode from "@/utils/useDarkMode";
import { useRouter } from "next/router";

// interface SidebarProps {}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Buzz",
    href: "/buzz",
    Icon: "Send",
  },
  {
    id: 2,
    name: "Profle",
    href: "/",
    Icon: "User",
  },
  {
    id: 3,
    name: "Stars",
    href: "/stars",
    Icon: "Star",
  },
];

const Sidebar: FC = ({}) => {
  const { data: session, status } = useSession();
  // const [dark, setDark] = useDarkMode();
  const router = useRouter();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen w-[450px] flex-col">
      <Link
        href="/"
        className="flex h-[101.5px] items-center gap-x-4 border-b-2 border-[#685582] p-4"
      >
        <Icons.Logo />
        <p className="text-2xl font-extrabold tracking-wide">Ninjask</p>
      </Link>

      <div className="flex shrink-0 grow flex-col justify-between p-4">
        <ul role="list" className="mt-2 p-2 ">
          {sidebarOptions.map((option) => {
            const Icon = Icons[option.Icon];
            return (
              <li
                key={option.id}
                className="mb-5 w-full rounded-md p-4 hover:border-2 hover:border-[#685582] hover:text-[#685582]"
              >
                <Link href={option.href} className="flex items-center gap-x-4">
                  <span className="hover:text-[#685582]">
                    <Icon className="h-8 w-8" />
                  </span>

                  <span className="truncate text-xl font-bold">
                    {option.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-center justify-center gap-y-4">
          <div className="flex w-full items-center justify-center gap-x-3 p-4">
            <Icons.Sun />
            <Switch />
            <Icons.Moon />
          </div>
          {session && (
            <div className="flex w-full items-center justify-between gap-x-5 p-4">
              <div className="flex items-center gap-x-2 p-4">
                <Image
                  src={session?.user.image as string}
                  alt="Profile Image"
                  className="h-14 w-14 cursor-pointer rounded-full ring-2 ring-[#685582]"
                  height={56}
                  width={56}
                  onClick={() => {
                    void router.push(`/${session.user.name as string}`);
                  }}
                />
                <div className="flex flex-col">
                  <p className="text-2xl font-bold">{session?.user.name}</p>
                  <p className="truncate">{session?.user.email}</p>
                </div>
              </div>
              <div className="p-4">
                <Button
                  className="flex gap-x-4 px-4 py-6"
                  onClick={() => void signOut()}
                >
                  <Icons.LogOut />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;