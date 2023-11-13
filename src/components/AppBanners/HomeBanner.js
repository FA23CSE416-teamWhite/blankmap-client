
import * as React from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';

export default function HomeBanner() {

    return (
        <Box width="100%" sx={{display:'flex', alignItems:'center'}}>
            <SearchIcon sx={{ml:"27%"}} />
            <TextField label="Search Maps" sx={{bgcolor:"white", minWidth:"40%",ml:2}}> </TextField>
        </Box>
    );
}