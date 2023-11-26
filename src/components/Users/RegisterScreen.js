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
import backgroundImage from '../images/login-background.png';
import AuthContext from '../../auth';
import { useContext } from 'react';
import { useState } from 'react';

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [recoveryQuestion, setRecoveryQuestion] = useState("");
    const [recoveryAnswer, setRecoveryAnswer] = useState("");
    const { auth } = useContext(AuthContext);

    function handleRegister(event) {
            if (username === "" || 
                email === "" || 
                password === "" || 
                passwordConfirm === "" || 
                recoveryAnswer === "" ||
                recoveryQuestion === "") {
                alert("Please fill all fields");
                return;
            }
            if(passwordConfirm != password){
                alert("Passwords do not match");
                return;
            }
        // https://blankmap-server-6de6d45e4291.herokuapp.com:5000/api/users // http://localhost:8000/api/users
           auth.registerUser(firstName, lastName, email, username, password, passwordConfirm)
           .then(function (res) { 
            console.log(auth)
            
        })
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
      ><Grid item xs={12} sm={8} md={6} lg={4}>
            <Card variant="outlined" sx={{ minWidth: 600,boxShadow:3,borderRadius: 3  }}>
                
                <CardContent  sx={{paddingY: 5,  alignItems:  "center"}}>
                    
                    <Box onSubmit={handleRegister}>
                    <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', paddingY: 2 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.4em' }}>Register</span>
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            First Name
                        </Box>
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField id="firstname" onChange={(e) => setFirstName(e.target.value)} fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Last Name
                        </Box>
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField id="lastname" onChange={(e) => setLastName(e.target.value)} fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Username
                        </Box>
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField id="username" onChange={(e) => setUsername(e.target.value)} fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>
    
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Email
                        </Box>
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField id="email" onChange={(e) => setEmail(e.target.value)} fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Password
                        </Box>
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField id="password" onChange={(e) => setPassword(e.target.value)} fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Confirm Password
                        </Box>
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField id="passwordVerify" onChange={(e) => setPasswordConfirm(e.target.value)} fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                        Choose a Recovery Question
                        </Box>
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth onChange={(e) => setRecoveryQuestion(e.target.value)} sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                        Answer to Question
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth onChange={(e) => setRecoveryAnswer(e.target.value)} sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>


                        <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', paddingY: 2, alignItems: 'center', justifyContent: 'center' }}>
                            
                            <Button variant="contained" onClick={handleRegister}
                                sx={{ width: '100%', backgroundColor: 'black', color: 'white', textAlign: 'center', display: 'flex', alignItems: 'center', height: '45px' }}>
                                Register
                            </Button>
                               
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",paddingY: 1,alignItems: 'center', justifyContent: 'center'}}> 
                       
                        <Link to="/login">Already have an Account?</Link>
                        </Box>
                    </Box>

                </CardContent>
            </Card>
        </Grid>
    </Grid>
    );
}
    