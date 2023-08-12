import { type FC } from "react";
import Link from "next/link";
import { Icons } from "../icons";
import { type SidebarOption } from "@/types";
import Button from "../ui/Button";
import { signIn, signOut, useSession } from "next-auth/react";
import LoadingSpinner from "../ui/Loading-Spinner";
import Image from "next/image";
import { useRouter } from "next/router";
import LightModeToggle from "../ui/light-mode-toggle";
import toast from "react-hot-toast";

interface SidebarProps {
  username: string | null | undefined;
}

const Sidebar: FC<SidebarProps> = ({ username }) => {
  const sidebarOptions: SidebarOption[] = [
    {
      id: 1,
      name: "Buzz",
      href: "/buzz",
      Icon: "Send",
    },
    {
      id: 2,
      name: "Profile",
      href: `/${username as string}`,
      Icon: "User",
    },
    {
      id: 3,
      name: "Stars",
      href: `/${username as string}/stars`,
      Icon: "Star",
    },
  ];

  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  function handleSignIn() {
    try {
      void signIn("discord");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, try again :/");
    }
  }

  return (
    <div className="flex fixed inset-y-0 w-[450px] flex-col ">
      <Link
        href="/"
        className="flex h-[101.5px] items-center gap-x-4 border-b-2 border-[#685582] p-4"
      >
        <Icons.Logo />
        <p className="text-3xl font-extrabold tracking-wide hover:text-[#685582]">
          Ninjask
        </p>
      </Link>

      <div className="flex shrink-0 grow flex-col justify-between p-4">
        <ul role="list" className="mt-2 p-2 ">
          {username &&
            sidebarOptions.map((option) => {
              const Icon = Icons[option.Icon];
              return (
                <li
                  key={option.id}
                  className="mb-5 w-full rounded-md hover:ring-2 hover:ring-[#685582] hover:text-[#685582]"
                >
                  <Link
                    href={option.href}
                    className="flex h-full w-full items-center gap-x-4 rounded-md p-4"
                  >
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
          {!username && (
            <div className="flex flex-col h-full w-full items-center justify-center">
              <p className="text-xl font-bold">
                Sign In to access all features
              </p>
              <div className="rounded p-2 text-white">
                <Button onClick={handleSignIn}>Sign In</Button>
              </div>
            </div>
          )}
        </ul>

        <div className="flex flex-col items-center justify-center gap-y-4">
          <div className="flex w-full items-center justify-center gap-x-3 p-4">
            <LightModeToggle />
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
