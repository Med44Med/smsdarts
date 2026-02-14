import clsx from "clsx";

const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-text/20",
        className,
      )}
    />
  );
};

export default Skeleton;
