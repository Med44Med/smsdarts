import { SubText, Text } from "@/components/Text";
import type { MessageType } from "@/types";
import { messageDateFull } from "@/utilis/day";
import clsx from "clsx";
import { FaArrowRotateRight } from "react-icons/fa6";

export const MessageText = ({
  message,
  handleRetryMessage,
}: {
  message: MessageType;
  handleRetryMessage: (id: string) => void;
}) => {
  
  
  return (
    <div
      className={clsx(
        "flex items-center gap-2",
        message.operation === "outgoing" ? "justify-start" : "justify-end",
      )}
    >
      <div className="max-w-1/2 flex flex-col gap-1">
        <Text
          className={clsx(
            "p-1 px-2 rounded text-wrap w-fit",
            message.operation === "outgoing"
              ? "bg-primary text-start self-start"
              : "bg-blue-500 text-end self-end",
          )}
        >
          {message.message}
        </Text>
        <SubText
          secondary
          className={clsx(
            "ml-1 text-xs flex items-center gap-1",
            message.status === "failed" && "text-red-500/80!",
          )}
        >
          {message.status === "failed" && (
            <FaArrowRotateRight
              className="cursor-pointer"
              onClick={() => handleRetryMessage(message.id)}
            />
          )}
          {messageDateFull(message.created_at)} - {message.status}
        </SubText>
      </div>
    </div>
  );
};
