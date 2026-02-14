import { View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Colors from "@/Constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type TabIconName = React.ComponentProps<typeof FontAwesome>["name"];

const icon: Record<string, TabIconName> = {
  index: "home",
  settings: "cog",
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        paddingBottom: insets.bottom,
        height: 70 + insets.bottom,
        backgroundColor: Colors.surface,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const label = options.tabBarLabel ?? options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <FontAwesome
              name={icon[route.name]}
              size={24}
              color={isFocused ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={{
                color: isFocused ? Colors.primary : Colors.textSecondary,
                fontWeight: isFocused ? "600" : "400",
                fontSize: 12,
              }}
            >
              {String(label) === "index" ? "Home" : String(label)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
