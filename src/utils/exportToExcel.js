import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportUsersToExcel = (users) => {
  // Format the data for Excel
  const formattedUsers = users.map((user) => ({
    [t("name")]: user.name,
    [t("email")]: user.email,
    [t("phone")]: user.phone,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedUsers);  //yangi ro'yxatni excelga yuklash
  const workbook = XLSX.utils.book_new(); //yangi exeel fayl qilish
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users"); //ro'yxatni faylga yuklash

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }); //excel faylni yaratish
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" }); //blob faylni yaratish

  // Save the file
  saveAs(blob, "users.xlsx");
};
