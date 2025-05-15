import React from "react";
import { Box, Tabs, Tab, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { closeTab, setTab, openTab } from "../store/uiSlice";
import UserTable from "./UserTable";
import { useTranslation } from "react-i18next";

const TabPanel = () => {
  const { tabs, currentTab } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const renderTabContent = () => {
    switch (currentTab) {
      case "Users":
        return <UserTable />;
      default:
        return <Box p={2}>Welcome to the {currentTab} page</Box>;
    }
  }; 

  const handleChange = (event, newValue) => {
    dispatch(openTab(newValue));
  }; 

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <Tabs
        value={currentTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {t(tab.toLowerCase())}
                {tab !== "Home" && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(closeTab(tab));
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            }
            value={tab}
          />
        ))}
      </Tabs>
      <Box p={2} sx={{ flexGrow: 1 }}> 
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default TabPanel;
