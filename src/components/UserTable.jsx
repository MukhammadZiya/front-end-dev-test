import { useState, useMemo, useRef, useEffect } from "react";
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
  Menu,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
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
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import PrintIcon from "@mui/icons-material/Print";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import DomainIcon from "@mui/icons-material/Domain";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import HeightIcon from "@mui/icons-material/Height";
import SecurityIcon from "@mui/icons-material/Security";
import BackupIcon from "@mui/icons-material/Backup";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import ReportView from "./ReportView";
import { useReactToPrint } from "react-to-print";
import SettingsPanel from "./SettingsPanel";

const UserTable = () => {
  const [filter, setFilter] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [multiEditUsers, setMultiEditUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [expandedRow, setExpandedRow] = useState(null);
  const [columnFilters, setColumnFilters] = useState(() => {
    const saved = localStorage.getItem("columnFilters");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          email: "",
          phone: "",
        };
  });
  const [columnOrder, setColumnOrder] = useState(() => {
    const saved = localStorage.getItem("columnOrder");
    return saved
      ? JSON.parse(saved)
      : ["name", "email", "phone", "status", "actions"];
  });
  const [columnWidths, setColumnWidths] = useState(() => {
    const saved = localStorage.getItem("columnWidths");
    return saved
      ? JSON.parse(saved)
      : {
          name: 200,
          email: 200,
          phone: 200,
          status: 150,
          actions: 150,
        };
  });
  const [resizingColumn, setResizingColumn] = useState(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const [columnMenuField, setColumnMenuField] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const saved = localStorage.getItem("columnVisibility");
    return saved
      ? JSON.parse(saved)
      : {
          name: true,
          email: true,
          phone: true,
          status: true,
          actions: true,
        };
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortModel, setSortModel] = useState(() => {
    const saved = localStorage.getItem("sortModel");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || "guest";
  });
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const users = useSelector((state) => state.users.users);
  const formMode = useSelector((state) => state.ui.formMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const tableRef = useRef(null);
  const reportRef = useRef();
  const [printData, setPrintData] = useState(null);
  const [userSettings, setUserSettings] = useState(() => {
    const savedSettings = localStorage.getItem("userSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          columnVisibility: {},
          columnOrder: [],
          defaultFilters: {},
          defaultSort: {},
          theme: "light",
          layout: "default",
          kpiLayout: "grid",
          autoSave: true,
          persistTableState: true,
        };
  });

  const localeMap = {
    en: enUS,
    ru: ruRU,
    ko: koKR,
  };

  const locale = localeMap[i18n.language] || enUS;

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  useEffect(() => {
    localStorage.setItem("columnOrder", JSON.stringify(columnOrder));
  }, [columnOrder]);

  useEffect(() => {
    localStorage.setItem("columnWidths", JSON.stringify(columnWidths));
  }, [columnWidths]);

  useEffect(() => {
    localStorage.setItem("columnFilters", JSON.stringify(columnFilters));
  }, [columnFilters]);

  useEffect(() => {
    localStorage.setItem("sortModel", JSON.stringify(sortModel));
  }, [sortModel]);

  useEffect(() => {
    if (userSettings.persistTableState) {
      localStorage.setItem("userSettings", JSON.stringify(userSettings));
    }
  }, [userSettings]);

  const handleResetView = () => {
    // Clear localStorage
    localStorage.removeItem("columnVisibility");
    localStorage.removeItem("columnOrder");
    localStorage.removeItem("columnWidths");
    localStorage.removeItem("columnFilters");
    localStorage.removeItem("sortModel");

    // Reset state to defaults
    setColumnVisibility({
      name: true,
      email: true,
      phone: true,
      status: true,
      actions: true,
    });
    setColumnOrder(["name", "email", "phone", "status", "actions"]);
    setColumnWidths({
      name: 200,
      email: 200,
      phone: 200,
      status: 150,
      actions: 150,
    });
    setColumnFilters({
      name: "",
      email: "",
      phone: "",
    });
    setSortModel([]);
  };

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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // First apply column filters
      const matchesColumnFilters = Object.entries(columnFilters).every(
        ([field, filterValue]) =>
          !filterValue ||
          String(user[field]).toLowerCase().includes(filterValue.toLowerCase())
      );

      // Then apply global search
      const matchesGlobalSearch =
        !searchText ||
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        );

      return matchesColumnFilters && matchesGlobalSearch;
    });
  }, [users, columnFilters, searchText]);

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

  const handleColumnResizeStart = (field, event) => {
    setResizingColumn(field);
    setResizeStartX(event.clientX);
    setResizeStartWidth(columnWidths[field]);
    event.preventDefault();
  };

  const handleColumnResizeMove = (event) => {
    if (resizingColumn) {
      const diff = event.clientX - resizeStartX;
      const newWidth = Math.max(100, resizeStartWidth + diff);
      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: newWidth,
      }));
    }
  };

  const handleColumnResizeEnd = () => {
    setResizingColumn(null);
  };

  const handleColumnReorder = (sourceField, targetField) => {
    const sourceIndex = columnOrder.indexOf(sourceField);
    const targetIndex = columnOrder.indexOf(targetField);
    const newOrder = [...columnOrder];
    newOrder.splice(sourceIndex, 1);
    newOrder.splice(targetIndex, 0, sourceField);
    setColumnOrder(newOrder);
  };

  const handleColumnMenuOpen = (event, field) => {
    setColumnMenuAnchor(event.currentTarget);
    setColumnMenuField(field);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
    setColumnMenuField(null);
  };

  const handleColumnVisibilityToggle = (field) => {
    setColumnOrder((prev) => prev.filter((f) => f !== field));
    handleColumnMenuClose();
  };

  const handleColumnReset = () => {
    setColumnOrder(["name", "email", "phone", "status", "actions"]);
    setColumnWidths({
      name: 200,
      email: 200,
      phone: 200,
      status: 150,
      actions: 150,
    });
    handleColumnMenuClose();
  };

  const handleToggleColumn = (field) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleResetVisibility = () => {
    setColumnVisibility({
      name: true,
      email: true,
      phone: true,
      status: true,
      actions: true,
    });
  };

  const renderColumnHeader = (column) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        <DragIndicatorIcon
          sx={{
            cursor: "move",
            color: "text.secondary",
            mr: 1,
            "&:hover": { color: "primary.main" },
          }}
        />
        <Typography variant="subtitle2">{column.headerName}</Typography>
      </Box>
      <IconButton
        size="small"
        onClick={(e) => handleColumnMenuOpen(e, column.field)}
        sx={{ ml: 1 }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "4px",
          cursor: "col-resize",
          "&:hover": { backgroundColor: "primary.main" },
        }}
        onMouseDown={(e) => handleColumnResizeStart(column.field, e)}
      />
    </Box>
  );

  const getRowClassName = (params) => {
    const user = params.row;
    const domain = user.email.split("@")[1];

    // Check if user has no child users
    if (getChildRows(user.id).length === 0) {
      return "row-no-children";
    }

    // Check if user is a child user
    if (user.parentId) {
      return "row-child";
    }

    return "";
  };

  const renderStatusCell = (params) => {
    const user = params.row;
    const domain = user.email.split("@")[1];
    const hasChildren = getChildRows(user.id).length > 0;

    let status = "Active";
    let color = "success.main";

    if (!hasChildren) {
      status = "No Children";
      color = "warning.main";
    }

    if (user.parentId) {
      status = "Child User";
      color = "info.main";
    }

    return (
      <Box
        sx={{
          px: 1,
          py: 0.5,
          borderRadius: 1,
          color: "white",
          backgroundColor: color,
          display: "inline-block",
          fontSize: "0.75rem",
          fontWeight: 500,
        }}
      >
        {status}
      </Box>
    );
  };

  const renderDomainCell = (params) => {
    const domain = params.value.split("@")[1];
    const isCommonDomain = ["gmail.com", "yahoo.com", "hotmail.com"].includes(
      domain
    );

    return (
      <Box
        sx={{
          px: 1,
          py: 0.5,
          borderRadius: 1,
          color: isCommonDomain ? "text.secondary" : "primary.main",
          backgroundColor: isCommonDomain ? "action.hover" : "primary.light",
          display: "inline-block",
          fontSize: "0.75rem",
        }}
      >
        {domain}
      </Box>
    );
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: "name",
        headerName: t("name"),
        width: columnWidths.name,
        editable: true,
        renderCell: renderHierarchicalCell,
        renderHeader: () =>
          renderColumnHeader({ field: "name", headerName: t("name") }),
      },
      {
        field: "email",
        headerName: t("email"),
        width: columnWidths.email,
        editable: true,
        renderCell: renderDomainCell,
        renderHeader: () =>
          renderColumnHeader({ field: "email", headerName: t("email") }),
      },
      {
        field: "phone",
        headerName: t("phone"),
        width: columnWidths.phone,
        editable: true,
        renderHeader: () =>
          renderColumnHeader({ field: "phone", headerName: t("phone") }),
      },
      {
        field: "status",
        headerName: t("status"),
        width: 150,
        renderCell: renderStatusCell,
        renderHeader: () =>
          renderColumnHeader({ field: "status", headerName: t("status") }),
      },
      {
        field: "actions",
        headerName: t("actions"),
        width: columnWidths.actions,
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
        renderHeader: () =>
          renderColumnHeader({ field: "actions", headerName: t("actions") }),
      },
    ];

    return columnOrder
      .filter((field) => columnVisibility[field])
      .map((field) => baseColumns.find((col) => col.field === field));
  }, [columnOrder, columnWidths, columnVisibility, t]);

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
            columns={columns}
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
            getRowClassName={getRowClassName}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
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
              "& .row-no-children": {
                backgroundColor: "rgba(255, 193, 7, 0.08)",
                "&:hover": {
                  backgroundColor: "rgba(255, 193, 7, 0.12)",
                },
              },
              "& .row-child": {
                backgroundColor: "rgba(33, 150, 243, 0.08)",
                "&:hover": {
                  backgroundColor: "rgba(33, 150, 243, 0.12)",
                },
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

  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleExportSelected = () => {
    const selectedData = users.filter((user) => selectedIds.includes(user.id));
    const csvContent = [
      Object.keys(selectedData[0]).join(","),
      ...selectedData.map((user) => Object.values(user).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected_users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportFiltered = () => {
    const csvContent = [
      Object.keys(filteredUsers[0]).join(","),
      ...filteredUsers.map((user) => Object.values(user).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered_users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Chart data preparation
  const chartData = useMemo(() => {
    const domainStats = {};
    const statusStats = {
      Active: 0,
      "No Children": 0,
      "Child User": 0,
    };

    filteredUsers.forEach((user) => {
      const domain = user.email.split("@")[1];
      domainStats[domain] = (domainStats[domain] || 0) + 1;

      const hasChildren = getChildRows(user.id).length > 0;
      if (!hasChildren) {
        statusStats["No Children"]++;
      } else if (user.parentId) {
        statusStats["Child User"]++;
      } else {
        statusStats["Active"]++;
      }
    });

    return {
      domainData: Object.entries(domainStats).map(([name, value]) => ({
        name,
        value,
      })),
      statusData: Object.entries(statusStats).map(([name, value]) => ({
        name,
        value,
      })),
      timelineData: filteredUsers.map((user) => ({
        name: user.name,
        children: getChildRows(user.id).length,
        status: user.parentId ? "Child" : "Parent",
      })),
    };
  }, [filteredUsers]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const renderCharts = () => (
    <Box sx={{ mt: 2, p: 2 }}>
      <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            {t("domain_distribution")}
          </Typography>
          <PieChart width={400} height={300}>
            <Pie
              data={chartData.domainData}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.domainData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <RechartsTooltip />
          </PieChart>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            {t("user_status")}
          </Typography>
          <BarChart width={400} height={300} data={chartData.statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </Paper>
      </Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t("user_hierarchy")}
        </Typography>
        <LineChart width={800} height={300} data={chartData.timelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="children"
            stroke="#8884d8"
            name={t("child_users")}
          />
        </LineChart>
      </Paper>
    </Box>
  );

  // Filter columns based on user role
  const filteredColumns = useMemo(() => {
    return columns.filter((col) => {
      if (col.adminOnly && userRole !== "admin") return false;
      if (col.operatorOnly && userRole === "guest") return false;
      return true;
    });
  }, [columns, userRole]);

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const handlePrintSelected = () => {
    const selectedData = users.filter((user) => selectedIds.includes(user.id));
    setPrintData(selectedData);
    setTimeout(handlePrint, 100);
  };

  const handlePrintFiltered = () => {
    setPrintData(filteredUsers);
    setTimeout(handlePrint, 100);
  };

  const handlePrintAll = () => {
    setPrintData(users);
    setTimeout(handlePrint, 100);
  };

  // Calculate KPI metrics
  const kpiMetrics = useMemo(() => {
    const totalUsers = filteredUsers.length;
    const activeUsers = filteredUsers.filter((user) => !user.parentId).length;
    const childUsers = filteredUsers.filter((user) => user.parentId).length;
    const uniqueDomains = new Set(
      filteredUsers.map((user) => user.email.split("@")[1])
    ).size;

    // Calculate average children per user
    const parentUsers = filteredUsers.filter((user) => !user.parentId);
    const totalChildren = filteredUsers.filter((user) => user.parentId).length;
    const avgChildren =
      parentUsers.length > 0
        ? (totalChildren / parentUsers.length).toFixed(1)
        : 0;

    // Calculate max hierarchy depth
    const calculateDepth = (userId, depth = 0) => {
      const children = filteredUsers.filter((user) => user.parentId === userId);
      if (children.length === 0) return depth;
      return Math.max(
        ...children.map((child) => calculateDepth(child.id, depth + 1))
      );
    };
    const maxDepth = Math.max(
      ...parentUsers.map((user) => calculateDepth(user.id))
    );

    return {
      totalUsers,
      activeUsers,
      childUsers,
      uniqueDomains,
      avgChildren,
      maxDepth,
    };
  }, [filteredUsers]);

  // Render KPI cards
  const renderKPICards = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} md={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">{t("kpi_total_users")}</Typography>
            </Box>
            <Typography variant="h4">{kpiMetrics.totalUsers}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PersonIcon sx={{ mr: 1, color: "success.main" }} />
              <Typography variant="h6">{t("kpi_active_users")}</Typography>
            </Box>
            <Typography variant="h4">{kpiMetrics.activeUsers}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <GroupIcon sx={{ mr: 1, color: "info.main" }} />
              <Typography variant="h6">{t("kpi_child_users")}</Typography>
            </Box>
            <Typography variant="h4">{kpiMetrics.childUsers}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <DomainIcon sx={{ mr: 1, color: "warning.main" }} />
              <Typography variant="h6">{t("kpi_unique_domains")}</Typography>
            </Box>
            <Typography variant="h4">{kpiMetrics.uniqueDomains}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AccountTreeIcon sx={{ mr: 1, color: "secondary.main" }} />
              <Typography variant="h6">{t("kpi_avg_children")}</Typography>
            </Box>
            <Typography variant="h4">{kpiMetrics.avgChildren}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <HeightIcon sx={{ mr: 1, color: "error.main" }} />
              <Typography variant="h6">{t("kpi_max_depth")}</Typography>
            </Box>
            <Typography variant="h4">{kpiMetrics.maxDepth}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const handleSettingsSave = (newSettings) => {
    setUserSettings(newSettings);
    if (newSettings.persistTableState) {
      localStorage.setItem("userSettings", JSON.stringify(newSettings));
    }
  };

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    localStorage.setItem("userRole", newRole);
    setShowRoleDialog(false);
  };

  const handleExportState = () => {
    try {
      const dashboardState = {
        columnVisibility,
        columnOrder,
        columnWidths,
        columnFilters,
        sortModel,
        userSettings,
        userRole,
        selectedIds,
        expandedRows: Array.from(expandedRows),
        searchText,
        selectedTab,
      };

      const blob = new Blob([JSON.stringify(dashboardState, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dashboard-backup.json";
      a.click();
      window.URL.revokeObjectURL(url);

      setNotification({
        open: true,
        message: t("backup_success"),
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: t("backup_error"),
        severity: "error",
      });
    }
  };

  const handleImportState = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedState = JSON.parse(e.target.result);

        // Validate the imported state
        if (!importedState || typeof importedState !== "object") {
          throw new Error("Invalid backup file");
        }

        // Update all states
        setColumnVisibility(importedState.columnVisibility || {});
        setColumnOrder(importedState.columnOrder || []);
        setColumnWidths(importedState.columnWidths || {});
        setColumnFilters(importedState.columnFilters || {});
        setSortModel(importedState.sortModel || []);
        setUserSettings(importedState.userSettings || {});
        setUserRole(importedState.userRole || "guest");
        setSelectedIds(importedState.selectedIds || []);
        setExpandedRows(new Set(importedState.expandedRows || []));
        setSearchText(importedState.searchText || "");
        setSelectedTab(importedState.selectedTab || 0);

        setNotification({
          open: true,
          message: t("restore_success"),
          severity: "success",
        });
      } catch (error) {
        setNotification({
          open: true,
          message: t("restore_error"),
          severity: "error",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" component="h1">
          {t("title")}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip
            icon={<SecurityIcon />}
            label={`${t("logged_in_as")}: ${t(userRole)}`}
            color="primary"
            onClick={() => setShowRoleDialog(true)}
            sx={{ cursor: "pointer" }}
          />
          <Button
            variant="outlined"
            startIcon={<BackupIcon />}
            onClick={handleExportState}
          >
            {t("export_state")}
          </Button>
          <Button
            variant="outlined"
            startIcon={<RestoreIcon />}
            component="label"
          >
            {t("import_state")}
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleImportState}
            />
          </Button>
          <IconButton onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>
      {renderKPICards()}
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
            <Button
              variant="outlined"
              onClick={handleExportSelected}
              disabled={selectedIds.length === 0}
            >
              {t("export_selected")}
            </Button>
            <Button
              variant="outlined"
              onClick={handleExportFiltered}
              disabled={filteredUsers.length === 0}
            >
              {t("export_filtered")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setSettingsOpen(true)}
              startIcon={<SettingsIcon />}
            >
              {t("settings")}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResetView}
              startIcon={<RestartAltIcon />}
            >
              {t("reset_view")}
            </Button>
            <Button
              variant="outlined"
              onClick={handlePrintAll}
              startIcon={<PrintIcon />}
            >
              {t("print_all")}
            </Button>
            <Button
              variant="outlined"
              onClick={handlePrintSelected}
              disabled={selectedIds.length === 0}
              startIcon={<PrintIcon />}
            >
              {t("print_selected")}
            </Button>
            <Button
              variant="outlined"
              onClick={handlePrintFiltered}
              disabled={filteredUsers.length === 0}
              startIcon={<PrintIcon />}
            >
              {t("print_filtered")}
            </Button>
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder={t("search_placeholder")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab
              icon={<BarChartIcon />}
              label={t("table_view")}
              iconPosition="start"
            />
            <Tab
              icon={<PieChartIcon />}
              label={t("charts")}
              iconPosition="start"
            />
          </Tabs>
          {selectedTab === 0 ? (
            <Box
              ref={tableRef}
              onMouseMove={handleColumnResizeMove}
              onMouseUp={handleColumnResizeEnd}
              onMouseLeave={handleColumnResizeEnd}
            >
              <DataGrid
                rows={filteredUsers}
                columns={filteredColumns}
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
                getRowClassName={getRowClassName}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
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
                  "& .row-no-children": {
                    backgroundColor: "rgba(255, 193, 7, 0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 193, 7, 0.12)",
                    },
                  },
                  "& .row-child": {
                    backgroundColor: "rgba(33, 150, 243, 0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(33, 150, 243, 0.12)",
                    },
                  },
                }}
              />
            </Box>
          ) : (
            renderCharts()
          )}
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
        <Menu
          anchorEl={columnMenuAnchor}
          open={Boolean(columnMenuAnchor)}
          onClose={handleColumnMenuClose}
        >
          <MenuItem
            onClick={() => handleColumnVisibilityToggle(columnMenuField)}
          >
            {t("hide_column")}
          </MenuItem>
          <MenuItem onClick={handleColumnReset}>{t("reset_columns")}</MenuItem>
        </Menu>
      </Box>

      {/* Column Visibility Settings Dialog */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={userSettings}
        onSave={handleSettingsSave}
      />
      {printData && (
        <Box sx={{ display: "none" }}>
          <ReportView ref={reportRef} data={printData} columns={columns} />
        </Box>
      )}

      {/* Role Selection Dialog */}
      <Dialog open={showRoleDialog} onClose={() => setShowRoleDialog(false)}>
        <DialogTitle>{t("change_role")}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Button
              fullWidth
              variant={userRole === "guest" ? "contained" : "outlined"}
              onClick={() => handleRoleChange("guest")}
              sx={{ mb: 1 }}
            >
              {t("guest")}
            </Button>
            <Button
              fullWidth
              variant={userRole === "operator" ? "contained" : "outlined"}
              onClick={() => handleRoleChange("operator")}
              sx={{ mb: 1 }}
            >
              {t("operator")}
            </Button>
            <Button
              fullWidth
              variant={userRole === "admin" ? "contained" : "outlined"}
              onClick={() => handleRoleChange("admin")}
            >
              {t("admin")}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRoleDialog(false)}>{t("close")}</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
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
    </Box>
  );
};

export default UserTable;
