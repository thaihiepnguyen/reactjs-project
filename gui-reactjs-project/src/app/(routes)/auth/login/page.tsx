'use client'

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, InputAdornment, IconButton, Grid } from '@mui/material';
import classes from "./styles.module.scss"
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { routes } from "@/app/routers/routes";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from "axios";
import Cookies from 'universal-cookie/es6';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  }
   
  const handlePasswordChange = (event: { target: { value: any; }; }) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (value: string) => {
    // Password validation logic
    const regex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (!regex.test(value)) {
      setError('Password must be at least 8 characters, contain one number, and one uppercase letter.');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    // Additional form submission logic
    try {
      const response = await axios.post(`${process.env.API_URL}/auth/login`, {
        email,
        password
      });

      // Handle the response as needed
      if (response.data) {
        const cookies = new Cookies();
        cookies.set('token', JSON.stringify(response.data.data.token));
        cookies.set('userId', response.data.data.user.id);
        cookies.set('userName', response.data.data.user.fullname);
        window.location.reload();
        console.log('Exist account: ', response.data);
      }
    } catch (error) {
      // Handle error
      console.error('Error submitting form:', error);
    }
    
    console.log('Form submitted:', {email, password});
  };
  
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          margin="normal"
          autoComplete="email"
          fullWidth
          required
          onChange={handleEmailChange}
        />
        <TextField
          type={showPassword ? 'text' : 'password'}
          label="Password"
          variant="outlined"
          margin="normal"
          autoComplete="current-password"
          fullWidth
          required
          value={password}
          onChange={handlePasswordChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="body2" align="right" style={{ marginTop: '5px', marginBottom: '5px', fontStyle: 'italic' }}>
          <Link href="#" color="primary">
            Forgot Password?
          </Link>
        </Typography>
        {error && <Typography variant="body2" sx={{my: 2}} color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={Boolean(error)} 
        >
          Login
        </Button>
      </form>
    </Container>
  );
}


export default function Login() {
  // const {value} = useAppSelector(state => state.counterReducer)

  return (
    <>
      {/* <span>Login page</span>
      <span>Counter: {value}</span> */}
      <Container className={classes.container} maxWidth="lg">
        <Container className={classes.left__section} maxWidth="sm">
          {/* Left side - Information */}
          <Container className={classes.infoContainer}>
              <Typography className={classes.title__left__section} variant="h2" align="left" gutterBottom>
                Join us to day
              </Typography>
              <Typography variant="body1" fontStyle="italic">
              Discover accessible, diverse education at your fingertips. 
              Our platform offers engaging courses, expert guidance, and flexible learning, 
              empowering you to excel on your educational journey, anytime, anywhere, ...
              </Typography>
            </Container>
        </Container>

        <Container className={classes.box} maxWidth="sm">
          <LoginForm />
          <Container maxWidth="sm">
            <Button 
                className={classes.loginGoogleBtn}
                type="submit"
                sx={{backgroundColor: "#fff", mt: 2}}
                variant="contained"
                // color="white"
                fullWidth
                onClick={()=>signIn('google')}
                >
                <img alt="Google icon" className={classes.google_icon} src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                Login with google
            </Button>
            <Typography className={classes.switchText}variant="body2" align="center" gutterBottom>
              Don't have an account?{' '}
              <Link href={routes.register} >
                Register
              </Link>
            </Typography>
          </Container>
        </Container>
      </Container>
    </>
  )
}
