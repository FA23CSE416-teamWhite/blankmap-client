import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProfileMenu from './ProfileMenu'; // Import your ProfileMenu component
import Message from './Message';

const MessageCenter = () => {
    const messages = [
        {
            id:1,
            message:"Hello World",
        }
    ]

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      {/* ProfileMenu on the left */}
      <ProfileMenu />

      {/* Content on the right */}
      <Box sx={{ marginLeft: '225px', flex: 1, marginRight: '20' }}>
        <Typography variant="h4" gutterBottom>
          Message Center
        </Typography>
        {messages.map((msg) => (
          <Message key={msg.id} message={msg.message} />
        ))}
      </Box>
    </Box>
  );
};

export default MessageCenter;