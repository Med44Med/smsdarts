import clsx from "clsx";
import Label from "./Label";
import { type IconType } from "react-icons";

const Input = ({
  label,
  Icon,
  IconClick,
  type="text",
  className,
  placeholder,
  value,
  onChange,
  onKeyDown,
}: {
  label?: string;
  Icon?: IconType;
  IconClick?: () => void;
  type: string;
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <div className="relative mb-3">
        <input
          type={type}
          placeholder={placeholder}
          className={clsx(
            "bg-background p-2 border-2 border-text/10 rounded text-white outline-none focus:border-primary",
            className,
          )}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        {Icon && (
          <Icon
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text text-xl cursor-pointer"
            onClick={IconClick}
          />
        )}
      </div>
    </div>
  );
};
export default Input;
