import * as React from 'react';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from "react-router-dom";
import { CardHeader, CardContent, Button } from '@mui/material';
import backgroundImage from './images/login-background.png';

export default function LoginScreen() {

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
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
            <Card variant="outlined" sx={{ width: 600 }}>
                <CardHeader color="blue"
                            title={<Typography noWrap sx={{textAlign: "center", fontWeight: "bold",  overflow: "hidden", textOverflow: "ellipsis"}}>LOGIN</Typography>}
                            sx = {{bgcolor:"CornflowerBlue"}}
                            />
                <CardContent  sx={{paddingY: 5,  alignItems:  "center"}}>
                    <Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px", paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <AccountCircle sx = {{padding:1}}/>
                            <TextField label = "Username" fullWidth/>
                        </Box>
    
                        <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",  paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <LockIcon sx = {{padding:1}}/>
                            <TextField label = "Password" fullWidth/>
                        </Box>

                        <Box sx = {{mt:3, mb:4,display: 'flex', }}>
                            {/* <Button variant="contained" to="/" sx={{ml:"25%"}}>
                                <Link to="/Home"> Login</Link>
                            </Button> */}
                            <Button variant="contained" to="/" sx={{ml:"20%"}}>
                                <Link to="/Home">Guest Login</Link>
                            </Button>
                        </Box>    
                    </Box>

                    <Box sx={{pr:"50%"}}> 
                        <Link to="/register">Register Account</Link>
                    </Box>
                    <Box > 
                        <Link to="/forgot">Forgot Password</Link>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
    );
}