import React from "react";
import { Link } from "react-router-dom";
import {Card, ListItemButton, ListItemText, List,ListItem , Typography } from '@mui/material';

const ProfileMenu = () => {
  return (
    <Card sx={{ width: '200px', height: '210px', position: 'flex', borderRadius: 3 }}>
       <List>
          <ListItem disablePadding>
            <ListItemButton href="/profile/personal-information">
              <ListItemText primary="Personal Information" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/profile/my-maps">
              <ListItemText primary="My Maps" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/profile/message-center">
              <ListItemText primary="Message Center" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/sign-out">
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        </List>
    </Card>
  );
};

export default ProfileMenu