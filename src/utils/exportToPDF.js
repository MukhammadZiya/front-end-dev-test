import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";

export const exportUsersToPDF = (users, t) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text(t("users"), 14, 20);

  // Prepare table data
  const tableData = users.map((user) => [user.name, user.email, user.phone]);

  // Generate table
  doc.autoTable({
    startY: 30,
    head: [[t("name"), t("email"), t("phone")]],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 30 },
  });

  // Save the PDF
  doc.save("users.pdf");
};
