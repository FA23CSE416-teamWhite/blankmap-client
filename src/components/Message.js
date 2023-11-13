import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Message = ({ message }) => {
  return (
    <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
      <Typography variant="body1">@{message.user} just commented "{message.message}" on your "{message.map}" - {message.dateCreated}</Typography>
    </Paper>
  );
};

export default Message;