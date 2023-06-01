import { type PropsWithChildren } from "react";

const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex justify-center">
      <div className="h-full w-full border-x border-[#685582] md:max-w-3xl">
        {props.children}
      </div>
    </main>
  );
};

export default PageLayout;
