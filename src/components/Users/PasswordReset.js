import * as React from 'react';
import {useState} from 'react'
import axios from 'axios';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { Link, useNavigate } from "react-router-dom";
import { CardHeader, CardContent, Button } from '@mui/material';
import backgroundImage from '../images/login-background.png';

export default function PasswordRecovery() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate()

    function retrieveAccount(event){

    }

    return(
        <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          height: 'calc(100vh - 128px)',
          background: `url(${backgroundImage}) center/cover no-repeat fixed`,
          padding: '20px', // Adjust padding as needed
          boxSizing: 'border-box',
        }}
      ><Grid item xs={12} sm={8} md={6} lg={4}>
            <Card variant="outlined" sx={{ minWidth: 600 }}>
                <CardHeader color="blue"
                            title={<Typography noWrap sx={{textAlign: "center", fontWeight: "bold",  overflow: "hidden", textOverflow: "ellipsis"}}>LOGIN</Typography>}
                            sx = {{bgcolor:"CornflowerBlue"}}
                            />
                <CardContent  sx={{paddingY: 5,  alignItems:  "center"}}>
                    <Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px", paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <AccountCircle sx = {{padding:1}}/>
                            <TextField label = "Username" fullWidth onChange={(e) => setUsername(e.target.value)}/>
                        </Box>

                        <Box sx = {{mt:3, mb:4,display: 'flex', }}>
                            <Box sx={{ml:"15%"}}/>
                            <Link to="/login" underline="none">
                                <Button variant="contained" sx={{ ml: "15%", width: '150px'}}>
                                    Back to Login
                                </Button>
                            </Link>
                            <Button variant="contained" to="/" sx={{ml:"25%"}}>Retrieve</Button>
                        </Box>    
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
    );
}