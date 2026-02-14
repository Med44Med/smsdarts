import Aside from "@/components/Aside";
import { Span, SubText } from "@/components/Text";
import { WebSocketContext } from "@/context/contexts";
import type { WebSocketContextType } from "@/types";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";

const Layout = () => {
  const [isOnline, setIsOnline] = useState(true);
  const ws = useContext<WebSocketContextType | null>(WebSocketContext);
  const { isServerOnline } = ws!;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <main className="flex bg-[#1e1e1e] h-screen overflow-x-hidden">
        <Aside />
        <article className="flex-1 overflow-y-auto px-10 py-10 flex flex-col gap-10">
          <div
            className={clsx(
              "fixed top-0 left-56 w-[calc(100%-224px)] py-2 bg-red-500 z-50 flex justify-center items-center",
              isOnline ? "-translate-y-full" : "translate-y-0",
            )}
          >
            <SubText className="text-red-500 font-bold text-lg">
              Please check your connection,
              <Span
                onClick={() => window.location.reload()}
                className="underline cursor-pointer"
              >
                Reload
              </Span>
            </SubText>
          </div>
          <div
            className={clsx(
              "fixed top-0 left-56 w-[calc(100%-224px)] py-2 bg-amber-500 z-50 flex justify-center items-center",
              isServerOnline === "online" ? "-translate-y-full" : "translate-y-0",
            )}
          >
            <SubText className="font-bold text-lg">
              {isServerOnline === "offline"
                ? "Server is offline"
                : "Trying to reconnect..."}
            </SubText>
          </div>
          <Outlet />
        </article>
      </main>
    </>
  );
};

export default Layout;
