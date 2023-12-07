'use client';
import SignupForm from '@/app/components/SignupForm';
import LoginForm from '@/app/components/LoginForm';
import { memo, useState, useTransition } from 'react';
import { Box } from '@mui/material';
import clsx from 'clsx';
import classes from './styles.module.scss';
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'next-i18next';

interface GettingStartedProps {}

const GettingStarted = memo((props: GettingStartedProps) => {
  const { t } = useTranslation();
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
              <h1>{t('Welcome Back!')}</h1>
              <p>{t('welcome description 2')}</p>
              <button className={classes.overlayBtn} id='signIn' onClick={() => handleOnClick('signIn')}>
                {t('sign in')}
              </button>
            </div>
            <div className={clsx([classes.overlayPanel, classes.overlayRight])}>
              <h1>{t('Join us today!')}</h1>
              <p>{t('welcome description')}</p>
              <button className={classes.overlayBtn} id='signIn' onClick={() => handleOnClick('signUp')}>
                {t('sign up')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
});

export default GettingStarted;
