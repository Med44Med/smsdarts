import Button from "@/components/Button";
import Popup from "@/components/Popup";
import Surface from "@/components/Surface";
import { H1, SubText, Text } from "@/components/Text";
import { FaLink, FaSave } from "react-icons/fa";
import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { FaRotateRight } from "react-icons/fa6";

const Webhook = ({ apiKey = "AIzaSyDaGmWKa4JsXZ-HjGw7ISLn_3namBGewQe" }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [url, setUrl] = useState("");
  const [event, setEvent] = useState("");
  const [loading, setLoading] = useState(false);

  const cancel = () => {
    setShowPopup(false);
    setUrl("");
    setEvent("");
  };
  const addWebhook = async () => {
    try {
      if (!url || !event) {
        alert("Please fill all the fields");
        return;
      }
      setLoading(true);
      const response = await fetch("https://api.smsdarts.com/api/v1/webhook", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ url, event }),
      }).then((res) => res.json());
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Surface>
        <H1>WebHook</H1>
        <Text className="my-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
          ipsum aliquid voluptas accusantium repellat aperiam at nostrum iste ad
          explicabo necessitatibus cumque officia, odit numquam earum velit nemo
          assumenda non.
        </Text>
        <div className="flex gap-5">
          <Button
            onClick={() => setShowPopup(true)}
            className="flex justify-center items-center gap-2 px-5"
          >
            <FaLink />
            <Text>Add WebHook</Text>
          </Button>
          <Button className="flex justify-center items-center gap-2 px-5">
            <Text>Documentation</Text>
          </Button>
        </div>
      </Surface>
      <Popup show={showPopup} setShow={cancel}>
        <H1 className="mb-3">Add WebHook</H1>
        <Input
          type="text"
          label="Callback URL :"
          placeholder="WebHook URL"
          className="w-full py-3 mb-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <SubText secondary className="ml-2 mb-5">
          a HTTP post request will be sent to this url everytime an event
          triggred in SMSDarts.
        </SubText>
        <Select
          className="w-full py-3 mb-1"
          onChange={(e) => setEvent(e.target.value)}
        >
          <Select.Option value="">Select Event</Select.Option>
          <Select.Option value="message.sent">Message Sent</Select.Option>
          <Select.Option value="message.failed">Message Failed</Select.Option>
          <Select.Option value="message.recieved">
            Message Recieved
          </Select.Option>
        </Select>
        <SubText secondary className="ml-2 mb-5">
          Select an Event to watch for.
        </SubText>
        <div className="flex gap-5 mt-2">
          <Button
            onClick={() => addWebhook()}
            className="flex justify-center items-center gap-2 px-5"
          >
            {loading ? (
              <>
                <FaRotateRight className="text-orange-500 animate-spin" />{" "}
                <Text>Save</Text>
              </>
            ) : (
              <>
                <FaSave />
                <Text>Save</Text>
              </>
            )}
          </Button>
          <Button
            onClick={() => {
              setShowPopup(false);
              setUrl("");
              setEvent("");
            }}
            className="bg-transparent!"
          >
            <Text className="hover:text-primary">Cancel</Text>
          </Button>
        </div>
      </Popup>
    </>
  );
};

export default Webhook;
