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
import AuthContext from '../auth';
import { useContext } from 'react';

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);

    const handleRegister = (event) => {
        const username = document.getElementById('username').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const firstName = document.getElementById('firstname').value;
        const passwordVerify = document.getElementById('passwordVerify').value;
        const password = document.getElementById('password').value;

        // Perform login action
        auth.registerUser(firstName,lastname,email,username, password,passwordVerify);
    };
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
                        <Box id="firstname" sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Last Name
                        </Box>
                        <Box id="lastname" sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Username
                        </Box>
                        <Box id="username" sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>
    
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Email
                        </Box>
                        <Box id="email" sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Password
                        </Box>
                        <Box id="password" sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Confirm Password
                        </Box>
                        <Box id="passwordVerify" sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                        Choose a Recovery Question
                        </Box>
                        <Box  sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                        Answer to Question
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>


                        <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', paddingY: 2, alignItems: 'center', justifyContent: 'center' }}>
                            <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'block', textTransform: 'none', fontSize: '1rem' }}>
                                    <Button variant="contained" onClick={handleRegister}
                                        sx={{ width: '100%', backgroundColor: 'black', color: 'white', textAlign: 'center', display: 'flex', alignItems: 'center', height: '45px' }}>
                                        Register
                                    </Button>
                                </Link>
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