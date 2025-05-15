import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../theme/ThemeContext";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const SettingsPanel = ({ open, onClose, settings, onSave }) => {
  const { t } = useTranslation();
  const { toggleTheme, mode } = useThemeContext();
  const [activeTab, setActiveTab] = useState(0);
  const [localSettings, setLocalSettings] = useState(settings);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (key, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleColumnOrderChange = (result) => {
    if (!result.destination) return;

    const items = Array.from(localSettings.columnOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    handleSettingChange("columnOrder", items);
  };

  const handleSave = () => {
    try {
      onSave(localSettings);
      setNotification({
        open: true,
        message: t("save_success"),
        severity: "success",
      });
      onClose();
    } catch (error) {
      setNotification({
        open: true,
        message: t("save_error"),
        severity: "error",
      });
    }
  };

  const handleReset = () => {
    try {
      onSave({
        columnVisibility: {},
        columnOrder: [],
        defaultFilters: {},
        defaultSort: {},
        theme: "light",
        layout: "default",
        kpiLayout: "grid",
      });
      setNotification({
        open: true,
        message: t("reset_success"),
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: t("reset_error"),
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {t("table_settings")}
          <IconButton aria-label="close" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label={t("general_settings")} />
            <Tab label={t("column_settings")} />
            <Tab label={t("view_settings")} />
            <Tab label={t("advanced_settings")} />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{t("theme_settings")}</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={mode === "dark"}
                        onChange={toggleTheme}
                      />
                    }
                    label={t("dark_mode")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">{t("layout_settings")}</Typography>
                  <FormControl fullWidth>
                    <InputLabel>{t("default_view")}</InputLabel>
                    <Select
                      value={localSettings.layout}
                      onChange={(e) =>
                        handleSettingChange("layout", e.target.value)
                      }
                    >
                      <MenuItem value="default">{t("table_view")}</MenuItem>
                      <MenuItem value="split">{t("split")}</MenuItem>
                      <MenuItem value="modal">{t("modal")}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t("column_order")}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {t("drag_to_reorder")}
                </Typography>
                <DragDropContext onDragEnd={handleColumnOrderChange}>
                  <Droppable droppableId="columns">
                    {(provided) => (
                      <Box {...provided.droppableProps} ref={provided.innerRef}>
                        {localSettings.columnOrder.map((column, index) => (
                          <Draggable
                            key={column}
                            draggableId={column}
                            index={index}
                          >
                            {(provided) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ p: 1, mb: 1 }}
                              >
                                {column}
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
              </Box>
            )}

            {activeTab === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{t("kpi_layout")}</Typography>
                  <FormControl fullWidth>
                    <InputLabel>{t("kpi_layout")}</InputLabel>
                    <Select
                      value={localSettings.kpiLayout}
                      onChange={(e) =>
                        handleSettingChange("kpiLayout", e.target.value)
                      }
                    >
                      <MenuItem value="grid">Grid</MenuItem>
                      <MenuItem value="list">List</MenuItem>
                      <MenuItem value="compact">Compact</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">{t("default_filters")}</Typography>
                  <TextField
                    fullWidth
                    label={t("search_filters")}
                    value={localSettings.defaultFilters.search || ""}
                    onChange={(e) =>
                      handleSettingChange("defaultFilters", {
                        ...localSettings.defaultFilters,
                        search: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 3 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{t("user_preferences")}</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localSettings.autoSave}
                        onChange={(e) =>
                          handleSettingChange("autoSave", e.target.checked)
                        }
                      />
                    }
                    label="Auto-save preferences"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">{t("table_state")}</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localSettings.persistTableState}
                        onChange={(e) =>
                          handleSettingChange(
                            "persistTableState",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Persist table state"
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReset} color="error">
            {t("reset_settings")}
          </Button>
          <Button onClick={onClose}>{t("cancel")}</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {t("save_settings")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SettingsPanel;
