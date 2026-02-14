import { createContext } from "react";
import type { AuthContextType, WebSocketContextType } from "@/types";

export const AuthContext = createContext<AuthContextType | null>(null);
export const WebSocketContext = createContext<WebSocketContextType | null>(null);
