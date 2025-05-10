import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { addUser, updateUser } from "../store/userSlice";

const UserFormModal = ({ open, setOpen, user, isInline, multiEditUsers }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (multiEditUsers?.length > 1) {
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    }
  }, [multiEditUsers]);

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (multiEditUsers?.length > 1) {
      multiEditUsers.forEach((u) => {
        dispatch(updateUser({ ...u, ...formData }));
      });
      setSuccessMsg(t("users_updated"));
    } else if (user?.id) {
      dispatch(updateUser({ ...user, ...formData }));
      setSuccessMsg(t("user_updated"));
    } else {
      dispatch(addUser({ ...formData, id: Date.now() }));
      setSuccessMsg(t("user_added"));
    }
    if (!isInline) {
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {multiEditUsers?.length > 1
            ? t("edit_multiple_users")
            : user?.id
            ? t("edit_user")
            : t("add_user")}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label={t("name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <TextField
                label={t("email")}
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <TextField
                label={t("phone")}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>{t("cancel")}</Button>
            <Button type="submit" variant="contained">
              {user?.id ? t("update") : t("add")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg("")}
      >
        <Alert severity="success" onClose={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserFormModal;
