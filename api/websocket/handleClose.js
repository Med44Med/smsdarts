const handleClose = ({ role, clientID, devicesID, clients, devices }) => {
  if (role === "client") {
    clients.delete(clientID);
  } else if (role === "device") {
    const isClientOnline = clients.has(clientID);
    if (!isClientOnline) return;
    const cilentWs = clients.get(clientID);
    const deviceWs = devices.get(devicesID[0]);

    cilentWs.send(
      JSON.stringify({
        type: "device_status",
        payload: {
          status: "offline",
          number: deviceWs.number,
          last_seen: new Date(),
        },
      }),
    );
    devicesID.forEach((deviceID) => {
      devices.delete(deviceID);
    });
  }
};

export default handleClose;
