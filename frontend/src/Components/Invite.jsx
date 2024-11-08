import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast"; // Assuming you want to use toasts for notifications

function Invite({ socketRef }) {
  const [username, setUsername] = useState(""); // Store the username to invite
  const { roomId } = useParams(); // Get the roomId from URL

  const handleInvite = () => {
    if (!username.trim()) {
      toast.error("Please enter a valid username.");
      return;
    }

    // Emit the invite event
    socketRef.current.emit("add-invite", { roomId, username });

    socketRef.current.once("invite-status", ({ status }) => {
      if (status === "success") {
        toast.success(`Invitation sent to ${username}`);
      } else {
        toast.error(`Already send invitation to ${username}`);
      }
    });

    setUsername(""); // Clear the input
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Invite Friend</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded text-black"
        />
        <button
          onClick={handleInvite}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Invite User
        </button>
      </div>
    </div>
  );
}

export default Invite;
