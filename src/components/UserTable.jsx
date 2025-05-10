import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { DataGrid, enUS, ruRU, koKR } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setFormMode } from "../store/uiSlice";
import { deleteUser } from "../store/userSlice";
import UserFormModal from "./UserFormModal";

const UserTable = () => {
  const [filter, setFilter] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [multiEditUsers, setMultiEditUsers] = useState([]);
  const users = useSelector((state) => state.users.users);
  const formMode = useSelector((state) => state.ui.formMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const localeMap = {
    en: enUS,
    ru: ruRU,
    ko: koKR,
  };

  const locale = localeMap[i18n.language] || enUS;

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  const columns = [
    ...(users.length > 0
      ? Object.keys(users[0]).map((field) => ({
          field,
          headerName: t(field),
          flex: 1,
        }))
      : []),
    {
      field: "actions",
      headerName: t("actions"),
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" onClick={() => handleEditUser(params.row)}>
            {t("edit")}
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => askDelete(params.row.id)}
          >
            {t("delete")}
          </Button>
        </Box>
      ),
    },
  ];

  const handleExport = () => {
    const csvContent = [
      Object.keys(users[0]).join(","),
      ...users.map((user) => Object.values(user).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddUser = () => {
    if (formMode === "page") {
      navigate("/form");
    } else if (formMode === "modal") {
      setIsModalOpen(true);
    } else {
      setEditingUser({});
    }
  };

  const handleEditUser = (user) => {
    if (formMode === "page") {
      navigate("/form", { state: user });
    } else if (formMode === "modal") {
      setEditingUser(user);
      setIsModalOpen(true);
    } else {
      setEditingUser(user);
    }
  };

  const askDelete = (id) => {
    setConfirmDeleteId(id);
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label={t("filter")}
            variant="outlined"
            size="small"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="form-mode-label">{t("form_mode")}</InputLabel>
            <Select
              labelId="form-mode-label"
              value={formMode}
              label={t("form_mode")}
              onChange={(e) => dispatch(setFormMode(e.target.value))}
            >
              <MenuItem value="modal">{t("modal")}</MenuItem>
              <MenuItem value="split">{t("split")}</MenuItem>
              <MenuItem value="page">{t("page")}</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddUser}>
            {t("add_user")}
          </Button>
          <Button
            variant="outlined"
            disabled={selectedIds.length < 2}
            onClick={() => {
              const selectedUsers = users.filter((u) =>
                selectedIds.includes(u.id)
              );
              setMultiEditUsers(selectedUsers);
              setIsModalOpen(true);
            }}
          >
            {t("multi_edit")}
          </Button>
          <Button variant="contained" onClick={handleExport}>
            {t("export_csv")}
          </Button>
        </Box>
        <DataGrid
          localeText={locale.components.MuiDataGrid.defaultProps.localeText}
          rows={filteredUsers}
          columns={columns}
          pageSize={5}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) =>
            setSelectedIds(newSelection)
          }
          rowSelectionModel={selectedIds}
          autoHeight
        />
      </Box>
      {formMode === "split" && editingUser !== null && (
        <Box sx={{ width: 400 }}>
          <UserFormModal
            open={true}
            setOpen={() => setEditingUser(null)}
            user={editingUser}
            isInline
          />
        </Box>
      )}
      {formMode === "modal" && (
        <UserFormModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          user={editingUser}
          multiEditUsers={multiEditUsers}
        />
      )}
      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>{t("confirm_delete")}</DialogTitle>
        <DialogContent>{t("confirm_delete_message")}</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>
            {t("cancel")}
          </Button>
          <Button
            color="error"
            onClick={() => {
              dispatch(deleteUser(confirmDeleteId));
              setConfirmDeleteId(null);
            }}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserTable;
