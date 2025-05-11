import React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SettingsIcon from "@mui/icons-material/Settings";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useTranslation } from "react-i18next";
import { exportUsersToExcel } from "../utils/exportToExcel";
import { exportUsersToPDF } from "../utils/exportToPDF";

const ActionToolbar = ({
  onAdd,
  onEdit,
  onDelete,
  onExport,
  canEdit,
  canDelete,
  users,
  onSettingsClick,
  onFileUpload,
}) => {
  const { t } = useTranslation();

  const handleSettings = () => {
    onSettingsClick();
  };

  const handleExcelExport = () => {
    exportUsersToExcel(users);
  };

  const handlePDFExport = () => {
    exportUsersToPDF(users, t);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, p: 2, borderBottom: "1px solid #ccc" }}>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
        id="upload-file"
        onChange={handleFileUpload}
      />
      <Tooltip title={t("register")}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={onAdd}>
          {t("register")}
        </Button>
      </Tooltip>
      <Tooltip title={t("edit")}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={onEdit}
          disabled={!canEdit}
        >
          {t("edit")}
        </Button>
      </Tooltip>
      <Tooltip title={t("delete")}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
          disabled={!canDelete}
        >
          {t("delete")}
        </Button>
      </Tooltip>
      <Tooltip title={t("export_excel")}>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExcelExport}
        >
          {t("excel")}
        </Button>
      </Tooltip>
      <Tooltip title={t("export_pdf")}>
        <Button
          variant="outlined"
          startIcon={<PictureAsPdfIcon />}
          onClick={handlePDFExport}
        >
          PDF
        </Button>
      </Tooltip>
      <Tooltip title={t("import")}>
        <label htmlFor="upload-file">
          <Button
            component="span"
            variant="outlined"
            startIcon={<UploadFileIcon />}
          >
            {t("import")}
          </Button>
        </label>
      </Tooltip>
      <Tooltip title={t("settings")}>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={handleSettings}
        >
          {t("settings")}
        </Button>
      </Tooltip>
    </Box>
  );
};

export default ActionToolbar;
