import { Activity } from "react";
import Surface from "./Surface";
import clsx from "clsx";

const Popup = ({
  children,
  show,
  setShow,
  className
}: {
  children?: React.ReactNode;
  show: boolean;
  setShow: (show: boolean) => void;
  className?: string;
}) => {
  return (
    <Activity mode={show ? "visible" : "hidden"}>
      <div className="z-50 fixed inset-0 bg-black/50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShow(false)}
        />
        <Surface className={clsx("z-10 w-2/3 h-2/3 overflow-x-hidden overflow-y-auto",className)}>
          {children}
        </Surface>
      </div>
    </Activity>
  );
};

export default Popup;
