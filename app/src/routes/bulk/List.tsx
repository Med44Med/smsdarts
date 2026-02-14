import Button from "@/components/Button";
import { H1, Text } from "@/components/Text";
import clsx from "clsx";
import { FaCheckSquare } from "react-icons/fa";
import { AiFillCloseSquare } from "react-icons/ai";
import { useContext, useRef, useState } from "react";
import type { WebSocketContextType } from "@/types";
import { WebSocketContext } from "@/context/contexts";

type BulkMessage = {
  to: string;
  message: string;
  schudeled?: string;
  status?: string;
};

const List = ({
  messages,
  handleClear,
}: {
  messages: BulkMessage[];
  handleClear: () => void;
}) => {
  const ws = useContext<WebSocketContextType | null>(WebSocketContext);
  const { sendJsonMessage } = ws!;
  const [status, setStatus] = useState<"idle" | "sending" | "suspended">(
    "idle",
  );
  const [sended, setSended] = useState<number>(0);
  const isSuspnded = useRef<boolean>(false);

  const handleCancel = () => {
    handleSuspend();
    if (confirm("Are you sure you want to cancel?")) {
      setStatus("idle");
      handleClear();
    } else {
      setStatus("sending");
      isSuspnded.current = false;
    }
  };
  const handleSuspend = () => {
    setStatus("suspended");
    isSuspnded.current = true;
  };

  const handleSend = async () => {
    setStatus("sending");
    isSuspnded.current = false;
    for (const message of messages) {
      if ((isSuspnded.current as boolean) === true) break;
      if (message.status === "success") continue;
      sendJsonMessage({
        type: "bulk_sms",
        payload: {
          to: message.to,
          message: message.message,
          schudele: message.schudeled ? message.schudeled : undefined,
        },
      });
      setSended((prev) => prev + 1);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <H1>
          {status === "sending" ? (
            `${sended === messages.length ? "Messages sent successfully" : "Sending messages..."} (${sended}/${messages.length}) `
          ) : status === "idle" ? (
            <>
              {messages.length}
              {messages.length === 1 ? " message" : " messages"}
            </>
          ) : (
            "Suspended"
          )}
        </H1>
        {status === "idle" && (
          <button onClick={handleClear}>
            <Text className="text-primary! cursor-pointer">Clear</Text>
          </button>
        )}
      </div>
      <div className="flex-1 w-full overflow-y-auto rounded-2xl ">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 bg-primary/20"></th>
              <th className="px-20 py-2 bg-primary/20">
                <Text>To</Text>
              </th>
              <th className="w-full px-4 py-2 bg-primary/20 ">
                <Text>Message</Text>
              </th>
              <th className="px-20 py-2 bg-primary/20">
                <Text>Schudeled</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message: BulkMessage, index: number) => (
              <tr
                key={index}
                className={clsx(index % 2 !== 0 && "bg-primary/5")}
              >
                <td className="p-2">
                  {message.status === "pending" ? null : message.status ===
                    "success" ? (
                    <FaCheckSquare className="text-primary" />
                  ) : (
                    <AiFillCloseSquare className="text-red-500" />
                  )}
                </td>
                <td className="px-4 py-2">
                  <Text className="w-full text-center">{message.to}</Text>
                </td>
                <td className="px-4 py-2">
                  <Text className="w-full">{message.message}</Text>
                </td>
                <td className="px-4 py-2">
                  <Text className="w-full text-center">
                    {message.schudeled}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-auto flex items-center justify-end gap-2">
        {status === "idle" && (
          <Button className="px-20" onClick={handleSend}>
            Send
          </Button>
        )}
        {status === "sending" &&
          (sended === messages.length ? (
            <Button className="px-20" onClick={handleClear}>
              Clear
            </Button>
          ) : (
            <>
              <Button className="px-20" onClick={handleSuspend}>
                Suspend
              </Button>
              <Button className="px-20" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ))}
        {status === "suspended" && (
          <>
            <Button className="px-20" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="px-20" onClick={handleSend}>
              Resume
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default List;
