import { type PropsWithChildren } from "react";

const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex relative left-[450px] justify-center">
      <div className="h-fit min-h-screen w-full border-x-2 border-[#685582] md:w-[750px]">
        {props.children}
      </div>
    </main>
  );
};

export default PageLayout;
