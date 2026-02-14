import { monthNames } from "@/assets/months";
import Surface from "@/components/Surface";
import { H1 } from "@/components/Text";
import { AuthContext } from "@/context/contexts";
import type { AuthContextType } from "@/types";
import { useContext } from "react";
import { BsEnvelopeArrowDownFill, BsEnvelopeArrowUpFill } from "react-icons/bs";

const Logs = () => {
  const auth = useContext<AuthContextType | null>(AuthContext);
  const { usage } = auth!;
  const today = new Date();
  const thisMonth = monthNames[today.getMonth()];
  const thisYear = today.getFullYear();
  return (
    <Surface className="flex flex-col gap-5">
      <H1>
        Usage{" "}
        <span className="text-sm text-text-secondary">
          ({thisMonth} {thisYear})
        </span>
      </H1>
      <div className="w-full flex flex-wrap justify-between gap-5">
        <Surface className="flex-1 bg-primary/10! p-10 flex flex-col items-center gap-5">
          <div className="w-full flex items-center gap-2 ">
            <BsEnvelopeArrowUpFill size={24} className="text-primary" />
            <H1 className="text-primary!">Sent SMS</H1>
          </div>
          <H1>{usage?.sent}</H1>
        </Surface>
        <Surface className="flex-1 bg-amber-300/10! p-10 flex flex-col items-center gap-5">
          <div className="w-full flex items-center gap-2 ">
            <BsEnvelopeArrowDownFill size={24} className="text-amber-300" />
            <H1 className="text-amber-300!">Received SMS</H1>
          </div>
          <H1>{usage?.received}</H1>
        </Surface>
      </div>
    </Surface>
  );
};

export default Logs;
