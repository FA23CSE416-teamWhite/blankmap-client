import React from "react";
import ProfileMenu from "./ProfileMenu";
import Message from "./Message";

const MessageCenter = () => {
    const messages = [
        {
            id:1,
            message:"Hello World",
        }
    ]

  return (
    <div className="message-center">
      <ProfileMenu />

      <div className="messages">
        <h2>Message Center</h2>
        {messages.map((msg) => (
          <Message key={msg.id} message={msg.message} />
        ))}
      </div>
    </div>
  );
};

export default MessageCenter;