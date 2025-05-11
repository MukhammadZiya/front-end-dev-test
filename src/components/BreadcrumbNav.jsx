import React from "react";
import { Breadcrumbs, Typography, Link } from "@mui/material";
import { useTranslation } from "react-i18next";

const breadcrumbMap = {
  Users: ["MES", "Init", "Users"],
  Machines: ["MES", "Equip", "Machines"],
  Dashboard: ["Home", "Dashboard"],
};

const BreadcrumbNav = ({ page }) => {
  const { t } = useTranslation();
  const path = breadcrumbMap[page] || ["Home"];

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ px: 3, py: 1 }}>
      {path.slice(0, -1).map((item, index) => (
        <Link key={index} underline="hover" color="inherit" href="#">
          {t(item.toLowerCase())}
        </Link>
      ))}
      <Typography color="text.primary">
        {t(path[path.length - 1].toLowerCase())}
      </Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;
