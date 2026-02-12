import clsx from "clsx";

type HeaderProps = {
  title?: string;
  sub?: string;
  className?: string;
  subStyle?: string;
  titleStyle?: string;
};

function HeaderSection({
  title,
  sub,
  className,
  subStyle = "font-libertine text-primaryPink",
  titleStyle = "font-averia",
}: HeaderProps) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <h1 className={clsx("font-bold text-4xl lg:text-5xl", titleStyle)}>
        {title}
      </h1>
      <p className={clsx("semibold text-2xl lg:text-3xl", subStyle)}>{sub}</p>
    </div>
  );
}

export default HeaderSection;
