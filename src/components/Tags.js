import React from "react";
import IconButton from '@mui/material/IconButton';

const Tags = ({ tags }) => {
  let tag_buttons = tags.map((tag, index) => (
    <IconButton
      key={index}
      sx={{
        fontSize: '10px',
        backgroundColor: '#0844A4',
        color: 'white',
        padding: '5px',
        borderRadius: '10px',
        margin: '0 4px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s', // Add transition for smooth color change
        ':hover': {
          backgroundColor: '#0A5CE8', // Change color on hover
        },
      }}
    >
      {tag}
    </IconButton>
  ));
  return (
    tag_buttons
  );
};

export default Tags;