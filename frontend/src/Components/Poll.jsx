import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";

function Poll({ socketRef }) {
  const [agreeCount, setAgreeCount] = useState(0);
  const [disagreeCount, setDisagreeCount] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const { roomId } = useParams();

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on(ACTIONS.POLL_UPDATE, ({ agree, disagree }) => {
      setAgreeCount(agree);
      setDisagreeCount(disagree);
    });

    socketRef.current.on("poll-update-username", ({ username }) => {
      toast(` 🙋 ${username} has voted`);
    });

    return () => {
      socketRef.current.off(ACTIONS.POLL_UPDATE);
    };
  }, [socketRef]);

  const handleVote = (vote) => {
    if (userVote === vote) {
      // Remove vote
      setUserVote(null);
      socketRef.current.emit(ACTIONS.POLL_VOTE, {
        roomId,
        vote: null,
        previousVote: vote,
      });
    } else {
      // Change vote or new vote
      setUserVote(vote);
      socketRef.current.emit(ACTIONS.POLL_VOTE, {
        roomId,
        vote,
        previousVote: userVote,
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Poll</h2>
      <div className="flex flex-col gap-4">
        <button
          className={`p-2 rounded ${
            userVote === "agree" ? "bg-green-500" : "bg-gray-300"
          }`}
          onClick={() => handleVote("agree")}
        >
          Agree ({agreeCount})
        </button>
        <button
          className={`p-2 rounded ${
            userVote === "disagree" ? "bg-red-500" : "bg-gray-300"
          }`}
          onClick={() => handleVote("disagree")}
        >
          Disagree ({disagreeCount})
        </button>
      </div>
    </div>
  );
}

export default Poll;
