import http from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT || 3001);
const PUBLIC_DIR = join(__dirname, "public");
const DATA_DIR = join(__dirname, "local-data");
const DATA_FILE = join(DATA_DIR, "data.json");
const BENEFICIARIES_DIR = join(DATA_DIR, "beneficiaries");
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_PAYLOAD_BYTES = 55 * 1024 * 1024;
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
  ".ico": "image/x-icon"
};

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

function ensureBeneficiaryFolders(slug) {
  for (const folder of ["documents", "expenses", "uploads", "reports"]) {
    mkdirSync(join(BENEFICIARIES_DIR, slug, folder), { recursive: true });
  }
}

function seedData() {
  return {
    beneficiaries: [
      {
        id: "admin",
        name: "ADMIN",
        slug: "ADMIN",
        role: "admin",
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "ben_fundacja_demo",
        name: "Fundacja Demo",
        slug: "fundacja-demo",
        role: "beneficiary",
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "ben_spolka_testowa",
        name: "Spolka Testowa",
        slug: "spolka-testowa",
        role: "beneficiary",
        active: true,
        createdAt: new Date().toISOString()
      }
    ],
    expenses: [
      {
        id: "exp_demo_1",
        beneficiaryId: "ben_fundacja_demo",
        invoiceNumber: "FV/AKCES/01/2026",
        contractor: "Centrum Szkolen Alfa",
        invoiceDate: "2026-05-03",
        paymentDate: "2026-05-17",
        netAmount: 4200,
        vatAmount: 966,
        grossAmount: 5166,
        acquisitionMethod: "przelew",
        priorityGoal: "Cel 1",
        detailedGoal: "Szkolenia zespolu projektowego",
        description: "Warsztat wdrozeniowy dla beneficjenta.",
        status: "przekazany-do-weryfikacji",
        attachments: [],
        createdAt: new Date().toISOString()
      },
      {
        id: "exp_demo_2",
        beneficiaryId: "ben_spolka_testowa",
        invoiceNumber: "RACH/88/2026",
        contractor: "Biuro Ekspertyz Beta",
        invoiceDate: "2026-04-28",
        paymentDate: "2026-05-10",
        netAmount: 2500,
        vatAmount: 575,
        grossAmount: 3075,
        acquisitionMethod: "przelew",
        priorityGoal: "Cel 2",
        detailedGoal: "Analiza dokumentacji technicznej",
        description: "Ekspertyza do raportu okresowego.",
        status: "zatwierdzony",
        attachments: [],
        createdAt: new Date().toISOString()
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
        createdAt: new Date().toISOString()
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
        status: "do-zrobienia",
        note: "Termin widoczny dla beneficjenta i administratora.",
        attachments: []
      }
    ],
    tutorials: [
      {
        id: "tut_1",
        title: "Jak dodac wydatek",
        body: "Uzupelnij dane faktury, kontrahenta, kwoty netto/VAT/brutto, cel priorytetowy i szczegolowy oraz dodaj opis kosztu."
      },
      {
        id: "tut_2",
        title: "Co oznaczaja statusy",
        body: "Wydatek przechodzi od wersji roboczej przez weryfikacje, zatwierdzenie, przekazanie do ksiegowosci az do wyplaty."
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

function readData() {
  initStorage();
  const data = JSON.parse(readFileSync(DATA_FILE, "utf8"));
  return normalizeData(data);
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
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
    attachments: Array.isArray(item.attachments) ? item.attachments : []
  };
}

function normalizeData(data) {
  return {
    beneficiaries: Array.isArray(data.beneficiaries) ? data.beneficiaries : [],
    expenses: Array.isArray(data.expenses) ? data.expenses : [],
    documents: Array.isArray(data.documents) ? data.documents : [],
    calendar: Array.isArray(data.calendar) ? data.calendar.map(normalizeCalendarItem) : [],
    tutorials: Array.isArray(data.tutorials) ? data.tutorials : []
  };
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

function selectedData(data, beneficiaryId) {
  const isAdmin = beneficiaryId === "admin";
  return {
    beneficiaries: data.beneficiaries,
    expenses: isAdmin ? data.expenses : data.expenses.filter((item) => item.beneficiaryId === beneficiaryId),
    documents: isAdmin ? data.documents : data.documents.filter((item) => item.beneficiaryId === beneficiaryId),
    calendar: isAdmin
      ? data.calendar
      : data.calendar.filter((item) => {
          const participantIds = Array.isArray(item.participantIds) ? item.participantIds : [];
          return item.beneficiaryId === beneficiaryId || item.ownerId === beneficiaryId || participantIds.includes(beneficiaryId);
        }),
    tutorials: data.tutorials
  };
}

function saveBase64File(beneficiary, file, folder = "uploads") {
  if (!file?.name || !file?.content) return null;
  const base64 = file.content.split(",").pop();
  const bytes = Buffer.from(base64, "base64");
  if (bytes.length > MAX_UPLOAD_BYTES) {
    throw new Error("Plik przekracza limit 10 MB");
  }
  const safeName = `${Date.now()}-${slugify(file.name)}${extname(file.name) || ""}`;
  const target = join(BENEFICIARIES_DIR, beneficiary.slug, folder, safeName);
  writeFileSync(target, bytes);
  return {
    fileName: file.name,
    storedPath: `local-data/beneficiaries/${beneficiary.slug}/${folder}/${safeName}`
  };
}

function saveBase64Files(beneficiary, files = [], folder = "uploads") {
  return (Array.isArray(files) ? files : [files])
    .filter(Boolean)
    .map((file) => saveBase64File(beneficiary, file, folder))
    .filter(Boolean);
}

function csvLine(row) {
  return row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(";");
}

function exportExpensesCsv(data, beneficiaryId) {
  const rows = selectedData(data, beneficiaryId).expenses.map((expense) => {
    const beneficiary = data.beneficiaries.find((item) => item.id === expense.beneficiaryId);
    return [
      beneficiary?.name || "",
      expense.invoiceNumber,
      expense.contractor,
      expense.invoiceDate,
      expense.paymentDate,
      expense.netAmount,
      expense.vatAmount,
      expense.grossAmount,
      expense.priorityGoal,
      expense.detailedGoal,
      expense.status,
      (expense.attachments || []).map((file) => file.fileName).join(", ")
    ];
  });
  const header = [
    "Beneficjent",
    "Numer faktury",
    "Kontrahent",
    "Data faktury",
    "Data platnosci",
    "Netto",
    "VAT",
    "Brutto",
    "Cel priorytetowy",
    "Cel szczegolowy",
    "Status",
    "Zalaczniki"
  ];
  return [header, ...rows].map(csvLine).join("\n");
}

function exportDocumentsCsv(data, beneficiaryId) {
  const rows = selectedData(data, beneficiaryId).documents.map((document) => {
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
  return [["Beneficjent", "Dokument", "Kategoria", "Dodane przez", "Status", "Uwagi", "Zalaczniki"], ...rows]
    .map(csvLine)
    .join("\n");
}

function exportCalendarCsv(data, beneficiaryId) {
  const rows = selectedData(data, beneficiaryId).calendar.map((item) => {
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
      item.type,
      item.status,
      item.note,
      (item.attachments || []).map((file) => file.fileName).join(", ")
    ];
  });
  return [["Beneficjent", "Wydarzenie", "Start", "Koniec", "Dodane przez", "Uczestnicy", "Typ", "Status", "Opis", "Zalaczniki"], ...rows]
    .map(csvLine)
    .join("\n");
}

function exportReportCsv(data, beneficiaryId, type) {
  if (type === "documents") return exportDocumentsCsv(data, beneficiaryId);
  if (type === "calendar") return exportCalendarCsv(data, beneficiaryId);
  return exportExpensesCsv(data, beneficiaryId);
}

function validateCalendarPayload(data, body, existingEvent = null) {
  const actorId = String(body.actorId || "");
  const actor = data.beneficiaries.find((item) => item.id === actorId);
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
  const participantIds = [...new Set(Array.isArray(body.participantIds) ? body.participantIds.filter((id) => knownIds.has(id)) : [])];
  if (actorId === "admin") {
    if (!participantIds.some((id) => id !== "admin")) {
      return { error: "ADMIN musi przypisac wydarzenie przynajmniej do jednego beneficjenta." };
    }
  } else {
    if (!participantIds.includes(actorId)) participantIds.push(actorId);
    if (!participantIds.includes("admin")) participantIds.push("admin");
  }

  const existingParticipants = Array.isArray(existingEvent?.participantIds) ? existingEvent.participantIds : [];
  if (existingEvent && actorId !== "admin" && existingEvent.ownerId !== actorId && !existingParticipants.includes(actorId)) {
    return { error: "Beneficjent moze edytowac tylko wydarzenia, w ktorych uczestniczy." };
  }

  const beneficiaryId = participantIds.find((id) => id !== "admin") || body.beneficiaryId || existingEvent?.beneficiaryId;
  const beneficiary = data.beneficiaries.find((item) => item.id === beneficiaryId && item.id !== "admin");
  if (!beneficiary) {
    return { error: "Wybierz beneficjenta powiazanego z wydarzeniem." };
  }

  return { actor, beneficiary, startAt, endAt, participantIds };
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const data = readData();

  if (req.method === "GET" && url.pathname === "/api/state") {
    sendJson(res, 200, selectedData(data, url.searchParams.get("beneficiaryId") || "admin"));
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/reports/") && url.pathname.endsWith(".csv")) {
    const beneficiaryId = url.searchParams.get("beneficiaryId") || "admin";
    const type = url.pathname.split("/").pop().replace(".csv", "");
    res.writeHead(200, {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="akces-ncbr-${type}.csv"`
    });
    res.end(exportReportCsv(data, beneficiaryId, type));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/beneficiaries") {
    const body = await readBody(req);
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
    writeData(data);
    sendJson(res, 201, beneficiary);
    return;
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/beneficiaries/")) {
    const id = url.pathname.split("/").pop();
    const body = await readBody(req);
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

  if (req.method === "POST" && url.pathname === "/api/expenses") {
    const body = await readBody(req);
    const actorId = String(body.actorId || "");
    if (!actorId || actorId === "admin") {
      sendJson(res, 403, { error: "ADMIN nie dodaje wydatkow. Wydatek moze dodac tylko aktywny beneficjent." });
      return;
    }
    if (actorId !== body.beneficiaryId) {
      sendJson(res, 403, { error: "Beneficjent moze dodac wydatek tylko we wlasnym widoku." });
      return;
    }
    const beneficiary = data.beneficiaries.find((item) => item.id === body.beneficiaryId && item.id !== "admin");
    if (!beneficiary) {
      sendJson(res, 400, { error: "Wybierz beneficjenta dla wydatku." });
      return;
    }
    const attachments = saveBase64Files(beneficiary, body.files, "expenses");
    const expense = {
      id: makeId("exp"),
      beneficiaryId: beneficiary.id,
      invoiceNumber: String(body.invoiceNumber || "").trim(),
      contractor: String(body.contractor || "").trim(),
      invoiceDate: body.invoiceDate || "",
      paymentDate: body.paymentDate || "",
      netAmount: Number(body.netAmount || 0),
      vatAmount: Number(body.vatAmount || 0),
      grossAmount: Number(body.grossAmount || 0),
      acquisitionMethod: String(body.acquisitionMethod || "").trim(),
      priorityGoal: String(body.priorityGoal || "").trim(),
      detailedGoal: String(body.detailedGoal || "").trim(),
      description: String(body.description || "").trim(),
      status: "przekazany-do-weryfikacji",
      attachments,
      createdAt: new Date().toISOString()
    };
    data.expenses.unshift(expense);
    writeData(data);
    sendJson(res, 201, expense);
    return;
  }

  if (req.method === "PATCH" && url.pathname.startsWith("/api/expenses/")) {
    const id = url.pathname.split("/").pop();
    const body = await readBody(req);
    const expense = data.expenses.find((item) => item.id === id);
    if (!expense) {
      sendJson(res, 404, { error: "Wydatek nie zostal znaleziony." });
      return;
    }
    expense.status = String(body.status || expense.status);
    writeData(data);
    sendJson(res, 200, expense);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/documents") {
    const body = await readBody(req);
    const actorId = String(body.actorId || "admin");
    if (actorId !== "admin" && actorId !== body.beneficiaryId) {
      sendJson(res, 403, { error: "Beneficjent moze dodac dokument tylko we wlasnym widoku." });
      return;
    }
    const beneficiary = data.beneficiaries.find((item) => item.id === body.beneficiaryId && item.id !== "admin");
    if (!beneficiary) {
      sendJson(res, 400, { error: "Wybierz beneficjenta dla dokumentu." });
      return;
    }
    const attachments = saveBase64Files(beneficiary, body.files, "documents");
    const document = {
      id: makeId("doc"),
      beneficiaryId: beneficiary.id,
      title: String(body.title || attachments[0]?.fileName || "Nowy dokument").trim(),
      category: String(body.category || "Inne").trim(),
      owner: String(body.owner || (actorId === "admin" ? "ADMIN" : beneficiary.name)).trim(),
      status: String(body.status || "do-weryfikacji").trim(),
      note: String(body.note || "").trim(),
      attachments,
      createdAt: new Date().toISOString()
    };
    data.documents.unshift(document);
    writeData(data);
    sendJson(res, 201, document);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/calendar") {
    const body = await readBody(req);
    const validated = validateCalendarPayload(data, body);
    if (validated.error) {
      sendJson(res, 400, { error: validated.error });
      return;
    }
    const attachments = saveBase64Files(validated.beneficiary, body.files, "uploads");
    const item = {
      id: makeId("cal"),
      beneficiaryId: validated.beneficiary.id,
      title: String(body.title || "").trim(),
      startAt: validated.startAt,
      endAt: validated.endAt,
      ownerId: validated.actor.id,
      participantIds: validated.participantIds,
      type: String(body.type || "zadanie").trim(),
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
    const attachments = saveBase64Files(validated.beneficiary, body.files, "uploads");
    item.beneficiaryId = validated.beneficiary.id;
    item.title = String(body.title || "").trim();
    item.startAt = validated.startAt;
    item.endAt = validated.endAt;
    item.participantIds = validated.participantIds;
    item.type = String(body.type || item.type || "zadanie").trim();
    item.note = String(body.note || "").trim();
    item.attachments = [...(item.attachments || []), ...attachments];
    writeData(data);
    sendJson(res, 200, item);
    return;
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/calendar/")) {
    const id = url.pathname.split("/").pop();
    const actorId = url.searchParams.get("actorId") || "";
    const item = data.calendar.find((entry) => entry.id === id);
    if (!item) {
      sendJson(res, 404, { error: "Wydarzenie nie zostalo znalezione." });
      return;
    }
    if (actorId !== "admin" && item.ownerId !== actorId && !(item.participantIds || []).includes(actorId)) {
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
