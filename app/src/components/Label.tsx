import clsx from "clsx";

const Label = ({
  children,
  htmlFor,
  className,
}: {
  children?: React.ReactNode | string;
  htmlFor?: string;
  className?: string;
}) => {
  return (
    <label htmlFor={htmlFor} className={clsx("text-white", className)}>
      {children}
    </label>
  );
};

export default Label;
