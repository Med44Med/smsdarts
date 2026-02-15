import { IoMdClose, IoMdMenu } from "react-icons/io";
import Select from "./Select";
import { useState, useContext } from "react";
import clsx from "clsx";
import { Text } from "./Text";
import { NavLink } from "react-router";
import Button from "./Button";
import { AuthContext } from "@/context/contexts";
import PhoneFormat from "@/utilis/phoneText";

const Links = [
  { to: "/", label: "Messages" },
  { to: "/bulk", label: "Bulk" },
  { to: "/templates", label: "Templates" },
  { to: "/usage", label: "Usage" },
  { to: "/settings", label: "Settings" },
];

const Header = () => {
  const auth = useContext(AuthContext);
  const { devices,logOut } = auth!;
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <header className="fixed top-0 left-0 h-24 flex md:hidden bg-surface w-full z-51 justify-between items-center px-4">
      <Select className="w-2/3">
        {devices.map((device) => (
          <Select.Option key={device.number} value={device.number}>
            {PhoneFormat(device.number)}
          </Select.Option>
        ))}
      </Select>
      <IoMdMenu
        className="text-4xl text-text"
        onClick={() => setShowMenu(true)}
      />
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-full z-52",
          showMenu ? "block" : "hidden",
        )}
      >
        <div
          className="absolute inset-0 bg-background/50"
          onClick={() => setShowMenu(false)}
        ></div>
        <div className="absolute inset-y-0 right-0 w-4/5 bg-surface">
          <div className="w-full h-full flex flex-col justify-end items-start p-3  ">
            <IoMdClose
              className="text-4xl text-text absolute left-4 top-4"
              onClick={() => setShowMenu(false)}
            />

            <nav className="h-full w-full flex flex-col gap-4 p-4 py-16">
              {Links.map((link) => (
                <NavLink
                  to={link.to}
                  key={link.to}
                  onClick={() => setShowMenu(false)}
                  className="w-full py-3 rounded-md text-center"
                >
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
