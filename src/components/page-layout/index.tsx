import { type PropsWithChildren } from "react";

const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex justify-center">
      <div className="h-full w-full border-x-2 border-[#685582] md:w-[750px]">
        {props.children}
      </div>
    </main>
  );
};

export default PageLayout;
