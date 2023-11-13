
import * as React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

export default function DefaultBanner() {

    return (
        <Box width="100%" sx={{display:'flex'}}>
            <Button sx={{color:'white'}}>Home </Button>
        </Box>
    );
}