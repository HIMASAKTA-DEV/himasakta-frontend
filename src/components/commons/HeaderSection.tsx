import clsx from "clsx";
import React from "react";

type HeaderProps = {
  title?: string;
  sub?: string;
  className?: string;
};

function HeaderSection({ title, sub, className }: HeaderProps) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <h1 className="font-averia font-bold text-4xl lg:text-5xl">{title}</h1>
      <p className="font-libertine semibold text-2xl lg:text-3xl text-primaryPink">
        {sub}
      </p>
    </div>
  );
}

export default HeaderSection;
