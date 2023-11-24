import * as React from 'react';
import {useState ,useContext} from 'react'
import AuthContext from '../../auth';
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
import axios from 'axios';
import blankMapicon from '../images/logo_clear.png';


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext);

    function handleLogin(event) {
        if (email === "" || 
            password === "" ) {
            alert("Please fill all fields");
            return;
        }
        auth.loginUser(email, password)
        .then(function (res){
            if(auth.user == null){
                alert("User not found") 
            }
        })
        
    // https://blankmap-server-6de6d45e4291.herokuapp.com:5000/api/users // http://localhost:8000/api/users
        
    }
    
    return(
        <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          height: 'calc(100vh )',
          background: `url(${backgroundImage}) center/cover no-repeat fixed`,
          padding: '20px', // Adjust padding as needed
          boxSizing: 'border-box',
        }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
            <Card variant="outlined" sx={{ width: 600,boxShadow:3,borderRadius: 2 }}>
                {/* <CardHeader color="blue"
                            title={<Typography noWrap sx={{textAlign: "center", fontWeight: "bold",  overflow: "hidden", textOverflow: "ellipsis"}}>LOGIN</Typography>}
                            sx = {{bgcolor:"CornflowerBlue"}}
                            /> */}
                <CardContent onSubmit={handleLogin} sx={{paddingY: 3,  alignItems:  "center"}}>
                    <Box>
                        <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px' }}>
                            <img src={blankMapicon} alt="fireSpot" width="60" height="60" />

                        </Box>
                        <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', paddingY: 4 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.4em' }}>Log in</span>
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Username
                        </Box>
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            {/* <AccountCircle sx = {{padding:1}}/> */}
                            <TextField id="username" fullWidth/>
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:"20px"}}>
                            Password
                            <Link to="/forgot" style={{ marginLeft: 'auto' }}>Forgot Password</Link>
                        </Box>
                        <Box  sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",marginTop:'3px',marginBottom:'3px', alignItems: 'center', justifyContent: 'center'}}>
                            {/* <LockIcon sx = {{padding:1}}/> */}
                            <TextField  id="password" fullWidth/>
                        </Box>
                        <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', paddingY: 3, alignItems: 'center', justifyContent: 'center' }}>
                            
                            
                                <Button variant="contained" onClick={handleLogin}
                                sx={{width: '100%', backgroundColor: 'black', color: 'white', textAlign: 'center', display: 'flex', alignItems: 'center', height: '50px'}}>
                                    Log in
                                </Button>
                           

                        </Box>


                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginBottom:"20px"}}>
                        <Link to="/home">Guest Login</Link>
                        </Box>
                
                        <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",paddingY: 1,alignItems: 'center', justifyContent: 'center'}}> 
                        Don't have an account? 
                            <Link to="/register">Register Account</Link>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
        
    </Grid>
    );
}