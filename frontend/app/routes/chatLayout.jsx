import bison from "../assets/bison.svg";
import { Outlet } from "react-router";

export default function ChatLayout() {
  return (
    <div className="page-chat">
      <div className="chat-header">
        <img src={bison} alt="bison" className="bison-icon" />
      </div>
      <Outlet />
    </div>
  );
}
