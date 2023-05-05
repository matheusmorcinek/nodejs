import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function App() {

  // Connect to the WebSocket server
  const socket = io('http://localhost:5000');

  const [clientId, setClientId] = useState(Math.random().toString(36).substring(7));

  const [likes, setLikes] = useState({
    card1: 0,
    card2: 0,
    card3: 0
  });

  useEffect(() => {
    console.log(`component did mount - [clientid ${clientId}]`);
  }, []);

  useEffect(() => {
    console.log(`component did render - [clientid ${clientId}]`);
  });

  useEffect(() => {
    // Listen for 'like' events from the server
    socket.on('like', (data) => {
      
      const index = data.index;
      const senderClientId = data.clientId;

      console.log(`Card ${index} was liked by client ${senderClientId}`);

      if (senderClientId !== clientId) {
        setLikes((prevLikes) => {
          return {
            ...prevLikes,
            [`card${index}`]: prevLikes[`card${index}`] + 1
          };
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLike = (index) => {
    setLikes((prevLikes) => {
      return {
        ...prevLikes,
        [`card${index}`]: prevLikes[`card${index}`] + 1
      };
    });

    // Emit a 'like' event to the server with the index of the card that was liked
    socket.emit('like', { index, clientId });
  };


  return (
    <div>
      <div>
        <button onClick={() => handleLike(1)}>Like</button>
        <span>{likes['card1']} Likes</span>
      </div>
      <div>
        <button onClick={() => handleLike(2)}>Like</button>
        <span>{likes['card2']} Likes</span>
      </div>
      <div>
        <button onClick={() => handleLike(3)}>Like</button>
        <span>{likes['card3']} Likes</span>
      </div>
    </div>
  );
}

export default App;
