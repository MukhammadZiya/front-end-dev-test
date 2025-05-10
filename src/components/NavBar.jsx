import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
  Box,
  InputLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import { useDispatch } from "react-redux";
import { openTab } from "../store/uiSlice";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../theme/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { toggleTheme, mode } = useThemeContext();

  const handleMenuClick = (label) => {
    dispatch(openTab(label));
    setOpen(false);
  };

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => handleMenuClick("Home")}
          >
            {t("title")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="language-select-label">
                {t("language")}
              </InputLabel>
              <Select
                labelId="language-select-label"
                value={i18n.language}
                label={t("language")}
                onChange={handleLanguageChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ko">한국어</MenuItem>
                <MenuItem value="ru">Русский</MenuItem>
              </Select>
            </FormControl>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List>
          <ListItem button onClick={() => handleMenuClick("Home")}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t("home")} />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick("Users")}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={t("users")} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
