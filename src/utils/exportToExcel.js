import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportUsersToExcel = (users) => {
  // Format the data for Excel
  const formattedUsers = users.map((user) => ({
    [t("name")]: user.name,
    [t("email")]: user.email,
    [t("phone")]: user.phone,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedUsers);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Save the file
  saveAs(blob, "users.xlsx");
};
