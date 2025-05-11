import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { addUser, updateUser } from "../store/userSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const UserFormModal = ({ open, setOpen, user, multiEditUsers, isInline }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      setForm(user);
    } else if (multiEditUsers?.length > 0) {
      // For multi-edit, initialize with common values or empty
      setForm({ name: "", email: "", phone: "" });
    } else {
      setForm({ name: "", email: "", phone: "" });
    }
  }, [user, multiEditUsers]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (multiEditUsers?.length > 0) {
      // Update multiple users
      multiEditUsers.forEach((user) => {
        dispatch(updateUser({ ...user, ...form }));
      });
    } else if (user) {
      // Update single user
      dispatch(updateUser({ ...user, ...form }));
    } else {
      // Add new user
      dispatch(addUser({ id: Date.now(), ...form }));
    }
    setOpen(false);
  };

  const handleClose = () => {
    setForm({ name: "", email: "", phone: "" });
    setOpen(false);
  };

  const modalContent = (
    <Box sx={isInline ? { p: 2 } : style}>
      <Typography variant="h6" gutterBottom>
        {multiEditUsers?.length > 0
          ? t("edit_multiple_users")
          : user
          ? t("edit_user")
          : t("add_user")}
      </Typography>
      <TextField
        fullWidth
        label={t("name")}
        name="name"
        value={form.name}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label={t("email")}
        name="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label={t("phone")}
        name="phone"
        value={form.phone}
        onChange={handleChange}
        margin="normal"
      />
      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
        <Button fullWidth variant="outlined" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button fullWidth variant="contained" onClick={handleSubmit}>
          {user || multiEditUsers?.length > 0 ? t("update") : t("add")}
        </Button>
      </Box>
    </Box>
  );

  if (isInline) {
    return modalContent;
  }

  return (
    <Modal open={open} onClose={handleClose}>
      {modalContent}
    </Modal>
  );
};

export default UserFormModal;
