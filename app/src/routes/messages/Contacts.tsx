import Button from "@/components/Button";
import { H1, Text } from "@/components/Text";
import { messageDate } from "@/utilis/day";
import phone from "@/utilis/phoneText";
import supabase from "@/utilis/supabase";
import clsx from "clsx";
import { useContext, useEffect, useEffectEvent, useState } from "react";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import type { DeviceType, MessageType, WebSocketContextType } from "@/types";
import Select from "@/components/Select";
import { WebSocketContext } from "@/context/contexts";

type Contact = {
  id: string;
  phone: string;
  last_message: string;
  created_at: string;
  seen: boolean;
  participant_1: string;
  participant_2: string;
};

const Contacts = ({
  handleParams,
  searchParams,
  setShowAddMessage,
  id,
  selectedDevice,
  setSelectedDevice,
  activeDevices,
}: {
  handleParams: (id: string) => void;
  searchParams: string | null;
  setShowAddMessage: (show: boolean) => void;
  id: string;
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceType | null>>;
  selectedDevice: DeviceType | null;
  activeDevices: DeviceType[];
}) => {
  const ws = useContext<WebSocketContextType | null>(WebSocketContext);
  const { lastJsonMessage } = ws!;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select()
        .eq("client", id)
        .order("created_at", { ascending: false })
        .limit(20);

      const newData = data?.map((d) => ({
        ...d,
        phone:
          d?.participant_1 === selectedDevice?.number
            ? d?.participant_2
            : d?.participant_1,
      }));

      if (error) {
        throw error;
      }

      if (!searchParams) {
        setContacts(newData as Contact[]);
        return;
      }

      const optimisticData = newData?.map((c: Contact) =>
        c.phone === searchParams ? { ...c, seen: true } : c,
      );

      setContacts(optimisticData as Contact[]);

      const selectedConversationsID = newData?.find(
        (c: Contact) => c.phone === searchParams,
      )?.id;

      const { error: updatedConversationError } = await supabase
        .from("conversations")
        .update({ seen: true })
        .eq("id", selectedConversationsID);

      if (updatedConversationError) {
        console.log(updatedConversationError.message);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactsEvent = useEffectEvent(() => fetchContacts());
  useEffect(() => {
    if (!id) return;
    fetchContactsEvent();
  }, [id, selectedDevice]);

  const changeContactEvent = useEffectEvent(async () => {
    const seen = contacts.find((c) => c.phone === searchParams)?.seen;

    if (!seen) {
      setContacts((prev) =>
        prev.map((c) => (c.phone === searchParams ? { ...c, seen: true } : c)),
      );

      const selectedConversationsID = contacts?.find(
        (c: Contact) => c.phone === searchParams,
      )?.id;

      const { error } = await supabase
        .from("conversations")
        .update({ seen: true })
        .eq("id", selectedConversationsID);
      if (error) {
        console.log(error);
      }
    }
  });

  useEffect(() => {
    if (!searchParams) return;
    changeContactEvent();
  }, [searchParams]);

  const handleContactClick = async (id: string) => {
    handleParams(id);
  };

  useEffect(() => {
    if (!lastJsonMessage) return;
    if (lastJsonMessage.type === "sms_response_success") {
      setContacts((prev) => {
        const newContact: Contact = {
          id: Math.floor(Math.random() * 1000000).toString(),
          phone: (lastJsonMessage.payload as MessageType).to,
          last_message: (lastJsonMessage.payload as MessageType).message,
          created_at: (lastJsonMessage.payload as MessageType).created_at,
          seen: true,
          participant_1: "",
          participant_2: "",
        };
        const newArray = [
          newContact,
          ...prev.filter((c: Contact) => c.phone !== newContact.phone),
        ];

        return newArray;
      });
    }
  }, [lastJsonMessage]);

  return (
    <div className="w-72 flex flex-col gap-3">
      <div className="w-full flex justify-between items-center">
        <H1>Messages</H1>
        <LuSquareArrowOutUpRight
          onClick={() => setShowAddMessage(true)}
          className="cursor-pointer text-xl text-primary"
          title="New message"
        />
      </div>
      <div className="w-full mb-3">
        <Select
          className="w-full"
          value={selectedDevice?.number}
          onChange={(e) =>
            setSelectedDevice(
              activeDevices.find(
                (device: DeviceType) => device.number === e.target.value,
              ) || activeDevices[0],
            )
          }
        >
          {activeDevices.map((device) => (
            <Select.Option key={device.id} value={device.number}>
              {device.number}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="w-72 flex-1 bg-[#2b2b2b] rounded-lg overflow-y-auto p-3 flex flex-col gap-1">
        {loading ? (
          <div className="flex flex-col gap-1">
            <div className="w-full h-16 bg-text/10 rounded-lg animate-pulse" />
            <div className="w-full h-16 bg-text/10 rounded-lg animate-pulse" />
            <div className="w-full h-16 bg-text/10 rounded-lg animate-pulse" />
            <div className="w-full h-16 bg-text/10 rounded-lg animate-pulse" />
            <div className="w-full h-16 bg-text/10 rounded-lg animate-pulse" />
          </div>
        ) : error ? (
          <>
            <Text className="text-center text-text/50">{error.message}</Text>
            <Button className="mt-5 w-2/3 mx-auto" onClick={fetchContacts}>
              Retry
            </Button>
          </>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className={clsx(
                "rounded border-b border-text/10 py-3 px-2 cursor-pointer hover:bg-text/10 flex justify-start items-center",
                searchParams === contact.phone && "bg-text/10",
              )}
              onClick={() => handleContactClick(contact.phone)}
            >
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Text
                    className={clsx(
                      "font-bold",
                      searchParams === contact.id && "text-primary!",
                    )}
                  >
                    {phone(contact.phone)}
                  </Text>
                  {!contact?.seen && (
                    <div className="mr-2">
                      <GoDotFill className="text-primary" size={12} />
                    </div>
                  )}
                </div>
                <Text
                  className={clsx(
                    "text-sm",
                    contact?.seen
                      ? "text-text-secondary"
                      : "text-text font-bold",
                  )}
                >
                  {contact.last_message}
                </Text>
              </div>
              <Text className="text-sm text-text/50">
                {messageDate(contact.created_at)}
              </Text>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Contacts;
