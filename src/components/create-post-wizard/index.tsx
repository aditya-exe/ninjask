/* eslint-disable @typescript-eslint/no-misused-promises */
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, type FC } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../ui/Button";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const formSchema = z.object({
  text: z.string().min(1),
});

type FormType = z.infer<typeof formSchema>;

const CreatePostWizard: FC = () => {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.post.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });
  const router = useRouter();
  const { register, handleSubmit: hookFormSubmit } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit: SubmitHandler<FormType> = ({ text }) => {
    console.log(text);
    mutate({ text });
  };

  return (
    <div className="flex h-[99.9px] w-full items-center gap-x-3 p-4">
      <Image
        src={session?.user.image as string}
        alt="Profile Image"
        className="h-14 w-14 cursor-pointer rounded-full ring-2 ring-[#685582]"
        height={56}
        width={56}
        onClick={() => {
          void router.push(`/${session?.user.name as string}`);
        }}
      />
      <form className={"w-full"} onSubmit={hookFormSubmit(onSubmit)}>
        <div className="flex gap-x-4">
          <input
            {...register("text")}
            type="text"
            placeholder="Type some emojis!"
            className="grow rounded border-2 border-[#685582] bg-transparent p-2 outline-none"
            disabled={isPosting}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (input !== "") {
                  mutate({ text: input });
                }
              }
            }}
          />
          <Button
            className={"min-w-[100px] p-2 font-bold tracking-wider"}
            isLoading={isPosting}
            type="submit"
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostWizard;
