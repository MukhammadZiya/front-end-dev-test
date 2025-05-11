import React, { useState } from "react";
import { Box, Typography, Snackbar, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import UserTable from "./UserTable";
import SettingsDialog from "./SettingsDialog";
import BreadcrumbNav from "./BreadcrumbNav";
import { useSelector, useDispatch } from "react-redux";
import { setUsers } from "../store/userSlice";
import * as XLSX from "xlsx";

const MainContent = ({ page }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [deletedUser, setDeletedUser] = useState(null);

  const handleSettingsOpen = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDelete = (userId) => {
    const user = users.find((u) => u.id === userId);
    const updated = users.filter((u) => u.id !== userId);
    dispatch(setUsers(updated));
    localStorage.setItem("users", JSON.stringify(updated));
    setDeletedUser(user);
    showSnackbar(t("user_deleted"), "info");
  };

  const handleUndo = () => {
    if (deletedUser) {
      const updated = [...users, deletedUser];
      dispatch(setUsers(updated));
      localStorage.setItem("users", JSON.stringify(updated));
      setDeletedUser(null);
      setSnackbar({ ...snackbar, open: false });
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet);

        const withIds = parsedData.map((row) => ({
          id: Date.now() + Math.random(),
          ...row,
        }));

        const updated = [...users, ...withIds];
        dispatch(setUsers(updated));
        localStorage.setItem("users", JSON.stringify(updated));
        showSnackbar(t("users_imported"));
      } catch (error) {
        showSnackbar(t("import_error"), "error");
      }
    };

    reader.onerror = () => {
      showSnackbar(t("import_error"), "error");
    };

    reader.readAsArrayBuffer(file);
  };

  const renderContent = () => {
    switch (page) {
      case "Users":
        return (
          <>
            <Typography variant="h4" gutterBottom>
              {t("title")}
            </Typography>
            <UserTable
              onSettingsClick={handleSettingsOpen}
              onDelete={handleDelete}
              onFileUpload={handleFileUpload}
            />
          </>
        );
      case "Machines":
        return (
          <Typography variant="h4" gutterBottom>
            {t("machines")}
          </Typography>
        );
      case "Dashboard":
        return (
          <Typography variant="h4" gutterBottom>
            {t("dashboard")}
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbNav page={page} />
      {renderContent()}
      <SettingsDialog open={isSettingsOpen} onClose={handleSettingsClose} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={
          deletedUser && (
            <Button color="secondary" size="small" onClick={handleUndo}>
              {t("undo")}
            </Button>
          )
        }
      />
    </Box>
  );
};

export default MainContent;
