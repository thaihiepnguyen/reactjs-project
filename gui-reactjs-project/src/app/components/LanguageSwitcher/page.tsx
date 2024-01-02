import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import { USA, VN, FR } from '@/assets';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load the translation files
import enTranslation from '../../../../src/language/en.json';
import viTranslation from '../../../../src/language/vi.json';
import frTranslation from '../../../../src/language/fr.json';


// Initialize i18n instance
i18n.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: 'en', // Default language
  resources: {
    en: { translation: enTranslation },
    vi: { translation: viTranslation },
    fr: { translation: frTranslation },
  },
});

const menu = ['EN', 'VI', 'FR'];

const LanguageSwitcher = () => {
  const isBrowser = typeof window !== 'undefined';
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  // useEffect(() => {
  //   // Save selected language to local storage whenever it changes
  //   localStorage.setItem('selectedLanguage', selectedIndex);
  // }, [selectedIndex]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (index, lng) => {
    setSelectedIndex(index);
    i18n.changeLanguage(lng);
    handleClose(); 
  };

  useEffect(() => {
    if (isBrowser) {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      setSelectedIndex(savedLanguage ? parseInt(savedLanguage, 10) : 0);
    }
  }, [isBrowser]);

  useEffect(() => {
    if (isBrowser) {
      localStorage.setItem('selectedLanguage', selectedIndex);
      i18n.changeLanguage(selectedIndex === 0 ? 'en' : selectedIndex === 1 ? 'vi' : 'fr');
    }
  }, [selectedIndex, isBrowser]);

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <div style={{margin: "0 2px"}}>{menu[selectedIndex]}</div>
        {selectedIndex === 0 ? <USA/> : selectedIndex === 1 ? <VN/> : <FR/>}
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem style={{width: '5rem'}} onClick={() => handleMenuItemClick(0, 'en')}><USA/>EN</MenuItem>
        <MenuItem style={{width: '5rem'}} onClick={() => handleMenuItemClick(1, 'vi')}><VN/>VI</MenuItem>
        <MenuItem style={{width: '5rem'}} onClick={() => handleMenuItemClick(2, 'fr')}><FR/>FR</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
