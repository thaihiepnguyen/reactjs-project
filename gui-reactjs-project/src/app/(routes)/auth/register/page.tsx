"use client";
// SignUpForm.jsx

import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
// import './SignUpFormStyles.scss';
import { Helmet } from 'react-helmet';

function RegisterForm() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (value) => {
    // Password validation logic
    const regex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (!regex.test(value)) {
      setError('Password must be at least 8 characters, contain one number, and one uppercase letter.');
    } else {
      setError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Additional form submission logic, e.g., sending data to the server
    console.log('Form submitted:', { firstname, lastname, email, password });
  };

  return (
    <Container className="register-form" maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={firstname}
          onChange={handleFirstNameChange}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={lastname}
          onChange={handleLastNameChange}
        />
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={password}
          onChange={handlePasswordChange}
        />
        {error && <Typography variant="body2" color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="submit-button"
          fullWidth
          disabled={Boolean(error)}
        >
          Register
        </Button>
      </form>
    </Container>
  );
}

export default function Register() {
  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      {/* <span>Register Page</span> */}
      <RegisterForm />
    </>
  );
}
