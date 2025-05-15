import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    maritalStatus: "not_married",
    numberOfChildren: "",
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      setForm({
        ...user,
        maritalStatus: user.maritalStatus || "not_married",
        numberOfChildren: user.numberOfChildren || "",
      });
    } else if (multiEditUsers?.length > 0) {
      setForm({
        name: "",
        email: "",
        phone: "",
        maritalStatus: "not_married",
        numberOfChildren: "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        maritalStatus: "not_married",
        numberOfChildren: "",
      });
    }
  }, [user, multiEditUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const userData = {
      ...form,
      numberOfChildren:
        form.maritalStatus === "have_children" ? form.numberOfChildren : "",
    };
    if (multiEditUsers?.length > 0) {
      multiEditUsers.forEach((user) => {
        dispatch(updateUser({ ...user, ...userData }));
      });
    } else if (user) {
      dispatch(updateUser({ ...user, ...userData }));
    } else {
      const newUser = {
        id: Date.now(),
        ...userData,
        parentId: null,
      };
      dispatch(addUser(newUser));
    }
    setOpen(false);
  };

  const handleClose = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      maritalStatus: "not_married",
      numberOfChildren: "",
    });
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
        required
      />
      <TextField
        fullWidth
        label={t("email")}
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label={t("phone")}
        name="phone"
        value={form.phone}
        onChange={handleChange}
        margin="normal"
        required
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="marital-status-label">Marital Status</InputLabel>
        <Select
          labelId="marital-status-label"
          name="maritalStatus"
          value={form.maritalStatus}
          label="Marital Status"
          onChange={handleChange}
        >
          <MenuItem value="married">Married</MenuItem>
          <MenuItem value="not_married">Not Married</MenuItem>
          <MenuItem value="have_children">Have Children</MenuItem>
        </Select>
      </FormControl>
      {form.maritalStatus === "have_children" && (
        <TextField
          fullWidth
          label="Number of Children"
          name="numberOfChildren"
          value={form.numberOfChildren}
          onChange={handleChange}
          margin="normal"
          placeholder="Enter number of kids"
          type="number"
          inputProps={{ min: 1 }}
          required
        />
      )}
      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
        <Button fullWidth variant="outlined" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !form.name ||
            !form.email ||
            !form.phone ||
            (form.maritalStatus === "have_children" && !form.numberOfChildren)
          }
        >
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
