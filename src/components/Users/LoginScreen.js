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


export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext);

    function submitForm(event) {
        if (email === "" || 
            password === ""  ) {
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
          height: 'calc(100vh - 128px)',
          background: `url(${backgroundImage}) center/cover no-repeat fixed`,
          padding: '20px', // Adjust padding as needed
          boxSizing: 'border-box',
        }}
      >
        <Grid item xs={1} spacing={1.5}>
            <Card variant="outlined" sx={{ minWidth: 600 }}>
                <CardHeader color="blue"
                            title={<Typography noWrap sx={{textAlign: "center", fontWeight: "bold",  overflow: "hidden", textOverflow: "ellipsis"}}>LOGIN</Typography>}
                            sx = {{bgcolor:"CornflowerBlue"}}
                            />
                <CardContent  sx={{paddingY: 5,  alignItems:  "center"}}>
                    <Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px", paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <AccountCircle sx = {{padding:1}}/>
                            <TextField label = "Username" onChange={(e) => setEmail(e.target.value)} fullWidth/>
                        </Box>
    
                        <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",  paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <LockIcon sx = {{padding:1}}/>
                            <TextField label = "Password" onChange={(e) => setPassword(e.target.value)} fullWidth/>
                        </Box>

                        <Box sx = {{mt:3, mb:4,display: 'flex', }}>
                            <Button variant="contained"  sx={{ml:"25%"}} onClick={() => {
                                submitForm();
                              }}>
                            Login
                            </Button>
                            <Button variant="contained" to="/" sx={{ml:"20%"}} onClick={() => {
                                auth.guestLogin()
                              }}>
                                Guest Login
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