import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Popup from "@/components/Popup";
import { H1, SubText, Text } from "@/components/Text";
import Textarea from "@/components/Textarea";
import { useContext, useEffect, useEffectEvent, useState } from "react";
import { RiMailSendLine } from "react-icons/ri";
import { ImSpinner } from "react-icons/im";
import { WebSocketContext } from "@/context/contexts";
import type {
  WebSocketContextType,
  DeviceType,
  JsonMessageType,
  SendSMSType,
} from "@/types";
import toast from "@/components/Toast";
import Select from "@/components/Select";

const AddMessage = ({
  show,
  setShow,
  selectedDevice,
  activeDevices,
  setSelectedDevice,
  handleParams
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedDevice: DeviceType | null;
  activeDevices: DeviceType[];
  setSelectedDevice: React.Dispatch<React.SetStateAction<DeviceType | null>>;
  handleParams: (phone: string) => void;
}) => {
  const ws = useContext<WebSocketContextType | null>(WebSocketContext);
  const { sendJsonMessage, lastJsonMessage } = ws!;

  const [tel, setTel] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSend = async () => {
    if (!selectedDevice) return;
    setLoading(true);
    setError(null);
    try {
      sendJsonMessage({
        type: "send_sms",
        payload: {
          from: selectedDevice?.number,
          to: tel,
          message,
          key: selectedDevice?.device_key,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleResponseEvent = useEffectEvent((message: JsonMessageType) => {
    if (message.type === "sms_response_success") {
      setTel("");
      setMessage("");
      setShow(false);
      setLoading(false);
      toast("your message has been sent");
      handleParams((message.payload as SendSMSType).to)
    }
    if (message.type === "sms_response_failed") {
      setError(new Error((message.payload as SendSMSType).error));
      setLoading(false);
      toast("your message has not been sent");
    }
  });

  useEffect(() => {
    if (!lastJsonMessage) return;
    handleResponseEvent(lastJsonMessage);
  }, [lastJsonMessage]);
  return (
    <Popup show={show} setShow={setShow} className="flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <H1>Add Message</H1>
        <SubText>Add a new message to your contacts.</SubText>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Label>Select Device :</Label>
        <Select
          value={selectedDevice?.number}
          onChange={(e) =>
            setSelectedDevice(
              activeDevices.find(
                (device: DeviceType) => device.number === e.target.value,
              ) || activeDevices[0],
            )
          }
        >
          {activeDevices.map((device: DeviceType) => (
            <Select.Option key={device.id} value={device.number}>
              {device.number}
            </Select.Option>
          ))}
        </Select>
        <Label>Phone Number :</Label>
        <Input
          type="text"
          placeholder="e.g : 00 213 XXX XXX XXX"
          className="w-full md:w-1/2"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
        />
        <Label>Message :</Label>
        <Textarea
          placeholder="Your message"
          className="flex-1 w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {error && <Text className="text-red-500/80!">{error?.message}</Text>}
      </div>
      <div className="w-full flex justify-center">
        <Button
          onClick={() => handleSend()}
          disabled={loading}
          className="md:w-1/3 mt-auto flex justify-center items-center gap-1"
        >
          {loading ? (
            <ImSpinner className="animate-spin" />
          ) : (
            <>
              <Text>Send</Text>
              <RiMailSendLine />
            </>
          )}
        </Button>
      </div>
    </Popup>
  );
};

export default AddMessage;
