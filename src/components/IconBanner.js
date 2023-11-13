
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
            <AppBar position="static">
                <Toolbar>
                <img  src={blankMapicon} alt="fireSpot"/>
                <Box sx ={{flexGrow: 1}}/>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    BlankMap
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <AccountCircle />
                </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}