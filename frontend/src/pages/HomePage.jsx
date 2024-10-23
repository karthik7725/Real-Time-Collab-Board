import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function HomePage() {
  const navigate = useNavigate();
  const [createRoom, setCreateRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const removeSpaces = (roomName) => {
    return roomName.replace(/\s/g, "");
  };

  const handleEnterClick = (e) => {
    if (e.code === "Enter") {
      handleFormSubmit();
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!roomId) {
      toast.error("Please Enter Room Id.", {});
      return;
    }
    if (!username) {
      toast.error("Please Enter Username.", {});
      return;
    }

    if (removeSpaces(roomId).length < 5) {
      toast.error("Room Id cannot be less than 5 characters excluding spaces.");
      return;
    }
    if (removeSpaces(username).length < 5) {
      toast.error(
        "Username cannot be less than 5 characters excluding spaces."
      );
      return;
    }

    navigate(`/editor/${removeSpaces(roomId)}`, {
      state: {
        username: username.trim(),
      },
    });
  };

  window.addEventListener("popstate", (e) => {
    if (e.state.idx === 1) {
      navigate("/", { replace: true });
    }
  });

  return (
    <div className="min-h-screen px-4 text-white pt-14 md:flex md:justify-around md:items-center md:gap-8">
      <div className="pb-5 md:w-1/2 md:pb-0 ">
        <img src="../../images/homePageImage.svg" />
      </div>
      <div>
        <p className="text-3xl md:text-[45px] lg:text-[50px] text-center font-Workbench pb-2">
          CodeBoard
        </p>
        <p className=" text-[15px] md:text-xl lg:text-[20px] text-center whitespace-nowrap">
          The collaborative coding & brainstorming platform.
        </p>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 pt-5">
          <input
            className="bg-secondary border-[#89919d] border-[1px] rounded py-2 text-xl font-bold px-2 outline-none placeholder:font-normal"
            value={roomId}
            type="text"
            placeholder="Room Id"
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleEnterClick}
          />
          <input
            className="bg-secondary border-[#89919d] border-[1px] rounded py-2 text-xl font-bold px-2 outline-none placeholder:font-normal"
            value={username}
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleEnterClick}
          />
          <button className="py-2 text-xl rounded bg-primary" type="submit">
            {createRoom ? "Create" : "Join"}
          </button>
        </form>
        <div>
          {!createRoom ? (
            <p
              onClick={() => {
                setRoomId(uuidv4());
                setCreateRoom(true);
                toast("New Room Created", {
                  icon: "🚀",
                });
              }}
              className="text-[16px] text-center  underline cursor-pointer py-4"
            >
              Create Room
            </p>
          ) : (
            <p
              onClick={() => {
                setRoomId("");
                setCreateRoom(false);
              }}
              className="text-[16px] text-center pt-4 underline cursor-pointer"
            >
              Join Room
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
