
import * as React from 'react';
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import blankMapicon from '../assets/blankMapIcon.png'

export default function IconBanner() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{bgcolor:'#C6D6D6'}}>
                <Toolbar>
                <img  src={blankMapicon} alt="fireSpot" width="48" height="48" />
                <Box sx ={{flexGrow: 1}}/>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    color="blue"
                    sx={{ display: { xs: 'none', sm: 'block' }, mr:3 }}
                >
                    BlankMap
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </AppBar>
        </Box>
    )
}