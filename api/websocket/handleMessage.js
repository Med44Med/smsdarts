import supabase from "../utilis/supabase.js";
const handleMessage = async ({
  role,
  clientID,
  devicesID,
  message,
  ws,
  clients,
  devices,
}) => {
  const JSONmessage = JSON.parse(message);

  if (role === "client") {
    switch (JSONmessage.type) {
      case "send_sms":
        const { from, to, message: messageText, key } = JSONmessage.payload;

        const deviceWs = devices.get(key);

        if (!deviceWs) {
          console.error("Device WebSocket not found for devicesID:", devicesID);
          ws.send(
            JSON.stringify({
              type: "sms_response_failed",
              payload: { error: "Device not connected" },
            }),
          );
          return;
        }

        const { data, error } = await supabase
          .from("messages")
          .insert([
            {
              from,
              to,
              message: messageText,
              client: clientID,
              operation: "outgoing",
            },
          ])
          .select()
          .single();
        if (error) {
          console.error("Error inserting message:", error);
          ws.send(
            JSON.stringify({
              type: "sms_response_failed",
              payload: { error: "Somthing went wrong!" },
            }),
          );
          return;
        }

        ws.send(
          JSON.stringify({ type: "sms_response_success", payload: data }),
        );
        deviceWs.send(JSON.stringify(data));
        break;

      case "bulk_sms":
        console.log("Received bulk_sms message");
        ws.send(
          JSON.stringify({
            type: "bulk_sms_response",
            payload: JSONmessage?.payload,
            status: "success",
          }),
        );
      default:
        break;
    }
    if (JSONmessage.type === "send_sms") {
    }
  } else if (role === "device") {
    switch (JSONmessage.type) {
      case "sms_response":
        console.log(JSONmessage.payload);
        const { error } = await supabase
          .from("messages")
          .update({ status: JSONmessage.payload.status })
          .eq("id", JSONmessage.payload.id);
        if (error) {
          console.error("Error updating message status:", error);
          return;
        }
        const clientWs = clients.get(clientID);
        if (clientWs) {
          clientWs.send(JSON.stringify(JSONmessage));
        }
        break;
      case "received_sms":
        const received_payload = JSONmessage.payload;
        const { data, error: receivedSMSError } = await supabase
          .from("messages")
          .insert([
            {
              from: received_payload.from,
              to: received_payload.to,
              message: received_payload.message,
              client: clientID,
              operation: "incoming",
              status: "received",
            },
          ])
          .select()
          .single();
        if (receivedSMSError) {
          console.error("Error inserting received message:", receivedSMSError);
          return;
        }
        const client = clients.get(clientID);
        if (client) {
          client.send(JSON.stringify({ type: "received_sms", payload: data }));
        }
      default:
        break;
    }
  }
};

export default handleMessage;
