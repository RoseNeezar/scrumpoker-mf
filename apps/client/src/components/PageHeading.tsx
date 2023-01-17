import React, { FC } from "react";
import { cn } from "../utils/tailwindCn";

type Props = {
  className?: string;
  highlights?: boolean;
  children: React.ReactNode;
};

const PageHeading: FC<Props> = (props) => {
  return (
    <h1
      className={cn(
        "text-4xl text-slate-800",
        props.highlights ? "bg-red-300" : "bg-slate-100",
        props.className
      )}
      {...props}
    >
      {props.children}
    </h1>
  );
};

export default PageHeading;
