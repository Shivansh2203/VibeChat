import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImaages] = useState([]);

  // Get all the images from the message and set to the state
  useEffect(() => {
    setMsgImaages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    selectedUser && (
      <div
        className={`w-full h-full bg-[#8185B2]/10 text-white relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}
      >
        {/* Profile Section */}
        <div className="pt-16 flex flex-col items-center text-xs font-light mx-auto gap-2">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
            className="w-20 aspect-square rounded-full border border-gray-600"
          />

          <h1 className="text-xl px-10 font-medium text-white flex items-center gap-2">
            {onlineUsers.includes(selectedUser._id) && (
              <p className="w-2 h-2 rounded-full bg-green-500"></p>
            )}
            {selectedUser.fullName}
          </h1>

          <p className="px-10 mx-auto">
            {selectedUser.bio || "No bio available"}
          </p>
        </div>
        <hr className="border-[#ffffff50] my-4" />
        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 max-h-50 overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
            {msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url, "_blank")}
                className="cursor-pointer rounded"
              >
                <img src={url} alt="" className="h-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="absolute mx-2 bottom-5 mt-6 px-6 py-2 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white transition duration-300"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
