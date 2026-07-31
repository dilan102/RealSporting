import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const headers = [
  "id",
  "dataConsent",
  "imageConsent",
  "riskConsent",
  "statutoryDeclaration",
  "memberName",
  "documentType",
  "documentNumber",
  "birthDate",
  "address",
  "phone",
  "eps",
  "shoeSize",
  "uniformSize",
  "populationType",
  "representativeName",
  "representativeId",
  "representativePhone",
  "correo",
  "mensaje",
  "createdAt",
];

function escapeCsv(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  const text = String(value);
  if (text.includes('"') || text.includes(",") || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export async function GET() {
  const records = await prisma.inscripcion.findMany({
    orderBy: { createdAt: "desc" },
  });

  const title = "Inscripciones Club Deportivo Real Sporting 2026";
  const headerRow = headers.map(escapeCsv).join(",");

  const bodyRows = records.map((record) => {
    const datos =
      typeof record.datos === "object" && record.datos !== null
        ? record.datos
        : {};

    return headers
      .map((field) => {
        if (field === "id") return escapeCsv(record.id);
        if (field === "correo") return escapeCsv(record.correo);
        if (field === "mensaje") return escapeCsv(record.mensaje);
        if (field === "createdAt")
          return escapeCsv(record.createdAt.toISOString());

        const value = (datos as Record<string, unknown>)[field];
        return escapeCsv(value);
      })
      .join(",");
  });

  const csv = [title, "", headerRow, ...bodyRows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=inscripciones.csv",
    },
  });
}
