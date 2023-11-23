'use client'
import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import axiosInstance from '@/app/routers/axios';
import CircularProgress from '@/app/components/CircularProgress';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(event.target.value);

    // Check input email
    // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // const isValid = emailRegex.test(email);
    setIsValidEmail(true);
    // console.log(isValid);
    setError('');
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (!isValidEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      const response = await axiosInstance.post(`/auth/forgot-password`, {
        email,
      });
      console.log(response.data.message);
      // Handle the response as needed
      if (response.data.message === 'send reset password email successfully!') {
        setLoading(false);
        // history.push({pathname: 'http://localhost:3000/auth/verifycode'});
        setSuccessMessage('Reset password link sent successfully. Please check your email.');
        setError('');
      }
      else {
        setError(response.data.message);
        setSuccessMessage('');
      }
    } catch (error) {
      // Handle error
      console.error(error);
      setError(error?.response?.data?.message || 'Something went wrong. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Forgot Password
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
        {error && (
          <Typography variant="body2" sx={{ my: 2 }} color="error">
            {error}
          </Typography>
        )}
         {/* {loading && <CircularProgress />}  */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
        {successMessage && (
          <Typography variant="body2" sx={{ my: 2 }} color="#4caf50">
            {successMessage}
          </Typography>
        )}
      </form>
    </Container>
  );
}

export default ForgotPasswordForm;
