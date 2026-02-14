import React, { useContext, useEffect, useEffectEvent, useState } from "react";
import { AuthContext, WebSocketContext } from "./contexts";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type {
  AuthContextType,
  JsonMessageType,
  DeviceStatusType,
  DeviceType,
} from "@/types";

const WebSocketWrapper = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext<AuthContextType | null>(AuthContext);
  const { user, setDevices } = auth!;

  const [isServerOnline, setIsServerOnline] = useState<
    "online" | "offline" | "connecting"
  >("offline");

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `${import.meta.env.VITE_WEB_SOCKET_URL}${user?.id}`,
    {
      shouldReconnect: () => true,
      reconnectInterval: 5000,
    },
  );

  const handleStatus = useEffectEvent((payload: DeviceStatusType) =>
    setDevices((prev: DeviceType[]) =>
      prev.map((device: DeviceType) =>
        device.number === payload.number
          ? {
              ...device,
              status: payload.status,
              deviceLastSeen: payload.deviceLastSeen,
            }
          : device,
      ),
    ),
  );

  const readyStateEvent = useEffectEvent((readyState: ReadyState) => {
    if (readyState === ReadyState.OPEN) {
      setIsServerOnline("online");
    }
    if (readyState === ReadyState.CONNECTING) {
      setIsServerOnline("connecting");
    }
    if (readyState === ReadyState.CLOSED) {
      setIsServerOnline("offline");
      setDevices((prev) =>
        prev.map((device) => {
          if (!device?.device_key) {
            return { ...device, status: "unverified" };
          }
          return { ...device, status: "offline" };
        }),
      );
    }
  });

  useEffect(() => {
    readyStateEvent(readyState);
  }, [readyState]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    console.log(lastJsonMessage);

    const { type, payload } = lastJsonMessage as JsonMessageType;
    switch (type) {
      case "device_status":
        handleStatus(payload as DeviceStatusType);
        break;

      default:
        break;
    }
  }, [lastJsonMessage]);

  return (
    <WebSocketContext.Provider
      value={{
        isServerOnline,
        lastJsonMessage: lastJsonMessage as JsonMessageType,
        sendJsonMessage: sendJsonMessage as (e: JsonMessageType) => void,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketWrapper;
