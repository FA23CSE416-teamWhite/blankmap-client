
import * as React from 'react';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
export default function CreateBanner() {

    return (
        <Box width="100%" sx={{display:'flex'}}>
        <Button color="inherit" component={RouterLink} to="/home">
          Home
        </Button>
        <Button color="inherit" component={RouterLink} to="/profile/my-maps">
          My Maps
        </Button>
        </Box>
    );
}