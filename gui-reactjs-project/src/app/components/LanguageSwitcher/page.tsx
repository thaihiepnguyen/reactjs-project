import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import { USA, VN } from '@/assets';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load the translation files
import enTranslation from '../../../../src/language/en.json';
import viTranslation from '../../../../src/language/vi.json';

// Initialize i18n instance
i18n.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: 'en', // Default language
  resources: {
    en: { translation: enTranslation },
    vi: { translation: viTranslation },
  },
});

const menu = ['EN', 'VI'];

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
      i18n.changeLanguage(selectedIndex === 0 ? 'en' : 'vi');
    }
  }, [selectedIndex, isBrowser]);

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{width: 'auto'}}
      >
        <div style={{margin: "0 2px"}}>{menu[selectedIndex]}</div>
        {selectedIndex === 0 ? <USA/> : <VN/>}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick(0, 'en')}>EN</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(1, 'vi')}>VI</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
