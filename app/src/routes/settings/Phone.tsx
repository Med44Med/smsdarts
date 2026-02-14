import Button from "@/components/Button";
import Input from "@/components/Input";
import Surface from "@/components/Surface";
import { H1, Text } from "@/components/Text";
import { AuthContext } from "@/context/contexts";
import type { AuthContextType, DeviceType } from "@/types";
import supabase from "@/utilis/supabase";
import { useContext,    useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import PhoneFormat from "../../utilis/phoneText";
import clsx from "clsx";
import { IoTrashBin } from "react-icons/io5";
import Switch from "@/components/Switch";

const Phone = () => {
  const auth = useContext<AuthContextType | null>(AuthContext);
  const { user, devices,setDevices } = auth!;
console.log(devices);

  const [add, setAdd] = useState(false);
  const [phoneAdd, setPhoneAdd] = useState("");
  const [autoSwitch, setAutoSwitch] = useState(
    localStorage.getItem("auto_switch_phone") === "true",
  );
  
  const handleAdd = async () => {
    try {
      const { data, error } = await supabase
        .from("devices")
        .insert([
          {
            number: phoneAdd,
            client: user?.id,
          },
        ])
        .select("id,number,last_seen,status,device_key")
        .single();
      if (error) throw error;
      setDevices([...devices, data as DeviceType]);
      setAdd(false);
      setPhoneAdd("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("devices").delete().eq("id", id);
      if (error) throw error;
      setDevices(devices.filter((phone) => phone.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAutoSwitch = async () => {
    localStorage.setItem("auto_switch_phone", (!autoSwitch).toString());
    setAutoSwitch(!autoSwitch);
  };
  return (
    <Surface id="phone">
      <H1>Phone Number</H1>
      <Text secondary className="mb-3">
        The Phone number that will sent and recieved messages in.
      </Text>
      <div className="mb-3">
        {devices.length === 0 ? (
          <>
            <Text className="mb-3">No phones found</Text>
          </>
        ) : (
          devices.map((phone) => (
            <div key={phone.id} className="mb-5 flex items-center gap-1">
              <Text>{PhoneFormat(phone.number)}</Text>
              <Text>
                {phone.device_key ? (
                  <FaCheckCircle className="text-primary text-xs" />
                ) : (
                  <Text className="text-sm text-white capitalize px-2 rounded-2xl bg-orange-500/50">
                    Not Verified
                  </Text>
                )}
              </Text>
              {phone.device_key && (
                <Text
                  className={clsx(
                    "text-sm text-white capitalize px-2 rounded-2xl",
                    phone.status === "online"
                      ? "bg-green-500/50"
                      : "bg-orange-500/50",
                  )}
                >
                  {phone.status}
                </Text>
              )}
              <IoTrashBin
                title="Delete Phone Number"
                className="text-text hover:text-red-500/70! cursor-pointer"
                onClick={() => handleDelete(phone.id)}
              />
            </div>
          ))
        )}
        {devices.length === 3 ? null : add ? (
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Phone Number"
              value={phoneAdd}
              onChange={(e) => setPhoneAdd(e.target.value)}
            />
            <Button className="mb-3" onClick={handleAdd}>
              Add
            </Button>
          </div>
        ) : (
          <Button className="w-fit" onClick={() => setAdd(true)}>
            Link a Phone
          </Button>
        )}
      </div>
      <div className="mb-5">
        <Text>Note: You can only add 3 phone numbers.</Text>
      </div>
      <div className="mb-3 flex items-center gap-3">
        <Switch value={autoSwitch} onChange={handleAutoSwitch} />
        <Text>Auto select phone number</Text>
      </div>
    </Surface>
  );
};

export default Phone;
