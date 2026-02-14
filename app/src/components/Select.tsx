import clsx from "clsx";
import React from "react";

const Select = ({
  children,
  value,
  onChange,
  className,
}: {
  children?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e)}
      className={clsx(
        "p-2 border-2 border-text/10 rounded text-white outline-none focus:border-primary",
        className,
      )}
    >
      {children}
    </select>
  );
};

const Option = ({ children, value }: { children?: React.ReactNode; value?: string }) => {
  return <option className="bg-background text-text" value={value}>{children}</option>;
};

Select.Option = Option;
export default Select;
