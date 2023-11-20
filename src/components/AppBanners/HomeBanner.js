
import * as React from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';

export default function HomeBanner() {

    return (
        <Box width="100%" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Search Maps"
          style={{
            marginLeft: '1rem',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc', 
            width: '50%',
          }}
        />
        <SearchIcon sx={{ ml: '1rem' }} />
      </Box>
    );
}