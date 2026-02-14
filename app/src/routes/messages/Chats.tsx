import Input from "@/components/Input";
import { H1, Text } from "@/components/Text";
import type {
  AuthContextType,
  DeviceType,
  MessageType,
  WebSocketContextType,
} from "@/types";
import phone from "@/utilis/phoneText";
import { useContext, useEffect, useEffectEvent, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import Button from "@/components/Button";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { MessageText } from "./MessageText";
import supabase from "@/utilis/supabase";
import { AuthContext, WebSocketContext } from "@/context/contexts";

const sendMessage = async (message: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    id: Date.now().toString(),
    operation: "outgoing",
    message,
    created_at: new Date().toISOString(),
    status: "delivered",
  } as MessageType;
};

const Chats = ({
  params,
  setShowAddMessage,
  selectedDevice,
}: {
  params: string | null;
  setShowAddMessage: (e: boolean) => void;
  selectedDevice: DeviceType | null;
}) => {
  const auth = useContext<AuthContextType | null>(AuthContext);
  const ws = useContext<WebSocketContextType | null>(WebSocketContext);
  const { lastJsonMessage, sendJsonMessage } = ws!;
  const { user } = auth!;

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`to.eq.${params},from.eq.${params}`)
        .order("created_at", { ascending: true });
      if (error) {
        console.log(error);
        setError(error);
        return;
      }
      setMessages(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesEvent = useEffectEvent(() => fetchMessages());
  useEffect(() => {
    if (!params) {
      return;
    }
    fetchMessagesEvent();
  }, [params]);

  const handleAddMessage = async () => {
    if (!input) return;
    const msg = input.trim();

    setInput("");

    const tempId = Date.now().toString();

    const optimisticMessage: MessageType = {
      id: tempId,
      client: user?.id || "",
      operation: "outgoing",
      message: msg,
      from: "",
      to: params ? params : "",
      created_at: new Date().toISOString(),
      status: "pending",
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    sendJsonMessage({
      type: "send_sms",
      payload: {
        from: selectedDevice?.number || "",
        to: params || "",
        message: msg,
        key: selectedDevice?.device_key || "",
      },
    });

    // try {
    //   const response = await sendMessage(msg);

    //   setMessages((prev) => prev.map((m) => (m.id === tempId ? response : m)));
    // } catch (error) {
    //   console.log(error);

    //   setMessages((prev) =>
    //     prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m)),
    //   );
    // }
  };

  const handleRetryMessage = async (id: string) => {
    console.log(id);
    const failedMessage = messages.find((m) => m.id === id);
    if (!failedMessage) return;
    console.log(failedMessage);

    try {
      const response = await sendMessage(failedMessage.message);
      setMessages((prev) => prev.map((m) => (m.id === id ? response : m)));
    } catch (error) {
      console.log(error);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "failed" } : m)),
      );
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  console.log(messages);
  
  useEffect(() => {
    if (!lastJsonMessage) return 
    if (lastJsonMessage.type !== "sms_received" && lastJsonMessage.type !== "sms_response") return 

    const message = lastJsonMessage as { type: string; payload: MessageType };
    if (message.payload.to !== params && message.payload.from !== params) return;

    if (message.type === "sms_received") {
      
      setMessages((prev) => [...prev, message.payload]);
    }
    if (message.type === "sms_response_success") {
      
      setMessages((prev) =>
        prev.map((m) => (m.id === message.payload.id ? message.payload : m)),
      );
    }
  }, [lastJsonMessage,params]);

  return (
    <div className="flex-1 rounded-lg bg-[#2b2b2b] flex flex-col gap-3 p-3">
      {params ? (
        loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Text>Loading...</Text>
          </div>
        ) : error ? (
          <div className="flex-1 flex justify-center items-center">
            <Text>Error: {error.message}</Text>
          </div>
        ) : (
          <>
            <H1>{phone(params)}</H1>
            <div
              ref={scrollRef}
              className="bg-background rounded-lg flex-1 p-5 overflow-y-auto flex flex-col gap-3"
            >
              {messages.map((message) => (
                <MessageText
                  key={message.id}
                  message={message}
                  handleRetryMessage={handleRetryMessage}
                />
              ))}
            </div>
            <Input
              type="text"
              placeholder="Type a message..."
              className="w-full! rounded-lg"
              Icon={IoSend}
              IconClick={handleAddMessage}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleAddMessage();
                }
              }}
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
            />
          </>
        )
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center gap-3">
          <Text>Please select a chat or start a new one</Text>
          <Button
            onClick={() => setShowAddMessage(true)}
            className="flex justify-center gap-1 items-center"
          >
            <Text>New message</Text>{" "}
            <LuSquareArrowOutUpRight className="cursor-pointer text-2xl text-text bg-primary p-1 rounded" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Chats;
