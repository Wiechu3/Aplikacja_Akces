const state = {
  activeView: "start",
  actorId: "admin",
  scopeBeneficiaryId: "all",
  showDocumentForm: false,
  startupCardBeneficiaryId: "",
  calendarDate: new Date(),
  calendarView: "dayGridMonth",
  calendarModal: null,
  data: {
    actorId: "admin",
    scopeBeneficiaryId: "all",
    beneficiaries: [],
    expenses: [],
    documents: [],
    calendar: [],
    startupCards: {},
    tutorials: []
  }
};

const statusLabels = {
  "roboczy": "roboczy",
  "przekazany-do-weryfikacji": "przekazany do weryfikacji",
  "zatwierdzony": "zatwierdzony",
  "odrzucony": "odrzucony",
  "przekazany-do-ksiegowosci": "przekazany do ksiegowosci",
  "wyplacony": "wyplacony",
  "do-pobrania": "do pobrania",
  "do-weryfikacji": "do weryfikacji",
  "do-zrobienia": "do zrobienia",
  "wykonane": "wykonane"
};

const expenseStatusOptions = [
  "roboczy",
  "przekazany-do-weryfikacji",
  "zatwierdzony",
  "odrzucony",
  "przekazany-do-ksiegowosci",
  "wyplacony"
];

const documentStatusOptions = ["do-weryfikacji", "do-pobrania", "zatwierdzony", "odrzucony"];
const vatOptions = ["23", "8", "5", "0", "zw"];
const goalOptions = Array.from({ length: 10 }, (_, index) => String(index + 1));
const calendarColors = [
  { value: "#f26a21", label: "pomaranczowy" },
  { value: "#218763", label: "zielony" },
  { value: "#2563eb", label: "niebieski" },
  { value: "#7c3aed", label: "fioletowy" },
  { value: "#b76a00", label: "bursztynowy" },
  { value: "#bf2e2e", label: "czerwony" }
];

const reportLabels = {
  expenses: "Wydatki",
  documents: "Dokumenty",
  calendar: "Kalendarz"
};

const startupFields = [
  ["companyName", "Nazwa spolki"],
  ["acronym", "Akronim"],
  ["nip", "NIP"],
  ["krs", "KRS"],
  ["regon", "REGON"],
  ["contactPeople", "Osoby kontaktowe"],
  ["mailingAddress", "Dane do korespondencji"],
  ["projectSupervisor", "Opiekun projektu"],
  ["mentors", "Mentorzy"],
  ["experts", "Eksperci"],
  ["projectSchedule", "Harmonogram projektu"],
  ["projectScope", "Zakres projektu"],
  ["contractAttachments", "Umowa i zalaczniki"],
  ["documentStatus", "Status dokumentow"]
];

const app = document.querySelector("#app");
const actorSelect = document.querySelector("#actor-select");
const scopeSelect = document.querySelector("#scope-select");
const scopeField = scopeSelect.closest(".field.compact");
const toast = document.querySelector("#toast");

function money(value) {
  return Number(value || 0).toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN"
  });
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pl-PL").format(new Date(`${value}T00:00:00`));
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toLocalDateTimeValue(value) {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function addMinutesToDateTime(value, minutes) {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() + minutes);
  return toLocalDateTimeValue(date);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    throw new Error(payload.error || "Operacja nie powiodla sie.");
  }
  return payload;
}

function getBeneficiary(id = state.scopeBeneficiaryId) {
  return state.data.beneficiaries.find((item) => item.id === id) || null;
}

function activeActor() {
  return getBeneficiary(state.actorId) || state.data.beneficiaries.find((item) => item.id === "admin");
}

function isAdmin() {
  return state.actorId === "admin";
}

function beneficiaryList() {
  return state.data.beneficiaries.filter((beneficiary) => beneficiary.id !== "admin" && beneficiary.active);
}

function currentScopeLabel() {
  if (isAdmin() && state.scopeBeneficiaryId === "all") return "wszyscy beneficjenci";
  return getBeneficiary(state.scopeBeneficiaryId)?.name || activeActor()?.name || "aktualny beneficjent";
}

function effectiveBeneficiaryId() {
  if (!isAdmin()) return state.actorId;
  if (state.scopeBeneficiaryId !== "all") return state.scopeBeneficiaryId;
  return "";
}

function canAdminEditSelectedBeneficiary() {
  return isAdmin() && (state.scopeBeneficiaryId !== "all" || beneficiaryList().length > 0);
}

async function loadState() {
  state.data = await api(`/api/state?actorId=${encodeURIComponent(state.actorId)}&scopeBeneficiaryId=${encodeURIComponent(state.scopeBeneficiaryId)}`);
  state.actorId = state.data.actorId || state.actorId;
  state.scopeBeneficiaryId = state.data.scopeBeneficiaryId || state.scopeBeneficiaryId;
  if (!state.startupCardBeneficiaryId || !state.data.startupCards[state.startupCardBeneficiaryId]) {
    state.startupCardBeneficiaryId = effectiveBeneficiaryId() || Object.keys(state.data.startupCards)[0] || "";
  }
  renderShell();
  renderView();
}

function setView(view) {
  state.activeView = view;
  if (view !== "documents") state.showDocumentForm = false;
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  renderView();
}

function renderShell() {
  const actorPrevious = state.actorId;
  actorSelect.innerHTML = state.data.beneficiaries
    .filter((beneficiary) => beneficiary.active || beneficiary.id === "admin")
    .map((beneficiary) => `<option value="${beneficiary.id}">${escapeHtml(beneficiary.name)}</option>`)
    .join("");
  actorSelect.value = state.data.beneficiaries.some((item) => item.id === actorPrevious) ? actorPrevious : "admin";

  if (isAdmin()) {
    scopeField.hidden = false;
    scopeField.style.display = "";
    scopeSelect.disabled = false;
    scopeSelect.innerHTML = `
      <option value="all">Wszyscy beneficjenci</option>
      ${beneficiaryOptions(state.scopeBeneficiaryId)}
    `;
    scopeSelect.value = state.scopeBeneficiaryId;
  } else {
    scopeField.hidden = true;
    scopeField.style.display = "none";
    scopeSelect.disabled = true;
    scopeSelect.innerHTML = `<option value="${state.actorId}">${escapeHtml(activeActor()?.name || "Beneficjent")}</option>`;
    scopeSelect.value = state.actorId;
  }
}

function beneficiaryOptions(selectedId = "") {
  return beneficiaryList()
    .map((beneficiary) => {
      const selected = beneficiary.id === selectedId ? "selected" : "";
      return `<option value="${beneficiary.id}" ${selected}>${escapeHtml(beneficiary.name)}</option>`;
    })
    .join("");
}

function optionList(values, selected = "", formatter = (value) => value) {
  return values.map((value) => `<option value="${value}" ${String(value) === String(selected) ? "selected" : ""}>${formatter(value)}</option>`).join("");
}

function attachmentList(attachments = []) {
  if (!attachments.length) return "";
  return `
    <ul class="attachment-list">
      ${attachments
        .map((file) => {
          const kind = file.kind === "invoice" ? "Faktura/Rachunek" : file.kind === "other" ? "Pozostale" : "Plik";
          return `<li><a href="/api/files/${encodeURIComponent(file.id)}?actorId=${encodeURIComponent(state.actorId)}" target="_blank" rel="noopener">${escapeHtml(kind)}: ${escapeHtml(file.fileName)}</a></li>`;
        })
        .join("")}
    </ul>
  `;
}

function pageHead(title, description, action = "") {
  return `
    <div class="section-head">
      <div>
        <p class="eyebrow">${escapeHtml(currentScopeLabel())}</p>
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
      ${action}
    </div>
  `;
}

function renderStart() {
  const totalGross = state.data.expenses.reduce((sum, expense) => sum + Number(expense.grossAmount || 0), 0);
  const totalNet = state.data.expenses.reduce((sum, expense) => sum + Number(expense.netAmount || 0), 0);
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">${escapeHtml(currentScopeLabel())}</p>
        <h1>Akces NCBR</h1>
        <p>
          Jedno miejsce do prowadzenia rozliczen, dokumentow, karty startupu i terminow.
          ADMIN moze pracowac na wszystkich danych albo zawezic widok do jednego beneficjenta.
        </p>
        <div class="hero-actions">
          <button class="button" data-go="startup-card">Karta Startupu</button>
          <button class="button secondary" data-go="expenses">Wydatki</button>
          <button class="button ghost" data-go="calendar">Kalendarz</button>
        </div>
      </div>
      <div class="hero-board" aria-label="Podsumowanie">
        <div class="metric-tile">
          <strong>${state.data.expenses.length}</strong>
          <span>wydatki w aktualnym zakresie</span>
        </div>
        <div class="metric-tile">
          <strong>${money(totalNet)}</strong>
          <span>laczna kwota netto</span>
        </div>
        <div class="metric-tile">
          <strong>${money(totalGross)}</strong>
          <span>laczna kwota brutto</span>
        </div>
      </div>
    </section>
    <section class="feature-grid" style="margin-top: 16px;">
      <article class="feature-tile">
        <h3>Karta Startupu</h3>
        <p>Podstawowe dane beneficjenta, zespol, harmonogram, zakres projektu i status dokumentow.</p>
      </article>
      <article class="feature-tile">
        <h3>Wydatki z zalacznikami</h3>
        <p>Faktura albo inny dokument sa wymagane, a VAT i brutto licza sie automatycznie.</p>
      </article>
      <article class="feature-tile">
        <h3>Dokumenty lokalne</h3>
        <p>Pliki trafiaja do folderow beneficjenta i sa dostepne z poziomu listy dokumentow.</p>
      </article>
      <article class="feature-tile">
        <h3>Kalendarz kolorami</h3>
        <p>Wydarzenia maja start, koniec, kolor i szybkie dodawanie przez plus w dniu.</p>
      </article>
    </section>
  `;
}

function renderStartupCard() {
  const beneficiaries = beneficiaryList();
  const selectedId = effectiveBeneficiaryId() || state.startupCardBeneficiaryId || beneficiaries[0]?.id || "";
  state.startupCardBeneficiaryId = selectedId;
  const card = state.data.startupCards[selectedId] || {};
  const selectedBeneficiary = getBeneficiary(selectedId);
  const editable = isAdmin() && Boolean(selectedId);
  const beneficiaryChooser = isAdmin() && state.scopeBeneficiaryId === "all"
    ? `<div class="field context-field">
        <label for="startup-beneficiary">Beneficjent</label>
        <select id="startup-beneficiary">${beneficiaryOptions(selectedId)}</select>
      </div>`
    : "";
  const fields = startupFields
    .map(([name, label]) => `
      <div class="field ${["contactPeople", "mailingAddress", "mentors", "experts", "projectSchedule", "projectScope", "contractAttachments", "documentStatus"].includes(name) ? "is-wide" : ""}">
        <label for="startup-${name}">${label}</label>
        ${editable
          ? `<textarea id="startup-${name}" name="${name}" ${["companyName", "acronym", "nip", "krs", "regon", "projectSupervisor"].includes(name) ? "class=\"short-textarea\"" : ""}>${escapeHtml(card[name] || "")}</textarea>`
          : `<div class="readonly-box">${escapeHtml(card[name] || "-")}</div>`}
      </div>
    `)
    .join("");

  app.innerHTML = `
    ${pageHead(
      "Karta Startupu",
      selectedBeneficiary
        ? "ADMIN edytuje dane karty, a beneficjent ma aktualny podglad najwazniejszych informacji o projekcie."
        : "Wybierz beneficjenta, zeby zobaczyc lub uzupelnic Karte Startupu.",
      beneficiaryChooser
    )}
    <form class="form-panel startup-form" id="startup-card-form">
      <input type="hidden" name="beneficiaryId" value="${escapeHtml(selectedId)}" />
      <div class="form-grid">
        ${fields || `<div class="empty-state">Brak aktywnych beneficjentow.</div>`}
        <div class="field is-wide">
          <label for="startup-bio">BIO / opis startupu</label>
          ${editable
            ? `<textarea id="startup-bio" name="bio" class="bio-textarea">${escapeHtml(card.bio || "")}</textarea>`
            : `<div class="readonly-box large">${escapeHtml(card.bio || "-")}</div>`}
        </div>
      </div>
      ${editable
        ? `<div class="form-actions">
            <button class="button" type="submit">Zapisz Karte Startupu</button>
          </div>`
        : ""}
    </form>
  `;
}

function renderExpenses() {
  const totalNet = state.data.expenses.reduce((sum, expense) => sum + Number(expense.netAmount || 0), 0);
  const totalGross = state.data.expenses.reduce((sum, expense) => sum + Number(expense.grossAmount || 0), 0);
  const rows = state.data.expenses.map((expense) => {
    const beneficiary = getBeneficiary(expense.beneficiaryId);
    const statusControl = isAdmin()
      ? `<select data-status-expense="${expense.id}">${expenseStatusOptions.map((status) => `<option value="${status}" ${status === expense.status ? "selected" : ""}>${statusLabels[status]}</option>`).join("")}</select>`
      : `<span class="status-pill" data-status="${expense.status}">${statusLabels[expense.status] || expense.status}</span>`;
    return `
      <tr data-priority="${escapeHtml(expense.priorityGoal)}" data-detail="${escapeHtml(expense.detailedGoal)}">
        <td><strong>${escapeHtml(beneficiary?.name || "-")}</strong></td>
        <td>${escapeHtml(expense.invoiceNumber || "-")}</td>
        <td>${escapeHtml(expense.contractor || "-")}</td>
        <td>${formatDate(expense.invoiceDate)}</td>
        <td>${formatDate(expense.paymentDate)}</td>
        <td>${money(expense.netAmount)}</td>
        <td>${escapeHtml(expense.vatRate === "zw" ? "zw" : `${expense.vatRate}%`)}</td>
        <td>${money(expense.vatAmount)}</td>
        <td><strong>${money(expense.grossAmount)}</strong></td>
        <td>${escapeHtml(expense.priorityGoal || "-")}</td>
        <td>${escapeHtml(expense.detailedGoal || "-")}</td>
        <td>${attachmentList(expense.attachments || []) || "-"}</td>
        <td>${statusControl}</td>
      </tr>
    `;
  });

  app.innerHTML = `
    ${pageHead(
      "Wydatki",
      isAdmin()
        ? "ADMIN moze dodawac wydatki w imieniu beneficjenta i zmieniac statusy."
        : "Beneficjent widzi i dodaje tylko swoje wydatki.",
      `<button class="button" data-go="add-expense">Dodaj wydatek</button>`
    )}
    <section class="summary-strip">
      <article><span>Wydatki</span><strong>${state.data.expenses.length}</strong></article>
      <article><span>Razem netto</span><strong>${money(totalNet)}</strong></article>
      <article><span>Razem brutto</span><strong>${money(totalGross)}</strong></article>
    </section>
    <section class="table-shell">
      <div class="table-tools compact-tools">
        <div class="field">
          <label for="expense-search">Szukaj</label>
          <input id="expense-search" type="search" placeholder="Faktura, kontrahent, opis" />
        </div>
        <div class="field">
          <label for="priority-filter">Cel priorytetowy</label>
          <select id="priority-filter">
            <option value="">Wszystkie</option>
            ${optionList(goalOptions)}
          </select>
        </div>
        <div class="field">
          <label for="detail-filter">Cel szczegolowy</label>
          <select id="detail-filter">
            <option value="">Wszystkie</option>
            ${optionList(goalOptions)}
          </select>
        </div>
        <div class="field">
          <label for="status-filter">Status</label>
          <select id="status-filter">
            <option value="">Wszystkie</option>
            ${expenseStatusOptions.map((status) => `<option value="${status}">${statusLabels[status]}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Beneficjent</th>
              <th>Numer</th>
              <th>Kontrahent</th>
              <th>Faktura</th>
              <th>Platnosc</th>
              <th>Netto</th>
              <th>VAT</th>
              <th>Kwota VAT</th>
              <th>Brutto</th>
              <th>Cel P</th>
              <th>Cel S</th>
              <th>Zalaczniki</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="expenses-body">${rows.join("") || `<tr><td colspan="13" class="empty-state">Brak wydatkow w tym zakresie.</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderAddExpense() {
  const selected = effectiveBeneficiaryId();
  const adminChooser = isAdmin()
    ? `<div class="field">
        <label for="expense-beneficiary">Beneficjent</label>
        <select id="expense-beneficiary" name="beneficiaryId" required>
          <option value="">Wybierz beneficjenta</option>
          ${beneficiaryOptions(selected)}
        </select>
      </div>`
    : `<input type="hidden" name="beneficiaryId" value="${state.actorId}" />
      <div class="field">
        <label>Beneficjent</label>
        <input value="${escapeHtml(activeActor()?.name || "")}" disabled />
      </div>`;

  app.innerHTML = `
    ${pageHead("Dodaj wydatek", "Dodaj dane faktury, wybierz VAT i dolacz przynajmniej jeden plik.")}
    <form class="form-panel" id="expense-form">
      <input type="hidden" name="actorId" value="${state.actorId}" />
      <div class="form-grid">
        ${adminChooser}
        <div class="field">
          <label for="invoiceNumber">Numer faktury/rachunku</label>
          <input id="invoiceNumber" name="invoiceNumber" required />
        </div>
        <div class="field">
          <label for="contractor">Kontrahent</label>
          <input id="contractor" name="contractor" required />
        </div>
        <div class="field">
          <label for="invoiceDate">Data faktury</label>
          <input id="invoiceDate" name="invoiceDate" type="date" required />
        </div>
        <div class="field">
          <label for="paymentDate">Data platnosci</label>
          <input id="paymentDate" name="paymentDate" type="date" />
        </div>
        <div class="field">
          <label for="acquisitionMethod">Sposob nabycia / platnosci</label>
          <input id="acquisitionMethod" name="acquisitionMethod" placeholder="np. przelew, karta, gotowka" />
        </div>
        <div class="field">
          <label for="netAmount">Kwota netto</label>
          <input id="netAmount" name="netAmount" type="number" min="0" step="0.01" required />
        </div>
        <div class="field">
          <label for="vatRate">Stawka VAT</label>
          <select id="vatRate" name="vatRate" required>
            ${optionList(vatOptions, "23", (value) => value === "zw" ? "zw" : `${value}%`)}
          </select>
        </div>
        <div class="field">
          <label for="vatAmount">Kwota VAT</label>
          <input id="vatAmount" name="vatAmount" type="number" min="0" step="0.01" readonly />
        </div>
        <div class="field">
          <label for="grossAmount">Kwota brutto</label>
          <input id="grossAmount" name="grossAmount" type="number" min="0" step="0.01" readonly />
        </div>
        <div class="field">
          <label for="priorityGoal">Cel priorytetowy</label>
          <select id="priorityGoal" name="priorityGoal" required>
            <option value="">Wybierz</option>
            ${optionList(goalOptions)}
          </select>
        </div>
        <div class="field">
          <label for="detailedGoal">Cel szczegolowy</label>
          <select id="detailedGoal" name="detailedGoal" required>
            <option value="">Wybierz</option>
            ${optionList(goalOptions)}
          </select>
        </div>
        <div class="field">
          <label for="invoice-files">Faktura/Rachunek</label>
          <input id="invoice-files" name="invoiceFiles" type="file" multiple />
        </div>
        <div class="field">
          <label for="other-files">Pozostale dokumenty</label>
          <input id="other-files" name="otherFiles" type="file" multiple />
        </div>
        <div class="field is-wide">
          <label for="description">Opis kosztu</label>
          <textarea id="description" name="description" required></textarea>
        </div>
      </div>
      <div class="form-actions">
        <button class="button" type="submit">Zapisz wydatek</button>
        <button class="button secondary" type="button" data-go="expenses">Wroc do listy</button>
      </div>
    </form>
  `;
  calculateExpenseTotals();
}

function renderDocuments() {
  const selected = effectiveBeneficiaryId();
  const cards = state.data.documents.map((document) => {
    const beneficiary = getBeneficiary(document.beneficiaryId);
    const statusControl = isAdmin()
      ? `<select data-status-document="${document.id}">${documentStatusOptions.map((status) => `<option value="${status}" ${status === document.status ? "selected" : ""}>${statusLabels[status]}</option>`).join("")}</select>`
      : `<span class="status-pill" data-status="${document.status}">${statusLabels[document.status] || document.status}</span>`;
    return `
      <article class="doc-card">
        <div>
          <h3>${escapeHtml(document.title)}</h3>
          <p class="meta">
            <span>${escapeHtml(beneficiary?.name || "-")}</span>
            <span>${escapeHtml(document.category)}</span>
            <span>${formatDate(String(document.createdAt || "").slice(0, 10))}</span>
          </p>
          <p>${escapeHtml(document.note || "Brak dodatkowych uwag.")}</p>
          ${attachmentList(document.attachments || [])}
        </div>
        <div class="status-cell">${statusControl}</div>
      </article>
    `;
  });

  const form = state.showDocumentForm
    ? `
      <form class="form-panel" id="document-form">
        <input type="hidden" name="actorId" value="${state.actorId}" />
        <div class="form-grid">
          ${
            isAdmin()
              ? `<div class="field">
                  <label for="document-beneficiary">Beneficjent</label>
                  <select id="document-beneficiary" name="beneficiaryId" required>
                    <option value="">Wybierz beneficjenta</option>
                    ${beneficiaryOptions(selected)}
                  </select>
                </div>`
              : `<input type="hidden" name="beneficiaryId" value="${state.actorId}" />
                <div class="field">
                  <label>Beneficjent</label>
                  <input value="${escapeHtml(activeActor()?.name || "")}" disabled />
                </div>`
          }
          <div class="field">
            <label for="document-title">Nazwa dokumentu</label>
            <input id="document-title" name="title" required />
          </div>
          <div class="field">
            <label for="document-category">Kategoria</label>
            <input id="document-category" name="category" placeholder="np. Harmonogram, Umowa, Monitoring" required />
          </div>
          <div class="field">
            <label for="document-status">Status</label>
            <select id="document-status" name="status">
              ${documentStatusOptions.map((status) => `<option value="${status}">${statusLabels[status]}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="document-files">Zalaczniki</label>
            <input id="document-files" name="files" type="file" multiple />
          </div>
          <div class="field is-wide">
            <label for="document-note">Opis / uwagi</label>
            <textarea id="document-note" name="note"></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button class="button" type="submit">Zapisz dokument</button>
          <button class="button secondary" type="button" data-hide-document-form>Schowaj formularz</button>
        </div>
      </form>
    `
    : "";

  app.innerHTML = `
    ${pageHead(
      "Dokumenty",
      "Dokumenty sa przypisane do beneficjenta, a pliki sa zapisywane lokalnie w jego folderze.",
      `<button class="button" data-show-document-form>Dodaj dokument</button>`
    )}
    <section class="doc-category-strip">
      <article>
        <strong>Umowy i zalaczniki</strong>
        <span>pliki formalne powiazane z projektem</span>
      </article>
      <article>
        <strong>Monitoring</strong>
        <span>harmonogramy, notatki i dokumenty kontrolne</span>
      </article>
      <article>
        <strong>Dokumenty beneficjenta</strong>
        <span>materialy przekazywane do weryfikacji</span>
      </article>
    </section>
    ${form}
    <section class="doc-list" style="margin-top: 16px;">
      ${cards.join("") || `<div class="empty-state card">Brak dokumentow w tym zakresie.</div>`}
    </section>
  `;
}

function participantOptions(selectedIds = []) {
  const allowed = isAdmin()
    ? beneficiaryList()
    : state.data.beneficiaries.filter((beneficiary) => beneficiary.id === "admin" || beneficiary.id === state.actorId);

  return allowed
    .map((beneficiary) => {
      const checked = selectedIds.includes(beneficiary.id) || (!isAdmin() && beneficiary.id === "admin") || (!isAdmin() && beneficiary.id === state.actorId);
      const disabled = !isAdmin() && beneficiary.id === state.actorId;
      return `
        <label class="check-row">
          <input type="checkbox" name="participantIds" value="${beneficiary.id}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
          <span>${escapeHtml(beneficiary.name)}</span>
        </label>
      `;
    })
    .join("");
}

function calendarEventStart(item) {
  return item.startAt || `${item.dueDate || dateKey(new Date())}T${item.dueTime || "09:00"}`;
}

function calendarEventEnd(item) {
  return item.endAt || addMinutesToDateTime(calendarEventStart(item), 60);
}

function calendarParticipants(item) {
  return [...new Set([item.beneficiaryId, ...(item.participantIds || []), ...(item.invitedIds || [])].filter(Boolean))];
}

function calendarPayloadFromEvent(item) {
  const participants = calendarParticipants(item);
  const names = participants.map((id) => getBeneficiary(id)?.name).filter(Boolean);
  const color = item.color || "#f26a21";
  return {
    id: item.id,
    title: item.title,
    start: calendarEventStart(item),
    end: calendarEventEnd(item),
    backgroundColor: color,
    borderColor: color,
    extendedProps: {
      note: item.note || "",
      participantIds: participants,
      participantNames: names,
      attachments: item.attachments || [],
      color
    }
  };
}

function renderCalendarModal() {
  const modal = state.calendarModal;
  if (!modal) return "";
  const event = modal.eventId ? state.data.calendar.find((item) => item.id === modal.eventId) : null;
  const startAt = event ? calendarEventStart(event) : modal.startAt;
  const endAt = event ? calendarEventEnd(event) : modal.endAt || addMinutesToDateTime(startAt, 60);
  const defaultBeneficiary = event?.beneficiaryId || effectiveBeneficiaryId() || "";
  const selectedIds = event ? calendarParticipants(event) : isAdmin() ? [defaultBeneficiary].filter(Boolean) : [state.actorId, "admin"];
  const color = event?.color || modal.color || "#f26a21";
  const beneficiaryField = isAdmin()
    ? `<div class="field">
        <label for="calendar-beneficiary">Beneficjent</label>
        <select id="calendar-beneficiary" name="beneficiaryId" required>
          <option value="">Wybierz beneficjenta</option>
          ${beneficiaryOptions(defaultBeneficiary)}
        </select>
      </div>`
    : `<input type="hidden" name="beneficiaryId" value="${state.actorId}" />`;

  return `
    <div class="modal-backdrop" data-close-calendar-modal>
      <section class="modal" role="dialog" aria-modal="true" aria-label="${event ? "Edytuj wydarzenie" : "Dodaj wydarzenie"}" data-modal-panel>
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Kalendarz</p>
            <h1>${event ? "Edytuj wydarzenie" : "Dodaj wydarzenie"}</h1>
          </div>
          <button class="button ghost" type="button" data-close-calendar-modal>Zamknij</button>
        </div>
        <form id="calendar-form" class="form-panel">
          <input type="hidden" name="id" value="${escapeHtml(event?.id || "")}" />
          <input type="hidden" name="actorId" value="${state.actorId}" />
          <div class="form-grid">
            ${beneficiaryField}
            <div class="field is-wide">
              <label for="calendar-title">Nazwa wydarzenia</label>
              <input id="calendar-title" name="title" value="${escapeHtml(event?.title || "")}" required />
            </div>
            <div class="field">
              <label for="calendar-start">Start</label>
              <input id="calendar-start" name="startAt" type="datetime-local" value="${escapeHtml(startAt)}" required />
            </div>
            <div class="field">
              <label for="calendar-end">Koniec</label>
              <input id="calendar-end" name="endAt" type="datetime-local" value="${escapeHtml(endAt)}" required />
            </div>
            <div class="field">
              <label for="calendar-color">Kolor</label>
              <select id="calendar-color" name="color">
                ${calendarColors.map((item) => `<option value="${item.value}" ${item.value === color ? "selected" : ""}>${item.label}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label for="calendar-files">Zalaczniki</label>
              <input id="calendar-files" name="files" type="file" multiple />
            </div>
            <div class="field is-wide">
              <label>Uzytkownicy przypisani</label>
              <div class="check-grid">${participantOptions(selectedIds)}</div>
            </div>
            <div class="field is-wide">
              <label for="calendar-note">Opis</label>
              <textarea id="calendar-note" name="note">${escapeHtml(event?.note || "")}</textarea>
            </div>
          </div>
          <div class="form-actions">
            <button class="button" type="submit">${event ? "Zapisz zmiany" : "Dodaj wydarzenie"}</button>
            ${event ? `<button class="button ghost" type="button" data-delete-calendar-event="${event.id}">Usun</button>` : ""}
          </div>
        </form>
      </section>
    </div>
  `;
}

function mountFullCalendar() {
  const element = document.querySelector("#fullcalendar");
  if (!element) return;
  if (!window.FullCalendar) {
    element.innerHTML = `<div class="empty-state">Nie udalo sie zaladowac biblioteki kalendarza.</div>`;
    return;
  }

  const calendar = new window.FullCalendar.Calendar(element, {
    initialView: state.calendarView,
    initialDate: state.calendarDate,
    locale: "pl",
    firstDay: 1,
    height: "auto",
    nowIndicator: true,
    editable: true,
    selectable: true,
    navLinks: true,
    eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },
    buttonText: {
      today: "Dzisiaj",
      month: "Miesiac",
      week: "Tydzien",
      day: "Dzien"
    },
    events: state.data.calendar.map(calendarPayloadFromEvent),
    datesSet(info) {
      state.calendarView = info.view.type;
      state.calendarDate = info.view.currentStart;
    },
    dayCellContent(info) {
      const date = dateKey(info.date);
      return {
        html: `
          <div class="fc-day-topline">
            <a class="fc-daygrid-day-number">${info.dayNumberText}</a>
            <button class="calendar-add-button" type="button" data-calendar-add="${date}" aria-label="Dodaj wydarzenie ${date}">+</button>
          </div>
        `
      };
    },
    dateClick(info) {
      const startAt = info.dateStr.includes("T") ? toLocalDateTimeValue(info.date) : `${info.dateStr}T09:00`;
      state.calendarModal = { startAt, endAt: addMinutesToDateTime(startAt, 60) };
      renderCalendar();
    },
    select(info) {
      state.calendarModal = {
        startAt: toLocalDateTimeValue(info.start),
        endAt: toLocalDateTimeValue(info.end)
      };
      renderCalendar();
    },
    eventClick(info) {
      state.calendarModal = { eventId: info.event.id };
      renderCalendar();
    },
    eventContent(info) {
      const names = info.event.extendedProps.participantNames || [];
      return {
        html: `
          <div class="fc-akces-event">
            <strong>${escapeHtml(info.event.title)}</strong>
            ${names.length ? `<span>${escapeHtml(names.join(", "))}</span>` : ""}
            <span class="event-edit-label">Edytuj</span>
          </div>
        `
      };
    },
    async eventDrop(info) {
      await persistCalendarMove(info);
    },
    async eventResize(info) {
      await persistCalendarMove(info);
    }
  });

  calendar.render();
}

function renderCalendar() {
  app.innerHTML = `
    ${pageHead(
      "Kalendarz",
      "Wydarzenia maja start, koniec i kolor. Plus przy dniu szybko otwiera dodawanie wydarzenia.",
      `<button class="button" data-open-calendar-modal>Dodaj wydarzenie</button>`
    )}
    <section class="calendar-shell fullcalendar-shell">
      <div id="fullcalendar"></div>
    </section>
    ${renderCalendarModal()}
  `;
  mountFullCalendar();
}

function renderReports() {
  const totalGross = state.data.expenses.reduce((sum, expense) => sum + Number(expense.grossAmount || 0), 0);
  const approved = state.data.expenses.filter((expense) => expense.status === "zatwierdzony" || expense.status === "wyplacony").length;
  const scopeFieldMarkup = isAdmin()
    ? `<div class="field">
        <label for="report-scope">Zakres</label>
        <select id="report-scope" name="scopeBeneficiaryId">
          <option value="all">Wszyscy beneficjenci</option>
          ${beneficiaryOptions(state.scopeBeneficiaryId)}
        </select>
      </div>`
    : `<input type="hidden" name="scopeBeneficiaryId" value="${state.actorId}" />
      <div class="field">
        <label>Zakres</label>
        <input value="${escapeHtml(activeActor()?.name || "Aktualny beneficjent")}" disabled />
      </div>`;

  app.innerHTML = `
    ${pageHead("Raporty", "Generator raportow pozwala wybrac typ danych, zakres i format eksportu.")}
    <section class="card-grid">
      <article class="card">
        <h3>Liczba wydatkow</h3>
        <p><strong>${state.data.expenses.length}</strong></p>
      </article>
      <article class="card">
        <h3>Kwota brutto</h3>
        <p><strong>${money(totalGross)}</strong></p>
      </article>
      <article class="card">
        <h3>Zatwierdzone / wyplacone</h3>
        <p><strong>${approved}</strong></p>
      </article>
      <article class="card">
        <h3>Dokumenty</h3>
        <p><strong>${state.data.documents.length}</strong></p>
      </article>
    </section>
    <form class="form-panel report-generator" id="report-form" style="margin-top: 16px;">
      <div class="form-grid">
        <div class="field">
          <label for="report-type">Typ raportu</label>
          <select id="report-type" name="type">
            ${Object.entries(reportLabels).map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}
          </select>
        </div>
        ${scopeFieldMarkup}
        <div class="field">
          <label for="report-format">Format</label>
          <select id="report-format" name="format">
            <option value="xlsx">Excel (.xlsx)</option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button class="button" type="submit">Generuj raport</button>
      </div>
    </form>
  `;
}

function renderTutorial() {
  app.innerHTML = `
    ${pageHead("Samouczek", "Krotkie instrukcje dla beneficjenta ograniczaja liczbe dodatkowych pytan po stronie zespolu.")}
    <section class="tutorial-list">
      ${state.data.tutorials.map((tutorial) => `
        <article class="card">
          <h3>${escapeHtml(tutorial.title)}</h3>
          <p>${escapeHtml(tutorial.body)}</p>
        </article>
      `).join("")}
      <article class="card">
        <h3>Jakie dokumenty dodawac</h3>
        <p>W zakladce Dokumenty dodawaj harmonogramy, umowy, zalaczniki monitoringowe i inne pliki wymagane przez administratora.</p>
      </article>
    </section>
  `;
}

function renderSettings() {
  const isAdminActive = isAdmin();
  app.innerHTML = `
    ${pageHead("Ustawienia", "Administrator dodaje beneficjentow. Dla kazdego beneficjenta aplikacja tworzy lokalne foldery na pliki i dane.")}
    <section class="settings-grid">
      <form class="form-panel" id="beneficiary-form">
        <input type="hidden" name="actorId" value="${state.actorId}" />
        <div class="field">
          <label for="beneficiary-name">Nazwa beneficjenta</label>
          <input id="beneficiary-name" name="name" ${isAdminActive ? "" : "disabled"} required />
        </div>
        <div class="form-actions">
          <button class="button" type="submit" ${isAdminActive ? "" : "disabled"}>Dodaj beneficjenta</button>
        </div>
        <p class="context-note">
          ${isAdminActive ? "Nowy beneficjent pojawi sie w gornym wyborze zakresu danych." : "Dodawanie beneficjentow jest dostepne po przelaczeniu pola Dzialam jako na ADMIN."}
        </p>
      </form>
      <div class="beneficiary-list">
        ${state.data.beneficiaries.map((beneficiary) => `
          <article class="beneficiary-row">
            <div>
              <h3>${escapeHtml(beneficiary.name)}</h3>
              <p class="meta">
                <span>${beneficiary.role === "admin" ? "administrator" : "beneficjent"}</span>
                <span>local-data/beneficiaries/${escapeHtml(beneficiary.slug)}/</span>
                <span>${beneficiary.active ? "aktywny" : "nieaktywny"}</span>
              </p>
            </div>
            ${beneficiary.id === "admin" ? "" : `<button class="button secondary" data-toggle-beneficiary="${beneficiary.id}" ${isAdminActive ? "" : "disabled"}>${beneficiary.active ? "Dezaktywuj" : "Aktywuj"}</button>`}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderView() {
  const views = {
    start: renderStart,
    "startup-card": renderStartupCard,
    expenses: renderExpenses,
    "add-expense": renderAddExpense,
    documents: renderDocuments,
    calendar: renderCalendar,
    reports: renderReports,
    tutorial: renderTutorial,
    settings: renderSettings
  };
  views[state.activeView]?.();
}

function formDataToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function filesToPayload(files) {
  return Promise.all(
    Array.from(files || []).map((file) => {
      return new Promise((resolve, reject) => {
        if (file.size > 10 * 1024 * 1024) {
          reject(new Error("Pojedynczy plik przekracza limit 10 MB."));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, content: reader.result });
        reader.onerror = () => reject(new Error("Nie udalo sie odczytac pliku."));
        reader.readAsDataURL(file);
      });
    })
  );
}

function formCheckboxValues(form, name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function filterExpenses() {
  const search = document.querySelector("#expense-search")?.value.toLowerCase() || "";
  const priority = document.querySelector("#priority-filter")?.value || "";
  const detail = document.querySelector("#detail-filter")?.value || "";
  const status = document.querySelector("#status-filter")?.value || "";
  document.querySelectorAll("#expenses-body tr").forEach((row) => {
    if (!row.dataset.priority) return;
    const text = row.textContent.toLowerCase();
    const rowStatus = row.querySelector("[data-status]")?.dataset.status || row.querySelector("[data-status-expense]")?.value || "";
    const visible =
      text.includes(search) &&
      (!priority || row.dataset.priority === priority) &&
      (!detail || row.dataset.detail === detail) &&
      (!status || rowStatus === status);
    row.style.display = visible ? "" : "none";
  });
}

function calculateExpenseTotals() {
  const form = document.querySelector("#expense-form");
  if (!form) return;
  const net = Number(form.netAmount.value || 0);
  const rate = form.vatRate.value;
  const vat = rate === "zw" ? 0 : Math.round(net * (Number(rate) / 100) * 100) / 100;
  const gross = Math.round((net + vat) * 100) / 100;
  form.vatAmount.value = vat.toFixed(2);
  form.grossAmount.value = gross.toFixed(2);
}

async function persistCalendarMove(info) {
  const existing = state.data.calendar.find((item) => item.id === info.event.id);
  if (!existing) return;
  try {
    await api(`/api/calendar/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        actorId: state.actorId,
        title: existing.title,
        startAt: toLocalDateTimeValue(info.event.start),
        endAt: toLocalDateTimeValue(info.event.end || new Date(info.event.start.getTime() + 60 * 60 * 1000)),
        color: existing.color || "#f26a21",
        note: existing.note || "",
        participantIds: calendarParticipants(existing),
        files: []
      })
    });
    showToast("Zmieniono termin wydarzenia.");
    await loadState();
  } catch (error) {
    info.revert();
    showToast(error.message);
  }
}

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

actorSelect.addEventListener("change", async () => {
  state.actorId = actorSelect.value;
  state.scopeBeneficiaryId = state.actorId === "admin" ? "all" : state.actorId;
  if (state.activeView === "add-expense") state.activeView = "expenses";
  await loadState();
});

scopeSelect.addEventListener("change", async () => {
  state.scopeBeneficiaryId = scopeSelect.value;
  if (state.scopeBeneficiaryId !== "all") state.startupCardBeneficiaryId = state.scopeBeneficiaryId;
  await loadState();
});

document.addEventListener("click", async (event) => {
  const closeButton = event.target.closest("button[data-close-calendar-modal]");
  const backdropClick = event.target.classList.contains("modal-backdrop");
  if (closeButton || backdropClick) {
    state.calendarModal = null;
    renderCalendar();
    return;
  }

  const go = event.target.closest("[data-go]");
  if (go) {
    setView(go.dataset.go);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const calendarAdd = event.target.closest("[data-calendar-add]");
  if (calendarAdd) {
    event.preventDefault();
    event.stopPropagation();
    const startAt = `${calendarAdd.dataset.calendarAdd}T09:00`;
    state.calendarModal = { startAt, endAt: addMinutesToDateTime(startAt, 60) };
    renderCalendar();
    return;
  }

  if (event.target.closest("[data-show-document-form]")) {
    state.showDocumentForm = true;
    renderDocuments();
    return;
  }

  if (event.target.closest("[data-hide-document-form]")) {
    state.showDocumentForm = false;
    renderDocuments();
    return;
  }

  if (event.target.closest("[data-open-calendar-modal]")) {
    const startAt = toLocalDateTimeValue(new Date());
    state.calendarModal = { startAt, endAt: addMinutesToDateTime(startAt, 60) };
    renderCalendar();
    return;
  }

  const deleteEvent = event.target.closest("[data-delete-calendar-event]");
  if (deleteEvent) {
    await api(`/api/calendar/${deleteEvent.dataset.deleteCalendarEvent}?actorId=${state.actorId}`, {
      method: "DELETE"
    });
    state.calendarModal = null;
    showToast("Usunieto wydarzenie.");
    await loadState();
    return;
  }

  const modalPanel = event.target.closest("[data-modal-panel]");
  if (modalPanel) return;

  const toggle = event.target.closest("[data-toggle-beneficiary]");
  if (toggle) {
    const beneficiary = state.data.beneficiaries.find((item) => item.id === toggle.dataset.toggleBeneficiary);
    await api(`/api/beneficiaries/${beneficiary.id}`, {
      method: "PATCH",
      body: JSON.stringify({ actorId: state.actorId, active: !beneficiary.active })
    });
    showToast("Zaktualizowano status beneficjenta.");
    await loadState();
  }
});

document.addEventListener("input", (event) => {
  if (["expense-search", "priority-filter", "detail-filter", "status-filter"].includes(event.target.id)) {
    filterExpenses();
  }
  if (["netAmount", "vatRate"].includes(event.target.id)) {
    calculateExpenseTotals();
  }
});

document.addEventListener("change", async (event) => {
  if (["status-filter", "priority-filter", "detail-filter"].includes(event.target.id)) {
    filterExpenses();
    return;
  }

  if (event.target.id === "vatRate") {
    calculateExpenseTotals();
    return;
  }

  if (event.target.id === "startup-beneficiary") {
    state.startupCardBeneficiaryId = event.target.value;
    renderStartupCard();
    return;
  }

  const expenseStatus = event.target.closest("[data-status-expense]");
  if (expenseStatus) {
    await api(`/api/expenses/${expenseStatus.dataset.statusExpense}`, {
      method: "PATCH",
      body: JSON.stringify({ actorId: state.actorId, status: expenseStatus.value })
    });
    showToast("Status wydatku zostal zaktualizowany.");
    await loadState();
    return;
  }

  const documentStatus = event.target.closest("[data-status-document]");
  if (documentStatus) {
    await api(`/api/documents/${documentStatus.dataset.statusDocument}`, {
      method: "PATCH",
      body: JSON.stringify({ actorId: state.actorId, status: documentStatus.value })
    });
    showToast("Status dokumentu zostal zaktualizowany.");
    await loadState();
  }
});

document.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  try {
    if (form.id === "expense-form") {
      const payload = formDataToObject(form);
      payload.actorId = state.actorId;
      payload.invoiceFiles = await filesToPayload(form.querySelector("#invoice-files")?.files);
      payload.otherFiles = await filesToPayload(form.querySelector("#other-files")?.files);
      if (!payload.invoiceFiles.length && !payload.otherFiles.length) {
        throw new Error("Dodaj przynajmniej jeden zalacznik: fakture/rachunek albo pozostaly dokument.");
      }
      await api("/api/expenses", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      showToast("Dodano wydatek i zalaczniki do lokalnej bazy.");
      await loadState();
      setView("expenses");
    }

    if (form.id === "document-form") {
      const payload = formDataToObject(form);
      payload.actorId = state.actorId;
      payload.files = await filesToPayload(form.querySelector("#document-files")?.files);
      await api("/api/documents", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      state.showDocumentForm = false;
      showToast("Dodano dokument i zapisano zalaczniki lokalnie.");
      await loadState();
    }

    if (form.id === "startup-card-form") {
      const payload = formDataToObject(form);
      const beneficiaryId = payload.beneficiaryId;
      delete payload.beneficiaryId;
      payload.actorId = state.actorId;
      await api(`/api/startup-cards/${beneficiaryId}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
      });
      showToast("Zapisano Karte Startupu.");
      await loadState();
    }

    if (form.id === "calendar-form") {
      const payload = formDataToObject(form);
      payload.actorId = state.actorId;
      payload.participantIds = formCheckboxValues(form, "participantIds");
      payload.files = await filesToPayload(form.querySelector("#calendar-files")?.files);
      if (!isAdmin() && !payload.participantIds.includes(state.actorId)) {
        payload.participantIds.push(state.actorId);
      }
      const eventId = payload.id;
      delete payload.id;
      await api(eventId ? `/api/calendar/${eventId}` : "/api/calendar", {
        method: eventId ? "PATCH" : "POST",
        body: JSON.stringify(payload)
      });
      state.calendarModal = null;
      showToast(eventId ? "Zapisano zmiany wydarzenia." : "Dodano wydarzenie do kalendarza.");
      await loadState();
    }

    if (form.id === "report-form") {
      const payload = formDataToObject(form);
      window.location.href = `/api/reports/${payload.type}.xlsx?actorId=${state.actorId}&scopeBeneficiaryId=${payload.scopeBeneficiaryId}`;
    }

    if (form.id === "beneficiary-form") {
      const beneficiary = await api("/api/beneficiaries", {
        method: "POST",
        body: JSON.stringify(formDataToObject(form))
      });
      state.actorId = "admin";
      state.scopeBeneficiaryId = beneficiary.id;
      state.startupCardBeneficiaryId = beneficiary.id;
      showToast(`Dodano beneficjenta: ${beneficiary.name}.`);
      form.reset();
      await loadState();
    }
  } catch (error) {
    showToast(error.message);
  }
});

loadState().catch((error) => {
  app.innerHTML = `<div class="empty-state card">${escapeHtml(error.message)}</div>`;
});
