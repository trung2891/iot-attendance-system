import { lazy } from "react";

const routes = [
  {
    path: "/home",
    exact: true,
    component: lazy(() => import("../pages/Home")),
    animation: "fadeIn",
  },
  {
    path: "/user/:userId",
    exact: true,
    component: lazy(() => import("../pages/Users")),
    animation: "fadeIn",
  },
  {
    path: "/add-user",
    exact: true,
    component: lazy(() => import("../pages/AddUser")),
    animation: "fadeIn",
  },
];

export default routes;
