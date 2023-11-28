'use client'
import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import axiosInstance from '@/app/routers/axios';

function ResetPasswordForm() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setEmail(event.target.value);
    };
    
    const handleNewPasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setNewPassword(event.target.value);
      setIsValidPassword(true);
      setError('');
    };
  
    const handleConfirmPasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setConfirmPassword(event.target.value);
      setIsValidPassword(true);
      setError('');
    };
  
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
      event.preventDefault();
  
      if (!isValidPassword || newPassword !== confirmPassword) {
        setError('Passwords do not match or are invalid.');
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await axiosInstance.post(`/auth/reset-password`, {
          email,
          newPassword,
        });
        console.log(response.data);
        // if (response.data.message === 'password reset successful') {
        //   setLoading(false);
        //   setSuccessMessage('Password reset successfully.');
        //   setError('');
        //   // Redirect or handle success as needed
        // } else {
        //   setError(response.data.message);
        //   setSuccessMessage('');
        // }
      } catch (error) {
        console.error(error);
        setError(error?.response?.data?.message || 'Something went wrong. Please try again.');
        setSuccessMessage('');
      }
    };
  
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Reset Password
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
            type="password"
            label="New Password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={handleNewPasswordChange}
          />
          <TextField
            type="password"
            label="Confirm New Password"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            onChange={handleConfirmPasswordChange}
          />
          {error && (
            <Typography variant="body2" sx={{ my: 2 }} color="error">
              {error}
            </Typography>
          )}
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
  
  export default ResetPasswordForm;