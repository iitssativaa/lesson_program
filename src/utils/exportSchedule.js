import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { days, hours } from "../data/classrooms";

function safeFileName(name) {
  return name
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^\wğüşıöçĞÜŞİÖÇ-]/g, "");
}

function getCellText(slot) {
  if (!slot) return "";

  const code = slot.courseCode || "KOD YOK";
  const name = slot.courseName || "";
  const room = slot.classroom || "";

  return `${code}\n${name}\n${room}`;
}

function buildWeeklyMatrix(schedule) {
  const occupiedSlots = schedule.generatedSchedule?.occupiedSlots || {};

  return hours.map((hour) => {
    const row = {
      Saat: hour,
    };

    days.forEach((day) => {
      const slotKey = `${day}-${hour}`;
      const slot = occupiedSlots[slotKey];

      row[day] = getCellText(slot);
    });

    return row;
  });
}

function buildBlockList(schedule) {
  const placements = schedule.generatedSchedule?.placements || [];

  return placements.map((placement) => ({
    Gün: placement.day,
    Saat: `${placement.startHour} - ${placement.endHour}`,
    "Ders Kodu": placement.courseCode || "KOD YOK",
    "Ders Adı": placement.courseName || "",
    Derslik: `${placement.classroomGroupLabel || ""} / ${
      placement.classroom || ""
    }`,
    Blok:
      placement.totalBlocks > 1
        ? `${placement.blockIndex}/${placement.totalBlocks}`
        : "Tek blok",
  }));
}

export function exportScheduleToExcel(schedule) {
  if (!schedule.generatedSchedule) {
    alert("Önce programı otomatik oluşturmalısın.");
    return;
  }

  const weeklyMatrix = buildWeeklyMatrix(schedule);
  const blockList = buildBlockList(schedule);

  const workbook = XLSX.utils.book_new();

  const weeklySheet = XLSX.utils.json_to_sheet(weeklyMatrix);
  const blockSheet = XLSX.utils.json_to_sheet(blockList);

  weeklySheet["!cols"] = [
    { wch: 12 },
    { wch: 28 },
    { wch: 28 },
    { wch: 28 },
    { wch: 28 },
    { wch: 28 },
  ];

  blockSheet["!cols"] = [
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 30 },
    { wch: 28 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(workbook, weeklySheet, "Haftalık Program");
  XLSX.utils.book_append_sheet(workbook, blockSheet, "Ders Blokları");

  const fileName = `${safeFileName(schedule.name)}-ders-programi.xlsx`;

  XLSX.writeFile(workbook, fileName);
}

export function exportScheduleToPDF(schedule) {
  if (!schedule.generatedSchedule) {
    alert("Önce programı otomatik oluşturmalısın.");
    return;
  }

  const occupiedSlots = schedule.generatedSchedule?.occupiedSlots || {};

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(16);
  doc.text(schedule.name || "Ders Programı", 14, 15);

  doc.setFontSize(10);
  doc.text(`Olusturulma: ${schedule.generatedSchedule.generatedAt}`, 14, 22);

  const head = [["Saat", ...days]];

  const body = hours.map((hour) => {
    const row = [hour];

    days.forEach((day) => {
      const slotKey = `${day}-${hour}`;
      const slot = occupiedSlots[slotKey];

      row.push(getCellText(slot));
    });

    return row;
  });

  autoTable(doc, {
    head,
    body,
    startY: 30,
    theme: "grid",
    styles: {
      fontSize: 7,
      cellPadding: 2,
      valign: "middle",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: {
        cellWidth: 18,
        fontStyle: "bold",
      },
    },
  });

  const fileName = `${safeFileName(schedule.name)}-ders-programi.pdf`;

  doc.save(fileName);
}