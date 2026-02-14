import Colors from "@/Constants/Colors";
import { View, Text, Pressable, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect } from "react";

const QRScanner = ({
  setKey,
  setShowCamera,
}: {
  setKey: React.Dispatch<React.SetStateAction<string>>;
  setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [permission, requestPermission] = useCameraPermissions();

  const handlePermission = async () => {
    const { granted } = await requestPermission();
    if (!granted) {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to scan QR codes. Please grant permission in the settings.",
        [
          {
            text: "Cancel",
            onPress: () => setShowCamera(false),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
      );
    } else {
      setShowCamera(true);
    }
  };

  useEffect(() => {
    handlePermission();
  }, []);

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Text style={{ color: Colors.text, fontSize: 16, fontWeight: "bold" }}>
          Permission not granted
        </Text>
        <Pressable
          onPress={handlePermission}
          style={{
            backgroundColor: Colors.primary,
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text
            style={{ color: Colors.text, fontSize: 16, fontWeight: "bold" }}
          >
            Grant Permission
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 50,
      }}
    >
      <CameraView
        style={{
          flex: 1,
          width: "100%",
          borderRadius: 5,
        }}
        facing="back"
        onBarcodeScanned={({ data }) => {
          setKey(data);
          setShowCamera(false);
        }}
      />
      <Pressable
        style={{
          backgroundColor: Colors.primary,
          width: "100%",
          height: 50,
          borderRadius: 5,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          marginTop: "auto",
        }}
        onPress={() => setShowCamera(false)}
      >
        <Text style={{ color: Colors.text, fontSize: 20, fontWeight: "bold" }}>
          Cancel
        </Text>
      </Pressable>
    </View>
  );
};

export default QRScanner;
