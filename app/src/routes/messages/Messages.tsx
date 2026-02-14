import Surface from "@/components/Surface";
import Contacts from "./Contacts";
import { useSearchParams } from "react-router";
import Chats from "./Chats";
import AddMessage from "./AddMessage";
import { useContext, useEffect, useState } from "react";
import type { AuthContextType, DeviceType } from "@/types";
import { AuthContext } from "@/context/contexts";

const Messages = () => {
  const auth = useContext<AuthContextType | null>(AuthContext);
  const { user, activeDevices } = auth!;

  const [searchParams, setSearchParams] = useSearchParams();

  const [showAddMessage, setShowAddMessage] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);

  useEffect(() => {
    (async () => {
      if (activeDevices.length > 0) {
        setSelectedDevice(activeDevices[0]);
      }
    })();
  }, [activeDevices]);

  const handleParams = (phone: string) => {
    setSearchParams({ phone });
  };

 
  return (
    <Surface className="h-screen flex gap-5 overflow-hidden">
      <Contacts
        handleParams={handleParams}
        searchParams={searchParams.get("phone")}
        setShowAddMessage={setShowAddMessage}
        id={user?.id ? user.id : ""}
        setSelectedDevice={setSelectedDevice}
        selectedDevice={selectedDevice}
        activeDevices={activeDevices}
        />
      <Chats
        params={searchParams.get("phone")}
        setShowAddMessage={setShowAddMessage}
        selectedDevice={selectedDevice}
        />
      <AddMessage
        show={showAddMessage}
        setShow={setShowAddMessage}
        selectedDevice={selectedDevice}
        activeDevices={activeDevices}
        setSelectedDevice={setSelectedDevice}
        handleParams={handleParams}
      />
    </Surface>
  );
};

export default Messages;
