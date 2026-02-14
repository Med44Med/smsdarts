import { Link, NavLink } from "react-router";
import { SubText, Text } from "./Text";
import clsx from "clsx";
import { AuthContext } from "@/context/contexts";
import { useContext } from "react";
import Button from "./Button";
import PhoneFormat from "@/utilis/phoneText";
import { FaMobileRetro } from "react-icons/fa6";
import { timer } from "@/utilis/day";
import {
  MdSignalWifiStatusbar4Bar,
  MdSignalWifiStatusbarNotConnected,
} from "react-icons/md";

const Links = [
  { to: "/", label: "Messages" },
  { to: "/bulk", label: "Bulk" },
  { to: "/templates", label: "Templates" },
  { to: "/usage", label: "Usage" },
  { to: "/settings", label: "Settings" },
];
const Aside = () => {
  const auth = useContext(AuthContext);
  const { devices, logOut } = auth!;
  
  return (
    <aside className="w-56 bg-[#2b2b2b] h-full flex flex-col p-3">
      <div className="w-full flex flex-col items-center gap-2 py-4 border-b border-primary/20">
        {/* <H1 className="font-bold text-lg text-center">{user?.username}</H1> */}
        <div className="w-full flex flex-col justify-center items-start gap-3">
          {devices?.length === 0 ? (
            <Link to="/settings#phone">
              <SubText className="font-bold text-xs text-red-400!">
                No devices found
              </SubText>
            </Link>
          ) : (
            devices?.map((device) => (
              <div
                key={device.number}
                className="flex w-full justify-start items-center gap-2 py-2 px-2 bg-primary/10 rounded-md"
                title={
                  device.status === "unverified"
                    ? "unverified"
                    : device.status === "offline"
                      ? timer(device.last_seen)
                      : "online"
                }
              >
                <FaMobileRetro
                  className={clsx(
                    "text-lg",
                    device.status === "unverified"
                      ? "text-red-400!"
                      : "text-primary!",
                  )}
                />
                <SubText className="flex-1 select-none font-bold text-lg text-nowrap">
                  {PhoneFormat(device.number)}
                </SubText>
                {device.status === "online" && (
                  <MdSignalWifiStatusbar4Bar className="text-primary!" />
                )}
                {device.status === "offline" && (
                  <MdSignalWifiStatusbarNotConnected className="text-red-400!" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <nav className="flex flex-col gap-4 p-4">
        {Links.map((link) => (
          <NavLink to={link.to} key={link.to}>
            {({ isActive }) => (
              <Text
                className={clsx(
                  "font-bold text-xl",
                  isActive && "text-primary!",
                )}
              >
                {link.label}
              </Text>
            )}
          </NavLink>
        ))}
      </nav>
      <Button className="w-full mt-auto" onClick={() => logOut()}>
        Logout
      </Button>
    </aside>
  );
};

export default Aside;
