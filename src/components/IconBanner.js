
import * as React from 'react';
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import blankMapicon from '../assets/blankMapIcon.png'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function IconBanner() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: '#C6D6D6' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Link to="/home" style={{ textDecoration: "none" }}>
                        <img src={blankMapicon} alt="fireSpot" width="48" height="48" />
                    </Link>
                    <Box sx={{ flexGrow: 1 }} />
                    <Link to="/home" style={{ textDecoration: "none" }}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            color="blue"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                mr: 3,
                                cursor: 'pointer',
                                fontFamily: 'Helvetica, sans-serif', // Change to the desired font family
                            }}
                        >
                            BlankMap
                        </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 1 }} />
                    <Link to="/Login">SignIn/SignOut</Link>

                    <Link to="/profile" style={{ textDecoration: "none" }}>
                        <AccountCircle color="gray" sx={{ ml: 1, cursor: 'pointer' }} />
                    </Link>

                </Toolbar>
            </AppBar>
        </Box>
    )
}