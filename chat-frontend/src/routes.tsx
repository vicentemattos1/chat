import { createBrowserRouter,  } from "react-router";
import ChatPage from "./pages/chat";

export const router = createBrowserRouter([
  { path: "/", element: <ChatPage /> },       
  { path: "/:id", element: <ChatPage /> },
]);
