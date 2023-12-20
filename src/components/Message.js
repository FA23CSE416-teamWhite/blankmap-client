import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Message = ({ message }) => {
  return (
    <Paper elevation={3} sx={{ padding: '16px', marginBottom: '16px' }}>
      <Typography variant="body1">@{message.commenter} just commented "{message.content}" on your map</Typography>
    </Paper>
  );
};

export default Message;