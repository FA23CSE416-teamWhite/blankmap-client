import * as React from 'react';
import {useState, useContext} from 'react'
import axios from 'axios';
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
import { QuestionAnswer } from '@mui/icons-material';

export default function PasswordRecovery() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [recoveryQuestion, setRecoveryQuestion] = useState("");
    const [recoveryAnswer, setRecoveryAnswer] = useState("");
    const [reset, setReset] = useState(false);
    const { auth } = useContext(AuthContext);

    function retrieveAccount(event) {
        if (email === ""  ) {
            alert("Please fill all fields");
            return;
        }
    // https://blankmap-server-6de6d45e4291.herokuapp.com:5000/api/users // http://localhost:8000/api/users
        auth.getQuestion(email)
            .then(function (res) { 
                const data = res.data
                setRecoveryQuestion(data.question)
                setRecoveryAnswer(data.answer)
                setReset(true)
                // window.location.reload();
            })
            .catch(function () {
                alert("Could not find account. Please try again");
            });
    }

    function resetAccount(event) {
        if (password === ""  ||
            passwordConfirm === "") {
            alert("Please fill all fields");
            return;
        }
        if(recoveryAnswer !== recoveryQuestion){
            alert("incorrect answer!")
            return;
        }
    // https://blankmap-server-6de6d45e4291.herokuapp.com:5000/api/users // http://localhost:8000/api/users
        auth.resetPassword(email, QuestionAnswer, password, passwordConfirm)
            .then(function (res) { 
                alert("password reset")
                // window.location.reload();
            })
            .catch(function () {
                alert("Error, Please try again");
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
      <Card variant="outlined" sx={{ minWidth: 600 ,boxShadow:3,borderRadius: 3 }}>
          <CardContent  sx={{paddingY: 5,  alignItems:  "center"}}>
              <Box>
                  <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', paddingY: 2 }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.4em' }}>Password Recovery</span>
                  </Box>
                  <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                      Email:
                  </Box>
                  <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                      <TextField onChange={(e) => setEmail(e.target.value)}  fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                  </Box>

                  </Box>

                        {(reset) && (
                            <Box>
                                <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px", paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                                    <Typography>{recoveryQuestion}</Typography>
                                </Box>
                                <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px", paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                                    <TextField label = "Answer to Question" fullWidth onChange={(e) => setRecoveryAnswer(e.target.value)}/>
                                </Box>
                                <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px", paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                                    <TextField label = "New Password" fullWidth onChange={(e) => setPassword(e.target.value)}/>
                                </Box>
                                <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px", paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                                    <TextField label = "Confirm New Password" fullWidth onChange={(e) => setPasswordConfirm(e.target.value)}/>
                                </Box>
                            </Box>
                        )}

                        <Box sx = {{mt:3, mb:4,display: 'flex', }}>
                            <Button variant="contained" sx={{ ml: "15%", width: '150px'}} onClick={() => {
                            retrieveAccount();
                            }}>
                                Find Account
                            </Button>
           
                            <Button disabled={!reset} variant="contained" to="/" sx={{ml:"25%"}} onClick={() => {
                                resetAccount();
                              }}>Reset</Button>
                        </Box>    
                    <Box>
                    
                  <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",paddingY: 1,alignItems: 'center', justifyContent: 'center'}}> 
                 
                  <Link to="/login">Back to login</Link>
                  </Box>
              </Box>
          </CardContent>
      </Card>
        </Grid>
    </Grid>
    );
}