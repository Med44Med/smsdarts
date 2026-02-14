import React, { useEffect, useState } from "react";
import { AuthContext } from "./contexts";
import type { UsageType, UserType, DeviceType } from "@/types";
import supabase from "@/utilis/supabase";

const AuthContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [usage, setUsage] = useState<UsageType | null>(null);
  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [activeDevices, setActiveDevices] = useState<DeviceType[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: import.meta.env.VITE_USER_EMAIL,
        password: import.meta.env.VITE_USER_PASSWORD,
      });
      if (error) {
        console.log(error);
      }
      const userId = data.user?.id;
      const { data: userProfile, error: fetchUserProfileError } = await supabase
        .from("profiles")
        .select()
        .eq("id", userId)
        .single();

      if (fetchUserProfileError) {
        console.log(fetchUserProfileError);
      }
      setUser(userProfile);
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("devices")
        .select()
        .eq("client", user.id);
      if (error) {
        console.log(error);
      }
      const updatedDevices = data?.map((device: DeviceType) => {
        if (!device?.device_key) {
          return { ...device, status: "unverified" };
        }
        return { ...device, status: "offline" };
      });
      setDevices(updatedDevices as DeviceType[]);
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      setActiveDevices(devices.filter((d) => d.status !== "unverified"));
    })();
  }, [devices]);

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    setUser(null);
    setUsage(null);
    setDevices([]);
  };
  if (!user) return null;
  return (
    <AuthContext.Provider value={{ user, usage, logOut, devices, setDevices,activeDevices }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextWrapper;
