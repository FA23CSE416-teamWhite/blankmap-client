import React from "react";
import ProfileMenu from "./ProfileMenu";

const MyInfoScreen = () => {
    const username = "testuser";
    const email = "email@email.email";
    const phone = "123-456-7890";
    const memberSince = "1/1/2024";
    const numberOfMaps = "0";
    const bio = "Nice to meet you!";
    const avatarUrl = "avatarUrl";

 return (
    <div className="info-screen" style={{ display: 'flex',padding:"20px"}}>
      <ProfileMenu />
      <div className="content-container" style={{ marginLeft: '250px' }}>
      <div className="avatar-section">
        <img src={avatarUrl} alt="User Avatar" className="avatar" />
      </div>

      <div className="user-info">
        <h2>User Information</h2>
        <div>
          <strong>Username:</strong> {username}
        </div>
        <div>
          <strong>Email:</strong> {email}
        </div>
        <div>
          <strong>Phone:</strong> {phone}
        </div>
        <div>
          <strong>Password:</strong> {/* Display password securely or provide an option to reset */}
          {/* Ideally, avoid displaying passwords for security reasons */}
        </div>
        <div>
          <strong>Member Since:</strong> {memberSince}
        </div>
        <div>
          <strong>Number of Maps:</strong> {numberOfMaps}
        </div>
        <div>
          <strong>Bio:</strong> {bio}
        </div>
      </div>
      </div>
      
    </div> 
  );
};

export default MyInfoScreen;