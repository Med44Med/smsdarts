import clsx from "clsx";

const Button = ({
  children,
  id,
  className,
  onClick,
  type = "button",
  href,
  disabled=false
}: {
  children: React.ReactNode | string;
  id?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | "link";
  href?: string;
  disabled?: boolean;
}) => {
  return type === "link" ? (
    <a
      href={href}
      className={clsx("p-2 bg-primary hover:bg-primary-hover rounded text-white text-center font-semibold", className)}
      onClick={onClick}
    >
      {children}
    </a>
  ) : (
    <button
      id={id}
      className={clsx("p-2 bg-primary hover:bg-primary-hover disabled:bg-primary-hover disabled:cursor-not-allowed rounded text-white font-semibold cursor-pointer", className)}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
