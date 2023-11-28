'use client';
import SignupForm from '@/app/components/SignupForm';
import LoginForm from '@/app/components/LoginForm';
import { memo, useState } from 'react';
import { Box } from '@mui/material';
import clsx from 'clsx';
import classes from './styles.module.scss';
import { useRouter, useSearchParams } from 'next/navigation'

interface GettingStartedProps {}

const GettingStarted = memo((props: GettingStartedProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
 
  const typeStart = searchParams.get('type')

  const [type, setType] = useState(typeStart || 'signIn');

  if (typeStart) {
    router.replace('/auth/welcome');
  }

  const handleOnClick = (text: string) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  
  return (
    <Box sx={{width: '100%', ml: 2}}>
      <div className={clsx(classes.container, { [classes.rightPanelActive]: type === 'signUp' })} id='container'>
        <SignupForm />
        <LoginForm />
        <div className={classes.overlayContainer}>
          <div className={classes.overlay}>
            <div className={clsx([classes.overlayPanel, classes.overlayLeft])}>
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className={classes.overlayBtn} id='signIn' onClick={() => handleOnClick('signIn')}>
                Sign In
              </button>
            </div>
            <div className={clsx([classes.overlayPanel, classes.overlayRight])}>
              <h1>Join us today!</h1>
              <p>Discover accessible, diverse education at your fingertips. Our platform offers engaging courses, expert guidance, and flexible learning, empowering you to excel on your educational journey, anytime, anywhere, ...</p>
              <button className={classes.overlayBtn} id='signIn' onClick={() => handleOnClick('signUp')}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
});

export default GettingStarted;
