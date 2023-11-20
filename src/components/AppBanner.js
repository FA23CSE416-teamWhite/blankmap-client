import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom'
import Toolbar from '@mui/material/Toolbar';
import HomeBanner from './AppBanners/HomeBanner'
import CreateBanner from './AppBanners/CreateBanner'
import DefaultBanner from './AppBanners/DefaultBanner';

export default function AppBanner() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: '#0844A4' }}>
                <Toolbar>
                    <Routes>
                        <Route path="/home" element={<HomeBanner />} />
                        <Route path="/create" element={<CreateBanner />} />
                        <Route path="/login" element={<Box></Box>} />
                        <Route path="/register" element={<Box></Box>} />
                        <Route path="/forgot" element={<Box></Box>} />
                        <Route path="*" element={<DefaultBanner />} />
                    </Routes>
                </Toolbar>
            </AppBar>
        </Box>
    );
}