import { createBrowserRouter } from "react-router";
import Root from "./Root";
import AdminPage from "./AdminPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
  },
  {
    path: "/admin",
    Component: AdminPage,
  },
]);
