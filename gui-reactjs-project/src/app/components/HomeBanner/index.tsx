'use client'
import React, { useTransition } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import image from './homebanner.jpg'
import { useTranslation } from 'next-i18next';

const HomeBanner = () => {
  const {t} = useTranslation();
  return (
    <>
    <div className="banner-container">
      {/* Add your banner content here */}
      <img src="./images/homebanner.jpg"/>
      <h1>{t('Welcome to Our Website')}</h1>
      <p>{t('Discover amazing products and services!')}</p>
    </div>
    
    </>
  );
};

export default HomeBanner;
