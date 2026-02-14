import clsx from "clsx";

export const Text = ({
  children,
  className,
  secondary = false,
  onClick,
}: {
  children?: React.ReactNode | string | number;
  className?: string;
  secondary?: boolean;
  onClick?: () => void;
}) => {
  return (
    <p
      className={clsx(
        "text-base",
        secondary ? "text-text-secondary" : "text-text",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </p>
  );
};

export const SubText = ({
  children,
  className,
  secondary,
  onClick,
}: {
  children?: React.ReactNode | string | number;
  className?: string;
  secondary?: boolean;
  onClick?: () => void;
}) => {
  return (
    <p
      className={clsx(
        "text-sm",
        secondary ? "text-text-secondary" : "text-text",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </p>
  );
};
export const Span = ({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode | string | number;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <span onClick={onClick} className={clsx("", className)}>
      {children}
    </span>
  );
};

export const H1 = ({
  children,
  className,
  onClick,
}: {
  children?: React.ReactNode | string | number;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <h1
      onClick={onClick}
      className={clsx("text-text font-bold text-2xl tracking-tight", className)}
    >
      {children}
    </h1>
  );
};
