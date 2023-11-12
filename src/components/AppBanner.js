import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';

export default function AppBanner() {

    return(
        <Box>
            <h1>blankMap</h1>
        </Box>
    );
}