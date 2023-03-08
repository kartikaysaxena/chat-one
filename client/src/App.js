import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  console.log(process.env)
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [token, setToken] = useState('10')

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer d-flex justify-content-center">
          <h2>Chat Room AI</h2>
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Kartikay"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
         <div className="container">
           <h6 >
             Select size of text you wish to generate from AI Model
           </h6>
         </div>
          <select typeof="number" type="number" itemType="number" className="form-select mb-2" value={token} onChange={e=> setToken(e.target.value)} aria-label="Default select example">
            <option type="number" value="10">Small</option>
            <option type="number" value="100">Medium</option>
            <option type="number" value="3000">Large</option>
          </select>
          <div className="container">
           <h6 >
             (May timely generate inappropriate or false information)
           </h6>
         </div>
        </div>
        
      ) : (
        <Chat socket={socket} username={username} room={room} token={token} />
      )}
    </div>
  );
}

export default App;