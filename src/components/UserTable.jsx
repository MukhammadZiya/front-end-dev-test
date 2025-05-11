import { useState, useMemo } from "react";
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
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { DataGrid, enUS, ruRU, koKR } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setFormMode } from "../store/uiSlice";
import { deleteUser, updateUser } from "../store/userSlice";
import UserFormModal from "./UserFormModal";
import ActionToolbar from "./ActionToolbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const UserTable = () => {
  const [filter, setFilter] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [multiEditUsers, setMultiEditUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [expandedRow, setExpandedRow] = useState(null);
  const [columnFilters, setColumnFilters] = useState({
    name: "",
    email: "",
    phone: "",
  });
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

  const handleColumnFilterChange = (field, value) => {
    setColumnFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditCellChangeCommitted = ({ id, field, value }) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      dispatch(updateUser({ ...user, [field]: value }));
    }
  };

  const handleViewDetails = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    if (formMode === "page") {
      navigate("/form", { state: user });
    } else if (formMode === "modal") {
      setEditingUser(user);
      setIsModalOpen(true);
    } else {
      setEditingUser(user);
    }
  };

  const handleDelete = (id) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      dispatch(deleteUser(id));
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getChildRows = (parentId) => {
    return users.filter((user) => user.parentId === parentId);
  };

  const renderHierarchicalCell = (params) => {
    const { row } = params;
    const hasChildren = getChildRows(row.id).length > 0;
    const isExpanded = expandedRows.has(row.id);
    const indent = row.parentId ? 2 : 0;

    return (
      <Box sx={{ display: "flex", alignItems: "center", pl: indent }}>
        {hasChildren && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleRowExpansion(row.id);
            }}
            sx={{ mr: 1 }}
          >
            {isExpanded ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </IconButton>
        )}
        {!hasChildren && <Box sx={{ width: 32 }} />}
        {row.name}
      </Box>
    );
  };

  const renderDetailPanel = (user) => (
    <Box sx={{ p: 2, backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
      <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t("hierarchy")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user.parentId ? (
              <>
                <Chip
                  label={
                    users.find((u) => u.id === user.parentId)?.name || "Unknown"
                  }
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2">→</Typography>
              </>
            ) : (
              <Chip
                label={t("top_level")}
                size="small"
                color="success"
                variant="outlined"
              />
            )}
            <Chip label={user.name} size="small" color="primary" />
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t("child_users")}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {users
              .filter((u) => u.parentId === user.id)
              .map((child) => (
                <Chip
                  key={child.id}
                  label={child.name}
                  size="small"
                  variant="outlined"
                />
              ))}
            {users.filter((u) => u.parentId === user.id).length === 0 && (
              <Typography variant="body2" color="text.secondary">
                {t("no_child_users")}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", gap: 4 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t("contact_info")}
          </Typography>
          <Typography variant="body2">
            {t("email")}: {user.email}
          </Typography>
          <Typography variant="body2">
            {t("phone")}: {user.phone}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t("domain_info")}
          </Typography>
          <Typography variant="body2">
            {t("domain")}: {user.email.split("@")[1]}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const filteredUsers = users.filter((user) =>
    Object.entries(columnFilters).every(
      ([field, filterValue]) =>
        !filterValue ||
        String(user[field]).toLowerCase().includes(filterValue.toLowerCase())
    )
  );

  const summaryStats = useMemo(() => {
    const stats = {
      totalUsers: filteredUsers.length,
      topLevelUsers: filteredUsers.filter((user) => !user.parentId).length,
      childUsers: filteredUsers.filter((user) => user.parentId).length,
      uniqueDomains: new Set(
        filteredUsers.map((user) => user.email.split("@")[1])
      ).size,
    };
    return stats;
  }, [filteredUsers]);

  const renderSummaryFooter = () => (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid rgba(224, 224, 224, 1)",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {t("summary")}:
      </Typography>
      <Box sx={{ display: "flex", gap: 3 }}>
        <Typography variant="body2">
          {t("total_users")}: {summaryStats.totalUsers}
        </Typography>
        <Typography variant="body2">
          {t("top_level")}: {summaryStats.topLevelUsers}
        </Typography>
        <Typography variant="body2">
          {t("child_users")}: {summaryStats.childUsers}
        </Typography>
        <Typography variant="body2">
          {t("unique_domains")}: {summaryStats.uniqueDomains}
        </Typography>
      </Box>
    </Box>
  );

  const columns = [
    {
      field: "name",
      headerName: t("name"),
      flex: 1,
      editable: true,
      renderCell: renderHierarchicalCell,
      renderHeader: () => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle2">{t("name")}</Typography>
          <TextField
            variant="standard"
            value={columnFilters.name}
            onChange={(e) => handleColumnFilterChange("name", e.target.value)}
            placeholder={t("search")}
            fullWidth
            size="small"
            InputProps={{
              sx: { fontSize: "0.875rem" },
            }}
          />
        </Box>
      ),
    },
    {
      field: "email",
      headerName: t("email"),
      flex: 1,
      editable: true,
      renderHeader: () => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle2">{t("email")}</Typography>
          <TextField
            variant="standard"
            value={columnFilters.email}
            onChange={(e) => handleColumnFilterChange("email", e.target.value)}
            placeholder={t("search")}
            fullWidth
            size="small"
            InputProps={{
              sx: { fontSize: "0.875rem" },
            }}
          />
        </Box>
      ),
    },
    {
      field: "phone",
      headerName: t("phone"),
      flex: 1,
      editable: true,
      renderHeader: () => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle2">{t("phone")}</Typography>
          <TextField
            variant="standard"
            value={columnFilters.phone}
            onChange={(e) => handleColumnFilterChange("phone", e.target.value)}
            placeholder={t("search")}
            fullWidth
            size="small"
            InputProps={{
              sx: { fontSize: "0.875rem" },
            }}
          />
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: t("actions"),
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
          <Tooltip title={t("view_details")}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(params.row);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("edit")}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(params.row);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("delete")}>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(params.row.id);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(211, 47, 47, 0.08)",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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

  const askDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleRowClick = (params) => {
    setSelectedIds([params.row.id]);
  };

  const renderPinnedColumns = () => {
    const nameColumn = columns.find((col) => col.field === "name");
    const actionsColumn = columns.find((col) => col.field === "actions");

    return (
      <Box sx={{ display: "flex", position: "relative" }}>
        {/* Left pinned column */}
        <Paper
          elevation={0}
          sx={{
            position: "sticky",
            left: 0,
            zIndex: 2,
            backgroundColor: "background.paper",
            borderRight: "1px solid rgba(224, 224, 224, 1)",
            width: nameColumn.width || 200,
          }}
        >
          <Box
            sx={{
              p: 1,
              borderBottom: "2px solid rgba(224, 224, 224, 1)",
              backgroundColor: "rgba(0, 0, 0, 0.02)",
            }}
          >
            <Typography variant="subtitle2">{nameColumn.headerName}</Typography>
            <TextField
              variant="standard"
              value={columnFilters.name}
              onChange={(e) => handleColumnFilterChange("name", e.target.value)}
              placeholder={t("search")}
              fullWidth
              size="small"
              InputProps={{
                sx: { fontSize: "0.875rem" },
              }}
            />
          </Box>
          {filteredUsers.map((user) => (
            <Box
              key={user.id}
              sx={{
                p: 1,
                borderBottom: "1px solid rgba(224, 224, 224, 1)",
                backgroundColor: selectedIds.includes(user.id)
                  ? "rgba(25, 118, 210, 0.08)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              {renderHierarchicalCell({ row: user })}
            </Box>
          ))}
        </Paper>

        {/* Main scrollable content */}
        <Box sx={{ flex: 1, overflowX: "auto" }}>
          <DataGrid
            localeText={locale.components.MuiDataGrid.defaultProps.localeText}
            rows={filteredUsers}
            columns={columns.filter(
              (col) => col.field !== "name" && col.field !== "actions"
            )}
            pageSize={5}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) =>
              setSelectedIds(newSelection)
            }
            rowSelectionModel={selectedIds}
            autoHeight
            disableColumnMenu
            getRowId={(row) => row.id}
            onRowClick={(params) => {
              handleRowClick(params);
              setExpandedRow(
                expandedRow === params.row.id ? null : params.row.id
              );
            }}
            onCellEditCommit={handleEditCellChangeCommitted}
            sx={{
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.12)",
                },
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                padding: "8px",
              },
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: "2px solid rgba(224, 224, 224, 1)",
              },
              "& .MuiDataGrid-cell": {
                padding: "8px",
              },
            }}
          />
        </Box>

        {/* Right pinned column */}
        <Paper
          elevation={0}
          sx={{
            position: "sticky",
            right: 0,
            zIndex: 2,
            backgroundColor: "background.paper",
            borderLeft: "1px solid rgba(224, 224, 224, 1)",
            width: actionsColumn.width || 150,
          }}
        >
          <Box
            sx={{
              p: 1,
              borderBottom: "2px solid rgba(224, 224, 224, 1)",
              backgroundColor: "rgba(0, 0, 0, 0.02)",
            }}
          >
            <Typography variant="subtitle2">
              {actionsColumn.headerName}
            </Typography>
          </Box>
          {filteredUsers.map((user) => (
            <Box
              key={user.id}
              sx={{
                p: 1,
                borderBottom: "1px solid rgba(224, 224, 224, 1)",
                backgroundColor: selectedIds.includes(user.id)
                  ? "rgba(25, 118, 210, 0.08)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              {actionsColumn.renderCell({ row: user })}
            </Box>
          ))}
        </Paper>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ActionToolbar
        onAdd={handleAddUser}
        onEdit={() =>
          selectedIds.length === 1 &&
          handleEdit(users.find((u) => u.id === selectedIds[0]))
        }
        onDelete={() => selectedIds.length === 1 && askDelete(selectedIds[0])}
        onExport={handleExport}
        canEdit={selectedIds.length === 1}
        canDelete={selectedIds.length === 1}
        users={filteredUsers}
      />
      <Breadcrumbs aria-label="breadcrumb" sx={{ px: 3, py: 1 }}>
        <Link underline="hover" color="inherit" href="#">
          MES
        </Link>
        <Link underline="hover" color="inherit" href="#">
          {t("master")}
        </Link>
        <Typography color="text.primary">{t("users")}</Typography>
      </Breadcrumbs>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
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
          {renderPinnedColumns()}
          {expandedRow &&
            renderDetailPanel(users.find((u) => u.id === expandedRow))}
          {renderSummaryFooter()}
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
        <Dialog
          open={!!confirmDeleteId}
          onClose={() => setConfirmDeleteId(null)}
        >
          <DialogTitle>{t("confirm_delete")}</DialogTitle>
          <DialogContent>{t("confirm_delete_message")}</DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteId(null)}>
              {t("cancel")}
            </Button>
            <Button
              color="error"
              onClick={() => {
                handleDelete(confirmDeleteId);
                setConfirmDeleteId(null);
              }}
            >
              {t("delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UserTable;
