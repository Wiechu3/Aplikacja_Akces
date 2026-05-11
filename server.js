import http from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import * as XLSX from "xlsx";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT || 3001);
const PUBLIC_DIR = join(__dirname, "public");
const DATA_DIR = join(__dirname, "local-data");
const DATA_FILE = join(DATA_DIR, "data.json");
const BENEFICIARIES_DIR = join(DATA_DIR, "beneficiaries");
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_PAYLOAD_BYTES = 55 * 1024 * 1024;
const VAT_RATES = new Set(["23", "8", "5", "0", "zw"]);
const EXPENSE_STATUSES = new Set([
  "roboczy",
  "przekazany-do-weryfikacji",
  "zatwierdzony",
  "odrzucony",
  "przekazany-do-ksiegowosci",
  "wyplacony"
]);
const DOCUMENT_STATUSES = new Set(["do-weryfikacji", "do-pobrania", "zatwierdzony", "odrzucony"]);
const CALENDAR_COLORS = new Set(["#f26a21", "#218763", "#2563eb", "#7c3aed", "#b76a00", "#bf2e2e"]);
const VENDOR_FILES = {
  "/vendor/fullcalendar/core.js": join(__dirname, "node_modules/@fullcalendar/core/index.global.min.js"),
  "/vendor/fullcalendar/daygrid.js": join(__dirname, "node_modules/@fullcalendar/daygrid/index.global.min.js"),
  "/vendor/fullcalendar/timegrid.js": join(__dirname, "node_modules/@fullcalendar/timegrid/index.global.min.js"),
  "/vendor/fullcalendar/interaction.js": join(__dirname, "node_modules/@fullcalendar/interaction/index.global.min.js"),
  "/vendor/fullcalendar/list.js": join(__dirname, "node_modules/@fullcalendar/list/index.global.min.js"),
  "/vendor/fullcalendar/pl.js": join(__dirname, "node_modules/@fullcalendar/core/locales/pl.global.min.js")
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

const startupCardFields = [
  "companyName",
  "acronym",
  "nip",
  "krs",
  "regon",
  "contactPeople",
  "mailingAddress",
  "projectSupervisor",
  "mentors",
  "experts",
  "projectSchedule",
  "projectScope",
  "contractAttachments",
  "documentStatus",
  "bio"
];

function slugify(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || `beneficjent-${Date.now()}`;
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function stableId(prefix, value) {
  return `${prefix}_${crypto.createHash("sha1").update(String(value)).digest("hex").slice(0, 12)}`;
}

function ensureBeneficiaryFolders(slug) {
  for (const folder of ["documents", "expenses", "uploads", "reports"]) {
    mkdirSync(join(BENEFICIARIES_DIR, slug, folder), { recursive: true });
  }
}

function emptyStartupCard(beneficiary = {}) {
  return {
    beneficiaryId: beneficiary.id || "",
    companyName: beneficiary.name || "",
    acronym: "",
    nip: "",
    krs: "",
    regon: "",
    contactPeople: "",
    mailingAddress: "",
    projectSupervisor: "",
    mentors: "",
    experts: "",
    projectSchedule: "",
    projectScope: "",
    contractAttachments: "",
    documentStatus: "",
    bio: "",
    updatedAt: ""
  };
}

function seedData() {
  const createdAt = new Date().toISOString();
  return {
    beneficiaries: [
      {
        id: "admin",
        name: "ADMIN",
        slug: "ADMIN",
        role: "admin",
        active: true,
        createdAt
      },
      {
        id: "ben_fundacja_demo",
        name: "Fundacja Demo",
        slug: "fundacja-demo",
        role: "beneficiary",
        active: true,
        createdAt
      },
      {
        id: "ben_spolka_testowa",
        name: "Spolka Testowa",
        slug: "spolka-testowa",
        role: "beneficiary",
        active: true,
        createdAt
      }
    ],
    startupCards: {
      ben_fundacja_demo: {
        ...emptyStartupCard({ id: "ben_fundacja_demo", name: "Fundacja Demo" }),
        acronym: "FD",
        projectSupervisor: "ADMIN",
        bio: "Demo karty startupu z podstawowymi informacjami o beneficjencie."
      },
      ben_spolka_testowa: emptyStartupCard({ id: "ben_spolka_testowa", name: "Spolka Testowa" })
    },
    expenses: [
      {
        id: "exp_demo_1",
        beneficiaryId: "ben_fundacja_demo",
        invoiceNumber: "FV/AKCES/01/2026",
        contractor: "Centrum Szkolen Alfa",
        invoiceDate: "2026-05-03",
        paymentDate: "2026-05-17",
        netAmount: 4200,
        vatRate: "23",
        vatAmount: 966,
        grossAmount: 5166,
        acquisitionMethod: "przelew",
        priorityGoal: "1",
        detailedGoal: "1",
        description: "Warsztat wdrozeniowy dla beneficjenta.",
        status: "przekazany-do-weryfikacji",
        attachments: [],
        createdAt
      },
      {
        id: "exp_demo_2",
        beneficiaryId: "ben_spolka_testowa",
        invoiceNumber: "RACH/88/2026",
        contractor: "Biuro Ekspertyz Beta",
        invoiceDate: "2026-04-28",
        paymentDate: "2026-05-10",
        netAmount: 2500,
        vatRate: "23",
        vatAmount: 575,
        grossAmount: 3075,
        acquisitionMethod: "przelew",
        priorityGoal: "2",
        detailedGoal: "2",
        description: "Ekspertyza do raportu okresowego.",
        status: "zatwierdzony",
        attachments: [],
        createdAt
      }
    ],
    documents: [
      {
        id: "doc_demo_1",
        beneficiaryId: "ben_fundacja_demo",
        title: "Harmonogram monitoringu",
        category: "Monitoring",
        owner: "ADMIN",
        status: "do-pobrania",
        note: "Dokument roboczy do konsultacji.",
        attachments: [],
        createdAt
      }
    ],
    calendar: [
      {
        id: "cal_demo_1",
        beneficiaryId: "ben_fundacja_demo",
        title: "Przekazanie weksla",
        startAt: "2026-05-20T10:00",
        endAt: "2026-05-20T11:00",
        ownerId: "admin",
        participantIds: ["ben_fundacja_demo"],
        type: "formalnosc",
        color: "#f26a21",
        status: "do-zrobienia",
        note: "Termin widoczny dla beneficjenta i administratora.",
        attachments: []
      }
    ],
    tutorials: [
      {
        id: "tut_1",
        title: "Jak dodac wydatek",
        body: "Uzupelnij dane faktury, kontrahenta, kwoty netto, stawke VAT, cele oraz dodaj przynajmniej jeden zalacznik."
      },
      {
        id: "tut_2",
        title: "Co oznaczaja statusy",
        body: "ADMIN nadaje statusy wydatkom i dokumentom, a beneficjent widzi aktualny etap obslugi."
      }
    ]
  };
}

function initStorage() {
  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(BENEFICIARIES_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) {
    const data = seedData();
    for (const beneficiary of data.beneficiaries) {
      ensureBeneficiaryFolders(beneficiary.slug);
    }
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }
}

function normalizeAttachment(file, fallbackKind = "attachment") {
  if (!file) return null;
  const storedPath = String(file.storedPath || "").trim();
  const fileName = String(file.fileName || file.name || basename(storedPath) || "zalacznik").trim();
  return {
    id: String(file.id || stableId("file", `${storedPath}:${fileName}:${fallbackKind}`)),
    fileName,
    storedPath,
    kind: String(file.kind || fallbackKind),
    createdAt: file.createdAt || new Date().toISOString()
  };
}

function normalizeAttachmentList(item, fallbackKind = "attachment") {
  const attachments = Array.isArray(item.attachments) ? item.attachments : [];
  if (!attachments.length && (item.fileName || item.storedPath)) {
    attachments.push({
      fileName: item.fileName,
      storedPath: item.storedPath,
      kind: fallbackKind,
      createdAt: item.createdAt
    });
  }
  return attachments.map((file) => normalizeAttachment(file, fallbackKind)).filter(Boolean);
}

function addHoursToLocal(value, hours = 1) {
  const date = new Date(value);
  date.setHours(date.getHours() + hours);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const localHours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${localHours}:${minutes}`;
}

function normalizeCalendarItem(item) {
  const dueDate = item.dueDate || new Date().toISOString().slice(0, 10);
  const dueTime = item.dueTime || "09:00";
  const startAt = item.startAt || `${dueDate}T${dueTime}`;
  let endAt = item.endAt || addHoursToLocal(startAt, 1);
  if (new Date(endAt) <= new Date(startAt)) {
    endAt = addHoursToLocal(startAt, 1);
  }
  const participantIds = [
    item.beneficiaryId,
    ...(Array.isArray(item.participantIds) ? item.participantIds : []),
    ...(Array.isArray(item.invitedIds) ? item.invitedIds : [])
  ].filter(Boolean);

  return {
    ...item,
    startAt,
    endAt,
    participantIds: [...new Set(participantIds)],
    color: CALENDAR_COLORS.has(item.color) ? item.color : "#f26a21",
    attachments: normalizeAttachmentList(item, "calendar")
  };
}

function normalizeExpense(item) {
  const netAmount = Number(item.netAmount || 0);
  const rate = VAT_RATES.has(String(item.vatRate || "")) ? String(item.vatRate) : inferVatRate(item);
  const amounts = calculateAmounts(netAmount, rate);
  return {
    ...item,
    netAmount,
    vatRate: rate,
    vatAmount: Number.isFinite(Number(item.vatAmount)) ? Number(item.vatAmount) : amounts.vatAmount,
    grossAmount: Number.isFinite(Number(item.grossAmount)) ? Number(item.grossAmount) : amounts.grossAmount,
    priorityGoal: normalizeGoal(item.priorityGoal),
    detailedGoal: normalizeGoal(item.detailedGoal),
    status: EXPENSE_STATUSES.has(item.status) ? item.status : "przekazany-do-weryfikacji",
    attachments: normalizeAttachmentList(item, "expense")
  };
}

function normalizeDocument(item) {
  return {
    ...item,
    status: DOCUMENT_STATUSES.has(item.status) ? item.status : "do-weryfikacji",
    attachments: normalizeAttachmentList(item, "document")
  };
}

function normalizeGoal(value) {
  const match = String(value || "").match(/([1-9]|10)/);
  return match ? match[1] : "";
}

function inferVatRate(item) {
  const net = Number(item.netAmount || 0);
  const vat = Number(item.vatAmount || 0);
  if (!net || !vat) return "23";
  const rounded = Math.round((vat / net) * 100);
  if (VAT_RATES.has(String(rounded))) return String(rounded);
  return "23";
}

function normalizeStartupCards(data) {
  const cards = data.startupCards && typeof data.startupCards === "object" ? data.startupCards : {};
  for (const beneficiary of data.beneficiaries || []) {
    if (beneficiary.id === "admin") continue;
    const existing = cards[beneficiary.id] || {};
    const { taxId, ...rest } = existing;
    cards[beneficiary.id] = {
      ...emptyStartupCard(beneficiary),
      ...rest,
      nip: String(existing.nip || taxId || ""),
      krs: String(existing.krs || ""),
      regon: String(existing.regon || ""),
      beneficiaryId: beneficiary.id
    };
  }
  return cards;
}

function normalizeData(data) {
  const normalized = {
    beneficiaries: Array.isArray(data.beneficiaries) ? data.beneficiaries : [],
    expenses: Array.isArray(data.expenses) ? data.expenses.map(normalizeExpense) : [],
    documents: Array.isArray(data.documents) ? data.documents.map(normalizeDocument) : [],
    calendar: Array.isArray(data.calendar) ? data.calendar.map(normalizeCalendarItem) : [],
    tutorials: Array.isArray(data.tutorials) ? data.tutorials : []
  };
  normalized.startupCards = normalizeStartupCards({ ...data, beneficiaries: normalized.beneficiaries });
  for (const beneficiary of normalized.beneficiaries) {
    ensureBeneficiaryFolders(beneficiary.slug);
  }
  return normalized;
}

function readData() {
  initStorage();
  const data = JSON.parse(readFileSync(DATA_FILE, "utf8"));
  return normalizeData(data);
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(normalizeData(data), null, 2));
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, message) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

async function readBody(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_PAYLOAD_BYTES) {
      throw new Error("Payload is too large");
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function getActor(data, actorId) {
  return data.beneficiaries.find((item) => item.id === actorId) || data.beneficiaries.find((item) => item.id === "admin");
}

function isAdminActor(actor) {
  return actor?.id === "admin" || actor?.role === "admin";
}

function scopeForActor(data, actor, scopeBeneficiaryId = "all") {
  if (!isAdminActor(actor)) return actor?.id || "";
  if (!scopeBeneficiaryId || scopeBeneficiaryId === "admin") return "all";
  if (scopeBeneficiaryId === "all") return "all";
  return data.beneficiaries.some((item) => item.id === scopeBeneficiaryId && item.id !== "admin") ? scopeBeneficiaryId : "all";
}

function belongsToScope(item, scope) {
  if (scope === "all") return true;
  const participantIds = Array.isArray(item.participantIds) ? item.participantIds : [];
  return item.beneficiaryId === scope || item.ownerId === scope || participantIds.includes(scope);
}

function selectedData(data, actorId, scopeBeneficiaryId = "all") {
  const actor = getActor(data, actorId);
  const admin = isAdminActor(actor);
  const scope = scopeForActor(data, actor, scopeBeneficiaryId);
  const filterByScope = (items) => items.filter((item) => belongsToScope(item, scope));
  const visibleBeneficiaries = admin
    ? data.beneficiaries
    : data.beneficiaries.filter((item) => item.id === "admin" || item.id === actor.id);
  const startupCards = {};
  for (const beneficiary of visibleBeneficiaries) {
    if (beneficiary.id === "admin") continue;
    if (scope !== "all" && beneficiary.id !== scope) continue;
    startupCards[beneficiary.id] = data.startupCards[beneficiary.id] || emptyStartupCard(beneficiary);
  }
  return {
    actorId: actor?.id || "admin",
    scopeBeneficiaryId: scope,
    beneficiaries: visibleBeneficiaries,
    expenses: filterByScope(data.expenses),
    documents: filterByScope(data.documents),
    calendar: filterByScope(data.calendar),
    startupCards,
    tutorials: data.tutorials
  };
}

function resolveBeneficiaryForWrite(data, actor, requestedId) {
  if (isAdminActor(actor)) {
    return data.beneficiaries.find((item) => item.id === requestedId && item.id !== "admin" && item.active);
  }
  if (actor?.id === requestedId && actor.active) return actor;
  return null;
}

function calculateAmounts(netAmount, vatRate) {
  const net = Math.max(0, Number(netAmount || 0));
  const rate = String(vatRate || "23");
  const vatAmount = rate === "zw" ? 0 : Math.round(net * (Number(rate) / 100) * 100) / 100;
  const grossAmount = Math.round((net + vatAmount) * 100) / 100;
  return { netAmount: net, vatAmount, grossAmount };
}

function saveBase64File(beneficiary, file, folder = "uploads", kind = "attachment") {
  if (!file?.name || !file?.content) return null;
  const base64 = file.content.split(",").pop();
  const bytes = Buffer.from(base64, "base64");
  if (bytes.length > MAX_UPLOAD_BYTES) {
    throw new Error("Plik przekracza limit 10 MB");
  }
  const extension = extname(file.name);
  const safeBase = slugify(file.name.replace(extension, ""));
  const safeName = `${Date.now()}-${crypto.randomBytes(3).toString("hex")}-${safeBase}${extension}`;
  const target = join(BENEFICIARIES_DIR, beneficiary.slug, folder, safeName);
  writeFileSync(target, bytes);
  return {
    id: makeId("file"),
    fileName: file.name,
    storedPath: `local-data/beneficiaries/${beneficiary.slug}/${folder}/${safeName}`,
    kind,
    createdAt: new Date().toISOString()
  };
}

function saveBase64Files(beneficiary, files = [], folder = "uploads", kind = "attachment") {
  return (Array.isArray(files) ? files : [files])
    .filter(Boolean)
    .map((file) => saveBase64File(beneficiary, file, folder, kind))
    .filter(Boolean);
}

function exportExpensesRows(data, actorId, scopeBeneficiaryId) {
  const rows = selectedData(data, actorId, scopeBeneficiaryId).expenses.map((expense) => {
    const beneficiary = data.beneficiaries.find((item) => item.id === expense.beneficiaryId);
    return [
      beneficiary?.name || "",
      expense.invoiceNumber,
      expense.contractor,
      expense.invoiceDate,
      expense.paymentDate,
      expense.netAmount,
      expense.vatRate,
      expense.vatAmount,
      expense.grossAmount,
      expense.priorityGoal,
      expense.detailedGoal,
      expense.status,
      (expense.attachments || []).map((file) => file.fileName).join(", ")
    ];
  });
  return [[
    "Beneficjent",
    "Numer faktury",
    "Kontrahent",
    "Data faktury",
    "Data platnosci",
    "Netto",
    "Stawka VAT",
    "VAT",
    "Brutto",
    "Cel priorytetowy",
    "Cel szczegolowy",
    "Status",
    "Zalaczniki"
  ], ...rows];
}

function exportDocumentsRows(data, actorId, scopeBeneficiaryId) {
  const rows = selectedData(data, actorId, scopeBeneficiaryId).documents.map((document) => {
    const beneficiary = data.beneficiaries.find((item) => item.id === document.beneficiaryId);
    return [
      beneficiary?.name || "",
      document.title,
      document.category,
      document.owner,
      document.status,
      document.note,
      (document.attachments || []).map((file) => file.fileName).join(", ")
    ];
  });
  return [["Beneficjent", "Dokument", "Kategoria", "Dodane przez", "Status", "Uwagi", "Zalaczniki"], ...rows];
}

function exportCalendarRows(data, actorId, scopeBeneficiaryId) {
  const rows = selectedData(data, actorId, scopeBeneficiaryId).calendar.map((item) => {
    const beneficiary = data.beneficiaries.find((entry) => entry.id === item.beneficiaryId);
    const owner = data.beneficiaries.find((entry) => entry.id === item.ownerId);
    const participants = (item.participantIds || [])
      .map((id) => data.beneficiaries.find((entry) => entry.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    return [
      beneficiary?.name || "",
      item.title,
      item.startAt,
      item.endAt,
      owner?.name || "",
      participants,
      item.color,
      item.status,
      item.note,
      (item.attachments || []).map((file) => file.fileName).join(", ")
    ];
  });
  return [["Beneficjent", "Wydarzenie", "Start", "Koniec", "Dodane przez", "Uczestnicy", "Kolor", "Status", "Opis", "Zalaczniki"], ...rows];
}

function exportReportRows(data, actorId, scopeBeneficiaryId, type) {
  if (type === "documents") return exportDocumentsRows(data, actorId, scopeBeneficiaryId);
  if (type === "calendar") return exportCalendarRows(data, actorId, scopeBeneficiaryId);
  return exportExpensesRows(data, actorId, scopeBeneficiaryId);
}

function exportReportXlsx(data, actorId, scopeBeneficiaryId, type) {
  const workbook = XLSX.utils.book_new();
  const rows = exportReportRows(data, actorId, scopeBeneficiaryId, type);
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const sheetName = type === "documents" ? "Dokumenty" : type === "calendar" ? "Kalendarz" : "Wydatki";
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

function validateCalendarPayload(data, body, existingEvent = null) {
  const actorId = String(body.actorId || "");
  const actor = getActor(data, actorId);
  if (!actor) {
    return { error: "Nie mozna ustalic osoby zapisujacej wydarzenie." };
  }

  const startAt = String(body.startAt || "").trim();
  const endAt = String(body.endAt || "").trim();
  if (!startAt || !endAt || Number.isNaN(new Date(startAt).getTime()) || Number.isNaN(new Date(endAt).getTime())) {
    return { error: "Podaj poprawna date i godzine rozpoczecia oraz zakonczenia." };
  }
  if (new Date(endAt) <= new Date(startAt)) {
    return { error: "Data zakonczenia musi byc pozniejsza niz data rozpoczecia." };
  }

  const knownIds = new Set(data.beneficiaries.map((item) => item.id));
  const requestedBeneficiaryId = String(body.beneficiaryId || existingEvent?.beneficiaryId || "").trim();
  const participantIds = [...new Set(Array.isArray(body.participantIds) ? body.participantIds.filter((id) => knownIds.has(id)) : [])];
  const admin = isAdminActor(actor);
  let beneficiaryId = "";

  if (admin) {
    beneficiaryId = requestedBeneficiaryId || participantIds.find((id) => id !== "admin") || "";
    if (!beneficiaryId) {
      return { error: "ADMIN musi przypisac wydarzenie przynajmniej do jednego beneficjenta." };
    }
  } else {
    beneficiaryId = actor.id;
    if (requestedBeneficiaryId && requestedBeneficiaryId !== actor.id) {
      return { error: "Beneficjent moze dodawac wydarzenia tylko dla siebie." };
    }
    if (!participantIds.includes(actor.id)) participantIds.push(actor.id);
    if (!participantIds.includes("admin")) participantIds.push("admin");
  }

  const existingParticipants = Array.isArray(existingEvent?.participantIds) ? existingEvent.participantIds : [];
  if (existingEvent && !admin && existingEvent.ownerId !== actor.id && !existingParticipants.includes(actor.id)) {
    return { error: "Beneficjent moze edytowac tylko wydarzenia, w ktorych uczestniczy." };
  }

  const beneficiary = data.beneficiaries.find((item) => item.id === beneficiaryId && item.id !== "admin");
  if (!beneficiary) {
    return { error: "Wybierz beneficjenta powiazanego z wydarzeniem." };
  }
  if (!participantIds.includes(beneficiaryId)) {
    participantIds.unshift(beneficiaryId);
  }

  const color = CALENDAR_COLORS.has(body.color) ? body.color : existingEvent?.color || "#f26a21";
  return { actor, beneficiary, startAt, endAt, participantIds: [...new Set(participantIds)], color };
}

function findAttachment(data, fileId) {
  const collections = [
    ...data.expenses.map((item) => ({ beneficiaryId: item.beneficiaryId, attachments: item.attachments || [] })),
    ...data.documents.map((item) => ({ beneficiaryId: item.beneficiaryId, attachments: item.attachments || [] })),
    ...data.calendar.map((item) => ({ beneficiaryId: item.beneficiaryId, attachments: item.attachments || [] }))
  ];
  for (const collection of collections) {
    const attachment = collection.attachments.find((file) => file.id === fileId);
    if (attachment) return { ...attachment, beneficiaryId: collection.beneficiaryId };
  }
  return null;
}

function canReadBeneficiary(actor, beneficiaryId) {
  return isAdminActor(actor) || actor?.id === beneficiaryId;
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const data = readData();

  if (req.method === "GET" && url.pathname === "/api/state") {
    sendJson(
      res,
      200,
      selectedData(data, url.searchParams.get("actorId") || "admin", url.searchParams.get("scopeBeneficiaryId") || "all")
    );
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/files/")) {
    const fileId = decodeURIComponent(url.pathname.split("/").pop() || "");
    const actor = getActor(data, url.searchParams.get("actorId") || "admin");
    const attachment = findAttachment(data, fileId);
    if (!attachment) {
      sendJson(res, 404, { error: "Plik nie zostal znaleziony." });
      return;
    }
    if (!canReadBeneficiary(actor, attachment.beneficiaryId)) {
      sendJson(res, 403, { error: "Nie masz uprawnien do tego pliku." });
      return;
    }
    const filePath = normalize(join(__dirname, attachment.storedPath));
    if (!filePath.startsWith(resolve(BENEFICIARIES_DIR)) || !existsSync(filePath)) {
      sendJson(res, 404, { error: "Plik nie istnieje na dysku." });
      return;
    }
    const contentType = mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${encodeURIComponent(attachment.fileName)}"`
    });
    res.end(readFileSync(filePath));
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/reports/") && url.pathname.endsWith(".xlsx")) {
    const actorId = url.searchParams.get("actorId") || "admin";
    const scopeBeneficiaryId = url.searchParams.get("scopeBeneficiaryId") || "all";
    const type = url.pathname.split("/").pop().replace(".xlsx", "");
    res.writeHead(200, {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="akces-ncbr-${type}.xlsx"`
    });
    res.end(exportReportXlsx(data, actorId, scopeBeneficiaryId, type));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/beneficiaries") {
    const body = await readBody(req);
    const actor = getActor(data, body.actorId || "admin");
    if (!isAdminActor(actor)) {
      sendJson(res, 403, { error: "Tylko ADMIN moze dodawac beneficjentow." });
      return;
    }
    const name = String(body.name || "").trim();
    if (name.length < 2) {
      sendJson(res, 400, { error: "Nazwa beneficjenta jest wymagana." });
      return;
    }
    const slugBase = slugify(name);
    let slug = slugBase;
    let counter = 2;
    while (data.beneficiaries.some((beneficiary) => beneficiary.slug.toLowerCase() === slug.toLowerCase())) {
      slug = `${slugBase}-${counter++}`;
    }
    const beneficiary = {
      id: makeId("ben"),
      name,
      slug,
      role: "beneficiary",
      active: true,
      createdAt: new Date().toISOString()
    };
    ensureBeneficiaryFolders(slug);
    data.beneficiaries.push(beneficiary);
    data.startupCards[beneficiary.id] = emptyStartupCard(beneficiary);
    writeData(data);
    sendJson(res, 201, beneficiary);
    return;
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/beneficiaries/")) {
    const id = url.pathname.split("/").pop();
    const body = await readBody(req);
    const actor = getActor(data, body.actorId || "admin");
    if (!isAdminActor(actor)) {
      sendJson(res, 403, { error: "Tylko ADMIN moze zmieniac status beneficjenta." });
      return;
    }
    const beneficiary = data.beneficiaries.find((item) => item.id === id);
    if (!beneficiary || beneficiary.id === "admin") {
      sendJson(res, 404, { error: "Beneficjent nie zostal znaleziony." });
      return;
    }
    beneficiary.active = Boolean(body.active);
    writeData(data);
    sendJson(res, 200, beneficiary);
    return;
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/startup-cards/")) {
    const beneficiaryId = url.pathname.split("/").pop();
    const body = await readBody(req);
    const actor = getActor(data, body.actorId || "");
    if (!isAdminActor(actor)) {
      sendJson(res, 403, { error: "Tylko ADMIN moze edytowac Karte Startupu." });
      return;
    }
    const beneficiary = data.beneficiaries.find((item) => item.id === beneficiaryId && item.id !== "admin");
    if (!beneficiary) {
      sendJson(res, 404, { error: "Beneficjent nie zostal znaleziony." });
      return;
    }
    const card = { ...emptyStartupCard(beneficiary), ...(data.startupCards[beneficiaryId] || {}) };
    for (const field of startupCardFields) {
      card[field] = String(body[field] || "").trim();
    }
    card.beneficiaryId = beneficiaryId;
    card.updatedAt = new Date().toISOString();
    data.startupCards[beneficiaryId] = card;
    writeData(data);
    sendJson(res, 200, card);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/expenses") {
    const body = await readBody(req);
    const actor = getActor(data, body.actorId || "");
    const beneficiary = resolveBeneficiaryForWrite(data, actor, body.beneficiaryId);
    if (!beneficiary) {
      sendJson(res, 403, { error: "Wybierz aktywnego beneficjenta dla wydatku." });
      return;
    }
    const invoiceFiles = saveBase64Files(beneficiary, body.invoiceFiles, "expenses", "invoice");
    const otherFiles = saveBase64Files(beneficiary, body.otherFiles, "expenses", "other");
    const attachments = [...invoiceFiles, ...otherFiles];
    if (!attachments.length) {
      sendJson(res, 400, { error: "Dodaj przynajmniej jeden zalacznik do wydatku." });
      return;
    }
    const vatRate = VAT_RATES.has(String(body.vatRate || "")) ? String(body.vatRate) : "23";
    const amounts = calculateAmounts(body.netAmount, vatRate);
    const expense = {
      id: makeId("exp"),
      beneficiaryId: beneficiary.id,
      invoiceNumber: String(body.invoiceNumber || "").trim(),
      contractor: String(body.contractor || "").trim(),
      invoiceDate: body.invoiceDate || "",
      paymentDate: body.paymentDate || "",
      netAmount: amounts.netAmount,
      vatRate,
      vatAmount: amounts.vatAmount,
      grossAmount: amounts.grossAmount,
      acquisitionMethod: String(body.acquisitionMethod || "").trim(),
      priorityGoal: normalizeGoal(body.priorityGoal),
      detailedGoal: normalizeGoal(body.detailedGoal),
      description: String(body.description || "").trim(),
      status: "przekazany-do-weryfikacji",
      attachments,
      createdAt: new Date().toISOString(),
      createdBy: actor.id
    };
    data.expenses.unshift(expense);
    writeData(data);
    sendJson(res, 201, expense);
    return;
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/expenses/")) {
    const id = url.pathname.split("/").pop();
    const body = await readBody(req);
    const actor = getActor(data, body.actorId || "");
    if (!isAdminActor(actor)) {
      sendJson(res, 403, { error: "Tylko ADMIN moze zmieniac status wydatku." });
      return;
    }
    const expense = data.expenses.find((item) => item.id === id);
    if (!expense) {
      sendJson(res, 404, { error: "Wydatek nie zostal znaleziony." });
      return;
    }
    const status = String(body.status || expense.status);
    if (!EXPENSE_STATUSES.has(status)) {
      sendJson(res, 400, { error: "Nieznany status wydatku." });
      return;
    }
    expense.status = status;
    writeData(data);
    sendJson(res, 200, expense);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/documents") {
    const body = await readBody(req);
    const actor = getActor(data, body.actorId || "");
    const beneficiary = resolveBeneficiaryForWrite(data, actor, body.beneficiaryId);
    if (!beneficiary) {
      sendJson(res, 403, { error: "Wybierz aktywnego beneficjenta dla dokumentu." });
      return;
    }
    const attachments = saveBase64Files(beneficiary, body.files, "documents", "document");
    const status = DOCUMENT_STATUSES.has(body.status) ? body.status : "do-weryfikacji";
    const document = {
      id: makeId("doc"),
      beneficiaryId: beneficiary.id,
      title: String(body.title || attachments[0]?.fileName || "Nowy dokument").trim(),
      category: String(body.category || "Inne").trim(),
      owner: String(body.owner || (isAdminActor(actor) ? "ADMIN" : beneficiary.name)).trim(),
      status,
      note: String(body.note || "").trim(),
      attachments,
      createdAt: new Date().toISOString(),
      createdBy: actor.id
    };
    data.documents.unshift(document);
    writeData(data);
    sendJson(res, 201, document);
    return;
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/documents/")) {
    const id = url.pathname.split("/").pop();
    const body = await readBody(req);
    const actor = getActor(data, body.actorId || "");
    if (!isAdminActor(actor)) {
      sendJson(res, 403, { error: "Tylko ADMIN moze zmieniac status dokumentu." });
      return;
    }
    const document = data.documents.find((item) => item.id === id);
    if (!document) {
      sendJson(res, 404, { error: "Dokument nie zostal znaleziony." });
      return;
    }
    const status = String(body.status || document.status);
    if (!DOCUMENT_STATUSES.has(status)) {
      sendJson(res, 400, { error: "Nieznany status dokumentu." });
      return;
    }
    document.status = status;
    writeData(data);
    sendJson(res, 200, document);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/calendar") {
    const body = await readBody(req);
    const validated = validateCalendarPayload(data, body);
    if (validated.error) {
      sendJson(res, 400, { error: validated.error });
      return;
    }
    const attachments = saveBase64Files(validated.beneficiary, body.files, "uploads", "calendar");
    const item = {
      id: makeId("cal"),
      beneficiaryId: validated.beneficiary.id,
      title: String(body.title || "").trim(),
      startAt: validated.startAt,
      endAt: validated.endAt,
      ownerId: validated.actor.id,
      participantIds: validated.participantIds,
      type: "zadanie",
      color: validated.color,
      status: "do-zrobienia",
      note: String(body.note || "").trim(),
      attachments
    };
    data.calendar.unshift(item);
    writeData(data);
    sendJson(res, 201, item);
    return;
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/calendar/")) {
    const id = url.pathname.split("/").pop();
    const body = await readBody(req);
    const item = data.calendar.find((entry) => entry.id === id);
    if (!item) {
      sendJson(res, 404, { error: "Wydarzenie nie zostalo znalezione." });
      return;
    }
    const validated = validateCalendarPayload(data, body, item);
    if (validated.error) {
      sendJson(res, 400, { error: validated.error });
      return;
    }
    const attachments = saveBase64Files(validated.beneficiary, body.files, "uploads", "calendar");
    item.beneficiaryId = validated.beneficiary.id;
    item.title = String(body.title || "").trim();
    item.startAt = validated.startAt;
    item.endAt = validated.endAt;
    item.participantIds = validated.participantIds;
    item.type = item.type || "zadanie";
    item.color = validated.color;
    item.note = String(body.note || "").trim();
    item.attachments = [...(item.attachments || []), ...attachments];
    writeData(data);
    sendJson(res, 200, item);
    return;
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/calendar/")) {
    const id = url.pathname.split("/").pop();
    const actor = getActor(data, url.searchParams.get("actorId") || "");
    const item = data.calendar.find((entry) => entry.id === id);
    if (!item) {
      sendJson(res, 404, { error: "Wydarzenie nie zostalo znalezione." });
      return;
    }
    if (!isAdminActor(actor) && item.ownerId !== actor.id && !(item.participantIds || []).includes(actor.id)) {
      sendJson(res, 403, { error: "Nie masz uprawnien do usuniecia tego wydarzenia." });
      return;
    }
    data.calendar = data.calendar.filter((entry) => entry.id !== id);
    writeData(data);
    sendJson(res, 200, { ok: true });
    return;
  }

  sendJson(res, 404, { error: "Nieznana sciezka API." });
}

function serveVendor(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = VENDOR_FILES[url.pathname];
  if (!filePath) {
    sendText(res, 404, "Not found");
    return;
  }
  try {
    const file = readFileSync(filePath);
    res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
    res.end(file);
  } catch {
    sendText(res, 404, "Vendor file not found");
  }
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = normalize(join(PUBLIC_DIR, requestedPath));
  if (!filePath.startsWith(resolve(PUBLIC_DIR))) {
    sendText(res, 403, "Forbidden");
    return;
  }
  try {
    const file = readFileSync(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream"
    });
    res.end(file);
  } catch {
    const index = readFileSync(join(PUBLIC_DIR, "index.html"));
    res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
    res.end(index);
  }
}

initStorage();

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/vendor/")) {
      serveVendor(req, res);
      return;
    }
    if (req.url.startsWith("/api/")) {
      await handleApi(req, res);
      return;
    }
    serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Blad serwera." });
  }
});

server.listen(PORT, () => {
  console.log(`Akces NCBR MVP dziala na http://localhost:${PORT}`);
});
