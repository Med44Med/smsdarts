import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/Constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useWebSocket, { ReadyState } from "react-use-websocket";
import sendSMS from "@/components/sendSMS";

const Main = () => {
  const [key, setKey] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const { sendJsonMessage,lastJsonMessage, readyState } = useWebSocket(
    key ? `ws://192.168.1.35:8000?role=device&id=123` : null,
    {
      shouldReconnect: () => true,
    },
  );

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("deviceKey");
      if (data) {
        setKey(JSON.parse(data as string).devicekey);
      }
    })();

    console.log(readyState);
    if (readyState === ReadyState.OPEN) {
      setStatus("connected");
    }
    if (readyState === ReadyState.CLOSED) {
      setStatus("disconnected");
    }
    if (readyState === ReadyState.CONNECTING) {
      setStatus("connecting");
    }
  }, [readyState, key]);

  useEffect(() => {
    (async () => {
      if (lastJsonMessage && typeof lastJsonMessage === "object") {
        const { status } = await sendSMS(
          lastJsonMessage as { to: string; message: string },
        );
        sendJsonMessage({status})
      }
    })();
  }, [lastJsonMessage, sendJsonMessage]);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          position: "relative",
          flex: 1,
          backgroundColor: Colors.background,
          padding: 20,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <View style={{ width: "100%" }}>
          <Text style={{ fontSize: 24, color: Colors.text }}>{key}</Text>
          <Text style={{ fontSize: 24, color: Colors.text }}>{status}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Main;
