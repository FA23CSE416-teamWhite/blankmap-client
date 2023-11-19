import * as React from 'react';
import {useState} from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { Link, useNavigate  } from "react-router-dom";
import { CardHeader, CardContent, Button } from '@mui/material';
import backgroundImage from '../images/login-background.png';
import axios from 'axios';

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [recoveryQuestion, setRecoveryQuestion] = useState("");
    const [recoveryAnswer, setRecoveryAnswer] = useState("");
    const navigate = useNavigate()

    function submitForm(event) {
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
            axios
                .post("http://localhost:8000/api/users", {
                    username: username,
                    email: email,
                    password: password,
                    recoveryQuestion: recoveryQuestion,
                    recoveryAnswer: recoveryAnswer
                })
                .then(function () {
                    alert("Account created successfully");
                    navigate('/login')
                    // window.location.reload();
                })
                .catch(function () {
                    alert("Could not creat account. Please try again");
                });
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
                            title={<Typography noWrap sx={{textAlign: "center", fontWeight: "bold",  overflow: "hidden", textOverflow: "ellipsis"}}>REGISTER</Typography>}
                            sx = {{bgcolor:"CornflowerBlue"}}
                            />
                <CardContent  sx={{paddingY: 5,  alignItems:  "center"}}>
                    <Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px", paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <TextField label = "Username" onChange={(e) => setUsername(e.target.value)} fullWidth/>
                        </Box>
    
                        <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",  paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <TextField label = "Email" onChange={(e) => setEmail(e.target.value)} fullWidth/>
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",  paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <TextField label = "Choose a Password" onChange={(e) => setPassword(e.target.value)} fullWidth/>
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",  paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <TextField label = "Confirm Password" onChange={(e) => setPasswordConfirm(e.target.value)}fullWidth/>
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",  paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <TextField label = "Choose a Recovery Question" onChange={(e) => setRecoveryQuestion(e.target.value)}fullWidth/>
                        </Box>

                        <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",  paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <TextField label = "Answer to Question" onChange={(e) => setRecoveryAnswer(e.target.value)} fullWidth/>
                        </Box>

                        <Box sx = {{mt:3, mb:4,display: 'flex', }}>
                            <Button variant="contained" to="/" sx={{ml:"40%"}}
                            onClick={() => {
                                submitForm();
                              }}>
                                Register
                            </Button>
                        </Box>    
                    </Box>

                    <Box sx={{pr:"50%"}}> 
                        <Link to="/login">Already have an Account?</Link>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
    );
}