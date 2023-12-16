import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
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
const imgMenu = [USA, VN];

export default function LanguageSwitcher() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // console.log();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (index, lng) => {
    // console.log(`Selected language: ${index}`);
    setSelectedIndex(index);
    i18n.changeLanguage(lng);
    handleClose(); 
  };

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
        {selectedIndex === 0 ? <USA/>:<VN/>}
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
}