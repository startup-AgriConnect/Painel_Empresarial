import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ==================== TIPOS ====================
export interface ExportMetadata {
  title: string;
  category?: string;
  refNumber?: string;
  province?: string;
  municipality?: string;
  commune?: string;
  additionalInfo?: Record<string, string>;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

// ==================== FUNÇÕES DE EXPORTAÇÃO ====================

/**
 * Gera cabeçalho oficial do Governo de Angola
 */
const generateOfficialHeader = (metadata: ExportMetadata): string => {
  const currentDate = new Date().toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const refNumber =
    metadata.refNumber ||
    `REF: AGRI-CONNECT/${metadata.category?.toUpperCase() || "GERAL"}/${new Date().getFullYear()}/${Math.floor(
      Math.random() * 9999,
    )
      .toString()
      .padStart(4, "0")}`;

  let header = `
═══════════════════════════════════════════════════════════════════════
                     REPÚBLICA DE ANGOLA
            MINISTÉRIO DA AGRICULTURA E PESCAS
                   AGRI-CONNECT PLATFORM
═══════════════════════════════════════════════════════════════════════

${refNumber}
Data: ${currentDate}

────────────────────────────────────────────────────────────────────

                        ${metadata.title.toUpperCase()}
${metadata.category ? `                   Categoria: ${metadata.category}` : ""}

────────────────────────────────────────────────────────────────────
`;

  if (metadata.province) {
    header += `\nÂMBITO TERRITORIAL:\n`;
    header += `  • Província: ${metadata.province.toUpperCase()}\n`;
    if (metadata.municipality && metadata.municipality !== "todos") {
      header += `  • Município: ${metadata.municipality.charAt(0).toUpperCase() + metadata.municipality.slice(1)}\n`;
    }
    if (metadata.commune && metadata.commune !== "todas") {
      header += `  • Comuna: ${metadata.commune.charAt(0).toUpperCase() + metadata.commune.slice(1)}\n`;
    }
    header += "\n";
  }

  return header;
};

/**
 * Gera rodapé oficial
 */
const generateOfficialFooter = (): string => {
  const currentDate = new Date().toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `
────────────────────────────────────────────────────────────────────

                        VALIDAÇÕES E APROVAÇÕES

Este relatório foi gerado pela plataforma AGRI-CONNECT, utilizando
tecnologia avançada de análise de dados, com informações actualizadas até
${currentDate}.

_______________________________
Analista Responsável
AGRI-CONNECT Platform

_______________________________
Coordenador Técnico
Ministério da Agricultura

────────────────────────────────────────────────────────────────────
          © ${new Date().getFullYear()} AGRI-CONNECT - República de Angola
             Todos os direitos reservados
────────────────────────────────────────────────────────────────────
`;
};

// ==================== EXPORTAÇÃO PDF ====================
export const exportToPDF = (
  metadata: ExportMetadata,
  content: string,
  tables?: TableData[],
): void => {
  const doc = new jsPDF();
  let yPosition = 20;

  const currentDate = new Date().toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const refNumber =
    metadata.refNumber ||
    `REF: AGRI-CONNECT/${metadata.category?.toUpperCase() || "GERAL"}/${new Date().getFullYear()}/${Math.floor(
      Math.random() * 9999,
    )
      .toString()
      .padStart(4, "0")}`;

  // Cabeçalho oficial
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("REPÚBLICA DE ANGOLA", 105, yPosition, { align: "center" });
  yPosition += 6;
  doc.text("MINISTÉRIO DA AGRICULTURA E PESCAS", 105, yPosition, {
    align: "center",
  });
  yPosition += 6;
  doc.text("AGRI-CONNECT PLATFORM", 105, yPosition, { align: "center" });
  yPosition += 10;

  // Linha divisória
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, 195, yPosition);
  yPosition += 8;

  // Referência e Data
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(refNumber, 15, yPosition);
  yPosition += 5;
  doc.text(`Data: ${currentDate}`, 15, yPosition);
  yPosition += 10;

  // Título
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(metadata.title.toUpperCase(), 105, yPosition, { align: "center" });
  yPosition += 7;

  if (metadata.category) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Categoria: ${metadata.category}`, 105, yPosition, {
      align: "center",
    });
    yPosition += 10;
  }

  // Âmbito territorial
  if (metadata.province) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ÂMBITO TERRITORIAL:", 15, yPosition);
    yPosition += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`• Província: ${metadata.province.toUpperCase()}`, 20, yPosition);
    yPosition += 5;

    if (metadata.municipality && metadata.municipality !== "todos") {
      doc.text(
        `• Município: ${metadata.municipality.charAt(0).toUpperCase() + metadata.municipality.slice(1)}`,
        20,
        yPosition,
      );
      yPosition += 5;
    }

    if (metadata.commune && metadata.commune !== "todas") {
      doc.text(
        `• Comuna: ${metadata.commune.charAt(0).toUpperCase() + metadata.commune.slice(1)}`,
        20,
        yPosition,
      );
      yPosition += 5;
    }
    yPosition += 8;
  }

  // Conteúdo principal
  if (content) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CONTEÚDO", 15, yPosition);
    yPosition += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const contentLines = doc.splitTextToSize(content, 180);
    doc.text(contentLines, 15, yPosition);
    yPosition += contentLines.length * 5 + 10;
  }

  // Tabelas
  if (tables && tables.length > 0) {
    tables.forEach((table, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`TABELA ${index + 1}`, 15, yPosition);
      yPosition += 7;

      autoTable(doc, {
        startY: yPosition,
        head: [table.headers],
        body: table.rows,
        theme: "grid",
        headStyles: {
          fillColor: [34, 139, 34],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: { fontSize: 9, cellPadding: 4 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    });
  }

  // Informações adicionais
  if (metadata.additionalInfo) {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMAÇÕES ADICIONAIS", 15, yPosition);
    yPosition += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    Object.entries(metadata.additionalInfo).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 15, yPosition);
      yPosition += 5;
    });
    yPosition += 10;
  }

  // Nova página para assinaturas
  if (yPosition > 240) {
    doc.addPage();
    yPosition = 20;
  }

  // Validações
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("VALIDAÇÕES E APROVAÇÕES", 15, yPosition);
  yPosition += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const disclaimer = doc.splitTextToSize(
    `Este relatório foi gerado pela plataforma AGRI-CONNECT, utilizando tecnologia avançada de análise de dados, com informações actualizadas até ${currentDate}.`,
    180,
  );
  doc.text(disclaimer, 15, yPosition);
  yPosition += disclaimer.length * 5 + 15;

  doc.text("_______________________________", 15, yPosition);
  yPosition += 5;
  doc.text("Analista Responsável", 15, yPosition);
  yPosition += 4;
  doc.text("AGRI-CONNECT Platform", 15, yPosition);
  yPosition += 12;

  doc.text("_______________________________", 15, yPosition);
  yPosition += 5;
  doc.text("Coordenador Técnico", 15, yPosition);
  yPosition += 4;
  doc.text("Ministério da Agricultura", 15, yPosition);

  // Footer em todas as páginas
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text(
      `© ${new Date().getFullYear()} AGRI-CONNECT - República de Angola`,
      105,
      285,
      { align: "center" },
    );
    doc.text(`Página ${i} de ${pageCount}`, 195, 285, { align: "right" });
  }

  const fileName = `${metadata.title.replace(/\s+/g, "_")}_${new Date().getTime()}`;
  doc.save(`${fileName}.pdf`);
};

// ==================== EXPORTAÇÃO EXCEL ====================
export const exportToExcel = (
  metadata: ExportMetadata,
  content: string,
  tables?: TableData[],
): void => {
  const workbook = XLSX.utils.book_new();

  const currentDate = new Date().toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const refNumber =
    metadata.refNumber ||
    `REF: AGRI-CONNECT/${metadata.category?.toUpperCase() || "GERAL"}/${new Date().getFullYear()}/${Math.floor(
      Math.random() * 9999,
    )
      .toString()
      .padStart(4, "0")}`;

  // Sheet 1: Sumário
  const summaryData = [
    ["REPÚBLICA DE ANGOLA"],
    ["MINISTÉRIO DA AGRICULTURA E PESCAS"],
    ["AGRI-CONNECT PLATFORM"],
    [],
    [refNumber],
    [`Data: ${currentDate}`],
    [],
    [metadata.title.toUpperCase()],
  ];

  if (metadata.category) {
    summaryData.push([`Categoria: ${metadata.category}`]);
  }

  summaryData.push([]);

  if (metadata.province) {
    summaryData.push(["ÂMBITO TERRITORIAL:"]);
    summaryData.push([`Província: ${metadata.province.toUpperCase()}`]);

    if (metadata.municipality && metadata.municipality !== "todos") {
      summaryData.push([
        `Município: ${metadata.municipality.charAt(0).toUpperCase() + metadata.municipality.slice(1)}`,
      ]);
    }

    if (metadata.commune && metadata.commune !== "todas") {
      summaryData.push([
        `Comuna: ${metadata.commune.charAt(0).toUpperCase() + metadata.commune.slice(1)}`,
      ]);
    }

    summaryData.push([]);
  }

  if (content) {
    summaryData.push(["CONTEÚDO"], [content]);
  }

  if (metadata.additionalInfo) {
    summaryData.push([], ["INFORMAÇÕES ADICIONAIS"]);
    Object.entries(metadata.additionalInfo).forEach(([key, value]) => {
      summaryData.push([key, value]);
    });
  }

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 100 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Sumário");

  // Sheets adicionais para tabelas
  if (tables && tables.length > 0) {
    tables.forEach((table, index) => {
      const tableData = [table.headers, ...table.rows];
      const tableSheet = XLSX.utils.aoa_to_sheet(tableData);

      // Auto-width
      const colWidths = table.headers.map((_, colIndex) => {
        const maxLength = Math.max(
          table.headers[colIndex]?.toString().length || 10,
          ...table.rows.map((row) => row[colIndex]?.toString().length || 0),
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      tableSheet["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(workbook, tableSheet, `Tabela ${index + 1}`);
    });
  }

  const fileName = `${metadata.title.replace(/\s+/g, "_")}_${new Date().getTime()}`;
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// ==================== EXPORTAÇÃO TXT/WORD ====================
export const exportToText = (
  metadata: ExportMetadata,
  content: string,
  tables?: TableData[],
): void => {
  let document = generateOfficialHeader(metadata);

  if (content) {
    document += `\n═══════════════════════════════════════════════════════════════════════\n`;
    document += `                           CONTEÚDO\n`;
    document += `═══════════════════════════════════════════════════════════════════════\n\n`;
    document += content + "\n";
  }

  // Tabelas em formato texto
  if (tables && tables.length > 0) {
    tables.forEach((table, index) => {
      document += `\n═══════════════════════════════════════════════════════════════════════\n`;
      document += `                         TABELA ${index + 1}\n`;
      document += `═══════════════════════════════════════════════════════════════════════\n\n`;

      // Cabeçalho
      document += table.headers.join(" | ") + "\n";
      document += "-".repeat(100) + "\n";

      // Linhas
      table.rows.forEach((row) => {
        document += row.join(" | ") + "\n";
      });

      document += "\n";
    });
  }

  // Informações adicionais
  if (metadata.additionalInfo) {
    document += `\n═══════════════════════════════════════════════════════════════════════\n`;
    document += `                   INFORMAÇÕES ADICIONAIS\n`;
    document += `═══════════════════════════════════════════════════════════════════════\n\n`;

    Object.entries(metadata.additionalInfo).forEach(([key, value]) => {
      document += `${key}: ${value}\n`;
    });
  }

  document += generateOfficialFooter();

  const blob = new Blob([document], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement("a");
  a.href = url;
  const fileName = `${metadata.title.replace(/\s+/g, "_")}_${new Date().getTime()}`;
  a.download = `${fileName}.txt`;
  window.document.body.appendChild(a);
  a.click();
  window.document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ==================== FUNÇÃO UNIVERSAL ====================
export const exportReport = (
  format: "pdf" | "excel" | "word",
  metadata: ExportMetadata,
  content: string,
  tables?: TableData[],
): void => {
  try {
    switch (format) {
      case "pdf":
        exportToPDF(metadata, content, tables);
        break;
      case "excel":
        exportToExcel(metadata, content, tables);
        break;
      case "word":
        exportToText(metadata, content, tables);
        break;
    }

    const fileExtension =
      format === "pdf" ? "PDF" : format === "excel" ? "XLSX" : "TXT";
    alert(
      `✅ Relatório exportado com sucesso!\n\n📄 Arquivo: ${metadata.title.replace(/\s+/g, "_")}.${fileExtension.toLowerCase()}\n📋 Formato: Padrão Oficial do Governo de Angola\n📊 Conteúdo completo com formatação profissional`,
    );
  } catch (error) {
    console.error("Erro ao exportar:", error);
    alert(
      `❌ Erro ao exportar relatório.\n\nPor favor, tente novamente ou contacte o suporte técnico.`,
    );
  }
};
