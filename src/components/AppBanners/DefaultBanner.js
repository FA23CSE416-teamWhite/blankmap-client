
import * as React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";

export default function DefaultBanner() {

    return (
        <Box width="100%" sx={{display:'flex'}}>
        <Button color="inherit" component={RouterLink} to="/home">
          Home
        </Button>
        </Box>
    );
}