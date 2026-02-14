import supabase from "../utilis/supabase.js";

const initiate = async ({ role, id, ws, clients, devices }) => {
  if (!role || (role !== "client" && role !== "device") || !id) {
    ws.close(1008, "Missing or Invalid role or id");
    return;
  }
  if (role === "client") {
    const { data: linkedDevices, error: linkedDevicesError } = await supabase
      .from("devices")
      .select("*")
      .eq("client", id);

    if (linkedDevicesError) {
      ws.send(JSON.stringify(linkedDevicesError))
      ws.close(1011, "Internal Server Error");
      return;
    }

    if (linkedDevices.length === 0) {
      return { clientID: id, devicesID: null };
    }

    let linkedDevicesID = [];

    linkedDevices.forEach((device) => {
      if (!device.device_key) {
        ws.send(
          JSON.stringify({
            type: "device_status",
            payload: {
              number: device.number,
              status: "unverified",
            },
          }),
        );
      } else {
        const isDeviceOnline = devices.has(device.device_key);
        ws.send(
          JSON.stringify({
            type: "device_status",
            payload: {
              number: device.number,
              status: isDeviceOnline ? "online" : "offline",
              deviceLastSeen: device.deviceLastSeen,
            },
          }),
        );

        linkedDevicesID.push(device.device_key);
      }
      ws.type = "client";
      ws.linkedDevices = linkedDevicesID;
      clients.set(id, ws);
    });
    return { clientID: id, devicesID: linkedDevicesID };
  } else if (role === "device") {
    const { data, error } = await supabase
      .from("devices")
      .select("*")
      .eq("device_key", id)
      .single();
    if (error || !data) {
      
      ws.close(1008, error?.message);
      return;
    }

    const clientID = data.client;
    const deviceID = data.device_key;

    const { data: updatedDeviceLastSeen, error: updateError } = await supabase
      .from("devices")
      .update({ last_seen: new Date() })
      .eq("device_key", deviceID)
      .select("last_seen")
      .single();
    if (updateError) {
      console.error(updateError);
    }

    const clientIsOnline = clients.has(clientID);
    if (clientIsOnline) {
      const clientWs = clients.get(clientID);
      clientWs.send(
        JSON.stringify({
          type: "device_status",
          payload: {
            number: data.number,
            status: "online",
          },
        }),
      );
    }
    ws.type = "device";
    ws.lastSeen = updatedDeviceLastSeen.deviceLastSeen;
    ws.isAlive = true;
    ws.number = data.number;
    devices.set(deviceID, ws);
    return { clientID, devicesID: [deviceID] };
  }

  // const { id: clientID, deviceKey: deviceID, deviceLastSeen } = data;

  // if (role === "client") {
  //   ws.type = "client";
  //   clients.set(clientID, ws);
  //   const isDeviceOnline = devices.has(deviceID);
  //   if (isDeviceOnline) {
  //     ws.send(
  //       JSON.stringify({
  //         type: "device_status",
  //         payload: {
  //           status: "online",
  //         },
  //       }),
  //     );
  //   } else {
  //     ws.send(
  //       JSON.stringify({
  //         type: "device_status",
  //         payload: {
  //           status: "offline",
  //           deviceLastSeen,
  //         },
  //       }),
  //     );
  //   }
  // } else if (role === "device") {
  //   const { data: updatedDeviceLastSeen, error } = await supabase
  //     .from("channels")
  //     .update({ deviceLastSeen: new Date() })
  //     .eq("id", clientID)
  //     .select("deviceLastSeen")
  //     .single();
  //   if (error) {
  //     console.error(error);
  //   }

  //   ws.type = "device";
  //   ws.lastSeen = updatedDeviceLastSeen.deviceLastSeen;
  //   ws.isAlive = true;
  //   devices.set(deviceID, ws);
  //   const isClientOnline = clients.has(data.id);
  //   if (!isClientOnline) return { clientID, deviceID };
  //   const cilentWs = clients.get(data.id);
  //   cilentWs.send(
  //     JSON.stringify({
  //       type: "device_status",
  //       payload: {
  //         status: "online",
  //       },
  //     }),
  //   );
  // }
  // return { clientID, deviceID };
};

export default initiate;
