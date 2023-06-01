import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { type FC } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../ui/Button";

// interface CreatePostWizardProps {}

const formSchema = z.object({
  tweet: z.string().emoji().min(1),
});

type FormType = z.infer<typeof formSchema>;

const CreatePostWizard: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    reset,
  } = useForm<FormType>({
    // resolver: zodResolver(formSchema),
  });
  const onSubmit: SubmitHandler<FormType> = ({ tweet }) => {
    // mutate({ content: tweet });
  };

  return (
    <div className="flex h-[100px] w-full items-center gap-x-3 p-4">
      <Image
        src={session?.user.image as string}
        alt="Profile Image"
        className="h-14 w-14 cursor-pointer rounded-full ring-2 ring-[#685582]"
        height={56}
        width={56}
        // onClick={async () => {
        //   await router.push(`/${userName}`);
        // }}
      />
      <form className={"w-full"} onSubmit={void hookFormSubmit(onSubmit)}>
        <div className="flex gap-x-4">
          <input
            {...register("tweet")}
            type="text"
            placeholder="Type some emojis!"
            className="grow rounded border-2 border-[#685582] bg-transparent p-2 outline-none"
            // disabled={isPosting}
          />
          {/* {!isPosting && ( */}
          <Button
            className={"min-w-[100px] p-2 font-bold tracking-wider"}
            type="submit"
          >
            Post
          </Button>
        </div>
      </form>
      {/* {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={45} />
        </div>
      )} */}

      {/* <SignOutMenu userName={userName} /> */}
    </div>
  );
};

export default CreatePostWizard;
