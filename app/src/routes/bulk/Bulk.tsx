import Surface from "@/components/Surface";
import { useContext, useEffect, useEffectEvent, useState } from "react";
import Update from "./Update";
import Papa from "papaparse";
import List from "./List";
import { read, utils } from "xlsx";
import { WebSocketContext } from "@/context/contexts";
import type {
  JsonMessageType,
  RecievedSMSType,
  WebSocketContextType,
} from "@/types";
import supabase from "@/utilis/supabase";
import { renderMessage } from "@/utilis/renderMessage";

type BulkMessage = {
  to: string;
  message: string;
  schudeled?: string;
  status?: string;
};

const Bulk = () => {
  const ws = useContext<WebSocketContextType | null>(WebSocketContext);
  const { lastJsonMessage } = ws!;
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<BulkMessage[]>([]);
  const [templates, setTemplates] = useState<
    { title: string; message: string }[]
  >([]);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [variables, setVariables] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (!selectedTemplate) return;
      const regex = /{{\w+}}/g;
      const matches = selectedTemplate.message.match(regex);
      if (matches) {
        setVariables(matches.map((match) => match.slice(2, -2)));
      }
    })();
  }, [selectedTemplate]);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("message,title");
      if (error) {
        console.error(error);
        return;
      }
      setTemplates(data as { title: string; message: string }[]);
    })();
  }, []);

  useEffect(() => {
    if (!file) return;
    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        complete: function (results) {
          const data = results.data as BulkMessage[];
          if (selectedTemplate) {
            const messages = data.map((message) => {
              const variablesData = variables.reduce(
                (acc, variable) => {
                  acc[variable] = (message as Record<string, string | number>)[
                    variable
                  ];
                  return acc;
                },
                {} as Record<string, string | number>,
              );
              return {
                to: message?.to,
                message: renderMessage(selectedTemplate.message, variablesData),
                status: "pending",
              };
            });
            setMessages(messages);
          } else {
            data.forEach((message) => {
              message.status = "pending";
            });
            setMessages(data);
          }
        },
      });
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json<BulkMessage>(worksheet);
        if (selectedTemplate) {
          const messages = json.map((message) => {
            const variablesData = variables.reduce(
              (acc, variable) => {
                acc[variable] = (message as Record<string, string | number>)[
                  variable
                ];
                return acc;
              },
              {} as Record<string, string | number>,
            );
            return {
              to: message?.to,
              message: renderMessage(selectedTemplate.message, variablesData),
              status: "pending",
            };
          });
          setMessages(messages);
        } else {
          json.forEach((message) => {
            message.status = "pending";
          });
          setMessages(json);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid file");
    }
  }, [file, selectedTemplate, variables]);

  const handleClear = () => {
    setFile(null);
    setMessages([]);
    setVariables([]);
  };

  const handleResponse = (message: JsonMessageType) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.to === (message.payload as RecievedSMSType).to &&
        m.message === (message.payload as RecievedSMSType).message
          ? { ...m, status: message.status }
          : m,
      ),
    );
  };

  const handleResponseEvent = useEffectEvent((message: JsonMessageType) =>
    handleResponse(message),
  );
  useEffect(() => {
    if (lastJsonMessage?.type !== "bulk_sms_response") return;
    handleResponseEvent(lastJsonMessage);
  }, [lastJsonMessage]);

  return (
    <Surface className="h-full flex flex-col gap-3">
      {messages.length > 0 ? (
        <List messages={messages} handleClear={handleClear} />
      ) : (
        <Update
          setFile={setFile}
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          variables={variables}
        />
      )}
    </Surface>
  );
};

export default Bulk;
