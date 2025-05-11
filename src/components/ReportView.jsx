import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

const ReportView = React.forwardRef(({ data, columns }, ref) => {
  const { t } = useTranslation();

  // Filter out action columns and non-essential columns for printing
  const reportColumns = columns.filter(
    (col) => !col.field.includes("actions") && !col.adminOnly
  );

  return (
    <Box
      ref={ref}
      sx={{
        p: 3,
        background: "#fff",
        color: "#000",
        "@media print": {
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderColor: "#ddd",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderColor: "#ddd",
            backgroundColor: "#f5f5f5",
          },
        },
      }}
    >
      <Typography variant="h5" gutterBottom>
        {t("user_report")} - {new Date().toLocaleDateString()}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t("report_summary")}
        </Typography>
        <Typography variant="body2">
          {t("total_users")}: {data.length}
        </Typography>
        <Typography variant="body2">
          {t("top_level")}: {data.filter((user) => !user.parentId).length}
        </Typography>
        <Typography variant="body2">
          {t("child_users")}: {data.filter((user) => user.parentId).length}
        </Typography>
        <Typography variant="body2">
          {t("unique_domains")}:{" "}
          {new Set(data.map((user) => user.email.split("@")[1])).size}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <DataGrid
        rows={data}
        columns={reportColumns}
        autoHeight
        hideFooter
        disableColumnMenu
        disableSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell": {
            borderColor: "#ddd",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderColor: "#ddd",
            backgroundColor: "#f5f5f5",
          },
        }}
      />
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Typography variant="caption" color="text.secondary">
          {t("generated_at")}: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
});

export default ReportView;
