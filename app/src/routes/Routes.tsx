import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Messages from "./messages/Messages";
import Templates from "./Templates/Templates";

const Layout = lazy(() => import("./Layout"));
const Bulk = lazy(() => import("./bulk/Bulk"));
const Settings = lazy(() => import("./settings/Settings"));
const Profile = lazy(() => import("./profile/Profile"));
const Usage = lazy(() => import("./usage/Usage"));

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Messages />,
      },
      {
        path: "bulk",
        element: <Bulk />,
      },
      {
        path: "templates",
        element: <Templates />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "settings/profile",
        element: <Profile />,
      },
      {
        path: "usage",
        element: <Usage />,
      },
    ],
  },
]);

const RoutesHandler = () => {
  return <RouterProvider router={router} />;
};

export default RoutesHandler;
