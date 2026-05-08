const state = {
  activeView: "start",
  activeBeneficiaryId: "admin",
  showDocumentForm: false,
  calendarDate: new Date(),
  data: {
    beneficiaries: [],
    expenses: [],
    documents: [],
    calendar: [],
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

const statusOptions = [
  "roboczy",
  "przekazany-do-weryfikacji",
  "zatwierdzony",
  "odrzucony",
  "przekazany-do-ksiegowosci",
  "wyplacony"
];

const reportLabels = {
  expenses: "Wydatki",
  documents: "Dokumenty",
  calendar: "Kalendarz"
};

const app = document.querySelector("#app");
const select = document.querySelector("#beneficiary-select");
const activeName = document.querySelector("#active-beneficiary-name");
const context = document.querySelector("#beneficiary-context");
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

function getBeneficiary(id = state.activeBeneficiaryId) {
  return state.data.beneficiaries.find((item) => item.id === id) || state.data.beneficiaries[0];
}

function isAdmin() {
  return state.activeBeneficiaryId === "admin";
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

async function loadState() {
  state.data = await api(`/api/state?beneficiaryId=${state.activeBeneficiaryId}`);
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
  const previousValue = select.value || state.activeBeneficiaryId;
  select.innerHTML = state.data.beneficiaries
    .filter((beneficiary) => beneficiary.active || beneficiary.id === "admin")
    .map((beneficiary) => `<option value="${beneficiary.id}">${escapeHtml(beneficiary.name)}</option>`)
    .join("");
  select.value = state.data.beneficiaries.some((item) => item.id === previousValue) ? previousValue : "admin";

  const active = getBeneficiary();
  activeName.textContent = active?.name || "ADMIN";
  context.textContent = isAdmin()
    ? "ADMIN widzi dane wszystkich beneficjentow, nadaje statusy, dodaje dokumenty i wydarzenia."
    : "Beneficjent widzi swoje dane i moze dodawac wlasne wydatki, dokumenty oraz wydarzenia z ADMINEM.";
  document.querySelector("#stat-expenses").textContent = state.data.expenses.length;
  document.querySelector("#stat-documents").textContent = state.data.documents.length;
  document.querySelector("#stat-calendar").textContent = state.data.calendar.length;
}

function beneficiaryOptions(selectedId = "") {
  return state.data.beneficiaries
    .filter((beneficiary) => beneficiary.id !== "admin" && beneficiary.active)
    .map((beneficiary) => {
      const selected = beneficiary.id === selectedId ? "selected" : "";
      return `<option value="${beneficiary.id}" ${selected}>${escapeHtml(beneficiary.name)}</option>`;
    })
    .join("");
}

function attachmentList(attachments = []) {
  if (!attachments.length) return "";
  return `
    <ul class="attachment-list">
      ${attachments.map((file) => `<li>${escapeHtml(file.fileName)}</li>`).join("")}
    </ul>
  `;
}

function pageHead(title, description, action = "") {
  return `
    <div class="section-head">
      <div>
        <p class="eyebrow">Akces NCBR</p>
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
      ${action}
    </div>
  `;
}

function renderStart() {
  const totalGross = state.data.expenses.reduce((sum, expense) => sum + Number(expense.grossAmount || 0), 0);
  const addExpenseAction = isAdmin()
    ? `<button class="button secondary" data-go="documents">Dodaj dokument</button>`
    : `<button class="button secondary" data-go="add-expense">Dodaj wydatek</button>`;

  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Nowy standard wspolpracy</p>
        <h1>Akces NCBR</h1>
        <p>
          Jedno uporzadkowane miejsce do prowadzenia rozliczen, dokumentow, terminow i raportow
          dla beneficjentow programu. MVP pokazuje kierunek systemu, ktory ma skrocic komunikacje
          i dac administratorowi pelny obraz pracy.
        </p>
        <div class="hero-actions">
          <button class="button" data-go="expenses">Przejdz do wydatkow</button>
          ${addExpenseAction}
          <button class="button ghost" data-go="calendar">Otworz kalendarz</button>
        </div>
      </div>
      <div class="hero-board" aria-label="Podsumowanie">
        <div class="metric-tile">
          <strong>${state.data.expenses.length}</strong>
          <span>wydatki w aktualnym widoku</span>
        </div>
        <div class="metric-tile">
          <strong>${money(totalGross)}</strong>
          <span>laczna kwota brutto do monitorowania</span>
        </div>
        <div class="metric-tile">
          <strong>${state.data.calendar.length}</strong>
          <span>wydarzenia w kalendarzu</span>
        </div>
      </div>
    </section>
    <section class="feature-grid" style="margin-top: 16px;">
      <article class="feature-tile">
        <h3>Wydatki pod kontrola</h3>
        <p>Administrator widzi wszystkie pozycje i zarzadza statusami, a beneficjent dodaje tylko swoje koszty.</p>
      </article>
      <article class="feature-tile">
        <h3>Zalaczniki przy kazdym procesie</h3>
        <p>Wydatki i dokumenty moga miec lokalne pliki, ktore nie trafiaja do repozytorium GitHub.</p>
      </article>
      <article class="feature-tile">
        <h3>Kalendarz jak narzedzie pracy</h3>
        <p>Klikniecie dnia otwiera okno dodania wydarzenia z godzina i zaproszonymi osobami.</p>
      </article>
      <article class="feature-tile">
        <h3>Raporty na zadanie</h3>
        <p>Generator raportow pozwala wybrac typ danych i zakres eksportu.</p>
      </article>
    </section>
  `;
}

function renderExpenses() {
  const rows = state.data.expenses.map((expense) => {
    const beneficiary = getBeneficiary(expense.beneficiaryId);
    const statusControl = isAdmin()
      ? `<select data-status-expense="${expense.id}">${statusOptions.map((status) => `<option value="${status}" ${status === expense.status ? "selected" : ""}>${statusLabels[status]}</option>`).join("")}</select>`
      : `<span class="status-pill" data-status="${expense.status}">${statusLabels[expense.status] || expense.status}</span>`;
    return `
      <tr data-priority="${escapeHtml(expense.priorityGoal)}" data-detail="${escapeHtml(expense.detailedGoal)}">
        <td><strong>${escapeHtml(beneficiary?.name || "-")}</strong></td>
        <td>${escapeHtml(expense.invoiceNumber || "-")}</td>
        <td>${escapeHtml(expense.contractor || "-")}</td>
        <td>${formatDate(expense.invoiceDate)}</td>
        <td>${formatDate(expense.paymentDate)}</td>
        <td>${money(expense.netAmount)}</td>
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
        ? "ADMIN przeglada wszystkie wydatki i zmienia ich status. Dodawanie kosztow jest po stronie beneficjenta."
        : "Beneficjent dodaje tylko swoje wydatki, wraz z zalacznikami do faktury, rachunku lub uzasadnienia.",
      isAdmin() ? "" : `<button class="button" data-go="add-expense">Dodaj wydatek</button>`
    )}
    <section class="table-shell">
      <div class="table-tools">
        <div class="field">
          <label for="expense-search">Szukaj</label>
          <input id="expense-search" type="search" placeholder="Faktura, kontrahent, opis" />
        </div>
        <div class="field">
          <label for="priority-filter">Cel priorytetowy</label>
          <input id="priority-filter" type="search" placeholder="np. Cel 1" />
        </div>
        <div class="field">
          <label for="detail-filter">Cel szczegolowy</label>
          <input id="detail-filter" type="search" placeholder="np. szkolenia" />
        </div>
        <div class="field">
          <label for="status-filter">Status</label>
          <select id="status-filter">
            <option value="">Wszystkie</option>
            ${statusOptions.map((status) => `<option value="${status}">${statusLabels[status]}</option>`).join("")}
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
              <th>Brutto</th>
              <th>Cel priorytetowy</th>
              <th>Cel szczegolowy</th>
              <th>Zalaczniki</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="expenses-body">${rows.join("") || `<tr><td colspan="12" class="empty-state">Brak wydatkow w tym widoku.</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderAddExpense() {
  if (isAdmin()) {
    app.innerHTML = `
      ${pageHead("Dodaj wydatek", "ADMIN nie dodaje wydatkow w imieniu beneficjentow. Przelacz aktywny widok po prawej stronie na konkretnego beneficjenta.")}
      <section class="card">
        <h3>Dodawanie wydatkow jest po stronie beneficjenta</h3>
        <p>To chroni MVP przed przypadkowym przypisaniem faktury do niewlasciwej osoby.</p>
      </section>
    `;
    return;
  }

  const active = getBeneficiary();
  app.innerHTML = `
    ${pageHead("Dodaj wydatek", "Formularz zapisze koszt tylko dla aktualnie wybranego beneficjenta. Mozesz dodac kilka zalacznikow.")}
    <form class="form-panel" id="expense-form">
      <input type="hidden" name="beneficiaryId" value="${state.activeBeneficiaryId}" />
      <input type="hidden" name="actorId" value="${state.activeBeneficiaryId}" />
      <div class="form-grid">
        <div class="field">
          <label>Beneficjent</label>
          <input value="${escapeHtml(active?.name || "")}" disabled />
        </div>
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
          <label for="vatAmount">VAT</label>
          <input id="vatAmount" name="vatAmount" type="number" min="0" step="0.01" required />
        </div>
        <div class="field">
          <label for="grossAmount">Kwota brutto</label>
          <input id="grossAmount" name="grossAmount" type="number" min="0" step="0.01" required />
        </div>
        <div class="field">
          <label for="priorityGoal">Cel priorytetowy</label>
          <input id="priorityGoal" name="priorityGoal" required />
        </div>
        <div class="field">
          <label for="detailedGoal">Cel szczegolowy</label>
          <input id="detailedGoal" name="detailedGoal" required />
        </div>
        <div class="field">
          <label for="expense-files">Zalaczniki</label>
          <input id="expense-files" name="files" type="file" multiple />
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
}

function renderDocuments() {
  const selected = isAdmin() ? "" : state.activeBeneficiaryId;
  const cards = state.data.documents.map((document) => {
    const beneficiary = getBeneficiary(document.beneficiaryId);
    return `
      <article class="doc-card">
        <div>
          <h3>${escapeHtml(document.title)}</h3>
          <p class="meta">
            <span>${escapeHtml(beneficiary?.name || "-")}</span>
            <span>${escapeHtml(document.category)}</span>
            <span>${formatDate(String(document.createdAt || "").slice(0, 10))}</span>
            <span class="status-pill" data-status="${document.status}">${statusLabels[document.status] || document.status}</span>
          </p>
          <p>${escapeHtml(document.note || "Brak dodatkowych uwag.")}</p>
          ${attachmentList(document.attachments || [])}
        </div>
      </article>
    `;
  });

  const form = state.showDocumentForm
    ? `
      <form class="form-panel" id="document-form">
        <input type="hidden" name="actorId" value="${state.activeBeneficiaryId}" />
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
              : `<input type="hidden" name="beneficiaryId" value="${state.activeBeneficiaryId}" />
                <div class="field">
                  <label>Beneficjent</label>
                  <input value="${escapeHtml(getBeneficiary()?.name || "")}" disabled />
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
      "Harmonogramy, dokumenty monitoringowe i zalaczniki sa widoczne od razu. Formularz pojawia sie dopiero po kliknieciu dodawania.",
      `<button class="button" data-show-document-form>Dodaj dokument</button>`
    )}
    <section class="doc-category-strip">
      <article>
        <strong>Harmonogram monitoringu</strong>
        <span>plany kontroli, spotkan i formalnosci</span>
      </article>
      <article>
        <strong>Harmonogram grantu</strong>
        <span>kamienie milowe i terminy programu</span>
      </article>
      <article>
        <strong>Dokumenty od beneficjenta</strong>
        <span>pliki przekazywane do weryfikacji</span>
      </article>
    </section>
    ${form}
    <section class="doc-list" style="margin-top: 16px;">
      ${cards.join("") || `<div class="empty-state card">Brak dokumentow w tym widoku.</div>`}
    </section>
  `;
}

function calendarInviteOptions() {
  if (isAdmin()) {
    return state.data.beneficiaries
      .filter((beneficiary) => beneficiary.id !== "admin" && beneficiary.active)
      .map((beneficiary) => `
        <label class="check-row">
          <input type="checkbox" name="invitedIds" value="${beneficiary.id}" />
          <span>${escapeHtml(beneficiary.name)}</span>
        </label>
      `)
      .join("");
  }
  return `
    <label class="check-row">
      <input type="checkbox" name="invitedIds" value="admin" checked />
      <span>ADMIN</span>
    </label>
  `;
}

function renderCalendarModal(day) {
  if (!day) return "";
  return `
    <div class="modal-backdrop" data-close-calendar-modal>
      <section class="modal" role="dialog" aria-modal="true" aria-label="Dodaj wydarzenie" data-modal-panel>
        <div class="section-head compact">
          <div>
            <p class="eyebrow">${formatDate(day)}</p>
            <h1>Dodaj wydarzenie</h1>
          </div>
          <button class="button ghost" type="button" data-close-calendar-modal>Zamknij</button>
        </div>
        <form id="calendar-form" class="form-panel">
          <input type="hidden" name="actorId" value="${state.activeBeneficiaryId}" />
          <input type="hidden" name="dueDate" value="${day}" />
          ${isAdmin() ? "" : `<input type="hidden" name="beneficiaryId" value="${state.activeBeneficiaryId}" />`}
          <div class="form-grid">
            <div class="field">
              <label for="calendar-title">Tytul</label>
              <input id="calendar-title" name="title" required />
            </div>
            <div class="field">
              <label for="calendar-time">Godzina</label>
              <input id="calendar-time" name="dueTime" type="time" />
            </div>
            <div class="field">
              <label for="calendar-type">Typ</label>
              <input id="calendar-type" name="type" placeholder="np. formalnosc, dokument, raport" />
            </div>
            <div class="field">
              <label for="calendar-files">Zalaczniki</label>
              <input id="calendar-files" name="files" type="file" multiple />
            </div>
            ${
              isAdmin()
                ? `<div class="field is-wide">
                    <label>Zaproszeni beneficjenci</label>
                    <div class="check-grid">${calendarInviteOptions()}</div>
                  </div>`
                : `<div class="field is-wide">
                    <label>Zaproszone osoby</label>
                    <div class="check-grid">${calendarInviteOptions()}</div>
                  </div>`
            }
            <div class="field is-wide">
              <label for="calendar-note">Opis</label>
              <textarea id="calendar-note" name="note"></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button class="button" type="submit">Dodaj wydarzenie</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function renderCalendar() {
  const year = state.calendarDate.getFullYear();
  const month = state.calendarDate.getMonth();
  const monthName = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(state.calendarDate);
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);
  const selectedDay = app.dataset.selectedCalendarDay || "";
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    const key = dateKey(day);
    const events = state.data.calendar.filter((item) => item.dueDate === key);
    const muted = day.getMonth() !== month ? "is-muted" : "";
    const today = key === dateKey(new Date()) ? "is-today" : "";
    return `
      <button class="calendar-day ${muted} ${today}" data-calendar-day="${key}" type="button">
        <span>${day.getDate()}</span>
        <div class="calendar-events">
          ${events.slice(0, 3).map((item) => `<em>${escapeHtml(item.dueTime || "")} ${escapeHtml(item.title)}</em>`).join("")}
          ${events.length > 3 ? `<strong>+${events.length - 3}</strong>` : ""}
        </div>
      </button>
    `;
  });

  app.innerHTML = `
    ${pageHead("Kalendarz", "Widok miesiaca dziala jak roboczy kalendarz: kliknij dzien, zeby dodac wydarzenie z godzina i zaproszonymi osobami.")}
    <section class="calendar-shell">
      <div class="calendar-toolbar">
        <button class="button secondary" data-calendar-prev type="button">Poprzedni</button>
        <h2>${escapeHtml(monthName)}</h2>
        <button class="button secondary" data-calendar-next type="button">Nastepny</button>
      </div>
      <div class="calendar-weekdays">
        <span>Pon</span><span>Wt</span><span>Sr</span><span>Czw</span><span>Pt</span><span>Sob</span><span>Nd</span>
      </div>
      <div class="calendar-grid">
        ${days.join("")}
      </div>
    </section>
    ${renderCalendarModal(selectedDay)}
  `;
}

function renderReports() {
  const totalGross = state.data.expenses.reduce((sum, expense) => sum + Number(expense.grossAmount || 0), 0);
  const approved = state.data.expenses.filter((expense) => expense.status === "zatwierdzony" || expense.status === "wyplacony").length;
  const scopeOptions = isAdmin()
    ? `<option value="admin">Wszyscy beneficjenci</option>${beneficiaryOptions()}`
    : `<option value="${state.activeBeneficiaryId}">${escapeHtml(getBeneficiary()?.name || "Aktualny beneficjent")}</option>`;

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
        <div class="field">
          <label for="report-scope">Zakres</label>
          <select id="report-scope" name="beneficiaryId">${scopeOptions}</select>
        </div>
        <div class="field">
          <label for="report-format">Format</label>
          <select id="report-format" name="format">
            <option value="csv">CSV / Excel</option>
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
        <div class="field">
          <label for="beneficiary-name">Nazwa beneficjenta</label>
          <input id="beneficiary-name" name="name" ${isAdminActive ? "" : "disabled"} required />
        </div>
        <div class="form-actions">
          <button class="button" type="submit" ${isAdminActive ? "" : "disabled"}>Dodaj beneficjenta</button>
        </div>
        <p class="context-note">
          ${isAdminActive ? "Nowy beneficjent pojawi sie w panelu po prawej stronie." : "Dodawanie beneficjentow jest dostepne po przelaczeniu widoku na ADMIN."}
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
  const priority = document.querySelector("#priority-filter")?.value.toLowerCase() || "";
  const detail = document.querySelector("#detail-filter")?.value.toLowerCase() || "";
  const status = document.querySelector("#status-filter")?.value || "";
  document.querySelectorAll("#expenses-body tr").forEach((row) => {
    if (!row.dataset.priority) return;
    const text = row.textContent.toLowerCase();
    const rowStatus = row.querySelector("[data-status]")?.dataset.status || row.querySelector("[data-status-expense]")?.value || "";
    const visible =
      text.includes(search) &&
      row.dataset.priority.toLowerCase().includes(priority) &&
      row.dataset.detail.toLowerCase().includes(detail) &&
      (!status || rowStatus === status);
    row.style.display = visible ? "" : "none";
  });
}

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

select.addEventListener("change", async () => {
  state.activeBeneficiaryId = select.value;
  if (state.activeView === "add-expense" && isAdmin()) {
    state.activeView = "expenses";
  }
  await loadState();
});

document.addEventListener("click", async (event) => {
  const closeButton = event.target.closest("button[data-close-calendar-modal]");
  const backdropClick = event.target.classList.contains("modal-backdrop");
  if (closeButton || backdropClick) {
    delete app.dataset.selectedCalendarDay;
    renderCalendar();
    return;
  }

  const go = event.target.closest("[data-go]");
  if (go) {
    setView(go.dataset.go);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  if (event.target.closest("[data-calendar-prev]")) {
    state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() - 1, 1);
    delete app.dataset.selectedCalendarDay;
    renderCalendar();
    return;
  }

  if (event.target.closest("[data-calendar-next]")) {
    state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + 1, 1);
    delete app.dataset.selectedCalendarDay;
    renderCalendar();
    return;
  }

  const day = event.target.closest("[data-calendar-day]");
  if (day) {
    app.dataset.selectedCalendarDay = day.dataset.calendarDay;
    renderCalendar();
    return;
  }

  const modalPanel = event.target.closest("[data-modal-panel]");
  if (modalPanel) return;

  const toggle = event.target.closest("[data-toggle-beneficiary]");
  if (toggle) {
    const beneficiary = state.data.beneficiaries.find((item) => item.id === toggle.dataset.toggleBeneficiary);
    await api(`/api/beneficiaries/${beneficiary.id}`, {
      method: "PATCH",
      body: JSON.stringify({ active: !beneficiary.active })
    });
    showToast("Zaktualizowano status beneficjenta.");
    await loadState();
  }
});

document.addEventListener("input", (event) => {
  if (["expense-search", "priority-filter", "detail-filter", "status-filter"].includes(event.target.id)) {
    filterExpenses();
  }
  if (["netAmount", "vatAmount"].includes(event.target.id)) {
    const form = event.target.form;
    const net = Number(form.netAmount.value || 0);
    const vat = Number(form.vatAmount.value || 0);
    form.grossAmount.value = (net + vat).toFixed(2);
  }
});

document.addEventListener("change", async (event) => {
  if (event.target.id === "status-filter") {
    filterExpenses();
    return;
  }

  const statusSelect = event.target.closest("[data-status-expense]");
  if (statusSelect) {
    await api(`/api/expenses/${statusSelect.dataset.statusExpense}`, {
      method: "PATCH",
      body: JSON.stringify({ status: statusSelect.value })
    });
    showToast("Status wydatku zostal zaktualizowany.");
    await loadState();
  }
});

document.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  try {
    if (form.id === "expense-form") {
      const payload = formDataToObject(form);
      payload.files = await filesToPayload(form.querySelector("#expense-files")?.files);
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
      payload.files = await filesToPayload(form.querySelector("#document-files")?.files);
      await api("/api/documents", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      state.showDocumentForm = false;
      showToast("Dodano dokument i zapisano zalaczniki lokalnie.");
      await loadState();
    }

    if (form.id === "calendar-form") {
      const payload = formDataToObject(form);
      payload.invitedIds = formCheckboxValues(form, "invitedIds");
      payload.files = await filesToPayload(form.querySelector("#calendar-files")?.files);
      if (isAdmin()) {
        payload.beneficiaryId = payload.invitedIds.find((id) => id !== "admin") || "";
      }
      await api("/api/calendar", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      delete app.dataset.selectedCalendarDay;
      showToast("Dodano wydarzenie do kalendarza.");
      await loadState();
    }

    if (form.id === "report-form") {
      const payload = formDataToObject(form);
      window.location.href = `/api/reports/${payload.type}.csv?beneficiaryId=${payload.beneficiaryId}`;
    }

    if (form.id === "beneficiary-form") {
      const beneficiary = await api("/api/beneficiaries", {
        method: "POST",
        body: JSON.stringify(formDataToObject(form))
      });
      state.activeBeneficiaryId = "admin";
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
