import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../theme/ThemeContext";

const SettingsDialog = ({ open, onClose, language, onLanguageChange }) => {
  const { t } = useTranslation();
  const { toggleTheme, mode } = useThemeContext();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("settings")}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              {t("appearance")}
            </Typography>
            <FormControlLabel
              control={
                <Switch checked={mode === "dark"} onChange={toggleTheme} />
              }
              label={t("dark_mode")}
            />
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              {t("language")}
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="language-select-label">
                {t("language")}
              </InputLabel>
              <Select
                labelId="language-select-label"
                value={language}
                label={t("language")}
                onChange={(e) => onLanguageChange(e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ko">한국어</MenuItem>
                <MenuItem value="ru">Русский</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("close")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
