import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { useTranslation } from "react-i18next";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

const App = () => {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState("Users");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileOpen(false); // Close mobile drawer after navigation
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Topbar onMenuClick={handleDrawerToggle} />
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: "240px" },
        }}
      >
        <MainContent page={activePage} />
      </Box>
    </Box>
  );
};

export default App;
