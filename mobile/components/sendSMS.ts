import { sendSms } from "expo-android-sms-sender";
import { PermissionsAndroid } from "react-native";

const sendSMS = async ({
  to,
  message,
}: {
  to: string;
  message: string;
}): Promise<{ status: string }> => {
  try {
    // First, check if we already have permission
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
    );

    console.log("Current SMS permission status:", hasPermission);

    let granted = hasPermission;

    // If we don't have permission, request it
    if (!hasPermission) {
      console.log("Requesting SMS permission...");
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: "SMS Permission",
          message: "We need your permission to send SMS.",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      console.log("Permission request result:", result);
      granted = result === PermissionsAndroid.RESULTS.GRANTED;
    }

    if (granted) {
      console.log("Sending SMS to:", to);
      await sendSms(to, message);
      return { status: "success" };
    } else {
      console.log("SMS permission denied");
      return { status: "denied" };
    }
  } catch (error) {
    console.error("Error in sendSMS:", error);
    return { status: `error : ${(error as Error).message}` };
  }
};

export default sendSMS;
