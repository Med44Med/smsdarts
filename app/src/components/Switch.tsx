import clsx from "clsx";
import { useRef } from "react";

const Switch = ({
  value,
  onChange,
  className
}: {
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?:string
}) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        type="checkbox"
        className="hidden"
        ref={ref}
        checked={value}
        onChange={onChange ? () => onChange(!value) : undefined}
      />
      <div
        onClick={() => ref.current?.click()}
        className={clsx(
          "cursor-pointer w-12 h-6 rounded-full p-0.5 transition-all duration-300 ease-in-out",
          value ? "bg-primary" : "bg-white",
          className
        )}
      >
        <div className="relative">
          <div
            className={clsx(
              "absolute top-0 left-0 transition-all duration-300 ease-in-out w-5 h-5  rounded-full",
              value ? "translate-x-6 bg-white" : "translate-x-0 bg-primary",
            )}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Switch;
