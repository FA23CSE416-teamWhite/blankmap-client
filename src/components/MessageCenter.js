import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProfileMenu from './ProfileMenu'; // Import your ProfileMenu component
import Message from './Message';
import Grid from "@mui/material/Grid";

const MessageCenter = () => {
    const messages = [
        {
            id:1,
            user: "Dog",
            message:"Nice map!",
            map: "World GDP",
            dateCreated: "8/02/2015"
        }
    ]

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      <Grid container>
        <Grid item xs={12} sm={3}>
          <ProfileMenu />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Box sx={{ flex: 1, marginRight: '20' }}>
            <Typography variant="h4" gutterBottom>
              Message Center
            </Typography>
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessageCenter;