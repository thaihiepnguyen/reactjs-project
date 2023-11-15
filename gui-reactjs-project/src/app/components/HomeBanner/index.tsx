// components/HomeBanner.js
import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import image from './homebanner.jpg'

const HomeBanner = () => {
  return (
    <div className="banner-container">
      {/* Add your banner content here */}
      <img src="./images/homebanner.jpg"/>
      <h1>Welcome to Our Website</h1>
      <p>Discover amazing products and services!</p>
    </div>
  );
};

export default HomeBanner;
