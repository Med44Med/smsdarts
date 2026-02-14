import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import React, { useState } from "react";
import Colors from "@/Constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import QRScanner from "@/components/QRScanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";

const Login = () => {
  const router = useRouter();
  const [showCamera, setShowCamera] = useState(false);
  const [key, setKey] = useState<string>("27c12364-ce58-4d58-9d1e-84f0c53d57f5");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSignIn = async () => {
    if (!key) return;
    setLoading(true);
    setError('');
    try {
      const deviceId = Application.getAndroidId();
      const data = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/register-device?id=${key}&deviceId=${deviceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then((res) => res.json());
      if (data.error) {
        throw data.error;
      }
      if (data.message === "Device registered successfully") {
        console.log(data.message);

        await AsyncStorage.setItem(
          "deviceKey",
          JSON.stringify({ devicekey: data.data.deviceKey, id: data.data.id }),
        );
        Alert.alert("Success", "Device registered successfully");
      }
      router.push("/(tabs)");
    } catch (error) {
      Alert.alert("Failed to register device", error as string);
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          position: "relative",
          flex: 1,
          backgroundColor: Colors.background,
          padding: 20,
        }}
      >
        {showCamera ? (
          <QRScanner setShowCamera={setShowCamera} setKey={setKey} />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: Colors.text, fontSize: 20, fontWeight: "bold" }}
            >
              please scan th Qr code to login
            </Text>
            <View
              style={{
                width: "100%",
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 5,
                  marginTop: 20,
                  color: Colors.text,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  paddingHorizontal: 10,
                  fontSize: 16,
                }}
                onChangeText={setKey}
                value={key}
                placeholder="Enter your key"
                placeholderTextColor={Colors.text}
                keyboardType="default"
              />
              <Pressable
                onPress={() => setShowCamera(true)}
                style={{
                  backgroundColor: Colors.primary,
                  width: 50,
                  height: 50,
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "auto",
                }}
              >
                <FontAwesome name="qrcode" size={24} color={Colors.text} />
              </Pressable>
            </View>
            {error && (
              <Text style={{ color: "red", marginTop: 10, width: "100%" }}>
                {error}
              </Text>
            )}
            <Pressable
              onPress={() => handleSignIn()}
              disabled={loading}
              style={{
                backgroundColor: Colors.primary,
                width: "100%",
                height: 50,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              {loading ? (
                <ActivityIndicator color={Colors.text} />
              ) : (
                <Text
                  style={{
                    color: Colors.text,
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                >
                  Sign in
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Login;
