export type UserType = {
  id?: string;
  createdAt?: string;
  username: string;
  email: string;
  phone?: string;
  apiKey?: string;
  phoneKey?: string;
  avatar_url?: string;
  api_key?: string;
};


export type DeviceType = {
  id: string;
  number: string;
  client: string;
  last_seen: string;
  status: "online" | "offline" | "unverified" | "unknown";
  device_key: string;
};

export type UsageType = {
  sent: number;
  received: number;
};

export type AuthContextType = {
  devices: DeviceType[];
  setDevices: React.Dispatch<React.SetStateAction<DeviceType[]>>;
  user: UserType | null;
  usage: UsageType | null;
  logOut: () => void;
  activeDevices: DeviceType[];
};

export type MessageType = {
  id: string;
  client: string;
  created_at: string;
  operation: "incoming" | "outgoing";
  from: string;
  to: string;
  message: string;
  status: "sent" | "failed" | "delivered" | "pending";
};

export type ConversationType = {
  id: string;
  from: string;
  to: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount?: number;
};

export type DeviceStatusType = {
  number: string;
  status: "online" | "offline" | "unverified";
  deviceLastSeen?: string;
};

export type SendSMSType = {
  from:string;
  to: string;
  message: string;
  schudele?: string;
  key:string;
  error?: string;
};
export type RecievedSMSType = {
  to: string;
  message: string;
  status: "success" | "failed" | "pending";
};

export type JsonMessageType = {
  type: string;
  payload: DeviceStatusType | SendSMSType | RecievedSMSType ;
  status?: "success" | "failed" | "pending";
};  

export type WebSocketContextType = {
  lastJsonMessage: JsonMessageType;
  sendJsonMessage: (message: JsonMessageType) => void;
  isServerOnline: "online" | "offline" | "connecting";
};
