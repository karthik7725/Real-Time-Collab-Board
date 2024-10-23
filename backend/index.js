const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const { ACTIONS } = require("./Actions");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userSocketMap = {};
const roomData = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

function generateTimeStamp() {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  const timestamp = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  return timestamp;
}

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    if (!roomData[roomId]) {
      code = `function sayHello() {
        console.log("Hello, World!");
  }`;
      roomData[roomId] = {
        code,
        canvasData: [],
        messages: [],
        selectedLanguage: "",
        pollData: { agree: 0, disagree: 0 }, // Initialize poll data here
      };
    }
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach((client) => {
      io.to(client.socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: client.socketId,    //not actually  required tho
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    //Send to all users except the sender
    roomData[roomId] = { ...roomData[roomId], code };
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CHANGES, ({ roomId, socketId }) => {
    //Send to just newly joined user.
    io.to(socketId).emit(ACTIONS.SYNC_CHANGES, { roomData: roomData[roomId] });
  });

  socket.on(ACTIONS.MESSAGE, ({ roomId, message }) => {
    if (roomData[roomId]) {
      roomData[roomId] = {
        ...roomData[roomId],
        messages: [
          ...roomData[roomId].messages,
          {
            message,
            id: Date.now(),
            username: userSocketMap[socket.id],
            timestamp: generateTimeStamp(),
          },
        ],
      };
    }
    //Emit even to all users including the sender
    io.in(roomId).emit(ACTIONS.MESSAGE, {
      message,
      id: Date.now(),
      username: userSocketMap[socket.id],
      timestamp: generateTimeStamp(),
    });
  });

  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, username, language }) => {
    if (roomData[roomId]) {
      roomData[roomId] = {
        ...roomData[roomId],
        selectedLanguage: language,
      };
    }
    socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, {
      username,
      language,
    });
  });

  socket.on(ACTIONS.CANVAS_CHANGE, ({ roomId, type, username, newChanges }) => {
    if (roomData[roomId]) {
      roomData[roomId] = {
        ...roomData[roomId],
        canvasData: [...roomData[roomId].canvasData, ...newChanges],
      };
    }

    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.CANVAS_CHANGE, {
        type,
        username,
        newChanges,
      });
    });
  });

  // socket.on("user-presence", ({ presence, roomId, username }) => {
  //   const clients = getAllConnectedClients(roomId);

  //   clients.forEach(({ socketId }) => {
  //     io.to(socketId).emit("user-presence", {
  //       username,
  //       presence,
  //     });
  //   });
  // });

      //adding the poll option event handler here

      socket.on(ACTIONS.POLL_VOTE, ({ roomId, vote, previousVote }) => {
        if (!roomData[roomId]) {
          roomData[roomId] = { pollData: { agree: 0, disagree: 0 } };
        }
    
        if (previousVote) {
          roomData[roomId].pollData[previousVote]--;
        }
    
        if (vote) {
          roomData[roomId].pollData[vote]++;
        }
    
        io.to(roomId).emit(ACTIONS.POLL_UPDATE, roomData[roomId].pollData);
        socket.in(roomId).emit("poll-update-username",{username:userSocketMap[socket.id]});
      });




  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      getAllConnectedClients(roomId).length === 1 && delete roomData[roomId];
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server has started listening on port " + PORT);
});
