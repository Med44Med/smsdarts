import { router, Stack } from "expo-router";
import { getSimCards } from "expo-android-sms-sender";
import { PermissionsAndroid } from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {

  // android.settings.BATTERY_SAVER_SETTINGS
  
  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("deviceKey");
      if (!data) {
        router.push("/login");
        return;
      }
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: "Read Phone State Permission",
          message:
            "We need your permission to read your phone state to get the SIM card information.",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const simCards = await getSimCards();
        console.log(simCards);
      } else {
        console.log("Permission Denied");
      }
    })();
  }, []);

  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
