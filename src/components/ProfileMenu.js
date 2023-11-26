import React from "react";
import { Link } from "react-router-dom";
import { Card, List, ListItemButton, ListItemText, ListItem, Typography } from '@mui/material';
import AuthContext from "../auth";
import { useContext } from "react";
const ProfileMenu = () => {
  const { auth } = useContext(AuthContext);
  const handleSignOut = () => {
    auth.logoutUser(); // Call the logout function from your auth module
    // Perform any additional sign-out related logic here if needed
  };
  return (
    <Card sx={{ width: '200px', height: '210px', position: 'flex', borderRadius: 3 }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/profile/personal-information">
            <ListItemText primary="Personal Information" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/profile/my-maps">
            <ListItemText primary="My Maps" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/profile/message-center">
            <ListItemText primary="Message Center" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleSignOut} component={Link} to="/sign-out">
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Card>
  );
};

export default ProfileMenu;
