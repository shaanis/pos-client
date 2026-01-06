// utils/generateReceipt.ts
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const THERMAL_WIDTH_PX = 380; // matches your receipt div width
const THERMAL_WIDTH_PT = 226; // 80mm ≈ 226pt (use 164pt for 58mm)

export const generateReceiptPDF = async (receiptElement: HTMLElement) => {
  if (!receiptElement) return;

  try {
    // Wait for fonts & layout
    await new Promise((r) => setTimeout(r, 300));

    const canvas = await html2canvas(receiptElement, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      foreignObjectRendering: false,

      ignoreElements: (el) =>
        el.tagName === "SVG" || el.classList.contains("lucide"),

      onclone: (doc) => {
        doc.querySelectorAll<HTMLElement>("*").forEach((el) => {
          const style = getComputedStyle(el);

          if (style.color.includes("oklch")) el.style.color = "#000";
          if (style.backgroundColor.includes("oklch"))
            el.style.backgroundColor = "#fff";
          if (style.borderColor.includes("oklch"))
            el.style.borderColor = "#000";
        });
      },
    });

    // 🔥 Calculate proportional height
    const imgHeightPt =
      (canvas.height * THERMAL_WIDTH_PT) / canvas.width;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [THERMAL_WIDTH_PT, imgHeightPt], // dynamic height
    });

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      0,
      THERMAL_WIDTH_PT,
      imgHeightPt
    );

    pdf.save(`receipt-${Date.now()}.pdf`);
  } catch (err) {
    console.error("Thermal PDF Error:", err);
  }
};
