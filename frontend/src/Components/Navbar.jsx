import { MdOutlineChat, MdPoll } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { LuPencilLine } from "react-icons/lu";
import { FaCode } from "react-icons/fa";
import { BiUserPlus } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import ViewMembers from "./ViewMembers";
import Chat from "./Chat";
import Settings from "./Settings";
import Poll from "./Poll";
import Invite from "./Invite";
function Navbar({
  socketRef,
  messages,
  clients,
  handleTabClick,
  setShowCanvas,
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [lastClickedIcon, setLastClickedIcon] = useState("code");

  function handleCodeOrCanvasClick(icon) {
    if (icon === "canvas") {
      setShowCanvas(true);
    } else {
      setShowCanvas(false);
    }
    setLastClickedIcon(icon);
    handleTabClick(icon);
    setShowSidebar(false);
  }

  function handleViewMembersClick(icon) {
    if (showSidebar && lastClickedIcon === icon) {
      setShowSidebar(false);
      setLastClickedIcon(null);
    } else {
      setShowSidebar(true);
      setLastClickedIcon(icon);
    }
    handleTabClick(icon);
  }
  function handleChatClick(icon) {
    if (showSidebar && lastClickedIcon === icon) {
      setShowSidebar(false);
      setLastClickedIcon(null);
    } else {
      setShowSidebar(true);
      setLastClickedIcon(icon);
    }
    handleTabClick(icon);
  }

  function handleSettingsClick(icon) {
    if (showSidebar && lastClickedIcon === icon) {
      setShowSidebar(false);
      setLastClickedIcon(null);
    } else {
      setShowSidebar(true);
      setLastClickedIcon(icon);
    }
    handleTabClick(icon);
  }
  function handlePollClick(icon) {
    if (showSidebar && lastClickedIcon === icon) {
      setShowSidebar(false);
      setLastClickedIcon(null);
    } else {
      setShowSidebar(true);
      setLastClickedIcon(icon);
    }
    handleTabClick(icon);
  }
  // Handle invite icon click
  function handleInviteClick(icon) {
    if (showSidebar && lastClickedIcon === icon) {
      setShowSidebar(false);
      setLastClickedIcon(null);
    } else {
      setShowSidebar(true);
      setLastClickedIcon(icon);
    }
    handleTabClick(icon);
  }

  return (
    <div className="  flex">
      <div className=" fixed bottom-0 left-0 z-50 flex items-center h-[50px] w-full gap-10 px-5 border-t border-[#89919d] bg-background  md:static md:h-screen md:w-[50px] md:min-w-[50px] md:flex-col md:border-r md:border-t-0 md:p-2 md:pt-4 cursor-pointer text-[#89919d]">
        <FaCode
          className={`${
            lastClickedIcon === "code" && "text-white scale-[2.2]"
          } scale-[2] `}
          onClick={() => handleCodeOrCanvasClick("code")}
        />
        <LuPencilLine
          className={`${
            lastClickedIcon === "canvas" && "text-white scale-[2.2]"
          } scale-[2] `}
          onClick={() => handleCodeOrCanvasClick("canvas")}
        />

        <LiaUserFriendsSolid
          className={`${
            lastClickedIcon === "viewmembers" && "text-white scale-[2.2]"
          } scale-[2] `}
          onClick={() => handleViewMembersClick("viewmembers")}
        />
        <div className="relative" onClick={() => handleChatClick("chat")}>
          <MdOutlineChat
            className={`${
              lastClickedIcon === "chat" && " text-white scale-[2.2]"
            } scale-[1.6] `}
          />
        </div>
        <IoSettingsOutline
          className={`${
            lastClickedIcon === "settings" && "text-white  scale-[2.2]"
          } scale-[1.6] `}
          onClick={() => handleSettingsClick("settings")}
        />
        <MdPoll
          className={`${
            lastClickedIcon === "poll" && "text-white scale-[2.2]"
          } scale-[2] `}
          onClick={() => handlePollClick("poll")}
        />
        {/* Invite Icon */}
        <BiUserPlus
          className={`${
            lastClickedIcon === "invite" && "text-white scale-[2.2]"
          } scale-[2] `}
          onClick={() => handleInviteClick("invite")}
        />
      </div>

      <div
        className={`absolute left-0 top-0 z-20 h-screen w-screen flex-col bg-dark md:static md:w-[350px] bg-background ${
          showSidebar ? "block" : "hidden"
        }`}
      >
        {lastClickedIcon === "settings" && <Settings socketRef={socketRef} />}
        {lastClickedIcon === "viewmembers" && <ViewMembers clients={clients} />}
        {lastClickedIcon === "chat" && (
          <Chat socketRef={socketRef} messagesArray={messages} />
        )}
        {lastClickedIcon === "poll" && <Poll socketRef={socketRef} />}
        {lastClickedIcon === "invite" && <Invite socketRef={socketRef} />}{" "}
        {/* Render Invite Component */}
      </div>
    </div>
  );
}

export default Navbar;
