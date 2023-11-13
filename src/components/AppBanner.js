import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export default function AppBanner() {

    return(
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    
                
                </Toolbar>

            </AppBar>
        </Box>
    );
}