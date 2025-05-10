import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser, updateUser } from "../store/userSlice";

const UserFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useLocation().state || null;
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState(
    user || { id: Date.now(), name: "", email: "", phone: "" }
  );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (user) {
      dispatch(updateUser(formData));
      setSuccessMsg("User updated successfully");
    } else {
      dispatch(addUser(formData));
      setSuccessMsg("User added successfully");
    }
    navigate("/");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {user ? "Edit User" : "Add New User"}
      </Typography>
      <TextField
        label="Name"
        name="name"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={handleChange}
      />
      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        label="Phone"
        name="phone"
        fullWidth
        margin="normal"
        value={formData.phone}
        onChange={handleChange}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        {user ? "Update" : "Add"} User
      </Button>
      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => navigate("/")}
      >
        Back
      </Button>
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg("")}
      >
        <Alert severity="success" variant="filled">
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserFormPage;
