
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
import blankmap_font from './images/blankMap.png'
import AuthContext from '../auth';
import { Menu } from '@mui/material';
import { useContext } from 'react';


export default function IconBanner() {
    const { auth } = useContext(AuthContext);
    let menu = <Link to="/Login" style={{ textDecoration: 'none', color: '#0844A4' }}>Login</Link>
    let main = <Link to="/" style={{ textDecoration: "none" }}>
        <img src={blankMapicon} alt="fireSpot" width="60" height="60" />
    </Link>
    if (auth.loggedIn) {
        menu = <Link id="accountCircle" to="/profile" style={{ textDecoration: "none", color: '#0844A4' }}>
            <AccountCircle color="gray" sx={{ ml: 1, cursor: 'pointer' }} />
        </Link>
        main = <Link to="/home" style={{ textDecoration: "none" }}>
            <img src={blankMapicon} alt="fireSpot" width="60" height="60" />
        </Link>
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: '#D6D6D6' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
                    {main}
                    <Box sx={{ flexGrow: 1 }} />
                    {/* <Link to="/home" style={{ textDecoration: "none" }}>
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
                            Blank Map
                        </Typography>
                    </Link> */}
                    <img src={blankmap_font} alt="fireSpot" width="120" height="100%" />
                    <Box sx={{ flexGrow: 1 }} />
                    {menu}

                </Toolbar>
            </AppBar>
        </Box>
    )
}