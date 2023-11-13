'use client'

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, InputAdornment, IconButton } from '@mui/material';
import classes from "./styles.module.scss"
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { routes } from "@/app/routers/routes";
import { Helmet } from "react-helmet";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from "axios";
import Cookies from 'universal-cookie/es6';
import {useAppDispatch} from "@/redux/hook";
import {setUser} from "@/redux/reducers/user";

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
    const regex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (!regex.test(value)) {
      setError('Password must be at least 8 characters, contain one number, and one uppercase letter.');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/auth/login', {
        email,
        password
      });

      if (response.data) {
        const cookies = new Cookies();
        cookies.set('token', JSON.stringify(response.data.data.token));
        cookies.set('userId', response.data.data.user.id);
        cookies.set('userName', response.data.data.user.fullname);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
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
          fullWidth
          required
          onChange={handleEmailChange}
        />
        <TextField
          type={showPassword ? 'text' : 'password'}
          label="Password"
          variant="outlined"
          margin="normal"
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
        {error && <Typography variant="body2" color="error">{error}</Typography>}
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
      <Helmet>
        <title>Login</title>
      </Helmet>
      {/* <span>Login page</span>
      <span>Counter: {value}</span> */}
      <Container className={classes.box} maxWidth="sm">
        <LoginForm />
        <Container maxWidth="sm">
          <Button 
              className={classes.loginGoogleBtn}
              type="submit"
              variant="contained"
              // color="white"
              fullWidth
              onClick={()=>signIn('google')}
              >
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
    </>
  )
}
