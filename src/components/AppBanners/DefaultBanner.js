
import * as React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Link } from "react-router-dom";

export default function DefaultBanner() {

    return (
        <Box width="100%" sx={{display:'flex'}}>
            <Button sx={{color:'white'}}>
                <Link to="/Home" > Home</Link>
             </Button>
        </Box>
    );
}