import { useContext, useEffect, useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Surface from "@/components/Surface";
import { H1, Text } from "@/components/Text";

import { FaEye, FaEyeSlash, FaCopy, FaRotateRight } from "react-icons/fa6";
import { BsQrCode } from "react-icons/bs";
import Popup from "@/components/Popup";
import QRCode from "react-qr-code";
import { Link } from "react-router";
import type { AuthContextType } from "@/types";
import { AuthContext } from "@/context/contexts";

const API = () => {
  const auth = useContext<AuthContextType | null>(AuthContext);
  const { user } = auth!;

  const [apiKey, setApiKey] = useState<string>("");
  const [showAPI, setShowAPI] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setApiKey(user?.api_key || "");
  }, [user]);

  const copyApi = async () => {
    setLoading(true);
    try {
      if (!user?.apiKey) return;
      await navigator.clipboard.writeText(user.apiKey);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/generate-api-key`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.id}`,
          },
        },
      ).then((res) => res.json());
      setApiKey(response.key);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Surface>
        <Text className="text-xl font-bold mb-1">API Key</Text>
        <Text secondary className="mb-3">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </Text>
        <Input
          onChange={() => {}}
          type={showAPI ? "text" : "password"}
          className="w-full py-3"
          Icon={showAPI ? FaEye : FaEyeSlash}
          IconClick={() => {
            setShowAPI(!showAPI);
          }}
          value={apiKey || ""}
        />
        <div className="flex gap-5 mt-2">
          {apiKey ? (
            <>
              <Button
                onClick={() => copyApi()}
                className="flex justify-center items-center gap-2 px-5"
              >
                <FaCopy />
                <Text>Copy API Key</Text>
              </Button>
              <Button
                onClick={() => setShowQR(true)}
                className="flex justify-center items-center gap-2 px-5"
              >
                <BsQrCode />
                <Text>Show QR Code</Text>
              </Button>
            </>
          ) : (
            <Button
              className="flex justify-center items-center gap-2 px-5"
              onClick={() => generateApiKey()}
            >
              <Text>Generate API Key</Text>
            </Button>
          )}
          <Button className="flex justify-center items-center gap-2 px-5">
            <Text>Documentation</Text>
          </Button>
          {apiKey && (
            <Button
              onClick={() => generateApiKey()}
              className="ml-auto bg-transparent! flex justify-center items-center gap-2 px-5 hover:bg-orange-500/10!"
            >
              {loading ? (
                <>
                  <FaRotateRight className="text-orange-500 animate-spin" />
                  <Text className="text-orange-500!">Generating...</Text>
                </>
              ) : (
                <>
                  <FaRotateRight className="text-orange-500" />
                  <Text className="text-orange-500!">Generate New API Key</Text>
                </>
              )}
            </Button>
          )}
        </div>
      </Surface>
      <Popup
        show={showQR}
        setShow={setShowQR}
        className="flex flex-col justify-start items-center gap-3"
      >
        <H1>QR Code</H1>
        <Text>
          Scan the QR code with{" "}
          <Link to={"/"} className="text-primary underline">
            SMSDart app
          </Link>{" "}
          on your phone to login.
        </Text>
        <div className="my-auto bg-text/10 p-2 rounded-lg">
          <QRCode
            value={apiKey || ""}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>
        <Button className="w-72 mt-auto" onClick={() => setShowQR(false)}>
          Close
        </Button>
      </Popup>
    </>
  );
};

export default API;
