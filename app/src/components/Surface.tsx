import clsx from "clsx";

const Surface = ({
  children,
  className,
  id,
}: {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <div
      id={id}
      className={clsx(
        className,
        "bg-surface rounded-xl p-5 border border-text/10",
      )}
    >
      {children}
    </div>
  );
};

export default Surface;
