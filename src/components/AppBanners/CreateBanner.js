
import * as React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

export default function CreateBanner() {

    return (
        <Box width="100%" sx={{display:'flex'}}>
            <Button sx={{color:'white'}}>Home </Button>
            <Button sx={{color:'white', ml:1}}>My Maps </Button>
        </Box>
    );
}