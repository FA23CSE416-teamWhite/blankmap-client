import React from "react";
import ProfileMenu from "./ProfileMenu";
import NavBar from "./NavBar";
import  avatar from "./images/avatar.png";
import { Paper, Typography, Box, Button } from "@mui/material";

const MyInfoScreen = () => {
    const username = "testuser";
    const email = "email@email.email";
    const phone = "123-456-7890";
    const memberSince = "1/1/2024";
    const numberOfMaps = "0";
    const bio = "Nice to meet you!";
    const avatarUrl = avatar;

 return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      <ProfileMenu />
      <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        marginLeft: '300px',
      }}
    >
      <div className="avatar-section">
        <img src={avatarUrl} alt="User Avatar" className="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
      </div>

      <div className="user-info" style={{ marginTop: '20px' }}>
        <Typography variant="h5">User Information</Typography>
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
      <Button variant="contained" onClick={() => console.log('Edit button clicked')} style={{ marginTop: '20px' }}>Edit</Button>
    </Paper>
    </Box>
  );
};

export default MyInfoScreen;