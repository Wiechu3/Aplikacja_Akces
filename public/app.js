const state = {
  activeView: "start",
  actorId: "admin",
  scopeBeneficiaryId: "all",
  sidebarCollapsed: window.localStorage.getItem("akces-sidebar-collapsed") === "true",
  mobileSidebarOpen: false,
  notificationsOpen: false,
  searchOpen: false,
  searchQuery: "",
  addressBookOpen: false,
  addressBookFormOpen: false,
  editingContactId: "",
  contactSearch: "",
  contactCategory: "all",
  addressBookContacts: [],
  startupProfileTab: "basics",
  startupProfileEditing: false,
  startupProfileOverrides: {},
  mentoringMainTab: "lead",
  mentoringActiveMentorId: "lead-mentor",
  mentoringSection: "info",
  mentoringGoalFormOpen: false,
  mentoringEditingGoalId: "",
  mentoringEntryFormOpen: false,
  mentoringExportMonth: "all",
  mentoringMentors: [],
  marketingTab: "package",
  marketingPackageItems: [],
  marketingProfile: {},
  marketingProfileEditing: false,
  marketingMaterialFilter: "all",
  marketingContestStatusFilter: "all",
  marketingContestTypeFilter: "all",
  marketingContestFormOpen: false,
  marketingEditingContestId: "",
  marketingContests: [],
  notifications: [],
  documentsTab: "contract",
  documentWorkflowDocs: [],
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
  expenses: "Grant i wydatki",
  documents: "Dokumenty",
  calendar: "Kalendarz"
};

const moduleLabels = {
  start: "Start",
  "startup-card": "Karta startupu",
  documents: "Dokumenty",
  calendar: "Kalendarz",
  mentoring: "Mentoring",
  expenses: "Grant i wydatki",
  "add-expense": "Grant i wydatki",
  marketing: "Marketing",
  reports: "Raporty",
  tutorial: "Samouczek",
  settings: "Ustawienia"
};

const startupProfileTabs = [
  { id: "basics", label: "Dane podstawowe" },
  { id: "project", label: "Projekt w programie" },
  { id: "description", label: "Opis startupu" },
  { id: "people", label: "Osoby kontaktowe" },
  { id: "correspondence", label: "Korespondencja" }
];

const mentorSections = [
  { id: "info", label: "Informacje o mentorze" },
  { id: "schedule", label: "Harmonogram Mentoringu" },
  { id: "hours", label: "Realizacja godzin" },
  { id: "documents", label: "Dokumenty" }
];

const mentoringMonths = ["Maj 2026", "Czerwiec 2026", "Lipiec 2026", "Sierpien 2026", "Wrzesien 2026", "Pazdziernik 2026"];
const mentoringGoalStatuses = ["planowany", "w trakcie", "zakonczony"];
const mentoringEntryStatuses = ["zaplanowane", "zrealizowane", "odwolane"];
const mentoringForms = ["spotkanie online", "spotkanie stacjonarne", "praca wlasna mentora"];
const reportStatuses = ["do uzupelnienia", "robocze", "wyslane", "do poprawy", "zaakceptowane"];
const marketingTabs = [
  { id: "package", label: "Paczka marketingowa" },
  { id: "profile", label: "Profil promocyjny" },
  { id: "materials", label: "Materialy od Akces" },
  { id: "publications", label: "Publikacje" },
  { id: "contests", label: "Konkursy" }
];
const marketingPackageStatuses = ["brak", "dodano", "do poprawy", "zaakceptowano"];
const marketingMaterialTypes = ["Webinary", "Prezentacje", "Instrukcje", "Grafiki", "Wzory postow", "Inne"];
const marketingPublicationStatuses = ["planowana", "w przygotowaniu", "wyslana do akceptacji", "zaakceptowana", "opublikowana", "archiwalna"];
const marketingContestTypes = ["konkurs", "nabor", "wydarzenie", "pitch contest", "nagroda", "program promocyjny"];
const marketingContestStatuses = ["nowy", "do rozwazenia", "w trakcie przygotowania", "zgloszony", "odrzucony", "zakwalifikowany", "wygrany", "archiwalny"];
const documentWorkflowTabs = [
  { id: "contract", label: "Umowa akceleracyjna" },
  { id: "wst", label: "WST miesieczne" },
  { id: "formal", label: "Dokumenty formalne" },
  { id: "other", label: "Inne dokumenty" },
  { id: "archive", label: "Archiwum" }
];
const documentWorkflowStatuses = [
  "Oczekuje na dodanie pliku",
  "Oczekuje na dodanie umowy przez Beneficjenta",
  "Oczekuje na dodanie podpisanego WST przez Beneficjenta",
  "Oczekuje na dodanie poprawnego pliku",
  "Oczekuje na podpis Beneficjenta",
  "Oczekuje na weryfikacje Akces",
  "Do poprawy",
  "Oczekuje na podpis Opiekuna Projektu",
  "Oczekuje na podpis osoby upowaznionej",
  "Podpisany przez wszystkie wymagane osoby",
  "Zaakceptowany",
  "Archiwalny"
];

const accelerationProject = {
  program: "HPN IMPAKT / Akces NCBR",
  stage: "Realizacja akceleracji",
  period: "28.04.2026 - 27.10.2026",
  progress: 38,
  status: "Aktywny",
  projectName: "Platforma rozwoju technologii w programie Akces NCBR",
  acronym: "APPLC"
};

const attentionTasks = [
  {
    title: "Harmonogram Mentoringu wymaga poprawy",
    description: "Wprowadz korekte zgodnie z uwagami opiekuna przed kolejnym spotkaniem.",
    status: "Wymaga reakcji",
    due: "do 31.05.2026",
    action: "Przejdz do dokumentu",
    view: "documents"
  },
  {
    title: "Deklaracja wekslowa nie zostala dostarczona",
    description: "Uzupelnij brakujacy dokument i zalacz skan w module Dokumenty.",
    status: "Brak dokumentu",
    due: "do 03.06.2026",
    action: "Zobacz instrukcje",
    view: "tutorial"
  },
  {
    title: "Harmonogram Grantu bedzie dostepny po akceptacji HM",
    description: "Po akceptacji harmonogramu mentoringu zobaczysz kolejne kroki rozliczen.",
    status: "Oczekuje",
    due: "",
    action: "Zobacz szczegoly",
    view: "expenses"
  },
  {
    title: "Opiekun projektu dodal komentarze",
    description: "Sprawdz ostatnie uwagi i potwierdz, ktore elementy zostaly poprawione.",
    status: "Nowe komentarze",
    due: "dzisiaj",
    action: "Przejdz do dokumentu",
    view: "documents"
  },
  {
    title: "Umow spotkanie mentoringowe",
    description: "Wybierz termin spotkania i dodaj go do kalendarza projektu.",
    status: "Do zaplanowania",
    due: "w tym tygodniu",
    action: "Przejdz do kalendarza",
    view: "calendar"
  }
];

const defaultNotifications = [
  {
    id: "notif-wst-correction",
    title: "Nowe uwagi do Harmonogramu Mentoringu",
    description: "Opiekun projektu oznaczyl punkty wymagajace poprawy.",
    type: "document_correction",
    module: "documents",
    relatedObjectId: "formal-weksel-deklaracja",
    relatedObjectName: "Deklaracja wekslowa",
    createdAt: "2026-05-26T15:12:00",
    read: false,
    actionLabel: "Przejdz do dokumentu"
  },
  {
    id: "notif-contract-sign",
    title: "Opiekun projektu dodal komentarze",
    description: "Komentarze zostaly dodane 2 godziny temu.",
    type: "project_comment",
    module: "documents",
    relatedObjectId: "contract-main",
    relatedObjectName: "Umowa akceleracyjna",
    createdAt: "2026-05-26T14:22:00",
    read: false,
    actionLabel: "Przejdz do komentarzy"
  },
  {
    id: "notif-mentor-meeting",
    title: "Zbliza sie spotkanie mentoringowe",
    description: "Spotkanie z Mentorem Prowadzacym odbedzie sie jutro o 10:00.",
    type: "mentoring_meeting",
    module: "mentoring",
    relatedObjectId: "lead-mentor",
    relatedObjectName: "Mentor prowadzacy",
    createdAt: "2026-05-26T09:00:00",
    read: false,
    actionLabel: "Przejdz do mentoringu"
  },
  {
    id: "notif-marketing-materials",
    title: "Dodano nowe materialy od Akces",
    description: "W module Marketing pojawil sie nowy webinar.",
    type: "marketing_material",
    module: "marketing",
    relatedObjectId: "mat-1",
    relatedObjectName: "Webinar marketingowy",
    createdAt: "2026-05-25T11:30:00",
    read: true,
    actionLabel: "Przejdz do materialow"
  },
  {
    id: "notif-deadline",
    title: "Przypomnienie o terminie",
    description: "Deklaracja wekslowa powinna zostac dostarczona w najblizszych dniach.",
    type: "deadline",
    module: "documents",
    relatedObjectId: "formal-weksel-deklaracja",
    relatedObjectName: "Deklaracja wekslowa",
    createdAt: "2026-05-25T08:15:00",
    read: false,
    actionLabel: "Przejdz do dokumentu"
  },
  {
    id: "notif-document-status",
    title: "Zmieniono status dokumentu",
    description: "Umowa akceleracyjna oczekuje na podpis osoby upowaznionej.",
    type: "document_status",
    module: "documents",
    relatedObjectId: "contract-main",
    relatedObjectName: "Umowa akceleracyjna",
    createdAt: "2026-05-24T16:40:00",
    read: true,
    actionLabel: "Przejdz do dokumentu"
  }
];

const contactCategories = ["Program", "Dokumenty", "Grant", "Mentoring", "Techniczne", "Marketing"];

const defaultAddressBookContacts = [
  {
    id: "opiekun-projektu",
    name: "Anna Kowalska",
    position: "Opiekun Projektu Akces NCBR",
    organization: "Akces NCBR / Program",
    email: "anna.kowalska@akces-ncbr.pl",
    phone: "+48 500 100 200",
    description: "kontakt w sprawach projektu, terminow i komentarzy do zadan",
    category: "Program",
    photoUrl: ""
  },
  {
    id: "koordynator-programu",
    name: "Marek Zielinski",
    position: "Koordynator programu",
    organization: "Akces NCBR / Program",
    email: "marek.zielinski@akces-ncbr.pl",
    phone: "+48 500 200 300",
    description: "kontakt w sprawach formalnych programu i harmonogramu akceleracji",
    category: "Program",
    photoUrl: ""
  },
  {
    id: "dokumenty",
    name: "Ewa Nowak",
    position: "Specjalistka ds. dokumentow",
    organization: "Akces NCBR / Dokumenty",
    email: "ewa.nowak@akces-ncbr.pl",
    phone: "+48 500 300 400",
    description: "kontakt w sprawach dokumentow, zalacznikow i terminow dostarczenia",
    category: "Dokumenty",
    photoUrl: ""
  },
  {
    id: "grant",
    name: "Piotr Wozniak",
    position: "Specjalista ds. rozliczenia grantu",
    organization: "Akces NCBR / Grant",
    email: "piotr.wozniak@akces-ncbr.pl",
    phone: "+48 500 400 500",
    description: "kontakt w sprawach wydatkow, rozliczen i Harmonogramu Grantu",
    category: "Grant",
    photoUrl: ""
  },
  {
    id: "mentoring",
    name: "Karolina Wisniewska",
    position: "Koordynatorka mentoringu",
    organization: "Akces NCBR / Mentoring",
    email: "karolina.wisniewska@akces-ncbr.pl",
    phone: "+48 500 500 600",
    description: "kontakt w sprawach spotkan, mentorow i harmonogramu mentoringu",
    category: "Mentoring",
    photoUrl: ""
  },
  {
    id: "techniczne",
    name: "Tomasz Kaminski",
    position: "Pomoc techniczna",
    organization: "Akces NCBR / IT",
    email: "support@akces-ncbr.pl",
    phone: "+48 500 600 700",
    description: "kontakt w sprawach dostepu, plikow i problemow technicznych",
    category: "Techniczne",
    photoUrl: ""
  },
  {
    id: "marketing",
    name: "Julia Lewandowska",
    position: "Kontakt marketingowy",
    organization: "Akces NCBR / Marketing",
    email: "marketing@akces-ncbr.pl",
    phone: "+48 500 700 800",
    description: "kontakt w sprawach komunikacji, materialow i promocji projektu",
    category: "Marketing",
    photoUrl: ""
  }
];

state.addressBookContacts = defaultAddressBookContacts.map((contact) => ({ ...contact }));

function monthlyReports(seed = {}) {
  return mentoringMonths.map((month, index) => ({
    month,
    status: seed[month]?.status || (index === 0 ? "do uzupelnienia" : "robocze"),
    signedFile: ""
  }));
}

const defaultMentoringMentors = [
  {
    id: "lead-mentor",
    type: "lead",
    role: "Mentor prowadzacy",
    name: "Jan Kowalski",
    specialization: "strategia produktu i rozwoj biznesu",
    email: "jan.kowalski@akces-ncbr.pl",
    phone: "+48 510 100 200",
    limit: 65,
    documents: {
      schedule: { status: "roboczy", version: "v1", addedAt: "2026-05-10", fileName: "" },
      reports: monthlyReports({ "Maj 2026": { status: "do uzupelnienia" } })
    },
    goals: [
      {
        id: "lead-goal-1",
        name: "Opracowanie wstepnej specyfikacji produktu",
        description: "Doprecyzowanie zakresu MVP, funkcji i zalozen walidacji.",
        plannedHours: 12,
        result: "dokument specyfikacji produktu",
        dueDate: "2026-06-20",
        status: "w trakcie"
      },
      {
        id: "lead-goal-2",
        name: "Plan akceleracji i kamienie milowe",
        description: "Ustalenie priorytetow mentoringu oraz oczekiwanych rezultatow miesiecznych.",
        plannedHours: 18,
        result: "plan prac i lista kamieni milowych",
        dueDate: "2026-07-15",
        status: "planowany"
      }
    ],
    entries: [
      {
        id: "lead-entry-1",
        date: "2026-06-12",
        startTime: "10:00",
        endTime: "12:00",
        goalId: "lead-goal-1",
        hours: 2,
        form: "spotkanie online",
        meetingLink: "https://meet.example.com/akces-mentor",
        supervisorLink: "https://akces.example.com/opiekun/spotkanie-1",
        place: "",
        description: "Omowienie struktury specyfikacji produktu i podzialu prac.",
        status: "zrealizowane",
        includeInReport: true,
        notes: "Do sprawozdania za czerwiec."
      },
      {
        id: "lead-entry-2",
        date: "2026-06-18",
        startTime: "09:00",
        endTime: "12:00",
        goalId: "lead-goal-1",
        hours: 3,
        form: "praca wlasna mentora",
        meetingLink: "",
        supervisorLink: "https://akces.example.com/opiekun/notatka-2",
        place: "",
        description: "Przeglad zalozen produktu i komentarze do dokumentu.",
        status: "zrealizowane",
        includeInReport: true,
        notes: ""
      }
    ]
  },
  {
    id: "subject-1",
    type: "subject",
    role: "Mentor merytoryczny",
    name: "Anna Zielinska",
    specialization: "sprzedaz B2B i walidacja rynku",
    email: "anna.zielinska@akces-ncbr.pl",
    phone: "+48 510 300 400",
    limit: 10,
    documents: {
      schedule: { status: "wyslany do Akces", version: "v1", addedAt: "2026-05-20", fileName: "" },
      reports: monthlyReports()
    },
    goals: [
      {
        id: "subject-1-goal-1",
        name: "Walidacja grupy docelowej",
        description: "Przygotowanie scenariusza rozmow z pierwszymi odbiorcami.",
        plannedHours: 6,
        result: "scenariusz wywiadow i lista hipotez",
        dueDate: "2026-06-25",
        status: "w trakcie"
      }
    ],
    entries: [
      {
        id: "subject-1-entry-1",
        date: "2026-06-10",
        startTime: "13:00",
        endTime: "15:00",
        goalId: "subject-1-goal-1",
        hours: 2,
        form: "spotkanie online",
        meetingLink: "https://meet.example.com/walidacja",
        supervisorLink: "",
        place: "",
        description: "Praca nad pytaniami do rozmow z klientami.",
        status: "zrealizowane",
        includeInReport: true,
        notes: ""
      }
    ]
  },
  {
    id: "subject-2",
    type: "subject",
    role: "Mentor merytoryczny",
    name: "Pawel Lewandowski",
    specialization: "finanse projektu i model przychodowy",
    email: "pawel.lewandowski@akces-ncbr.pl",
    phone: "+48 510 500 600",
    limit: 10,
    documents: {
      schedule: { status: "roboczy", version: "v1", addedAt: "2026-05-22", fileName: "" },
      reports: monthlyReports()
    },
    goals: [
      {
        id: "subject-2-goal-1",
        name: "Model finansowy MVP",
        description: "Przygotowanie zalozen kosztowych i pierwszych scenariuszy sprzedazy.",
        plannedHours: 5,
        result: "arkusz modelu finansowego",
        dueDate: "2026-07-05",
        status: "planowany"
      }
    ],
    entries: []
  },
  {
    id: "subject-3",
    type: "subject",
    role: "Mentor merytoryczny",
    name: "Katarzyna Wrobel",
    specialization: "marketing i komunikacja",
    email: "katarzyna.wrobel@akces-ncbr.pl",
    phone: "+48 510 700 800",
    limit: 10,
    documents: {
      schedule: { status: "zaakceptowany", version: "v2", addedAt: "2026-05-28", fileName: "" },
      reports: monthlyReports()
    },
    goals: [
      {
        id: "subject-3-goal-1",
        name: "Komunikacja wartosci produktu",
        description: "Ulozenie komunikatow dla pierwszych materialow promocyjnych.",
        plannedHours: 7,
        result: "zestaw komunikatow marketingowych",
        dueDate: "2026-07-10",
        status: "planowany"
      }
    ],
    entries: []
  }
];

state.mentoringMentors = defaultMentoringMentors.map((mentor) => ({
  ...mentor,
  goals: mentor.goals.map((goal) => ({ ...goal })),
  entries: mentor.entries.map((entry) => ({ ...entry })),
  documents: {
    schedule: { ...mentor.documents.schedule },
    reports: mentor.documents.reports.map((report) => ({ ...report }))
  }
}));

const defaultMarketingPackageItems = [
  { id: "logo", title: "Logo startupu", status: "zaakceptowano", kind: "file", link: "", text: "Podstawowy logotyp APPLC.", fileName: "applc-demo-logo.png", fileData: "" },
  { id: "logo-light", title: "Logo w wersji jasnej", status: "dodano", kind: "file", link: "", text: "Wersja do ciemnego tla.", fileName: "applc-demo-logo-light.svg", fileData: "" },
  { id: "logo-dark", title: "Logo w wersji ciemnej", status: "brak", kind: "file", link: "", text: "", fileName: "", fileData: "" },
  { id: "short-description", title: "Krotki opis startupu", status: "zaakceptowano", kind: "text", link: "", text: "APPLC pomaga planowac uprawe warzyw zgodnie z kalendarzem biodynamicznym.", fileName: "", fileData: "" },
  { id: "long-description", title: "Dluzszy opis startupu", status: "do poprawy", kind: "text", link: "", text: "Opis wymaga doprecyzowania zastosowan dla gospodarstw i ogrodow spolecznych.", fileName: "", fileData: "" },
  { id: "project-description", title: "Opis projektu realizowanego w programie", status: "dodano", kind: "text", link: "", text: "Projekt rozwija cyfrowy planer prac ogrodniczych oparty o fazy ksiezyca i dni korzenia, liscia, kwiatu oraz owocu.", fileName: "", fileData: "" },
  { id: "team-photos", title: "Zdjecia zespolu", status: "dodano", kind: "file", link: "", text: "Zdjecia robocze do selekcji.", fileName: "zespol-applc-demo.zip", fileData: "" },
  { id: "founders-photo", title: "Zdjecie founderow / reprezentantow", status: "brak", kind: "file", link: "", text: "", fileName: "", fileData: "" },
  { id: "product-graphics", title: "Grafiki lub zdjecia produktu", status: "dodano", kind: "file", link: "", text: "Zrzuty ekranu planera upraw.", fileName: "product-screens.zip", fileData: "" },
  { id: "website", title: "Link do strony www", status: "dodano", kind: "link", link: "https://applc-demo.example.com", text: "", fileName: "", fileData: "" },
  { id: "linkedin", title: "Link do LinkedIna", status: "brak", kind: "link", link: "", text: "", fileName: "", fileData: "" },
  { id: "demo", title: "Link do demo / filmu / prezentacji", status: "dodano", kind: "link", link: "https://demo.example.com/applc-demo", text: "Wersja demo do pokazywania partnerom programu.", fileName: "", fileData: "" },
  { id: "pitch", title: "Krotki pitch, 2-3 zdania", status: "zaakceptowano", kind: "text", link: "", text: "Tworzymy planer upraw, ktory laczy praktyke ogrodnicza z kalendarzem biodynamicznym. Pomaga dobrac prace do dni korzenia, liscia, kwiatu i owocu.", fileName: "", fileData: "" },
  { id: "consent", title: "Zgoda na wykorzystanie materialow marketingowych", status: "brak", kind: "file", link: "", text: "", fileName: "", fileData: "" }
];

const defaultMarketingProfile = {
  activity: "Startup rozwija narzedzie pomagajace planowac uprawe warzyw zgodnie z kalendarzem biodynamicznym.",
  problem: "Male gospodarstwa i ogrody edukacyjne maja rozproszone informacje o terminach siewu, przesadzania, pielegnacji i zbiorow.",
  solution: "Aplikacja porzadkuje prace wedlug dni korzenia, liscia, kwiatu i owocu oraz podpowiada, kiedy siac, sadzic, nawozic i zbierac.",
  audience: "Gospodarstwa ekologiczne, ogrody spoleczne, szkoly ogrodnicze, edukatorzy i pasjonaci upraw warzywnych.",
  distinction: "Laczy praktyczne checklisty, sezonowosc i prosty jezyk z biodynamicznym podejsciem do rytmu prac w ogrodzie.",
  achievements: "Pierwszy prototyp planera, testy z ogrodami spolecznymi i baza ponad 40 popularnych warzyw.",
  tags: "agritech, ogrodnictwo, edukacja ekologiczna, warzywa, kalendarz biodynamiczny",
  impact: "Wsparcie lokalnej produkcji zywnosci, ograniczanie strat w uprawach i edukacja klimatyczna.",
  shortPublication: "APPLC tworzy planer upraw warzyw zgodny z kalendarzem biodynamicznym.",
  longPublication: "APPLC pomaga ogrodnikom i malym gospodarstwom planowac prace w rytmie dni korzenia, liscia, kwiatu i owocu. Narzedzie laczy kalendarz, zadania i proste rekomendacje dla sezonowej uprawy warzyw.",
  founderQuote: "Chcemy, zeby planowanie ogrodu bylo spokojniejsze, bardziej swiadome i oparte na rytmie natury.",
  presentationPreference: "Pokazywac startup jako praktyczne narzedzie agritech dla ekologicznej uprawy warzyw, bez tonu ezoterycznego."
};

const defaultAkcesMarketingMaterials = [
  { id: "mat-1", title: "Webinar: jak opowiadac o projekcie w programie", type: "Webinary", description: "Nagranie z krotkimi wskazowkami do komunikacji startupu.", addedAt: "2026-05-08", url: "https://akces.example.com/webinar-marketing" },
  { id: "mat-2", title: "Prezentacja Akces NCBR dla beneficjentow", type: "Prezentacje", description: "Slajdy do wykorzystania przy spotkaniach z partnerami.", addedAt: "2026-05-12", url: "https://akces.example.com/prezentacja" },
  { id: "mat-3", title: "Instrukcja oznaczania Akces NCBR", type: "Instrukcje", description: "Zasady uzycia nazwy programu, logotypow i informacji o finansowaniu.", addedAt: "2026-05-15", url: "https://akces.example.com/instrukcja-oznaczania" },
  { id: "mat-4", title: "Paczka graficzna programu", type: "Grafiki", description: "Logotypy, belki i grafiki do publikacji informacyjnych.", addedAt: "2026-05-18", url: "https://akces.example.com/grafiki" },
  { id: "mat-5", title: "Wzor posta o udziale w programie", type: "Wzory postow", description: "Gotowa struktura komunikatu do adaptacji przez startup.", addedAt: "2026-05-20", url: "https://akces.example.com/wzor-posta" },
  { id: "mat-6", title: "Checklista przed publikacja", type: "Inne", description: "Krotka lista sprawdzajaca linki, zgody i oznaczenia.", addedAt: "2026-05-22", url: "https://akces.example.com/checklista" }
];

const defaultMarketingPublications = [
  { id: "pub-1", title: "Post o starcie akceleracji", type: "post o startupie", description: "Krotki wpis przedstawiajacy startup i temat projektu.", status: "opublikowana", plannedAt: "2026-05-30", url: "https://akces.example.com/post-applc-demo", fileName: "" },
  { id: "pub-2", title: "Opis na stronie programu", type: "opis na stronie programu", description: "Profil startupu na stronie Akces NCBR.", status: "wyslana do akceptacji", plannedAt: "2026-06-06", url: "", fileName: "opis-do-akceptacji.docx" },
  { id: "pub-3", title: "Newsletter dla partnerow", type: "newsletter", description: "Wzmianka o projekcie i jego zastosowaniu w ogrodach edukacyjnych.", status: "w przygotowaniu", plannedAt: "2026-06-18", url: "", fileName: "" },
  { id: "pub-4", title: "Case study po pilocie", type: "case study", description: "Material planowany po pierwszym pilocie z ogrodem spolecznym.", status: "planowana", plannedAt: "2026-09-15", url: "", fileName: "" }
];

const defaultMarketingContests = [
  {
    id: "contest-1",
    name: "Green Startup Challenge",
    organizer: "Fundacja Zielone Innowacje",
    type: "pitch contest",
    description: "Pitch contest dla startupow rozwijajacych rozwiazania srodowiskowe.",
    audience: "Startupy agritech, cleantech i impact",
    deadline: "2026-06-21",
    status: "w trakcie przygotowania",
    url: "https://example.com/green-startup",
    requiredMaterials: "pitch deck, opis projektu, logo, dane zespolu",
    owner: "Maria Nowak",
    notes: "Przygotowac wersje pitchu z naciskiem na ogrody spoleczne.",
    fileName: ""
  },
  {
    id: "contest-2",
    name: "Impact Demo Day",
    organizer: "Akces NCBR",
    type: "wydarzenie",
    description: "Wydarzenie widocznosciowe dla projektow z potencjalem wdrozeniowym.",
    audience: "Beneficjenci programu i partnerzy biznesowi",
    deadline: "2026-07-05",
    status: "nowy",
    url: "https://akces.example.com/demo-day",
    requiredMaterials: "opis 500 znakow, zdjecie zespolu, grafika produktu",
    owner: "Olga Kaminska",
    notes: "Sprawdzic, czy demo bedzie gotowe do pokazania.",
    fileName: ""
  },
  {
    id: "contest-3",
    name: "Nagroda dla innowacji spolecznych",
    organizer: "Forum Innowacji",
    type: "nagroda",
    description: "Nagroda promujaca projekty o wplywie spolecznym i edukacyjnym.",
    audience: "Organizacje i startupy impact",
    deadline: "2026-05-15",
    status: "archiwalny",
    url: "https://example.com/nagroda-impact",
    requiredMaterials: "formularz, opis wplywu, rekomendacja",
    owner: "Maria Nowak",
    notes: "Termin miniety, zachowac jako inspiracje do przyszlych naborow.",
    fileName: ""
  }
];

state.marketingPackageItems = defaultMarketingPackageItems.map((item) => ({ ...item }));
state.marketingProfile = { ...defaultMarketingProfile };
state.marketingContests = defaultMarketingContests.map((contest) => ({ ...contest }));

function docHistory(id, timestamp, actorName, actorRole, actionType, previousStatus, newStatus, comment, fileName = "", previousFileName = "", newFileName = "") {
  return {
    id: `hist-${id}-${timestamp.replaceAll(/[^0-9]/g, "")}`,
    documentId: id,
    timestamp,
    actorName,
    actorRole,
    actionType,
    fileName,
    previousFileName,
    newFileName,
    previousStatus,
    newStatus,
    comment
  };
}

function mockPdfFile(name, addedBy = "Jan Nowak", addedByRole = "Beneficjent", addedAt = "2026-05-26T14:22:00") {
  return {
    id: `file-${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`,
    name,
    type: "application/pdf",
    addedBy,
    addedByRole,
    addedAt,
    content: ""
  };
}

const defaultDocumentWorkflowDocs = [
  {
    id: "contract-main",
    documentType: "contract",
    title: "Umowa akceleracyjna APPLC",
    typeLabel: "Umowa akceleracyjna",
    status: "Oczekuje na podpis osoby upowaznionej",
    currentStep: "Akces / osoba upowazniona podpisuje zweryfikowana umowe.",
    signaturePath: [
      { role: "Beneficjent", state: "podpisano" },
      { role: "Akces / Opiekun Projektu", state: "zweryfikowano" },
      { role: "Akces / osoba upowazniona", state: "oczekuje" }
    ],
    currentFile: mockPdfFile("Umowa_akceleracyjna_APPLC_podpis_Beneficjent.pdf"),
    fileVersions: [],
    comments: [
      { id: "comment-contract-1", author: "Julia Bareja", role: "Opiekun Projektu", timestamp: "2026-05-26T15:10:00", text: "Plik zweryfikowany i przekazany do podpisu osoby upowaznionej." }
    ],
    history: [
      docHistory("contract-main", "2026-05-26T14:22:00", "Jan Nowak", "Beneficjent", "Dodano plik PDF", "Oczekuje na dodanie umowy przez Beneficjenta", "Oczekuje na weryfikacje Akces", "Beneficjent dodal podpisana umowe.", "Umowa_akceleracyjna_APPLC_podpis_Beneficjent.pdf", "", "Umowa_akceleracyjna_APPLC_podpis_Beneficjent.pdf"),
      docHistory("contract-main", "2026-05-26T15:10:00", "Julia Bareja", "Opiekun Projektu", "Zweryfikowano dokument", "Oczekuje na weryfikacje Akces", "Oczekuje na podpis osoby upowaznionej", "Plik poprawny, przekazano do podpisu osoby upowaznionej.", "Umowa_akceleracyjna_APPLC_podpis_Beneficjent.pdf")
    ],
    createdAt: "2026-05-20T10:00:00",
    updatedAt: "2026-05-26T15:10:00"
  },
  ..."Maj 2026,Czerwiec 2026,Lipiec 2026,Sierpien 2026,Wrzesien 2026,Pazdziernik 2026".split(",").map((month, index) => ({
    id: `wst-${index + 1}`,
    documentType: "wst",
    title: `WST miesieczne - ${month}`,
    typeLabel: "WST miesieczne",
    month,
    status: index === 0 ? "Oczekuje na podpis Opiekuna Projektu" : "Oczekuje na dodanie podpisanego WST przez Beneficjenta",
    currentStep: index === 0 ? "Opiekun Projektu podpisuje / akceptuje dokument WST." : "Beneficjent dodaje podpisany plik PDF WST.",
    signaturePath: [
      { role: "Beneficjent", state: index === 0 ? "podpisano" : "oczekuje" },
      { role: "Opiekun Projektu", state: index === 0 ? "oczekuje" : "oczekuje" },
      { role: "Osoba upowazniona", state: "oczekuje" }
    ],
    currentFile: index === 0 ? mockPdfFile("WST_maj_2026_podpis_Beneficjent.pdf", "Jan Nowak", "Beneficjent", "2026-05-26T14:40:00") : null,
    fileVersions: [],
    comments: index === 0 ? [
      { id: "comment-wst-1", author: "Jan Nowak", role: "Beneficjent", timestamp: "2026-05-26T14:40:00", text: "WST za maj dodany do podpisu Opiekuna Projektu." }
    ] : [],
    history: index === 0 ? [
      docHistory("wst-1", "2026-05-26T14:40:00", "Jan Nowak", "Beneficjent", "Dodano plik PDF", "Oczekuje na dodanie podpisanego WST przez Beneficjenta", "Oczekuje na podpis Opiekuna Projektu", "Dodano podpisany WST za maj.", "WST_maj_2026_podpis_Beneficjent.pdf", "", "WST_maj_2026_podpis_Beneficjent.pdf")
    ] : [],
    createdAt: "2026-05-01T09:00:00",
    updatedAt: index === 0 ? "2026-05-26T14:40:00" : "2026-05-01T09:00:00"
  })),
  {
    id: "formal-weksel-deklaracja",
    documentType: "formal",
    title: "Deklaracja wekslowa",
    typeLabel: "Dokument formalny",
    category: "deklaracja wekslowa",
    status: "Do poprawy",
    currentStep: "Beneficjent dodaje poprawiona wersje dokumentu PDF.",
    signaturePath: [
      { role: "Beneficjent", state: "do poprawy" },
      { role: "Akces", state: "oczekuje" }
    ],
    currentFile: null,
    fileVersions: [
      mockPdfFile("Deklaracja_wekslowa_wersja_bledna.pdf", "Jan Nowak", "Beneficjent", "2026-05-24T11:30:00")
    ],
    comments: [
      { id: "comment-formal-1", author: "Julia Bareja", role: "Opiekun Projektu", timestamp: "2026-05-26T15:12:00", text: "Brakuje podpisu osoby uprawnionej do reprezentacji." }
    ],
    history: [
      docHistory("formal-weksel-deklaracja", "2026-05-24T11:30:00", "Jan Nowak", "Beneficjent", "Dodano plik PDF", "Oczekuje na dodanie pliku", "Oczekuje na weryfikacje Akces", "Dodano deklaracje wekslowa.", "Deklaracja_wekslowa_wersja_bledna.pdf", "", "Deklaracja_wekslowa_wersja_bledna.pdf"),
      docHistory("formal-weksel-deklaracja", "2026-05-26T15:12:00", "Julia Bareja", "Opiekun Projektu", "Usunieto aktualny plik", "Oczekuje na weryfikacje Akces", "Do poprawy", "Bledna wersja dokumentu. Brakuje podpisu osoby uprawnionej.", "Deklaracja_wekslowa_wersja_bledna.pdf", "Deklaracja_wekslowa_wersja_bledna.pdf", "")
    ],
    createdAt: "2026-05-20T10:00:00",
    updatedAt: "2026-05-26T15:12:00"
  },
  {
    id: "formal-pelnomocnictwo",
    documentType: "formal",
    title: "Pelnomocnictwo do reprezentacji",
    typeLabel: "Dokument formalny",
    category: "pelnomocnictwo",
    status: "Zaakceptowany",
    currentStep: "Dokument zaakceptowany, nie wymaga dzialania.",
    signaturePath: [
      { role: "Beneficjent", state: "dodano" },
      { role: "Akces", state: "zaakceptowano" }
    ],
    currentFile: mockPdfFile("Pelnomocnictwo_APPLC.pdf", "Maria Nowak", "Beneficjent", "2026-05-19T09:20:00"),
    fileVersions: [],
    comments: [],
    history: [
      docHistory("formal-pelnomocnictwo", "2026-05-19T09:20:00", "Maria Nowak", "Beneficjent", "Dodano plik PDF", "Oczekuje na dodanie pliku", "Oczekuje na weryfikacje Akces", "Dodano pelnomocnictwo.", "Pelnomocnictwo_APPLC.pdf", "", "Pelnomocnictwo_APPLC.pdf"),
      docHistory("formal-pelnomocnictwo", "2026-05-19T12:05:00", "Julia Bareja", "Opiekun Projektu", "Zaakceptowano dokument", "Oczekuje na weryfikacje Akces", "Zaakceptowany", "Dokument poprawny.", "Pelnomocnictwo_APPLC.pdf")
    ],
    createdAt: "2026-05-19T09:20:00",
    updatedAt: "2026-05-19T12:05:00"
  },
  {
    id: "other-1",
    documentType: "other",
    title: "Dodatkowa specyfikacja projektu",
    typeLabel: "Inny dokument",
    category: "zalacznik projektowy",
    description: "Dokument pomocniczy do rozmow z opiekunem projektu.",
    status: "Oczekuje na weryfikacje Akces",
    currentStep: "Akces weryfikuje dodany dokument.",
    signaturePath: [
      { role: "Beneficjent", state: "dodano" },
      { role: "Akces", state: "weryfikacja" }
    ],
    currentFile: mockPdfFile("Specyfikacja_projektu_APPLC.pdf", "Olga Kaminska", "Beneficjent", "2026-05-23T10:30:00"),
    fileVersions: [],
    comments: [],
    history: [
      docHistory("other-1", "2026-05-23T10:30:00", "Olga Kaminska", "Beneficjent", "Dodano plik PDF", "Oczekuje na dodanie pliku", "Oczekuje na weryfikacje Akces", "Dodano specyfikacje projektu.", "Specyfikacja_projektu_APPLC.pdf", "", "Specyfikacja_projektu_APPLC.pdf")
    ],
    createdAt: "2026-05-23T10:30:00",
    updatedAt: "2026-05-23T10:30:00"
  },
  {
    id: "archive-1",
    documentType: "archive",
    title: "Wersja robocza oswiadczenia",
    typeLabel: "Archiwum",
    category: "oswiadczenie",
    status: "Archiwalny",
    currentStep: "Dokument archiwalny tylko do podgladu.",
    signaturePath: [
      { role: "Beneficjent", state: "zastapiono nowsza wersja" },
      { role: "Akces", state: "zarchiwizowano" }
    ],
    currentFile: mockPdfFile("Oswiadczenie_wersja_robocza.pdf", "Jan Nowak", "Beneficjent", "2026-05-12T13:00:00"),
    fileVersions: [],
    comments: [
      { id: "comment-archive-1", author: "Admin", role: "Admin", timestamp: "2026-05-18T16:30:00", text: "Dokument zastapiony nowsza wersja." }
    ],
    history: [
      docHistory("archive-1", "2026-05-12T13:00:00", "Jan Nowak", "Beneficjent", "Dodano plik PDF", "Oczekuje na dodanie pliku", "Oczekuje na weryfikacje Akces", "Dodano wersje robocza.", "Oswiadczenie_wersja_robocza.pdf", "", "Oswiadczenie_wersja_robocza.pdf"),
      docHistory("archive-1", "2026-05-18T16:30:00", "Admin", "Admin", "Przeniesiono do archiwum", "Oczekuje na weryfikacje Akces", "Archiwalny", "Dokument zastapiony nowsza wersja.", "Oswiadczenie_wersja_robocza.pdf")
    ],
    createdAt: "2026-05-12T13:00:00",
    updatedAt: "2026-05-18T16:30:00"
  }
];

state.documentWorkflowDocs = defaultDocumentWorkflowDocs.map((document) => ({
  ...document,
  signaturePath: document.signaturePath.map((step) => ({ ...step })),
  currentFile: document.currentFile ? { ...document.currentFile } : null,
  fileVersions: document.fileVersions.map((file) => ({ ...file })),
  comments: document.comments.map((comment) => ({ ...comment })),
  history: document.history.map((entry) => ({ ...entry }))
}));

const app = document.querySelector("#app");
const actorSelect = document.querySelector("#actor-select");
const scopeSelect = document.querySelector("#scope-select");
const scopeField = scopeSelect.closest(".field.compact");
const toast = document.querySelector("#toast");
const shell = document.querySelector(".app-shell");
const currentViewLabel = document.querySelector("#current-view-label");
const contextMenu = document.querySelector("#context-menu");
const contextToggle = document.querySelector("[data-context-toggle]");
const sidebarCollapse = document.querySelector("[data-sidebar-collapse]");
const notificationMenu = document.querySelector("#notification-menu");
const globalSearch = document.querySelector("#global-search");
const mockStorageKey = "akces-static-demo-data";
let inMemoryMockData = null;

new MutationObserver(() => {
  document.querySelectorAll("form").forEach((form) => {
    form.noValidate = true;
  });
}).observe(app, { childList: true, subtree: true });

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

function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
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

function statusTone(status = "") {
  const normalized = String(status).toLowerCase();
  if (/(zaakcept|zatwierdz|podpis|zrealiz|komplet|wyplac)/.test(normalized)) return "success";
  if (/(do poprawy|brak pliku|blad|odrzu|przekrocz)/.test(normalized)) return "danger";
  if (/(oczekuje|w trakcie|do uzupelnienia|w weryfikacji|przekazany)/.test(normalized)) return "warning";
  if (/(plan|now|wyslan|informac|webinar|prezentac|instrukc|grafik|konkurs|nabor)/.test(normalized)) return "info";
  if (/(robocz|archiw|niedostep|nie dotyczy|brak)/.test(normalized)) return "neutral";
  return "neutral";
}

function statusBadge(status, extraClass = "") {
  const className = extraClass ? ` ${extraClass}` : "";
  return `<span class="status-badge${className}" data-tone="${statusTone(status)}">${escapeHtml(status || "-")}</span>`;
}

function emptyState(title, description = "", action = "") {
  return `
    <div class="empty-state">
      <strong>${escapeHtml(title)}</strong>
      ${description ? `<p>${escapeHtml(description)}</p>` : ""}
      ${action}
    </div>
  `;
}

function formatNotificationTime(value) {
  return formatDateTime(value);
}

function moduleName(moduleId) {
  return moduleLabels[moduleId] || moduleId || "Akces";
}

function notificationTone(type = "") {
  if (type.includes("correction") || type.includes("rejected")) return "danger";
  if (type.includes("deadline") || type.includes("status")) return "warning";
  if (type.includes("marketing") || type.includes("meeting")) return "info";
  return "neutral";
}

function toastTone(message = "", tone = "") {
  if (tone) return tone;
  const normalized = normalizeSearchText(message);
  if (/(nie mozna|blad|wymagany|przekrocz|popraw|usunieto aktualny plik)/.test(normalized)) return "danger";
  if (/(zapisano|dodano|podmieniono|wygenerowano|zaktualizowano|zmieniono|wykonano)/.test(normalized)) return "success";
  return "info";
}

function showToast(message, tone = "") {
  const resolvedTone = toastTone(message, tone);
  toast.textContent = message;
  toast.className = `toast is-visible is-${resolvedTone}`;
  window.clearTimeout(showToast.hideTimer);
  showToast.hideTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2800);
}

function renderSkeleton() {
  return `
    <section class="skeleton-layout" aria-label="Ladowanie danych">
      <div class="skeleton-card"></div>
      <div class="summary-strip">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>
      <div class="skeleton-card"></div>
    </section>
  `;
}

function renderNotificationMenu() {
  if (!notificationMenu) return;
  const unreadCount = state.notifications.filter((item) => !item.read).length;
  const notifications = state.notifications.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  notificationMenu.innerHTML = `
    <button class="notification-button" type="button" data-notifications-toggle aria-label="Komunikaty od Akces" aria-expanded="${state.notificationsOpen}">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2Z"></path>
        <path d="M10 21h4"></path>
      </svg>
      ${unreadCount ? `<strong>${unreadCount}</strong>` : ""}
    </button>
    <div class="notifications-panel" ${state.notificationsOpen ? "" : "hidden"}>
      <div class="notifications-head">
        <h2>Powiadomienia</h2>
        <p>${unreadCount ? `${unreadCount} nieprzeczytane` : "Wszystko przeczytane"}</p>
      </div>
      <div class="notifications-list">
        ${notifications.map((item) => `
          <article class="${item.read ? "is-read" : "is-unread"}" data-notification-id="${escapeHtml(item.id)}">
            <div class="notification-body">
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.description)}</p>
              <span>${formatNotificationTime(item.createdAt)}</span>
            </div>
            <div class="notification-card-actions">
              <button class="button secondary compact-button notification-open-button" type="button" data-notification-open="${escapeHtml(item.id)}">Przejdz do dokumentu</button>
              <button class="icon-button notification-read-button" type="button" data-notification-read="${escapeHtml(item.id)}" aria-label="Oznacz jako odczytane" ${item.read ? "disabled" : ""}>
                <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"></path></svg>
              </button>
            </div>
          </article>
        `).join("") || emptyState("Brak powiadomien", "Historia powiadomien pojawi sie tutaj.")}
      </div>
      <div class="notifications-actions">
        <button class="button secondary compact-button" type="button" data-notifications-history>Zobacz wszystkie</button>
        <button class="button ghost compact-button" type="button" data-notifications-clear-read>Wyczysc przeczytane</button>
      </div>
    </div>
  `;
}

function normalizeSearchText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0142/g, "l")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function searchResult(item) {
  const status = item.status ? statusBadge(item.status) : "";
  return `
    <article class="search-result-item" data-search-result="${escapeHtml(item.id)}">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.description || "")}</p>
        <span>${escapeHtml(item.type)} / ${escapeHtml(moduleName(item.module))}</span>
      </div>
      ${status}
      <button class="button secondary compact-button" type="button" data-search-open="${escapeHtml(item.id)}">Przejdz</button>
    </article>
  `;
}

function buildSearchIndex() {
  const items = [];
  state.documentWorkflowDocs.forEach((document) => {
    items.push({
      id: `document:${document.id}`,
      title: `${document.title}${document.month && !document.title.includes(document.month) ? ` - ${document.month}` : ""}`,
      type: "Dokument",
      module: "documents",
      relatedObjectId: document.id,
      description: document.currentStep || document.description || "",
      status: document.status,
      keywords: [document.typeLabel, document.status, document.month, document.currentFile?.name, document.description].join(" ")
    });
  });
  state.addressBookContacts.forEach((contact) => {
    items.push({
      id: `contact:${contact.id}`,
      title: contact.name,
      type: "Kontakt",
      module: "start",
      relatedObjectId: contact.id,
      description: `${contact.position} / ${contact.organization}`,
      status: contact.category,
      keywords: [contact.email, contact.phone, contact.description, contact.category].join(" ")
    });
  });
  state.mentoringMentors.forEach((mentor) => {
    items.push({
      id: `mentor:${mentor.id}`,
      title: mentor.name,
      type: mentor.type === "lead" ? "Mentor prowadzacy" : "Mentor merytoryczny",
      module: "mentoring",
      relatedObjectId: mentor.id,
      description: mentor.specialization,
      status: `${mentorUsedHours(mentor)} / ${mentor.limit} h`,
      keywords: [mentor.role, mentor.specialization, mentor.email, mentor.phone].join(" ")
    });
    mentor.documents.reports.forEach((report) => {
      items.push({
        id: `report:${mentor.id}:${report.month}`,
        title: `Sprawozdanie - ${report.month}`,
        type: "Sprawozdanie",
        module: "mentoring",
        relatedObjectId: mentor.id,
        description: `Mentor: ${mentor.name}`,
        status: report.status,
        keywords: [report.month, report.status, mentor.name].join(" ")
      });
    });
  });
  state.marketingContests.forEach((contest) => {
    items.push({
      id: `contest:${contest.id}`,
      title: contest.name,
      type: "Konkurs",
      module: "marketing",
      relatedObjectId: contest.id,
      description: contest.deadline ? `Termin zgloszen: ${formatDate(contest.deadline)}` : contest.description,
      status: contest.status,
      keywords: [contest.organizer, contest.type, contest.description, contest.audience, contest.requiredMaterials, contest.notes].join(" ")
    });
  });
  defaultMarketingPublications.forEach((publication) => {
    items.push({
      id: `publication:${publication.id}`,
      title: publication.title,
      type: "Publikacja",
      module: "marketing",
      relatedObjectId: publication.id,
      description: publication.description,
      status: publication.status,
      keywords: [publication.type, publication.plannedAt, publication.fileName].join(" ")
    });
  });
  defaultAkcesMarketingMaterials.forEach((material) => {
    items.push({
      id: `material:${material.id}`,
      title: material.title,
      type: "Material od Akces",
      module: "marketing",
      relatedObjectId: material.id,
      description: material.description,
      status: material.type,
      keywords: [material.type, material.addedAt].join(" ")
    });
  });
  state.marketingPackageItems.forEach((item) => {
    items.push({
      id: `package:${item.id}`,
      title: item.title,
      type: "Paczka marketingowa",
      module: "marketing",
      relatedObjectId: item.id,
      description: item.fileName || item.link || item.text || "Material marketingowy",
      status: item.status,
      keywords: [item.fileName, item.link, item.text].join(" ")
    });
  });
  attentionTasks.forEach((task, index) => {
    items.push({
      id: `task:${index}`,
      title: task.title,
      type: "Zadanie",
      module: task.view,
      relatedObjectId: "",
      description: task.description,
      status: task.status,
      keywords: [task.due, task.action].join(" ")
    });
  });
  state.data.expenses.forEach((expense) => {
    items.push({
      id: `expense:${expense.id}`,
      title: expense.invoiceNumber || expense.contractor || "Wydatek",
      type: "Wydatek",
      module: "expenses",
      relatedObjectId: expense.id,
      description: `${expense.contractor || "-"} / ${money(expense.grossAmount)}`,
      status: statusLabels[expense.status] || expense.status,
      keywords: [expense.description, expense.priorityGoal, expense.detailedGoal, expense.contractor].join(" ")
    });
  });
  return items.map((item) => ({
    ...item,
    haystack: normalizeSearchText([item.title, item.description, item.status, item.module, item.type, item.keywords].join(" "))
  }));
}

function currentSearchResults() {
  const query = normalizeSearchText(state.searchQuery);
  if (!query) return [];
  const terms = query.split(/\s+/).filter(Boolean);
  return buildSearchIndex()
    .filter((item) => terms.every((term) => item.haystack.includes(term)))
    .slice(0, 8);
}

function renderGlobalSearch() {
  if (!globalSearch) return;
  const results = currentSearchResults();
  const showPanel = state.searchOpen && state.searchQuery.trim().length > 0;
  globalSearch.innerHTML = `
    <label class="global-search-box">
      <span aria-hidden="true">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path d="m16 16 4 4"></path></svg>
      </span>
      <input id="global-search-input" type="search" value="${escapeHtml(state.searchQuery)}" placeholder="Szukaj" autocomplete="off" />
    </label>
    <div class="search-results-panel" ${showPanel ? "" : "hidden"}>
      ${results.length ? results.map(searchResult).join("") : emptyState("Brak wynikow dla podanej frazy", "Sprobuj wpisac nazwe dokumentu, mentora, konkursu albo status.")}
    </div>
  `;
}

function goToRelatedItem(moduleId, relatedObjectId = "") {
  state.notificationsOpen = false;
  state.searchOpen = false;
  if (moduleId === "documents") {
    const document = workflowDocument(relatedObjectId);
    if (document) state.documentsTab = document.documentType || "contract";
    setView("documents");
  } else if (moduleId === "mentoring") {
    if (relatedObjectId) state.mentoringActiveMentorId = relatedObjectId;
    state.mentoringMainTab = mentoringMentor(relatedObjectId)?.type === "subject" ? "subject" : "lead";
    state.mentoringSection = "info";
    setView("mentoring");
  } else if (moduleId === "marketing") {
    if (String(relatedObjectId).startsWith("mat-")) state.marketingTab = "materials";
    else if (String(relatedObjectId).startsWith("pub-")) state.marketingTab = "publications";
    else if (String(relatedObjectId).startsWith("contest")) state.marketingTab = "contests";
    else state.marketingTab = "package";
    setView("marketing");
  } else if (moduleId === "start") {
    setView("start");
    state.addressBookOpen = true;
    renderStart();
  } else {
    setView(moduleId || "start");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openNotification(id) {
  const notification = state.notifications.find((item) => item.id === id);
  if (!notification) return;
  notification.read = true;
  goToRelatedItem(notification.module, notification.relatedObjectId);
  renderNotificationMenu();
}

function addNotification({ title, description, type, module, relatedObjectId = "", relatedObjectName = "", actionLabel = "Przejdz" }) {
  state.notifications.unshift({
    id: `notif-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    description,
    type,
    module,
    relatedObjectId,
    relatedObjectName,
    createdAt: new Date().toISOString(),
    read: false,
    actionLabel
  });
  renderNotificationMenu();
}

function openSearchResult(id) {
  const result = buildSearchIndex().find((item) => item.id === id);
  if (!result) return;
  state.searchQuery = "";
  goToRelatedItem(result.module, result.relatedObjectId);
  renderGlobalSearch();
}

function createMockData() {
  const createdAt = "2026-05-08T13:57:53.100Z";
  return {
    beneficiaries: [
      { id: "admin", name: "ADMIN", slug: "admin", role: "admin", active: true, createdAt },
      { id: "ben_fundacja_demo", name: "Fundacja Demo", slug: "fundacja-demo", role: "beneficiary", active: true, createdAt },
      { id: "ben_spolka_testowa", name: "Spolka Testowa", slug: "spolka-testowa", role: "beneficiary", active: true, createdAt }
    ],
    startupCards: {
      ben_fundacja_demo: { beneficiaryId: "ben_fundacja_demo", companyName: "Fundacja Demo", acronym: "APPLC" },
      ben_spolka_testowa: { beneficiaryId: "ben_spolka_testowa", companyName: "Spolka Testowa", acronym: "" }
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
        status: "zatwierdzony",
        attachments: [],
        createdAt,
        createdBy: "admin"
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
        status: "odrzucony",
        attachments: [],
        createdAt,
        createdBy: "admin"
      }
    ],
    documents: [
      { id: "doc_demo_1", beneficiaryId: "ben_fundacja_demo", title: "Harmonogram monitoringu", category: "Monitoring", owner: "ADMIN", status: "do-pobrania", note: "Dokument roboczy do konsultacji.", attachments: [], createdAt, createdBy: "admin" }
    ],
    calendar: [
      { id: "cal_demo_1", beneficiaryId: "ben_fundacja_demo", title: "Przekazanie weksla", startAt: "2026-05-20T09:00", endAt: "2026-05-20T10:00", ownerId: "admin", participantIds: ["ben_fundacja_demo"], type: "formalnosc", color: "#f26a21", status: "do-zrobienia", note: "Termin widoczny dla beneficjenta i administratora.", attachments: [] },
      { id: "cal_demo_2", beneficiaryId: "ben_fundacja_demo", title: "Spotkanie mentoringowe", startAt: "2026-06-12T10:00", endAt: "2026-06-12T12:00", ownerId: "admin", participantIds: ["ben_fundacja_demo"], type: "mentoring", color: "#2563eb", status: "do-zrobienia", note: "Omowienie harmonogramu mentoringu.", attachments: [] }
    ],
    tutorials: [
      { id: "tut_1", title: "Jak dodac wydatek", body: "Uzupelnij dane faktury, kontrahenta, kwoty netto, stawke VAT, cele oraz dodaj przynajmniej jeden zalacznik." },
      { id: "tut_2", title: "Co oznaczaja statusy", body: "ADMIN nadaje statusy wydatkom i dokumentom, a beneficjent widzi aktualny etap obslugi." }
    ]
  };
}

function makeMockId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function mockStorage() {
  try {
    return window.localStorage || null;
  } catch {
    return null;
  }
}

function readMockData() {
  const storage = mockStorage();
  try {
    const stored = storage?.getItem(mockStorageKey);
    if (stored) return JSON.parse(stored);
  } catch {
    storage?.removeItem(mockStorageKey);
  }
  if (inMemoryMockData) return inMemoryMockData;
  const data = createMockData();
  writeMockData(data);
  return data;
}

function writeMockData(data) {
  inMemoryMockData = data;
  try {
    mockStorage()?.setItem(mockStorageKey, JSON.stringify(data));
  } catch {
    // Demo still works in-memory when browser storage is unavailable.
  }
}

function mockActor(data, actorId = "admin") {
  return data.beneficiaries.find((beneficiary) => beneficiary.id === actorId) || data.beneficiaries.find((beneficiary) => beneficiary.id === "admin");
}

function mockIsAdmin(actor) {
  return actor?.id === "admin" || actor?.role === "admin";
}

function mockScope(data, actor, scopeBeneficiaryId = "all") {
  if (!mockIsAdmin(actor)) return actor?.id || "";
  if (!scopeBeneficiaryId || scopeBeneficiaryId === "admin") return "all";
  if (scopeBeneficiaryId === "all") return "all";
  return data.beneficiaries.some((beneficiary) => beneficiary.id === scopeBeneficiaryId && beneficiary.id !== "admin") ? scopeBeneficiaryId : "all";
}

function mockBelongsToScope(item, scope) {
  if (scope === "all") return true;
  return item.beneficiaryId === scope || item.ownerId === scope || (item.participantIds || []).includes(scope);
}

function selectedMockData(data, actorId, scopeBeneficiaryId = "all") {
  const actor = mockActor(data, actorId);
  const scope = mockScope(data, actor, scopeBeneficiaryId);
  const admin = mockIsAdmin(actor);
  const beneficiaries = admin ? data.beneficiaries : data.beneficiaries.filter((beneficiary) => beneficiary.id === "admin" || beneficiary.id === actor.id);
  const startupCards = {};
  beneficiaries.forEach((beneficiary) => {
    if (beneficiary.id !== "admin" && (scope === "all" || beneficiary.id === scope)) {
      startupCards[beneficiary.id] = data.startupCards[beneficiary.id] || { beneficiaryId: beneficiary.id, companyName: beneficiary.name, acronym: "" };
    }
  });
  return {
    actorId: actor?.id || "admin",
    scopeBeneficiaryId: scope,
    beneficiaries,
    expenses: data.expenses.filter((item) => mockBelongsToScope(item, scope)),
    documents: data.documents.filter((item) => mockBelongsToScope(item, scope)),
    calendar: data.calendar.filter((item) => mockBelongsToScope(item, scope)),
    startupCards,
    tutorials: data.tutorials
  };
}

function resolveMockBeneficiary(data, actor, requestedId) {
  if (mockIsAdmin(actor)) {
    if (requestedId && requestedId !== "all") return data.beneficiaries.find((beneficiary) => beneficiary.id === requestedId && beneficiary.id !== "admin" && beneficiary.active);
    return data.beneficiaries.find((beneficiary) => beneficiary.id !== "admin" && beneficiary.active);
  }
  return data.beneficiaries.find((beneficiary) => beneficiary.id === actor?.id && beneficiary.active);
}

function createMockAttachment(file, kind = "attachment") {
  if (!file?.name) return null;
  return {
    id: makeMockId("file"),
    fileName: file.name,
    kind,
    content: file.content || "",
    createdAt: new Date().toISOString()
  };
}

function mockJsonError(message) {
  return Promise.reject(new Error(message));
}

async function mockApi(path, options = {}) {
  const url = new URL(path, window.location.origin);
  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const data = readMockData();

  if (method === "GET" && url.pathname === "/api/state") {
    return selectedMockData(data, url.searchParams.get("actorId") || "admin", url.searchParams.get("scopeBeneficiaryId") || "all");
  }

  if (method === "POST" && url.pathname === "/api/beneficiaries") {
    const actor = mockActor(data, body.actorId || "admin");
    if (!mockIsAdmin(actor)) return mockJsonError("Tylko ADMIN moze dodawac beneficjentow.");
    const name = String(body.name || "").trim();
    if (name.length < 2) return mockJsonError("Nazwa beneficjenta jest wymagana.");
    const beneficiary = { id: makeMockId("ben"), name, slug: normalizeSearchText(name).replaceAll(" ", "-") || makeMockId("beneficjent"), role: "beneficiary", active: true, createdAt: new Date().toISOString() };
    data.beneficiaries.push(beneficiary);
    data.startupCards[beneficiary.id] = { beneficiaryId: beneficiary.id, companyName: name, acronym: "" };
    writeMockData(data);
    return beneficiary;
  }

  if (method === "PATCH" && url.pathname.startsWith("/api/beneficiaries/")) {
    const actor = mockActor(data, body.actorId || "admin");
    if (!mockIsAdmin(actor)) return mockJsonError("Tylko ADMIN moze zmieniac status beneficjenta.");
    const beneficiary = data.beneficiaries.find((item) => item.id === url.pathname.split("/").pop() && item.id !== "admin");
    if (!beneficiary) return mockJsonError("Beneficjent nie zostal znaleziony.");
    beneficiary.active = Boolean(body.active);
    writeMockData(data);
    return beneficiary;
  }

  if (method === "POST" && url.pathname === "/api/expenses") {
    const actor = mockActor(data, body.actorId || "");
    const beneficiary = resolveMockBeneficiary(data, actor, body.beneficiaryId);
    if (!beneficiary) return mockJsonError("Wybierz aktywnego beneficjenta dla wydatku.");
    const attachments = [
      ...(body.invoiceFiles || []).map((file) => createMockAttachment(file, "invoice")).filter(Boolean),
      ...(body.otherFiles || []).map((file) => createMockAttachment(file, "other")).filter(Boolean)
    ];
    if (!attachments.length) return mockJsonError("Dodaj przynajmniej jeden zalacznik do wydatku.");
    const netAmount = Number(body.netAmount || 0);
    const vatRate = String(body.vatRate || "23");
    const vatAmount = vatRate === "zw" ? 0 : Math.round(netAmount * (Number(vatRate) / 100) * 100) / 100;
    const expense = {
      id: makeMockId("exp"),
      beneficiaryId: beneficiary.id,
      invoiceNumber: String(body.invoiceNumber || "").trim(),
      contractor: String(body.contractor || "").trim(),
      invoiceDate: body.invoiceDate || "",
      paymentDate: body.paymentDate || "",
      netAmount,
      vatRate,
      vatAmount,
      grossAmount: Math.round((netAmount + vatAmount) * 100) / 100,
      acquisitionMethod: String(body.acquisitionMethod || "").trim(),
      priorityGoal: String(body.priorityGoal || "").match(/([1-9]|10)/)?.[1] || "",
      detailedGoal: String(body.detailedGoal || "").match(/([1-9]|10)/)?.[1] || "",
      description: String(body.description || "").trim(),
      status: "przekazany-do-weryfikacji",
      attachments,
      createdAt: new Date().toISOString(),
      createdBy: actor?.id || "admin"
    };
    data.expenses.unshift(expense);
    writeMockData(data);
    return expense;
  }

  if (method === "PATCH" && url.pathname.startsWith("/api/expenses/")) {
    const expense = data.expenses.find((item) => item.id === url.pathname.split("/").pop());
    if (!expense) return mockJsonError("Wydatek nie zostal znaleziony.");
    expense.status = body.status || expense.status;
    writeMockData(data);
    return expense;
  }

  if ((method === "POST" && url.pathname === "/api/calendar") || (method === "PATCH" && url.pathname.startsWith("/api/calendar/"))) {
    const actor = mockActor(data, body.actorId || state.actorId);
    const id = method === "PATCH" ? url.pathname.split("/").pop() : makeMockId("cal");
    const existing = data.calendar.find((item) => item.id === id);
    const beneficiary = resolveMockBeneficiary(data, actor, body.beneficiaryId || existing?.beneficiaryId);
    if (!beneficiary) return mockJsonError("Wybierz aktywnego beneficjenta dla wydarzenia.");
    const next = {
      id,
      beneficiaryId: beneficiary.id,
      title: String(body.title || existing?.title || "").trim(),
      startAt: body.startAt || existing?.startAt || "",
      endAt: body.endAt || existing?.endAt || "",
      ownerId: existing?.ownerId || actor?.id || "admin",
      participantIds: Array.isArray(body.participantIds) ? body.participantIds : existing?.participantIds || [beneficiary.id],
      type: existing?.type || "zadanie",
      color: body.color || existing?.color || "#f26a21",
      status: existing?.status || "do-zrobienia",
      note: String(body.note || "").trim(),
      attachments: [...(existing?.attachments || []), ...(body.files || []).map((file) => createMockAttachment(file, "calendar")).filter(Boolean)]
    };
    if (existing) data.calendar = data.calendar.map((item) => item.id === id ? next : item);
    else data.calendar.unshift(next);
    writeMockData(data);
    return next;
  }

  if (method === "DELETE" && url.pathname.startsWith("/api/calendar/")) {
    data.calendar = data.calendar.filter((item) => item.id !== url.pathname.split("/").pop());
    writeMockData(data);
    return { ok: true };
  }

  return mockJsonError("Ta akcja demo nie wymaga backendu albo nie jest jeszcze zamockowana.");
}

async function api(path, options = {}) {
  if (path.startsWith("/api/")) return mockApi(path, options);
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
  if (app && !app.innerHTML.trim()) {
    app.innerHTML = renderSkeleton();
  }
  state.data = await api(`/api/state?actorId=${encodeURIComponent(state.actorId)}&scopeBeneficiaryId=${encodeURIComponent(state.scopeBeneficiaryId)}`);
  state.actorId = state.data.actorId || state.actorId;
  state.scopeBeneficiaryId = state.data.scopeBeneficiaryId || state.scopeBeneficiaryId;
  if (!state.notifications.length) {
    state.notifications = defaultNotifications.map((notification) => ({ ...notification }));
  }
  if (!state.startupCardBeneficiaryId || !state.data.startupCards[state.startupCardBeneficiaryId]) {
    state.startupCardBeneficiaryId = effectiveBeneficiaryId() || Object.keys(state.data.startupCards)[0] || "";
  }
  renderShell();
  renderView();
}

function navViewFor(view = state.activeView) {
  return view === "add-expense" ? "expenses" : view;
}

function syncShellState() {
  shell.classList.toggle("is-sidebar-collapsed", state.sidebarCollapsed);
  shell.classList.toggle("is-sidebar-open", state.mobileSidebarOpen);
  document.querySelectorAll(".nav-button[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === navViewFor());
  });
  if (currentViewLabel) {
    currentViewLabel.textContent = moduleLabels[state.activeView] || moduleLabels[navViewFor()] || "Akces NCBR";
  }
  if (sidebarCollapse) {
    sidebarCollapse.setAttribute("aria-expanded", String(!state.sidebarCollapsed));
    sidebarCollapse.setAttribute("aria-label", state.sidebarCollapsed ? "Rozwin panel boczny" : "Zwin panel boczny");
    const iconPath = state.sidebarCollapsed ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6";
    const icon = sidebarCollapse.querySelector(".nav-icon");
    if (icon) icon.innerHTML = `<svg viewBox="0 0 24 24"><path d="${iconPath}"></path></svg>`;
  }
  renderNotificationMenu();
  renderGlobalSearch();
}

function setView(view) {
  state.activeView = view;
  if (view !== "documents") state.showDocumentForm = false;
  state.mobileSidebarOpen = false;
  syncShellState();
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
  syncShellState();
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

function initials(value = "") {
  return String(value)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase() || "AK";
}

function contactAvatar(contact, className = "") {
  const extraClass = className ? ` ${className}` : "";
  if (contact.photoUrl) {
    return `<span class="contact-avatar${extraClass}"><img src="${escapeHtml(contact.photoUrl)}" alt="" /></span>`;
  }
  return `<span class="contact-avatar${extraClass}" aria-hidden="true">${escapeHtml(initials(contact.name))}</span>`;
}

function selectedDashboardBeneficiary() {
  return getBeneficiary(effectiveBeneficiaryId()) || beneficiaryList()[0] || activeActor();
}

function selectedStartupCard(beneficiary) {
  return state.data.startupCards[beneficiary?.id] || {};
}

function projectDashboardData() {
  const beneficiary = selectedDashboardBeneficiary();
  const card = selectedStartupCard(beneficiary);
  const companyName = card.companyName || beneficiary?.name || "Twoj startup";
  const acronym = card.acronym || accelerationProject.acronym;
  return {
    companyName,
    projectName: card.projectScope || accelerationProject.projectName,
    acronym,
    supervisor: card.projectSupervisor || "Anna Kowalska"
  };
}

function startupProfileBeneficiary() {
  return selectedDashboardBeneficiary();
}

function startupProfileBase() {
  const beneficiary = startupProfileBeneficiary();
  const card = selectedStartupCard(beneficiary);
  const companyName = card.companyName || beneficiary?.name || "BioWarzywa Sp. z o.o.";
  const acronym = card.acronym || "BioKalendarz";
  const projectScope = "System planowania upraw warzyw zgodnie z kalendarzem biodynamicznym, z podpowiedziami dla dni korzenia, liscia, kwiatu i owocu.";
  return {
    summary: {
      companyName,
      acronym,
      programStatus: "Aktywny",
      projectName: projectScope,
      program: "HPN IMPAKT / Akces NCBR",
      supervisor: card.projectSupervisor || "Anna Kowalska"
    },
    basics: {
      companyName,
      acronym,
      legalForm: "spolka z ograniczona odpowiedzialnoscia",
      nip: card.nip || "5250000000",
      krs: card.krs || "0000123456",
      regon: card.regon || "012345678",
      registeredAddress: card.mailingAddress || "ul. Innowacyjna 12, 00-001 Warszawa",
      website: "https://example.com/applc-demo",
      social: "https://example.com/company/applc-demo",
      industry: "rolnictwo ekologiczne / agrotech / planowanie upraw",
      companyStatus: "Aktywny w programie"
    },
    project: {
      projectName: projectScope,
      projectAcronym: acronym,
      program: "HPN IMPAKT / Akces NCBR",
      contractNumber: "AKCES/HPN/2026/014",
      agreementDate: "28.04.2026",
      accelerationPeriod: "28.04.2026 - 27.10.2026",
      programStage: "Realizacja akceleracji",
      thematicArea: "zrownowazone rolnictwo, ogrodnictwo i technologie wspierajace uprawy",
      developmentStage: "MVP / pilotaz",
      projectScope
    },
    description: {
      shortDescription: "Startup tworzy praktyczny kalendarz biodynamiczny dla uprawy warzyw, ktory pomaga planowac siew, pikowanie, sadzenie, podlewanie i zbiory w odpowiednich dniach.",
      problem: "Osoby uprawiajace warzywa czesto wiedza, co chca posiac, ale nie maja prostego narzedzia pokazujacego, kiedy pracowac z korzeniem, lisciem, kwiatem albo owocem.",
      solution: "Aplikacja tlumaczy kalendarz biodynamiczny na konkretne zadania: w dni korzenia planujemy marchew, buraki i pietruszke, w dni liscia salaty i ziola, w dni kwiatu rosliny kwitnace, a w dni owocu pomidory, ogorki, dynie i papryke.",
      targetGroup: "Mali ogrodnicy, gospodarstwa ekologiczne, miejskie ogrody spoleczne, edukatorzy przyrodniczy i osoby prowadzace przydomowe warzywniki.",
      advantage: "Rozwiazanie laczy proste instrukcje ogrodnicze z rytmem kalendarza biodynamicznego, dzieki czemu uzytkownik widzi nie tylko daty, ale tez sens pracy w danym dniu.",
      useCases: "Planowanie sezonu warzywnego, przypomnienia o siewie i zbiorach, edukacja ogrodnicza, prowadzenie notatek z grzadek oraz porownywanie efektow prac wykonanych w dniach korzenia, liscia, kwiatu i owocu."
    },
    people: [
      {
        name: "Maria Nowak",
        function: "CEO",
        projectRole: "liderka projektu",
        email: "maria.nowak@applc-demo.example.com",
        phone: "+48 501 100 200",
        type: "kontakt glowny",
        representation: "tak"
      },
      {
        name: "Adam Zielinski",
        function: "CFO",
        projectRole: "kontakt finansowy",
        email: "adam.zielinski@applc-demo.example.com",
        phone: "+48 501 200 300",
        type: "kontakt finansowy",
        representation: "nie"
      },
      {
        name: "Olga Kaminska",
        function: "CTO",
        projectRole: "koordynacja techniczna",
        email: "olga.kaminska@applc-demo.example.com",
        phone: "+48 501 300 400",
        type: "kontakt techniczny",
        representation: "nie"
      }
    ],
    correspondence: {
      correspondenceAddress: card.mailingAddress || "ul. Innowacyjna 12, 00-001 Warszawa",
      paperDocumentsAddress: "ul. Innowacyjna 12, pok. 4.2, 00-001 Warszawa",
      formalEmail: "formal@applc-demo.example.com",
      preferredContact: "e-mail, a w sprawach pilnych telefon do kontaktu glownego",
      notes: "Prosba o kierowanie korespondencji formalnej rownolegle do osoby kontaktowej i na adres formalny."
    }
  };
}

function currentStartupProfile() {
  const beneficiary = startupProfileBeneficiary();
  const key = beneficiary?.id || "default";
  const base = startupProfileBase();
  const override = state.startupProfileOverrides[key] || {};
  return {
    ...base,
    ...override,
    summary: { ...base.summary, ...(override.summary || {}) },
    basics: { ...base.basics, ...(override.basics || {}) },
    project: { ...base.project, ...(override.project || {}) },
    description: { ...base.description, ...(override.description || {}) },
    people: override.people || base.people,
    correspondence: { ...base.correspondence, ...(override.correspondence || {}) }
  };
}

function updateStartupProfile(patch) {
  const beneficiary = startupProfileBeneficiary();
  const key = beneficiary?.id || "default";
  const current = state.startupProfileOverrides[key] || {};
  state.startupProfileOverrides[key] = {
    ...current,
    ...patch,
    summary: { ...(current.summary || {}), ...(patch.summary || {}) },
    basics: { ...(current.basics || {}), ...(patch.basics || {}) },
    project: { ...(current.project || {}), ...(patch.project || {}) },
    description: { ...(current.description || {}), ...(patch.description || {}) },
    correspondence: { ...(current.correspondence || {}), ...(patch.correspondence || {}) }
  };
}

function attachmentList(attachments = []) {
  if (!attachments.length) return "";
  return `
    <ul class="attachment-list">
      ${attachments
        .map((file) => {
          const kind = file.kind === "invoice" ? "Faktura/Rachunek" : file.kind === "other" ? "Pozostale" : "Plik";
          const href = file.content || "#";
          const download = file.content ? ` download="${escapeHtml(file.fileName)}"` : ` aria-disabled="true"`;
          return `<li><a href="${escapeHtml(href)}"${download}>${escapeHtml(kind)}: ${escapeHtml(file.fileName)}</a></li>`;
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

function filteredAddressBookContacts() {
  const search = state.contactSearch.trim().toLowerCase();
  return state.addressBookContacts.filter((contact) => {
    const categoryMatches = state.contactCategory === "all" || contact.category === state.contactCategory;
    const text = [contact.name, contact.position, contact.email, contact.organization, contact.phone].join(" ").toLowerCase();
    return categoryMatches && (!search || text.includes(search));
  });
}

function renderContactForm() {
  if (!state.addressBookFormOpen) return "";
  const contact = state.addressBookContacts.find((item) => item.id === state.editingContactId) || {};
  return `
    <form class="contact-form" id="contact-form">
      <input type="hidden" name="id" value="${escapeHtml(contact.id || "")}" />
      <div class="form-grid">
        <div class="field">
          <label for="contact-name">Imie i nazwisko</label>
          <input id="contact-name" name="name" value="${escapeHtml(contact.name || "")}" required />
        </div>
        <div class="field">
          <label for="contact-position">Stanowisko</label>
          <input id="contact-position" name="position" value="${escapeHtml(contact.position || "")}" required />
        </div>
        <div class="field">
          <label for="contact-organization">Organizacja / dzial</label>
          <input id="contact-organization" name="organization" value="${escapeHtml(contact.organization || "")}" required />
        </div>
        <div class="field">
          <label for="contact-email">E-mail</label>
          <input id="contact-email" name="email" type="email" value="${escapeHtml(contact.email || "")}" required />
        </div>
        <div class="field">
          <label for="contact-phone">Telefon</label>
          <input id="contact-phone" name="phone" value="${escapeHtml(contact.phone || "")}" />
        </div>
        <div class="field">
          <label for="contact-category">Kategoria kontaktu</label>
          <select id="contact-category" name="category">
            ${optionList(contactCategories, contact.category || "Program")}
          </select>
        </div>
        <div class="field">
          <label for="contact-photo-url">URL zdjecia</label>
          <input id="contact-photo-url" name="photoUrl" value="${escapeHtml(contact.photoUrl || "")}" placeholder="https://..." />
        </div>
        <div class="field">
          <label for="contact-photo-file">Zdjecie kontaktu</label>
          <input id="contact-photo-file" name="photoFile" type="file" accept="image/*" />
        </div>
        <div class="field is-wide">
          <label for="contact-description">Opis</label>
          <textarea id="contact-description" name="description">${escapeHtml(contact.description || "")}</textarea>
        </div>
      </div>
      <div class="form-actions">
        <button class="button" type="submit" data-submit-contact>${contact.id ? "Zapisz kontakt" : "Dodaj kontakt"}</button>
        <button class="button secondary" type="button" data-contact-form-close>Anuluj</button>
      </div>
    </form>
  `;
}

function renderAddressBookModal() {
  if (!state.addressBookOpen) return "";
  const contacts = filteredAddressBookContacts();
  return `
    <div class="modal-backdrop address-book-backdrop" data-close-address-book>
      <section class="modal address-book-modal" role="dialog" aria-modal="true" aria-label="Ksiazka teleadresowa" data-address-book-panel>
        <div class="section-head compact">
          <div>
            <p class="eyebrow">Kontakty Akces</p>
            <h1>Ksiazka teleadresowa</h1>
            <p>Najwazniejsze kontakty dla Beneficjenta. Lista jest lokalnym mockiem gotowym do podpiecia pod backend.</p>
          </div>
          <button class="button ghost" type="button" data-close-address-book>Zamknij</button>
        </div>
        <div class="address-book-tools">
          <div class="field">
            <label for="contact-search">Szukaj kontaktu</label>
            <input id="contact-search" type="search" value="${escapeHtml(state.contactSearch)}" placeholder="Imie, stanowisko, e-mail" />
          </div>
          <div class="field">
            <label for="contact-category-filter">Kategoria</label>
            <select id="contact-category-filter">
              <option value="all">Wszystkie</option>
              ${optionList(contactCategories, state.contactCategory)}
            </select>
          </div>
          <button class="button" type="button" data-add-contact>Dodaj kontakt</button>
        </div>
        ${renderContactForm()}
        <div class="contact-list">
          ${contacts.map((contact) => `
            <article class="contact-row">
              ${contactAvatar(contact)}
              <div>
                <div class="contact-row-head">
                  <div>
                    <h3>${escapeHtml(contact.name)}</h3>
                    <p>${escapeHtml(contact.position)}</p>
                  </div>
                  ${statusBadge(contact.category)}
                </div>
                <p class="meta">
                  <span>${escapeHtml(contact.organization)}</span>
                  <span>${escapeHtml(contact.email)}</span>
                  <span>${escapeHtml(contact.phone || "-")}</span>
                </p>
                <p class="contact-description">${escapeHtml(contact.description || "Kontakt pomocniczy.")}</p>
                <div class="contact-actions">
                  <button class="button secondary" type="button" data-edit-contact="${escapeHtml(contact.id)}">Edytuj</button>
                  <button class="button danger" type="button" data-delete-contact="${escapeHtml(contact.id)}">Usun</button>
                </div>
              </div>
            </article>
          `).join("") || emptyState("Brak kontaktow", "Zmien filtr lub dodaj nowy kontakt do ksiazki teleadresowej.", `<button class="button" type="button" data-add-contact>Dodaj kontakt</button>`)}
        </div>
      </section>
    </div>
  `;
}

function renderStart() {
  const dashboard = projectDashboardData();
  const advisor = state.addressBookContacts.find((contact) => contact.id === "opiekun-projektu") || state.addressBookContacts[0];
  const documentsAttention = state.documentWorkflowDocs.filter((document) => ["Do poprawy", "Oczekuje na podpis Opiekuna Projektu", "Oczekuje na podpis osoby upowaznionej"].includes(document.status)).length;
  const leadMentor = mentoringMentors("lead")[0];
  const nextCalendarItem = state.data.calendar.slice().sort((a, b) => calendarEventStart(a).localeCompare(calendarEventStart(b)))[0];
  app.innerHTML = `
    <section class="beneficiary-dashboard">
      <div class="dashboard-toolbar">
        <div>
          <p class="eyebrow">${escapeHtml(currentScopeLabel())}</p>
          <h1>Start</h1>
          <p class="context-note">Najwazniejsze zadania, terminy i status programu w jednym miejscu.</p>
        </div>
      </div>

      <section class="summary-strip start-summary">
        <article><span>Priorytety</span><strong>${attentionTasks.length}</strong></article>
        <article><span>Dokumenty wymagajace uwagi</span><strong>${documentsAttention}</strong></article>
        <article><span>Mentor prowadzacy</span><strong>${mentorUsedHours(leadMentor)} / ${leadMentor.limit} h</strong></article>
        <article><span>Deadline</span><strong>${nextCalendarItem ? formatDate(calendarEventStart(nextCalendarItem).slice(0, 10)) : "-"}</strong></article>
      </section>

      <section class="welcome-panel">
        <div>
          <p class="eyebrow">Panel Beneficjenta</p>
          <h2>Witaj, ${escapeHtml(dashboard.companyName)}</h2>
          <p>Projekt: ${escapeHtml(dashboard.projectName)} / ${escapeHtml(dashboard.acronym)}</p>
        </div>
        <dl class="project-facts">
          <div><dt>Program</dt><dd>${escapeHtml(accelerationProject.program)}</dd></div>
          <div><dt>Etap</dt><dd>${escapeHtml(accelerationProject.stage)}</dd></div>
          <div><dt>Okres akceleracji</dt><dd>${escapeHtml(accelerationProject.period)}</dd></div>
          <div><dt>Opiekun projektu</dt><dd>${escapeHtml(dashboard.supervisor)}</dd></div>
        </dl>
        <div class="progress-block" aria-label="Postep akceleracji">
          <div class="progress-copy">
            <strong>Akceleracja: ${accelerationProject.progress}% czasu za nami</strong>
            <span>${escapeHtml(accelerationProject.period)}</span>
          </div>
          <div class="progress-track"><span style="width: ${accelerationProject.progress}%"></span></div>
        </div>
      </section>

      <div class="dashboard-grid">
        <section class="attention-panel">
          <div class="section-head compact">
            <div>
              <p class="eyebrow">Priorytety</p>
              <h1>Co wymaga Twojej uwagi</h1>
            </div>
          </div>
          <div class="task-list">
            ${attentionTasks.map((task) => `
              <article class="task-card">
                <div>
                  ${statusBadge(task.status)}
                  <h3>${escapeHtml(task.title)}</h3>
                  <p>${escapeHtml(task.description)}</p>
                  ${task.due ? `<span class="task-due">Termin: ${escapeHtml(task.due)}</span>` : ""}
                </div>
                <button class="icon-button task-icon-button" type="button" data-go="${escapeHtml(task.view)}" aria-label="${escapeHtml(task.action)}">
                  <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>
                </button>
              </article>
            `).join("")}
          </div>
        </section>

        <aside class="supervisor-card">
          ${contactAvatar(advisor, "large")}
          <div class="supervisor-main">
            <h2>${escapeHtml(advisor.name)}</h2>
            <p>${escapeHtml(advisor.position)}</p>
          </div>
          <dl>
            <div><dt>E-mail</dt><dd><a href="mailto:${escapeHtml(advisor.email)}">${escapeHtml(advisor.email)}</a></dd></div>
            <div><dt>Telefon</dt><dd><a href="tel:${escapeHtml(advisor.phone)}">${escapeHtml(advisor.phone)}</a></dd></div>
          </dl>
          <div class="supervisor-actions">
            <a class="button" href="mailto:${escapeHtml(advisor.email)}">Napisz wiadomosc</a>
            <button class="button secondary" type="button" data-open-address-book>Kontakty</button>
          </div>
        </aside>
      </div>
    </section>
    ${renderAddressBookModal()}
  `;
}

function infoGrid(items) {
  return `
    <div class="profile-info-grid">
      ${items.map(([label, value]) => `
        <article>
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value || "-")}</strong>
        </article>
      `).join("")}
    </div>
  `;
}

function profileEditField(name, label, value, wide = false, multiline = false) {
  return `
    <div class="field ${wide ? "is-wide" : ""}">
      <label for="profile-${name}">${escapeHtml(label)}</label>
      ${multiline
        ? `<textarea id="profile-${name}" name="${name}">${escapeHtml(value || "")}</textarea>`
        : `<input id="profile-${name}" name="${name}" value="${escapeHtml(value || "")}" />`}
    </div>
  `;
}

function renderStartupProfileContent(profile) {
  const editing = state.startupProfileEditing;
  if (state.startupProfileTab === "basics") {
    const fields = [
      ["companyName", "Nazwa spolki"],
      ["acronym", "Akronim / nazwa skrocona"],
      ["legalForm", "Forma prawna"],
      ["nip", "NIP"],
      ["krs", "KRS"],
      ["regon", "REGON"],
      ["registeredAddress", "Adres siedziby"],
      ["website", "Strona internetowa"],
      ["social", "LinkedIn / social media"],
      ["industry", "Branza / obszar dzialalnosci"],
      ["companyStatus", "Status firmy w programie"]
    ];
    return editing
      ? `<div class="form-grid">${fields.map(([name, label]) => profileEditField(name, label, profile.basics[name], ["registeredAddress", "social", "industry"].includes(name))).join("")}</div>`
      : infoGrid(fields.map(([name, label]) => [label, profile.basics[name]]));
  }

  if (state.startupProfileTab === "project") {
    const fields = [
      ["projectName", "Pelna nazwa projektu"],
      ["projectAcronym", "Akronim projektu"],
      ["program", "Program"],
      ["contractNumber", "Numer umowy akceleracyjnej"],
      ["agreementDate", "Data podpisania umowy"],
      ["accelerationPeriod", "Okres akceleracji"],
      ["programStage", "Etap udzialu w programie"],
      ["thematicArea", "Obszar tematyczny projektu"],
      ["developmentStage", "Etap rozwoju rozwiazania"],
      ["projectScope", "Zakres projektu w programie"]
    ];
    return editing
      ? `<div class="form-grid">${fields.map(([name, label]) => profileEditField(name, label, profile.project[name], ["projectName", "thematicArea", "projectScope"].includes(name), name === "projectScope")).join("")}</div>`
      : infoGrid(fields.map(([name, label]) => [label, profile.project[name]]));
  }

  if (state.startupProfileTab === "description") {
    const cards = [
      ["shortDescription", "Krotki opis startupu"],
      ["problem", "Problem"],
      ["solution", "Rozwiazanie"],
      ["targetGroup", "Grupa docelowa"],
      ["advantage", "Przewaga konkurencyjna"],
      ["useCases", "Potencjalne zastosowania"]
    ];
    return editing
      ? `<div class="form-grid">${cards.map(([name, label]) => profileEditField(name, label, profile.description[name], true, true)).join("")}</div>`
      : `<div class="description-card-grid">${cards.map(([name, label]) => `
          <article class="description-card">
            <h3>${escapeHtml(label)}</h3>
            <p>${escapeHtml(profile.description[name])}</p>
          </article>
        `).join("")}</div>`;
  }

  if (state.startupProfileTab === "people") {
    if (editing) {
      return `
        <div class="contact-person-edit-list">
          ${profile.people.map((person, index) => `
            <article class="contact-person-edit" data-profile-person="${index}">
              ${profileEditField("name", "Imie i nazwisko", person.name)}
              ${profileEditField("function", "Funkcja w spolce", person.function)}
              ${profileEditField("projectRole", "Rola w projekcie", person.projectRole)}
              ${profileEditField("email", "E-mail", person.email)}
              ${profileEditField("phone", "Telefon", person.phone)}
              ${profileEditField("type", "Typ kontaktu", person.type)}
              ${profileEditField("representation", "Uprawniona do reprezentacji / podpisu", person.representation, true)}
            </article>
          `).join("")}
        </div>
        <button class="button secondary" type="button" data-add-profile-person>Dodaj osobe kontaktowa</button>
      `;
    }
    return `
      <div class="contact-person-grid">
        ${profile.people.map((person) => `
          <article class="contact-person-card">
            <div class="contact-avatar" aria-hidden="true">${escapeHtml(initials(person.name))}</div>
            <div>
              ${statusBadge(person.type)}
              <h3>${escapeHtml(person.name)}</h3>
              <p>${escapeHtml(person.function)} / ${escapeHtml(person.projectRole)}</p>
              <dl>
                <div><dt>E-mail</dt><dd><a href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a></dd></div>
                <div><dt>Telefon</dt><dd><a href="tel:${escapeHtml(person.phone)}">${escapeHtml(person.phone)}</a></dd></div>
                <div><dt>Reprezentacja</dt><dd>${escapeHtml(person.representation)}</dd></div>
              </dl>
            </div>
          </article>
        `).join("")}
      </div>
      <button class="button secondary" type="button" data-edit-startup-profile>${isAdmin() ? "Dodaj osobe kontaktowa" : "Zglos zmiane danych kontaktowych"}</button>
    `;
  }

  const fields = [
    ["correspondenceAddress", "Adres do korespondencji"],
    ["paperDocumentsAddress", "Adres do wysylki dokumentow papierowych"],
    ["formalEmail", "E-mail do komunikacji formalnej"],
    ["preferredContact", "Preferowany sposob kontaktu"],
    ["notes", "Dodatkowe uwagi do korespondencji"]
  ];
  return editing
    ? `<div class="form-grid">${fields.map(([name, label]) => profileEditField(name, label, profile.correspondence[name], true, ["preferredContact", "notes"].includes(name))).join("")}</div>`
    : infoGrid(fields.map(([name, label]) => [label, profile.correspondence[name]]));
}

function renderStartupCard() {
  const profile = currentStartupProfile();
  const activeTab = startupProfileTabs.find((tab) => tab.id === state.startupProfileTab) || startupProfileTabs[0];
  app.innerHTML = `
    <section class="startup-profile">
      <div class="section-head">
        <div>
          <p class="eyebrow">Profil startupu</p>
          <h1>Karta startupu</h1>
          <p>Najwazniejsze informacje o firmie, projekcie, osobach kontaktowych i danych korespondencyjnych.</p>
        </div>
        <button class="button ${state.startupProfileEditing ? "secondary" : ""}" type="button" data-edit-startup-profile>
          ${state.startupProfileEditing ? "Zakoncz edycje" : "Edytuj dane"}
        </button>
      </div>

      <section class="startup-summary-card">
        <div>
          <p class="eyebrow">Metryczka startupu</p>
          <h2>${escapeHtml(profile.summary.companyName)}</h2>
          <p>Projekt: ${escapeHtml(profile.summary.projectName)}</p>
        </div>
        <div class="summary-facts">
          <article><span>Akronim</span><strong>${escapeHtml(profile.summary.acronym)}</strong></article>
          <article><span>Status</span><strong>${statusBadge(profile.summary.programStatus)}</strong></article>
          <article><span>Program</span><strong>${escapeHtml(profile.summary.program)}</strong></article>
          <article><span>Opiekun projektu</span><strong>${escapeHtml(profile.summary.supervisor)}</strong></article>
        </div>
      </section>

      <div class="profile-tabs" role="tablist" aria-label="Sekcje profilu startupu">
        ${startupProfileTabs.map((tab) => `
          <button class="${tab.id === state.startupProfileTab ? "is-active" : ""}" type="button" role="tab" data-startup-profile-tab="${tab.id}">
            ${escapeHtml(tab.label)}
          </button>
        `).join("")}
      </div>

      <form class="startup-profile-panel" id="startup-profile-form">
        <div class="profile-panel-head">
          <div>
            <p class="eyebrow">${escapeHtml(activeTab.label)}</p>
            <h2>${escapeHtml(activeTab.label)}</h2>
          </div>
          ${state.startupProfileEditing ? `<button class="button" type="submit">Zapisz zmiany</button>` : ""}
        </div>
        ${renderStartupProfileContent(profile)}
      </form>
    </section>
  `;
}

function renderExpenses() {
  const totalNet = state.data.expenses.reduce((sum, expense) => sum + Number(expense.netAmount || 0), 0);
  const totalGross = state.data.expenses.reduce((sum, expense) => sum + Number(expense.grossAmount || 0), 0);
  const pending = state.data.expenses.filter((expense) => ["przekazany-do-weryfikacji", "przekazany-do-ksiegowosci"].includes(expense.status)).length;
  const approvedCount = state.data.expenses.filter((expense) => ["zatwierdzony", "wyplacony"].includes(expense.status)).length;
  const rejectedCount = state.data.expenses.filter((expense) => expense.status === "odrzucony").length;
  const rows = state.data.expenses.map((expense) => {
    const beneficiary = getBeneficiary(expense.beneficiaryId);
    const statusControl = isAdmin()
      ? `<select data-status-expense="${expense.id}">${expenseStatusOptions.map((status) => `<option value="${status}" ${status === expense.status ? "selected" : ""}>${statusLabels[status]}</option>`).join("")}</select>`
      : statusBadge(statusLabels[expense.status] || expense.status);
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
      "Grant i wydatki",
      isAdmin()
        ? "ADMIN moze dodawac wydatki w imieniu beneficjenta i zmieniac statusy. Modul bedzie rozwijany o rozliczanie grantu i Harmonogram Grantu."
        : "Beneficjent widzi i dodaje tylko swoje wydatki. Modul bedzie rozwijany o rozliczanie grantu i Harmonogram Grantu.",
      `<button class="button" data-go="add-expense">Dodaj wydatek</button>`
    )}
    <section class="summary-strip">
      <article><span>Liczba wydatkow</span><strong>${state.data.expenses.length}</strong></article>
      <article><span>Razem netto</span><strong>${money(totalNet)}</strong></article>
      <article><span>Razem brutto</span><strong>${money(totalGross)}</strong></article>
      <article><span>Do weryfikacji</span><strong>${pending}</strong></article>
      <article><span>Zaakceptowane</span><strong>${approvedCount}</strong></article>
      <article><span>Odrzucone</span><strong>${rejectedCount}</strong></article>
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
          <tbody id="expenses-body">${rows.join("") || `<tr><td colspan="13">${emptyState("Brak wydatkow", "Dodaj pierwszy wydatek albo zmien filtry listy.", `<button class="button" type="button" data-go="add-expense">Dodaj wydatek</button>`)}</td></tr>`}</tbody>
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
    ${pageHead("Dodaj wydatek", "Dodaj dane faktury w module Grant i wydatki, wybierz VAT i dolacz przynajmniej jeden plik.")}
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

function workflowDocumentsForTab() {
  if (state.documentsTab === "archive") {
    return state.documentWorkflowDocs.filter((document) => document.status === "Archiwalny" || document.documentType === "archive");
  }
  return state.documentWorkflowDocs.filter((document) => document.documentType === state.documentsTab && document.status !== "Archiwalny");
}

function renderSignaturePath(document) {
  return `
    <div class="signature-path">
      ${document.signaturePath.map((step) => `
        <div>
          <span>${escapeHtml(step.role)}</span>
          <strong>${escapeHtml(step.state)}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderCurrentFile(document) {
  const file = document.currentFile;
  if (!file) {
    return `
      <div class="current-file empty">
        <strong>Brak aktualnego pliku PDF</strong>
        <span>Dodaj zalacznik PDF, aby uruchomic kolejny krok obiegu.</span>
      </div>
    `;
  }
  return `
    <div class="current-file">
      <div>
        <strong>${escapeHtml(file.name)}</strong>
        <span>Dodal: ${escapeHtml(file.addedBy)} (${escapeHtml(file.addedByRole)})</span>
        <span>${formatDateTime(file.addedAt)}</span>
      </div>
      <a class="button ghost" href="${file.content || "#"}" ${file.content ? `download="${escapeHtml(file.name)}"` : ""}>Pobierz aktualny plik</a>
    </div>
  `;
}

function renderFileVersions(document) {
  if (!document.fileVersions.length) return `<p class="muted-copy">Brak poprzednich wersji pliku.</p>`;
  return `
    <div class="file-version-list">
      ${document.fileVersions.map((file) => `
        <article>
          <strong>${escapeHtml(file.name)}</strong>
          <span>${escapeHtml(file.addedBy)} (${escapeHtml(file.addedByRole)})</span>
          <span>${formatDateTime(file.addedAt)}</span>
        </article>
      `).join("")}
    </div>
  `;
}

function renderDocumentUpload(document) {
  if (document.status === "Archiwalny") {
    return `<p class="muted-copy">Dokument archiwalny jest tylko do podgladu i pobrania.</p>`;
  }
  return `
    <form class="document-upload-box" data-document-upload-form>
      <input type="hidden" name="documentId" value="${escapeHtml(document.id)}" />
      <label for="upload-${escapeHtml(document.id)}">Dodaj zalacznik PDF</label>
      <p>Przeciagnij plik tutaj albo wybierz go z dysku. Akceptowany jest tylko PDF.</p>
      <input id="upload-${escapeHtml(document.id)}" name="pdfFile" type="file" accept="application/pdf,.pdf" required />
      <div class="contact-actions">
        <button class="button secondary" type="submit">${document.currentFile ? "Podmien plik PDF" : "Dodaj plik PDF"}</button>
        ${document.currentFile ? `<button class="button danger" type="button" data-remove-document-file="${escapeHtml(document.id)}">Usun aktualny plik</button>` : ""}
      </div>
    </form>
  `;
}

function renderDocumentActions(document) {
  if (document.status === "Archiwalny") return "";
  const adminActions = isAdmin() ? `
    <button class="button secondary" type="button" data-document-action="verify" data-document-id="${escapeHtml(document.id)}">Zweryfikuj dokument</button>
    <button class="button danger" type="button" data-document-action="return" data-document-id="${escapeHtml(document.id)}">Zwroc do poprawy</button>
    <button class="button secondary" type="button" data-document-action="project-sign" data-document-id="${escapeHtml(document.id)}">Podpisano jako Opiekun Projektu</button>
    <button class="button secondary" type="button" data-document-action="authorized-sign" data-document-id="${escapeHtml(document.id)}">Dodaj podpis osoby upowaznionej</button>
    <button class="button ghost" type="button" data-document-action="complete" data-document-id="${escapeHtml(document.id)}">Oznacz jako podpisany przez wszystkie osoby</button>
    <button class="button danger" type="button" data-document-action="archive" data-document-id="${escapeHtml(document.id)}">Przenies do archiwum</button>
    <div class="field emergency-status">
      <label>Awaryjna zmiana statusu Admina</label>
      <select data-document-emergency-status="${escapeHtml(document.id)}">
        ${documentWorkflowStatuses.map((status) => `<option value="${status}" ${document.status === status ? "selected" : ""}>${status}</option>`).join("")}
      </select>
    </div>
  ` : "";
  return `<div class="document-actions">${adminActions}</div>`;
}

function renderDocumentComments(document) {
  return `
    <div class="document-comments">
      <div class="comment-list">
        ${document.comments.map((comment) => `
          <article>
            <strong>${escapeHtml(comment.author)} <span>${escapeHtml(comment.role)}</span></strong>
            <time>${formatDateTime(comment.timestamp)}</time>
            <p>${escapeHtml(comment.text)}</p>
          </article>
        `).join("") || `<p class="muted-copy">Brak komentarzy.</p>`}
      </div>
      ${document.status === "Archiwalny" ? "" : `
        <form class="comment-form" data-document-comment-form>
          <input type="hidden" name="documentId" value="${escapeHtml(document.id)}" />
          <div class="field">
            <label>Dodaj komentarz / uwage</label>
            <textarea name="comment" class="short-textarea" placeholder="np. Brakuje podpisu osoby uprawnionej do reprezentacji." required></textarea>
          </div>
          <button class="button secondary" type="submit">Dodaj komentarz</button>
        </form>
      `}
    </div>
  `;
}

function renderDocumentHistory(document) {
  return `
    <ol class="document-timeline">
      ${document.history.slice().reverse().map((entry) => `
        <li>
          <div>
            <strong>${escapeHtml(entry.actionType)}</strong>
            <time>${formatDateTime(entry.timestamp)} - ${escapeHtml(entry.actorName)} (${escapeHtml(entry.actorRole)})</time>
          </div>
          <p>${escapeHtml(entry.comment || "")}</p>
          <dl>
            <div><dt>Poprzedni status</dt><dd>${escapeHtml(entry.previousStatus || "-")}</dd></div>
            <div><dt>Nowy status</dt><dd>${escapeHtml(entry.newStatus || "-")}</dd></div>
            <div><dt>Plik</dt><dd>${escapeHtml(entry.fileName || "-")}</dd></div>
            <div><dt>Poprzedni plik</dt><dd>${escapeHtml(entry.previousFileName || "-")}</dd></div>
            <div><dt>Nowy plik</dt><dd>${escapeHtml(entry.newFileName || "-")}</dd></div>
          </dl>
        </li>
      `).join("") || `<li><p>Brak historii dokumentu.</p></li>`}
    </ol>
  `;
}

function renderDocumentCard(document) {
  return `
    <article class="workflow-doc-card">
      <div class="workflow-doc-head">
        <div>
          <p class="eyebrow">${escapeHtml(document.typeLabel)}${document.month ? ` / ${escapeHtml(document.month)}` : ""}</p>
          <h2>${escapeHtml(document.title)}</h2>
          ${document.description ? `<p>${escapeHtml(document.description)}</p>` : ""}
        </div>
        ${statusBadge(document.status, "document-status")}
      </div>
      <div class="current-step">
        <span>Aktualny krok procesu</span>
        <strong>${escapeHtml(document.currentStep)}</strong>
      </div>
      <details open>
        <summary>Aktualny plik i zalacznik PDF</summary>
        ${renderCurrentFile(document)}
        ${renderDocumentUpload(document)}
      </details>
      <details open>
        <summary>Sciezka podpisu</summary>
        ${renderSignaturePath(document)}
      </details>
      <details>
        <summary>Poprzednie wersje pliku</summary>
        ${renderFileVersions(document)}
      </details>
      ${renderDocumentActions(document)}
      <details open>
        <summary>Komentarze / uwagi</summary>
        ${renderDocumentComments(document)}
      </details>
      <details>
        <summary>Historia dokumentu</summary>
        ${renderDocumentHistory(document)}
      </details>
    </article>
  `;
}

function renderDocuments() {
  const documents = workflowDocumentsForTab();
  const currentTab = documentWorkflowTabs.find((tab) => tab.id === state.documentsTab);
  const awaiting = state.documentWorkflowDocs.filter((document) => document.status.startsWith("Oczekuje")).length;
  const correction = state.documentWorkflowDocs.filter((document) => document.status === "Do poprawy").length;
  const complete = state.documentWorkflowDocs.filter((document) => ["Podpisany przez wszystkie wymagane osoby", "Zaakceptowany"].includes(document.status)).length;
  const archived = state.documentWorkflowDocs.filter((document) => document.status === "Archiwalny").length;
  app.innerHTML = `
    <section class="documents-workflow-page">
      <div class="section-head">
        <div>
          <p class="eyebrow">${escapeHtml(currentScopeLabel())}</p>
          <h1>Dokumenty</h1>
          <p>Centrum obiegu dokumentow, podpisow, zalacznikow PDF, komentarzy i historii zmian. Status zmienia sie po wykonaniu akcji, a nie przez zwykly wybor z listy.</p>
        </div>
      </div>
      <section class="document-summary-strip">
        <article><span>Oczekuja na krok</span><strong>${awaiting}</strong></article>
        <article><span>Do poprawy</span><strong>${correction}</strong></article>
        <article><span>Zakonczone</span><strong>${complete}</strong></article>
        <article><span>Archiwum</span><strong>${archived}</strong></article>
      </section>
      <div class="profile-tabs document-tabs" role="tablist" aria-label="Typy dokumentow">
        ${documentWorkflowTabs.map((tab) => `
          <button class="${state.documentsTab === tab.id ? "is-active" : ""}" type="button" data-documents-tab="${tab.id}">${tab.label}</button>
        `).join("")}
      </div>
      <section class="document-tab-intro">
        <p class="eyebrow">${escapeHtml(currentTab?.label || "Dokumenty")}</p>
        <h2>${escapeHtml(currentTab?.label || "Dokumenty")}</h2>
        <p>Dokumenty sa pogrupowane po typie. Status, aktualny krok i osoba odpowiedzialna za kolejny ruch sa widoczne na karcie dokumentu.</p>
      </section>
      <section class="workflow-doc-list">
        ${documents.map(renderDocumentCard).join("") || emptyState("Brak dokumentow w tej sekcji", "Dodaj pierwszy plik PDF, aby rozpoczac obieg dokumentu.", `<button class="button" type="button" data-documents-tab="contract">Przejdz do umow</button>`)}
      </section>
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
            ${event ? `<button class="button danger" type="button" data-delete-calendar-event="${event.id}">Usun</button>` : ""}
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
    element.innerHTML = emptyState("Nie udalo sie zaladowac kalendarza", "Odswiez aplikacje lub sprawdz dostepnosc biblioteki kalendarza.");
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
            <option value="xls">Excel (.xls)</option>
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

function renderPlaceholderModule(title, description) {
  app.innerHTML = `
    ${pageHead(title, description)}
    <section class="placeholder-module">
      <div>
        <p class="eyebrow">Modul</p>
        <h2>${escapeHtml(title)}</h2>
        <p>Ten obszar jest przygotowany w nawigacji i czeka na docelowe widoki oraz logike.</p>
      </div>
    </section>
  `;
}

function mentoringMentors(type = "") {
  return state.mentoringMentors.filter((mentor) => !type || mentor.type === type);
}

function mentoringMentor(id = state.mentoringActiveMentorId) {
  return state.mentoringMentors.find((mentor) => mentor.id === id) || mentoringMentors("lead")[0];
}

function mentoringEntryCounts(entry) {
  return entry.status === "zrealizowane" && Number(entry.hours || 0) > 0;
}

function mentorUsedHours(mentor) {
  return mentor.entries.filter(mentoringEntryCounts).reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
}

function mentorPlannedHours(mentor) {
  return mentor.goals.reduce((sum, goal) => sum + Number(goal.plannedHours || 0), 0);
}

function goalUsedHours(mentor, goalId) {
  return mentor.entries
    .filter((entry) => entry.goalId === goalId && mentoringEntryCounts(entry))
    .reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
}

function subjectUsedHours() {
  return mentoringMentors("subject").reduce((sum, mentor) => sum + mentorUsedHours(mentor), 0);
}

function subjectPlannedHours() {
  return mentoringMentors("subject").reduce((sum, mentor) => sum + mentorPlannedHours(mentor), 0);
}

function mentoringMonthLabel(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  const month = new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(date);
  return month.charAt(0).toUpperCase() + month.slice(1);
}

function progressBar(used, limit) {
  const percent = Math.min(100, Math.round((Number(used || 0) / Number(limit || 1)) * 100));
  return `<div class="hours-progress" aria-label="Wykorzystanie godzin"><span style="width: ${percent}%"></span></div>`;
}

function renderMentorCard(mentor, compact = false) {
  const used = mentorUsedHours(mentor);
  const remaining = Math.max(0, mentor.limit - used);
  return `
    <article class="mentor-card">
      <div class="mentor-card-head">
        <div class="contact-avatar" aria-hidden="true">${escapeHtml(initials(mentor.name))}</div>
        <div>
          <p class="eyebrow">${escapeHtml(mentor.role)}</p>
          <h3>${escapeHtml(mentor.name)}</h3>
          <p>${escapeHtml(mentor.specialization)}</p>
        </div>
      </div>
      <dl class="mentor-facts">
        <div><dt>E-mail</dt><dd><a href="mailto:${escapeHtml(mentor.email)}">${escapeHtml(mentor.email)}</a></dd></div>
        <div><dt>Telefon</dt><dd><a href="tel:${escapeHtml(mentor.phone)}">${escapeHtml(mentor.phone)}</a></dd></div>
        <div><dt>Limit godzin</dt><dd>${mentor.limit} h${mentor.type === "subject" ? " / max na mentora" : ""}</dd></div>
        <div><dt>Wykorzystano</dt><dd>${used} h</dd></div>
        <div><dt>Pozostalo</dt><dd>${remaining} h</dd></div>
      </dl>
      ${progressBar(used, mentor.limit)}
      ${compact ? `<button class="button secondary" type="button" data-open-mentor="${escapeHtml(mentor.id)}">Otworz szczegoly mentora</button>` : ""}
    </article>
  `;
}

function renderMentorSections(mentor) {
  return `
    <div class="mentor-section-tabs">
      ${mentorSections.map((section) => `
        <button class="${state.mentoringSection === section.id ? "is-active" : ""}" type="button" data-mentor-section="${section.id}">
          ${escapeHtml(section.label)}
        </button>
      `).join("")}
    </div>
    <section class="mentor-section-panel">
      ${renderMentorSectionContent(mentor)}
    </section>
  `;
}

function renderGoalForm(mentor) {
  if (!state.mentoringGoalFormOpen) return "";
  const editingGoal = mentor.goals.find((goal) => goal.id === state.mentoringEditingGoalId) || {};
  return `
    <form class="mentoring-inline-form" id="mentoring-goal-form">
      <input type="hidden" name="mentorId" value="${escapeHtml(mentor.id)}" />
      <input type="hidden" name="id" value="${escapeHtml(editingGoal.id || "")}" />
      <div class="form-grid">
        ${profileEditField("name", "Nazwa celu", editingGoal.name || "")}
        ${profileEditField("plannedHours", "Planowana liczba godzin", editingGoal.plannedHours || "")}
        ${profileEditField("dueDate", "Termin realizacji", editingGoal.dueDate || "")}
        <div class="field">
          <label for="profile-status">Status celu</label>
          <select id="profile-status" name="status">${optionList(mentoringGoalStatuses, editingGoal.status || "planowany")}</select>
        </div>
        ${profileEditField("description", "Opis celu", editingGoal.description || "", true, true)}
        ${profileEditField("result", "Oczekiwany rezultat / produkt", editingGoal.result || "", true)}
      </div>
      <div class="form-actions">
        <button class="button" type="submit">${editingGoal.id ? "Zapisz cel" : "Dodaj cel"}</button>
        <button class="button secondary" type="button" data-close-goal-form>Anuluj</button>
      </div>
    </form>
  `;
}

function renderMentorSchedule(mentor) {
  return `
    <div class="mentor-panel-head">
      <div>
        <p class="eyebrow">Harmonogram Mentoringu</p>
        <h2>Cele mentora</h2>
        <p>Zaplanowano ${mentorPlannedHours(mentor)} / ${mentor.limit} h.</p>
      </div>
      <button class="button" type="button" data-open-goal-form>Dodaj cel</button>
    </div>
    ${renderGoalForm(mentor)}
    <div class="mentoring-goal-list">
      ${mentor.goals.map((goal) => {
        const used = goalUsedHours(mentor, goal.id);
        const remaining = Math.max(0, Number(goal.plannedHours || 0) - used);
        return `
          <article class="mentoring-goal-card">
            <div>
              ${statusBadge(goal.status)}
              <h3>${escapeHtml(goal.name)}</h3>
              <p>${escapeHtml(goal.description)}</p>
              <dl class="mentor-facts compact">
                <div><dt>Plan</dt><dd>${goal.plannedHours} h</dd></div>
                <div><dt>Zrealizowano</dt><dd>${used} h</dd></div>
                <div><dt>Pozostalo</dt><dd>${remaining} h</dd></div>
                <div><dt>Termin</dt><dd>${escapeHtml(goal.dueDate)}</dd></div>
                <div><dt>Rezultat</dt><dd>${escapeHtml(goal.result)}</dd></div>
              </dl>
            </div>
            <div class="contact-actions">
              <button class="button secondary" type="button" data-edit-goal="${escapeHtml(goal.id)}">Edytuj</button>
              <button class="button danger" type="button" data-delete-goal="${escapeHtml(goal.id)}">Usun</button>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderEntryForm(mentor) {
  if (!state.mentoringEntryFormOpen) return "";
  const used = mentorUsedHours(mentor);
  const subjectUsed = subjectUsedHours();
  return `
    <form class="mentoring-inline-form" id="mentoring-entry-form">
      <input type="hidden" name="mentorId" value="${escapeHtml(mentor.id)}" />
      <div class="validation-hint">
        ${mentor.type === "lead"
          ? `Mentor prowadzacy: wykorzystano ${used} / 65 h. Pozostalo ${Math.max(0, 65 - used)} h.`
          : `Ten mentor: ${used} / 10 h. Mentorzy merytoryczni lacznie: ${subjectUsed} / 60 h.`}
      </div>
      <div class="form-grid">
        ${profileEditField("date", "Data", dateKey(new Date()))}
        ${profileEditField("startTime", "Godzina rozpoczecia", "10:00")}
        ${profileEditField("endTime", "Godzina zakonczenia", "12:00")}
        <div class="field">
          <label for="profile-goalId">Powiazany cel</label>
          <select id="profile-goalId" name="goalId">${mentor.goals.map((goal) => `<option value="${goal.id}">${escapeHtml(goal.name)}</option>`).join("")}</select>
        </div>
        ${profileEditField("hours", "Liczba zrealizowanych godzin", "2")}
        <div class="field">
          <label for="profile-form">Forma realizacji</label>
          <select id="profile-form" name="form">${optionList(mentoringForms, "spotkanie online")}</select>
        </div>
        <div class="field">
          <label for="profile-status">Status</label>
          <select id="profile-status" name="status">${optionList(mentoringEntryStatuses, "zrealizowane")}</select>
        </div>
        ${profileEditField("meetingLink", "Link do spotkania / materialow", "")}
        ${profileEditField("supervisorLink", "Link dla opiekuna projektu", "")}
        ${profileEditField("place", "Miejsce, jesli stacjonarne", "")}
        ${profileEditField("description", "Agenda / opis realizacji", "", true, true)}
        ${profileEditField("notes", "Uwagi", "", true)}
        <label class="check-row">
          <input type="checkbox" name="includeInReport" value="true" checked />
          <span>Uwzglednij w sprawozdaniu miesiecznym</span>
        </label>
      </div>
      <div class="form-actions">
        <button class="button" type="submit">Zapisz realizacje</button>
        <button class="button secondary" type="button" data-close-entry-form>Anuluj</button>
      </div>
    </form>
  `;
}

function renderMentorHours(mentor) {
  const reportMonths = ["all", ...mentoringMonths.map((month) => month.toLowerCase())];
  return `
    <div class="mentor-panel-head">
      <div>
        <p class="eyebrow">Realizacja godzin</p>
        <h2>Spotkania i wpisy godzinowe</h2>
        <p>Wpisy zrealizowane aktualizuja cele, wykorzystanie mentora i limity.</p>
      </div>
      <div class="form-actions no-margin">
        <button class="button" type="button" data-open-entry-form>Dodaj spotkanie / realizacje</button>
        <button class="button secondary" type="button" data-export-mentoring-report="${escapeHtml(mentor.id)}">Eksportuj raport godzin do Excela</button>
      </div>
    </div>
    <div class="mentoring-export-tools">
      <div class="field">
        <label for="mentoring-export-month">Okres raportu</label>
        <select id="mentoring-export-month" data-mentoring-export-month>
          ${reportMonths.map((month) => `<option value="${month}" ${state.mentoringExportMonth === month ? "selected" : ""}>${month === "all" ? "Caly okres akceleracji" : escapeHtml(month)}</option>`).join("")}
        </select>
      </div>
      <p class="context-note">Raport mozna eksportowac dla biezacego mentora, konkretnego mentora albo calej grupy przez przyciski w odpowiednich widokach.</p>
    </div>
    ${renderEntryForm(mentor)}
    <div class="mentoring-entry-list">
      ${mentor.entries.map((entry) => {
        const goal = mentor.goals.find((item) => item.id === entry.goalId);
        return `
          <article class="mentoring-entry-card">
            <div>
              ${statusBadge(entry.status)}
              <h3>${formatDate(entry.date)} ${escapeHtml(entry.startTime || "")}-${escapeHtml(entry.endTime || "")}</h3>
              <p>${escapeHtml(entry.description || "Brak opisu.")}</p>
              <dl class="mentor-facts compact">
                <div><dt>Cel</dt><dd>${escapeHtml(goal?.name || "-")}</dd></div>
                <div><dt>Godziny</dt><dd>${entry.hours} h</dd></div>
                <div><dt>Forma</dt><dd>${escapeHtml(entry.form)}</dd></div>
                <div><dt>Sprawozdanie</dt><dd>${entry.includeInReport ? "tak" : "nie"}</dd></div>
              </dl>
            </div>
          </article>
        `;
      }).join("") || emptyState("Brak wpisow realizacji godzin", "Dodaj spotkanie lub realizacje, aby aktualizowac wykorzystanie godzin mentora.", `<button class="button" type="button" data-open-entry-form>Dodaj realizacje</button>`)}
    </div>
  `;
}

function monthHours(mentor, month) {
  return mentor.entries
    .filter((entry) => mentoringEntryCounts(entry) && mentoringMonthLabel(entry.date).toLowerCase() === month.toLowerCase())
    .reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
}

function renderMentorDocuments(mentor) {
  return `
    <div class="mentor-panel-head">
      <div>
        <p class="eyebrow">Dokumenty mentora</p>
        <h2>Harmonogram i sprawozdania</h2>
        <p>Dokumenty sa przypisane do tego konkretnego mentora.</p>
      </div>
    </div>
    <section class="document-strip">
      <article>
        <h3>Harmonogram Mentoringu</h3>
        <p>Status: <strong>${escapeHtml(mentor.documents.schedule.status)}</strong></p>
        <p>Wersja: ${escapeHtml(mentor.documents.schedule.version)} / data dodania: ${escapeHtml(mentor.documents.schedule.addedAt)}</p>
        <div class="contact-actions">
          <button class="button secondary" type="button">Dodaj plik</button>
          <button class="button secondary" type="button">Wygeneruj z danych aplikacji</button>
          <button class="button ghost" type="button">Pobierz</button>
        </div>
      </article>
    </section>
    <div class="monthly-report-list">
      ${mentor.documents.reports.map((report) => `
        <article class="monthly-report-card">
          <div>
            ${statusBadge(report.status)}
            <h3>${escapeHtml(report.month)}</h3>
            <p>Liczba godzin w miesiacu: <strong>${monthHours(mentor, report.month)} h</strong></p>
          </div>
          <div class="contact-actions">
            <button class="button secondary" type="button">Uzupelnij</button>
            <button class="button secondary" type="button">Wygeneruj sprawozdanie</button>
            <button class="button ghost" type="button">Dodaj podpisany plik</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderMentorSectionContent(mentor) {
  if (state.mentoringSection === "schedule") return renderMentorSchedule(mentor);
  if (state.mentoringSection === "hours") return renderMentorHours(mentor);
  if (state.mentoringSection === "documents") return renderMentorDocuments(mentor);
  return `
    <div class="mentor-detail-grid">
      ${renderMentorCard(mentor)}
      <section class="card">
        <h3>Jak pracowac z mentorem</h3>
        <p>Harmonogram, realizacja godzin i dokumenty sa dostepne w sekcjach tego mentora. Na glownej karcie widzisz tylko najwazniejsze dane i wykorzystanie limitu.</p>
      </section>
    </div>
  `;
}

function renderMentoringSummary() {
  const lead = mentoringMentors("lead")[0];
  const leadUsed = mentorUsedHours(lead);
  const subjectUsed = subjectUsedHours();
  const nextEntry = state.mentoringMentors.flatMap((mentor) => mentor.entries.map((entry) => ({ ...entry, mentor }))).sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))[0];
  return `
    <section class="mentoring-summary">
      <article><span>Mentor prowadzacy</span><strong>${leadUsed} / 65 h</strong></article>
      <article><span>Mentorzy merytoryczni</span><strong>${subjectUsed} / 60 h</strong></article>
      <article><span>Najblizsze spotkanie</span><strong>${nextEntry ? `${formatDate(nextEntry.date)}, godz. ${nextEntry.startTime}` : "-"}</strong></article>
      <article><span>Status HM</span><strong>${escapeHtml(lead.documents.schedule.status)}</strong></article>
      <article><span>Sprawozdanie za maj 2026</span><strong>do uzupelnienia</strong></article>
    </section>
  `;
}

function renderLeadMentorTab() {
  const mentor = mentoringMentors("lead")[0];
  state.mentoringActiveMentorId = mentor.id;
  return `
    <section class="mentor-workspace">
      ${renderMentorCard(mentor)}
      ${renderMentorSections(mentor)}
    </section>
  `;
}

function renderSubjectMentorsTab() {
  const mentors = mentoringMentors("subject");
  const active = mentoringMentor();
  const totalUsed = subjectUsedHours();
  const totalPlanned = subjectPlannedHours();
  const showDetail = active?.type === "subject";
  return `
    <section class="subject-summary">
      <article><span>Laczny limit</span><strong>60 h</strong></article>
      <article><span>Wykorzystano</span><strong>${totalUsed} h</strong></article>
      <article><span>Pozostalo</span><strong>${Math.max(0, 60 - totalUsed)} h</strong></article>
      <article><span>Liczba mentorow</span><strong>${mentors.length}</strong></article>
      <article><span>Zaplanowano</span><strong>${totalPlanned} / 60 h</strong></article>
    </section>
    ${showDetail ? `
      <button class="button ghost" type="button" data-close-mentor-detail>Wroc do listy mentorow</button>
      <section class="mentor-workspace">
        ${renderMentorCard(active)}
        ${renderMentorSections(active)}
      </section>
    ` : `
      <div class="mentor-card-grid">
        ${mentors.map((mentor) => renderMentorCard(mentor, true)).join("")}
      </div>
      <button class="button secondary" type="button" data-export-mentoring-report="all-subject">Eksportuj raport wszystkich mentorow merytorycznych</button>
    `}
  `;
}

function renderMentoring() {
  app.innerHTML = `
    <section class="mentoring-page">
      <div class="section-head">
        <div>
          <p class="eyebrow">Mentoring</p>
          <h1>Mentoring</h1>
          <p>Zarzadzaj mentorami, harmonogramami, realizacja godzin, spotkaniami i dokumentami przypisanymi do konkretnych mentorow.</p>
        </div>
      </div>
      ${renderMentoringSummary()}
      <div class="profile-tabs mentoring-main-tabs" role="tablist" aria-label="Mentoring">
        <button class="${state.mentoringMainTab === "lead" ? "is-active" : ""}" type="button" data-mentoring-main-tab="lead">Mentor prowadzacy</button>
        <button class="${state.mentoringMainTab === "subject" ? "is-active" : ""}" type="button" data-mentoring-main-tab="subject">Mentorzy merytoryczni</button>
      </div>
      ${state.mentoringMainTab === "lead" ? renderLeadMentorTab() : renderSubjectMentorsTab()}
    </section>
  `;
}

function marketingPackageStats() {
  const added = state.marketingPackageItems.filter((item) => item.status !== "brak").length;
  const accepted = state.marketingPackageItems.filter((item) => item.status === "zaakceptowano").length;
  const total = state.marketingPackageItems.length;
  const status = accepted === total
    ? "zaakceptowana"
    : added === total
      ? "w weryfikacji"
      : "do uzupelnienia";
  return { added, accepted, total, status };
}

function renderMarketingSummary() {
  const packageStats = marketingPackageStats();
  const activeContests = state.marketingContests.filter((contest) => contest.status !== "archiwalny").length;
  return `
    <section class="marketing-hero">
      <div>
        <p class="eyebrow">Marketing</p>
        <h1>Marketing startupu w programie</h1>
        <p>W tym miejscu znajdziesz materialy potrzebne do komunikacji i promocji startupu w ramach programu Akces NCBR.</p>
      </div>
      <div class="marketing-status-card">
        ${statusBadge(packageStats.status)}
        <strong>Paczka marketingowa: ${packageStats.added}/${packageStats.total} materialow dodanych</strong>
        ${progressBar(packageStats.added, packageStats.total)}
      </div>
    </section>
    <section class="marketing-summary">
      <article><span>Status paczki</span><strong>${packageStats.status}</strong></article>
      <article><span>Ostatnia aktualizacja</span><strong>26.05.2026</strong></article>
      <article><span>Materialy od Akces</span><strong>${defaultAkcesMarketingMaterials.length}</strong></article>
      <article><span>Publikacje</span><strong>${defaultMarketingPublications.length}</strong></article>
      <article><span>Aktywne konkursy</span><strong>${activeContests}</strong></article>
    </section>
  `;
}

function renderMarketingPackage() {
  const stats = marketingPackageStats();
  return `
    <section class="marketing-panel">
      <div class="mentor-panel-head">
        <div>
          <p class="eyebrow">Paczka marketingowa</p>
          <h2>${stats.added}/${stats.total} materialow dodanych</h2>
          <p>Uzupelnij pliki, linki i opisy, ktore Akces NCBR moze wykorzystac do promocji startupu.</p>
        </div>
        <div class="marketing-progress-box">
          ${progressBar(stats.added, stats.total)}
          <span>${Math.round((stats.added / stats.total) * 100)}% kompletnosci</span>
        </div>
      </div>
      <div class="marketing-package-grid">
        ${state.marketingPackageItems.map((item) => `
          <form class="marketing-package-card" data-marketing-package-form>
            <input type="hidden" name="id" value="${escapeHtml(item.id)}" />
            <div class="marketing-card-head">
              <div>
                ${statusBadge(item.status)}
                <h3>${escapeHtml(item.title)}</h3>
              </div>
              <button class="button danger" type="button" data-remove-marketing-package="${escapeHtml(item.id)}">Usun</button>
            </div>
            <div class="field">
              <label>Status</label>
              <select name="status">
                ${marketingPackageStatuses.map((status) => `<option value="${status}" ${item.status === status ? "selected" : ""}>${status}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label>Plik</label>
              <input type="file" name="file" />
            </div>
            <div class="field">
              <label>Link</label>
              <input name="link" value="${escapeHtml(item.link)}" placeholder="https://" />
            </div>
            <div class="field">
              <label>Opis / tresc</label>
              <textarea name="text" class="short-textarea">${escapeHtml(item.text)}</textarea>
            </div>
            <div class="marketing-preview">
              <strong>Podglad materialu</strong>
              ${item.fileData ? `<a href="${escapeHtml(item.fileData)}" download="${escapeHtml(item.fileName || item.title)}">Pobierz dodany plik: ${escapeHtml(item.fileName)}</a>` : item.fileName ? `<span>Plik: ${escapeHtml(item.fileName)}</span>` : "<span>Brak pliku</span>"}
              ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener">Otworz link</a>` : ""}
              ${item.text ? `<p>${escapeHtml(item.text)}</p>` : ""}
            </div>
            <button class="button secondary" type="submit">Zapisz material</button>
          </form>
        `).join("")}
      </div>
    </section>
  `;
}

function marketingProfileFields() {
  return [
    ["activity", "Czym zajmuje sie startup"],
    ["problem", "Jaki problem rozwiazuje"],
    ["solution", "Jakie rozwiazanie rozwija"],
    ["audience", "Dla kogo jest produkt/usluga"],
    ["distinction", "Co wyroznia startup"],
    ["achievements", "Najwazniejsze osiagniecia"],
    ["tags", "Branza / tagi"],
    ["impact", "Obszar wplywu spolecznego lub srodowiskowego"],
    ["shortPublication", "Krotki opis do publikacji"],
    ["longPublication", "Dluzszy opis do publikacji"],
    ["founderQuote", "Cytat foundera lub reprezentanta"],
    ["presentationPreference", "Preferowany sposob przedstawiania startupu"]
  ];
}

function renderMarketingProfile() {
  const fields = marketingProfileFields();
  if (state.marketingProfileEditing) {
    return `
      <form class="marketing-panel" id="marketing-profile-form">
        <div class="mentor-panel-head">
          <div>
            <p class="eyebrow">Profil promocyjny</p>
            <h2>Edycja tresci promocyjnych</h2>
          </div>
          <button class="button ghost" type="button" data-cancel-marketing-profile>Przerwij edycje</button>
        </div>
        <div class="marketing-profile-grid">
          ${fields.map(([key, label]) => `
            <div class="field ${["longPublication", "presentationPreference"].includes(key) ? "is-wide" : ""}">
              <label>${label}</label>
              <textarea name="${key}">${escapeHtml(state.marketingProfile[key])}</textarea>
            </div>
          `).join("")}
        </div>
        <div class="form-actions">
          <button class="button" type="submit">Zapisz profil promocyjny</button>
        </div>
      </form>
    `;
  }
  return `
    <section class="marketing-panel">
      <div class="mentor-panel-head">
        <div>
          <p class="eyebrow">Profil promocyjny</p>
          <h2>Tresci do komunikacji zewnetrznej</h2>
          <p>Profil jest podzielony na krotkie karty, zeby latwo wykorzystac go w publikacjach i materialach Akces.</p>
        </div>
        <button class="button secondary" type="button" data-edit-marketing-profile>Edytuj profil promocyjny</button>
      </div>
      <div class="marketing-profile-grid">
        ${fields.map(([key, label]) => `
          <article class="marketing-info-card ${["longPublication", "presentationPreference"].includes(key) ? "is-wide" : ""}">
            <h3>${label}</h3>
            <p>${escapeHtml(state.marketingProfile[key])}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAkcesMaterials() {
  const filtered = defaultAkcesMarketingMaterials.filter((material) => state.marketingMaterialFilter === "all" || material.type === state.marketingMaterialFilter);
  return `
    <section class="marketing-panel">
      <div class="mentor-panel-head">
        <div>
          <p class="eyebrow">Materialy od Akces</p>
          <h2>Webinary, prezentacje i instrukcje</h2>
          <p>Materialy przygotowane przez Akces do wykorzystania przez Beneficjenta.</p>
        </div>
        <div class="field compact-field">
          <label>Typ materialu</label>
          <select data-marketing-material-filter>
            <option value="all">Wszystkie</option>
            ${marketingMaterialTypes.map((type) => `<option value="${type}" ${state.marketingMaterialFilter === type ? "selected" : ""}>${type}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="marketing-card-grid">
        ${filtered.map((material) => `
          <article class="marketing-info-card">
            ${statusBadge(material.type)}
            <h3>${escapeHtml(material.title)}</h3>
            <p>${escapeHtml(material.description)}</p>
            <p>Dodano: ${formatDate(material.addedAt)}</p>
            <div class="contact-actions">
              <a class="button secondary" href="${escapeHtml(material.url)}" target="_blank" rel="noopener">${material.type === "Grafiki" ? "Pobierz" : "Otworz"}</a>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMarketingPublications() {
  return `
    <section class="marketing-panel">
      <div class="mentor-panel-head">
        <div>
          <p class="eyebrow">Publikacje</p>
          <h2>Materialy promocyjne startupu</h2>
          <p>Lista publikacji i planowanych materialow, bez rozbudowanego kalendarza marketingowego.</p>
        </div>
      </div>
      <div class="marketing-card-grid">
        ${defaultMarketingPublications.map((publication) => `
          <article class="marketing-info-card">
            ${statusBadge(publication.status)}
            <h3>${escapeHtml(publication.title)}</h3>
            <p>${escapeHtml(publication.description)}</p>
            <dl class="marketing-dl">
              <div><dt>Typ</dt><dd>${escapeHtml(publication.type)}</dd></div>
              <div><dt>Planowana data</dt><dd>${formatDate(publication.plannedAt)}</dd></div>
              <div><dt>Material</dt><dd>${escapeHtml(publication.fileName || "brak pliku do akceptacji")}</dd></div>
            </dl>
            <div class="contact-actions">
              <button class="button secondary" type="button">Zobacz szczegoly</button>
              ${publication.url ? `<a class="button ghost" href="${escapeHtml(publication.url)}" target="_blank" rel="noopener">Otworz publikacje</a>` : ""}
              ${publication.fileName ? `<button class="button ghost" type="button">Pobierz material</button>` : ""}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function filteredMarketingContests() {
  return state.marketingContests
    .filter((contest) => state.marketingContestStatusFilter === "all" || contest.status === state.marketingContestStatusFilter)
    .filter((contest) => state.marketingContestTypeFilter === "all" || contest.type === state.marketingContestTypeFilter)
    .sort((a, b) => (a.deadline || "9999-12-31").localeCompare(b.deadline || "9999-12-31"));
}

function renderMarketingContestForm() {
  if (!state.marketingContestFormOpen) return "";
  const contest = state.marketingContests.find((item) => item.id === state.marketingEditingContestId) || {
    id: "",
    name: "",
    organizer: "",
    type: "konkurs",
    description: "",
    audience: "",
    deadline: "",
    status: "nowy",
    url: "",
    requiredMaterials: "",
    owner: "",
    notes: "",
    fileName: "",
    fileData: ""
  };
  return `
    <form class="marketing-contest-form" id="marketing-contest-form">
      <input type="hidden" name="id" value="${escapeHtml(contest.id)}" />
      <div class="mentor-panel-head">
        <div>
          <p class="eyebrow">Konkurs</p>
          <h2>${contest.id ? "Edycja konkursu" : "Dodaj konkurs"}</h2>
        </div>
        <button class="button ghost" type="button" data-close-marketing-contest-form>Przerwij</button>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Nazwa konkursu</label>
          <input name="name" value="${escapeHtml(contest.name)}" required />
        </div>
        <div class="field">
          <label>Organizator</label>
          <input name="organizer" value="${escapeHtml(contest.organizer)}" required />
        </div>
        <div class="field">
          <label>Typ</label>
          <select name="type">${marketingContestTypes.map((type) => `<option value="${type}" ${contest.type === type ? "selected" : ""}>${type}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label>Status</label>
          <select name="status">${marketingContestStatuses.map((status) => `<option value="${status}" ${contest.status === status ? "selected" : ""}>${status}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label>Termin zgloszen</label>
          <input type="date" name="deadline" value="${escapeHtml(contest.deadline)}" />
        </div>
        <div class="field">
          <label>Link do strony konkursu</label>
          <input name="url" value="${escapeHtml(contest.url)}" placeholder="https://" />
        </div>
        <div class="field">
          <label>Dla kogo jest konkurs</label>
          <input name="audience" value="${escapeHtml(contest.audience)}" />
        </div>
        <div class="field">
          <label>Osoba odpowiedzialna</label>
          <input name="owner" value="${escapeHtml(contest.owner)}" />
        </div>
        <div class="field">
          <label>Materialy zgloszeniowe</label>
          <input type="file" name="file" />
        </div>
        <div class="field is-wide">
          <label>Krotki opis</label>
          <textarea name="description">${escapeHtml(contest.description)}</textarea>
        </div>
        <div class="field is-wide">
          <label>Wymagane materialy</label>
          <textarea name="requiredMaterials">${escapeHtml(contest.requiredMaterials)}</textarea>
        </div>
        <div class="field is-wide">
          <label>Notatki</label>
          <textarea name="notes">${escapeHtml(contest.notes)}</textarea>
        </div>
      </div>
      <div class="form-actions">
        <button class="button" type="submit">${contest.id ? "Zapisz konkurs" : "Dodaj konkurs"}</button>
      </div>
    </form>
  `;
}

function renderMarketingContests() {
  const active = state.marketingContests.filter((contest) => contest.status !== "archiwalny").length;
  const submitted = state.marketingContests.filter((contest) => contest.status === "zgloszony").length;
  const archived = state.marketingContests.filter((contest) => contest.status === "archiwalny").length;
  const nearest = state.marketingContests
    .filter((contest) => contest.status !== "archiwalny" && contest.deadline)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))[0];
  const contests = filteredMarketingContests();
  return `
    <section class="marketing-panel">
      <div class="mentor-panel-head">
        <div>
          <p class="eyebrow">Konkursy</p>
          <h2>Konkursy, nabory i okazje promocyjne</h2>
          <p>Konkursy sa tylko podzakladka Marketingu, bez osobnej pozycji w glownym menu.</p>
        </div>
        <button class="button" type="button" data-open-marketing-contest-form>Dodaj konkurs</button>
      </div>
      <section class="marketing-summary compact-summary">
        <article><span>Aktywne konkursy</span><strong>${active}</strong></article>
        <article><span>Najblizszy termin</span><strong>${nearest ? formatDate(nearest.deadline) : "-"}</strong></article>
        <article><span>Zgloszone</span><strong>${submitted}</strong></article>
        <article><span>Archiwalne</span><strong>${archived}</strong></article>
      </section>
      <div class="marketing-filters">
        <div class="field">
          <label>Status</label>
          <select data-marketing-contest-status-filter>
            <option value="all">Wszystkie</option>
            ${marketingContestStatuses.map((status) => `<option value="${status}" ${state.marketingContestStatusFilter === status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label>Typ</label>
          <select data-marketing-contest-type-filter>
            <option value="all">Wszystkie</option>
            ${marketingContestTypes.map((type) => `<option value="${type}" ${state.marketingContestTypeFilter === type ? "selected" : ""}>${type}</option>`).join("")}
          </select>
        </div>
      </div>
      ${renderMarketingContestForm()}
      <div class="marketing-card-grid">
        ${contests.map((contest) => `
          <article class="marketing-info-card">
            <div class="marketing-card-head">
              <div>
                ${statusBadge(contest.status)}
                <h3>${escapeHtml(contest.name)}</h3>
              </div>
              <button class="button ghost" type="button" data-edit-marketing-contest="${escapeHtml(contest.id)}">Edytuj</button>
            </div>
            <p>${escapeHtml(contest.description)}</p>
            <dl class="marketing-dl">
              <div><dt>Organizator</dt><dd>${escapeHtml(contest.organizer)}</dd></div>
              <div><dt>Typ</dt><dd>${escapeHtml(contest.type)}</dd></div>
              <div><dt>Dla kogo</dt><dd>${escapeHtml(contest.audience)}</dd></div>
              <div><dt>Termin</dt><dd>${formatDate(contest.deadline)}</dd></div>
              <div><dt>Materialy</dt><dd>${escapeHtml(contest.requiredMaterials)}</dd></div>
              <div><dt>Odpowiedzialny</dt><dd>${escapeHtml(contest.owner)}</dd></div>
              <div><dt>Plik</dt><dd>${escapeHtml(contest.fileName || "brak")}</dd></div>
            </dl>
            <p>${escapeHtml(contest.notes)}</p>
            <div class="contact-actions">
              ${contest.url ? `<a class="button secondary" href="${escapeHtml(contest.url)}" target="_blank" rel="noopener">Otworz konkurs</a>` : ""}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMarketing() {
  const views = {
    package: renderMarketingPackage,
    profile: renderMarketingProfile,
    materials: renderAkcesMaterials,
    publications: renderMarketingPublications,
    contests: renderMarketingContests
  };
  app.innerHTML = `
    <section class="marketing-page">
      ${renderMarketingSummary()}
      <div class="profile-tabs marketing-tabs" role="tablist" aria-label="Marketing">
        ${marketingTabs.map((tab) => `
          <button class="${state.marketingTab === tab.id ? "is-active" : ""}" type="button" data-marketing-tab="${tab.id}">${tab.label}</button>
        `).join("")}
      </div>
      ${views[state.marketingTab]()}
    </section>
  `;
}

function renderSettings() {
  const isAdminActive = isAdmin();
  app.innerHTML = `
    ${pageHead("Ustawienia", "Administrator dodaje beneficjentow do danych demo. Zmiany sa zapisywane w tej przegladarce.")}
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
          ${isAdminActive ? "Nowy beneficjent pojawi sie w wyborze zakresu danych pod logo AKCES." : "Dodawanie beneficjentow jest dostepne po przelaczeniu pola Dzialam jako na ADMIN w menu pod logo AKCES."}
        </p>
      </form>
      <div class="beneficiary-list">
        ${state.data.beneficiaries.map((beneficiary) => `
          <article class="beneficiary-row">
            <div>
              <h3>${escapeHtml(beneficiary.name)}</h3>
              <p class="meta">
                <span>${beneficiary.role === "admin" ? "administrator" : "beneficjent"}</span>
                <span>dane demo w przegladarce</span>
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
    mentoring: renderMentoring,
    reports: renderReports,
    marketing: renderMarketing,
    tutorial: renderTutorial,
    settings: renderSettings
  };
  views[state.activeView]?.();
}

function formDataToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function clearFieldError(field) {
  const container = field?.closest(".field, .document-upload-box, .marketing-package-card, .check-row");
  if (!container) return;
  container.classList.remove("has-error");
  container.querySelector(".field-error")?.remove();
}

function setFieldError(form, nameOrField, message) {
  const field = typeof nameOrField === "string" ? form.querySelector(`[name="${nameOrField}"], #${nameOrField}`) : nameOrField;
  if (!field) return;
  const container = field.closest(".field, .document-upload-box, .marketing-package-card, .check-row") || field.parentElement;
  if (!container) return;
  container.classList.add("has-error");
  container.querySelector(".field-error")?.remove();
  const error = document.createElement("p");
  error.className = "field-error";
  error.textContent = message;
  container.append(error);
}

function clearFormErrors(form) {
  form.querySelectorAll(".has-error").forEach((item) => item.classList.remove("has-error"));
  form.querySelectorAll(".field-error, .form-error").forEach((item) => item.remove());
}

function addFormError(form, message = "Nie mozna zapisac formularza. Popraw oznaczone pola.") {
  form.querySelector(".form-error")?.remove();
  const error = document.createElement("div");
  error.className = "form-error";
  error.textContent = message;
  form.prepend(error);
}

function addValidationError(errors, field, message) {
  errors.push({ field, message });
}

function showValidationErrors(form, errors) {
  clearFormErrors(form);
  if (!errors.length) return true;
  addFormError(form);
  errors.forEach((error) => setFieldError(form, error.field, error.message));
  showToast("Nie mozna zapisac formularza. Popraw oznaczone pola.");
  return false;
}

function digitsOnly(value = "") {
  return String(value).replace(/\D/g, "");
}

function validateRequired(value) {
  return String(value ?? "").trim().length > 0;
}

function validateNip(value) {
  return digitsOnly(value).length === 10;
}

function validateRegon(value) {
  return [9, 14].includes(digitsOnly(value).length);
}

function validateKrs(value) {
  return digitsOnly(value).length === 10;
}

function validateEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function validatePhone(value) {
  if (!value) return true;
  return /^\+?[\d\s-]{7,18}$/.test(String(value).trim());
}

function validateUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(String(value).trim());
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function validateHoursValue(value) {
  return /^\d+(\.\d{1,2})?$/.test(String(value)) && Number(value) > 0;
}

function validateDateRange(start, end) {
  if (!start || !end) return true;
  return new Date(end) >= new Date(start);
}

function parseDatePl(value = "") {
  const [day, month, year] = String(value).split(".");
  if (!day || !month || !year) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function accelerationDateRange() {
  const [start, end] = accelerationProject.period.split("-");
  return { start: parseDatePl(start), end: parseDatePl(end) };
}

function validatePdfFile(file) {
  if (!file) return "To pole jest wymagane.";
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "Ten dokument musi byc dodany w formacie PDF.";
  if (file.size > 10 * 1024 * 1024) return "Pojedynczy plik przekracza limit 10 MB.";
  return "";
}

function validateFiles(files, { pdfOnly = false, required = false } = {}) {
  const selected = Array.from(files || []);
  if (required && !selected.length) return "To pole jest wymagane.";
  for (const file of selected) {
    if (file.size > 10 * 1024 * 1024) return "Pojedynczy plik przekracza limit 10 MB.";
    if (pdfOnly && validatePdfFile(file)) return "Ten dokument musi byc dodany w formacie PDF.";
  }
  return "";
}

function filesToPayload(files, options = {}) {
  const fileError = validateFiles(files, options);
  if (fileError) return Promise.reject(new Error(fileError));
  return Promise.all(
    Array.from(files || []).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, content: reader.result });
        reader.onerror = () => reject(new Error("Nie udalo sie odczytac pliku."));
        reader.readAsDataURL(file);
      });
    })
  );
}

async function saveContactFromForm(form) {
  const payload = formDataToObject(form);
  const errors = [];
  ["name", "position", "organization", "email"].forEach((field) => {
    if (!validateRequired(payload[field])) addValidationError(errors, field, "To pole jest wymagane.");
  });
  if (!validateEmail(payload.email)) addValidationError(errors, "email", "Podaj poprawny adres e-mail.");
  if (!validatePhone(payload.phone)) addValidationError(errors, "phone", "Podaj poprawny numer telefonu.");
  if (!validateUrl(payload.photoUrl)) addValidationError(errors, "photoUrl", "Podaj poprawny link.");
  if (!showValidationErrors(form, errors)) return;
  const uploadedPhoto = await filesToPayload(form.querySelector("#contact-photo-file")?.files);
  if (uploadedPhoto.length) payload.photoUrl = uploadedPhoto[0].content;
  const id = payload.id || `kontakt-${Date.now()}`;
  const contact = {
    id,
    name: payload.name,
    position: payload.position,
    organization: payload.organization,
    email: payload.email,
    phone: payload.phone,
    category: payload.category,
    description: payload.description,
    photoUrl: payload.photoUrl || ""
  };
  const existingIndex = state.addressBookContacts.findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    state.addressBookContacts[existingIndex] = contact;
    showToast("Zapisano kontakt w lokalnej ksiazce teleadresowej.");
  } else {
    state.addressBookContacts.push(contact);
    showToast("Dodano kontakt do lokalnej ksiazki teleadresowej.");
  }
  state.addressBookFormOpen = false;
  state.editingContactId = "";
  renderStart();
}

function saveStartupProfileFromForm(form) {
  const payload = formDataToObject(form);
  const errors = [];
  if (state.startupProfileTab === "basics") {
    if (!validateRequired(payload.companyName)) addValidationError(errors, "companyName", "To pole jest wymagane.");
    if (!validateNip(payload.nip)) addValidationError(errors, "nip", "NIP powinien skladac sie z 10 cyfr.");
    if (!validateKrs(payload.krs)) addValidationError(errors, "krs", "KRS powinien skladac sie z 10 cyfr.");
    if (!validateRegon(payload.regon)) addValidationError(errors, "regon", "REGON powinien miec 9 albo 14 cyfr.");
    if (!validateUrl(payload.website)) addValidationError(errors, "website", "Podaj poprawny link.");
    if (!validateUrl(payload.social)) addValidationError(errors, "social", "Podaj poprawny link.");
  }
  if (state.startupProfileTab === "people") {
    const people = Array.from(form.querySelectorAll("[data-profile-person]")).map((row) => ({
      name: row.querySelector('[name="name"]')?.value || "",
      function: row.querySelector('[name="function"]')?.value || "",
      projectRole: row.querySelector('[name="projectRole"]')?.value || "",
      email: row.querySelector('[name="email"]')?.value || "",
      phone: row.querySelector('[name="phone"]')?.value || "",
      type: row.querySelector('[name="type"]')?.value || "",
      representation: row.querySelector('[name="representation"]')?.value || ""
    }));
    people.forEach((person, index) => {
      const row = form.querySelectorAll("[data-profile-person]")[index];
      if (!validateRequired(person.name)) {
        const field = row?.querySelector('[name="name"]');
        addValidationError(errors, field, "To pole jest wymagane.");
      }
      if (!validateEmail(person.email)) {
        const field = row?.querySelector('[name="email"]');
        addValidationError(errors, field, "Podaj poprawny adres e-mail.");
      }
      if (!validatePhone(person.phone)) {
        const field = row?.querySelector('[name="phone"]');
        addValidationError(errors, field, "Podaj poprawny numer telefonu.");
      }
    });
    if (!showValidationErrors(form, errors)) return;
    updateStartupProfile({ people });
  } else {
    if (!showValidationErrors(form, errors)) return;
    updateStartupProfile({ [state.startupProfileTab]: payload });
  }
  state.startupProfileEditing = false;
  renderStartupCard();
  showToast("Zapisano zmiany w lokalnym profilu startupu.");
}

function validateMentoringPlannedHours(mentor, nextGoals) {
  const planned = nextGoals.reduce((sum, goal) => sum + Number(goal.plannedHours || 0), 0);
  if (planned > mentor.limit) {
    throw new Error(`Suma godzin w harmonogramie mentora nie moze przekroczyc ${mentor.limit} h.`);
  }
  if (mentor.type === "subject") {
    const otherPlanned = mentoringMentors("subject")
      .filter((item) => item.id !== mentor.id)
      .reduce((sum, item) => sum + mentorPlannedHours(item), 0);
    if (otherPlanned + planned > 60) {
      throw new Error("Suma zaplanowanych godzin mentorow merytorycznych nie moze przekroczyc 60 h.");
    }
  }
}

function saveMentoringGoal(form) {
  const payload = formDataToObject(form);
  const mentor = mentoringMentor(payload.mentorId);
  const errors = [];
  if (!validateRequired(payload.name)) addValidationError(errors, "name", "To pole jest wymagane.");
  if (!validateHoursValue(payload.plannedHours)) addValidationError(errors, "plannedHours", "Liczba godzin musi byc wieksza niz 0 i miec maksymalnie 2 miejsca po przecinku.");
  if (!validateRequired(payload.dueDate)) addValidationError(errors, "dueDate", "To pole jest wymagane.");
  const goal = {
    id: payload.id || `goal-${Date.now()}`,
    name: payload.name,
    description: payload.description,
    plannedHours: Number(payload.plannedHours || 0),
    result: payload.result,
    dueDate: payload.dueDate,
    status: payload.status
  };
  const existingIndex = mentor.goals.findIndex((item) => item.id === goal.id);
  const nextGoals = existingIndex >= 0 ? mentor.goals.map((item) => item.id === goal.id ? goal : item) : [...mentor.goals, goal];
  const planned = nextGoals.reduce((sum, item) => sum + Number(item.plannedHours || 0), 0);
  if (mentor.type === "lead" && planned > 65) addValidationError(errors, "plannedHours", "Mentor prowadzacy nie moze przekroczyc limitu 65 godzin.");
  if (mentor.type === "subject" && planned > 10) addValidationError(errors, "plannedHours", "Jeden mentor merytoryczny nie moze przekroczyc limitu 10 godzin.");
  if (mentor.type === "subject") {
    const otherPlanned = mentoringMentors("subject")
      .filter((item) => item.id !== mentor.id)
      .reduce((sum, item) => sum + mentorPlannedHours(item), 0);
    if (otherPlanned + planned > 60) addValidationError(errors, "plannedHours", "Laczny limit godzin mentorow merytorycznych wynosi 60 godzin.");
  }
  if (!showValidationErrors(form, errors)) return;
  validateMentoringPlannedHours(mentor, nextGoals);
  mentor.goals = nextGoals;
  state.mentoringGoalFormOpen = false;
  state.mentoringEditingGoalId = "";
  renderMentoring();
  showToast(existingIndex >= 0 ? "Zapisano cel mentoringowy." : "Dodano cel mentoringowy.");
}

function validateMentoringEntry(mentor, entry) {
  if (entry.status !== "zrealizowane") return;
  const currentUsed = mentorUsedHours(mentor);
  const nextUsed = currentUsed + Number(entry.hours || 0);
  if (nextUsed > mentor.limit) {
    throw new Error(`Ten wpis przekroczylby limit mentora: ${mentor.limit} h.`);
  }
  if (mentor.type === "subject") {
    const otherUsed = mentoringMentors("subject")
      .filter((item) => item.id !== mentor.id)
      .reduce((sum, item) => sum + mentorUsedHours(item), 0);
    if (otherUsed + nextUsed > 60) {
      throw new Error("Ten wpis przekroczylby laczny limit 60 h dla mentorow merytorycznych.");
    }
  }
}

function saveMentoringEntry(form) {
  const payload = formDataToObject(form);
  const mentor = mentoringMentor(payload.mentorId);
  const errors = [];
  if (!mentor) addValidationError(errors, "mentorId", "Realizacja musi byc przypisana do konkretnego mentora.");
  if (!validateRequired(payload.goalId)) addValidationError(errors, "goalId", "Realizacja musi byc przypisana do celu z Harmonogramu Mentoringu.");
  if (!validateRequired(payload.date)) addValidationError(errors, "date", "To pole jest wymagane.");
  if (!validateRequired(payload.startTime)) addValidationError(errors, "startTime", "To pole jest wymagane.");
  if (!validateRequired(payload.endTime)) addValidationError(errors, "endTime", "To pole jest wymagane.");
  if (!validateHoursValue(payload.hours)) addValidationError(errors, "hours", "Liczba godzin musi byc wieksza niz 0 i miec maksymalnie 2 miejsca po przecinku.");
  if (payload.startTime && payload.endTime && payload.endTime < payload.startTime) {
    addValidationError(errors, "endTime", "Data zakonczenia nie moze byc wczesniejsza niz data rozpoczecia.");
  }
  const range = accelerationDateRange();
  if (payload.date && range.start && range.end && (payload.date < range.start || payload.date > range.end)) {
    addValidationError(errors, "date", "Data realizacji musi miescic sie w okresie akceleracji.");
  }
  const entry = {
    id: `entry-${Date.now()}`,
    date: payload.date,
    startTime: payload.startTime,
    endTime: payload.endTime,
    goalId: payload.goalId,
    hours: Number(payload.hours || 0),
    form: payload.form,
    meetingLink: payload.meetingLink,
    supervisorLink: payload.supervisorLink,
    place: payload.place,
    description: payload.description,
    status: payload.status,
    includeInReport: payload.includeInReport === "true",
    notes: payload.notes
  };
  const currentUsed = mentorUsedHours(mentor);
  const nextUsed = currentUsed + Number(entry.hours || 0);
  if (entry.status === "zrealizowane") {
    if (mentor.type === "lead" && nextUsed > 65) addValidationError(errors, "hours", "Mentor prowadzacy nie moze przekroczyc limitu 65 godzin.");
    if (mentor.type === "subject" && nextUsed > 10) addValidationError(errors, "hours", "Jeden mentor merytoryczny nie moze przekroczyc limitu 10 godzin.");
    if (mentor.type === "subject") {
      const otherUsed = mentoringMentors("subject")
        .filter((item) => item.id !== mentor.id)
        .reduce((sum, item) => sum + mentorUsedHours(item), 0);
      if (otherUsed + nextUsed > 60) addValidationError(errors, "hours", "Laczny limit godzin mentorow merytorycznych wynosi 60 godzin.");
    }
  }
  if (!showValidationErrors(form, errors)) return;
  validateMentoringEntry(mentor, entry);
  mentor.entries.push(entry);
  state.mentoringEntryFormOpen = false;
  renderMentoring();
  showToast("Dodano realizacje godzin i zaktualizowano limity mentoringu.");
}

function mentoringReportRows(scopeId) {
  const mentors = scopeId === "all-subject"
    ? mentoringMentors("subject")
    : scopeId === "all"
      ? state.mentoringMentors
      : [mentoringMentor(scopeId)];
  return mentors.flatMap((mentor) => {
    let cumulative = 0;
    return mentor.entries
      .filter((entry) => {
        const monthOk = state.mentoringExportMonth === "all" || mentoringMonthLabel(entry.date).toLowerCase() === state.mentoringExportMonth;
        return monthOk;
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((entry) => {
        const goal = mentor.goals.find((item) => item.id === entry.goalId) || {};
        if (mentoringEntryCounts(entry)) cumulative += Number(entry.hours || 0);
        const goalUsed = goal.id ? goalUsedHours(mentor, goal.id) : 0;
        return {
          "Data": entry.date,
          "Miesiac": mentoringMonthLabel(entry.date),
          "Typ mentora": mentor.role,
          "Imie i nazwisko mentora": mentor.name,
          "Cel z Harmonogramu Mentoringu": goal.name || "",
          "Opis celu": goal.description || "",
          "Planowana liczba godzin dla celu": goal.plannedHours || "",
          "Zrealizowane godziny w danym wpisie": entry.hours,
          "Zrealizowane godziny narastajaco": cumulative,
          "Pozostale godziny": Math.max(0, Number(goal.plannedHours || 0) - goalUsed),
          "Forma realizacji": entry.form,
          "Link do spotkania / materialow": entry.meetingLink,
          "Link dla opiekuna projektu": entry.supervisorLink,
          "Opis realizacji": entry.description,
          "Status spotkania": entry.status,
          "Czy uwzglednic w sprawozdaniu miesiecznym": entry.includeInReport ? "tak" : "nie",
          "Uwagi": entry.notes
        };
      });
  });
}

function downloadExcelTable({ filename, columns, rows }) {
  const html = `
    <html><head><meta charset="UTF-8" /></head><body>
      <table>
        <thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${columns.map((column) => `<td>${escapeHtml(row[column] ?? "")}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </body></html>
  `;
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function exportOperationalReport(type, scopeBeneficiaryId) {
  const data = selectedMockData(readMockData(), state.actorId, scopeBeneficiaryId || state.scopeBeneficiaryId);
  const beneficiaryName = (id) => data.beneficiaries.find((beneficiary) => beneficiary.id === id)?.name || id || "-";
  const reportConfig = {
    expenses: {
      filename: "raport-grant-i-wydatki.xls",
      columns: ["Beneficjent", "Numer dokumentu", "Kontrahent", "Data faktury", "Kwota brutto", "Status", "Opis"],
      rows: data.expenses.map((expense) => ({
        "Beneficjent": beneficiaryName(expense.beneficiaryId),
        "Numer dokumentu": expense.invoiceNumber,
        "Kontrahent": expense.contractor,
        "Data faktury": formatDate(expense.invoiceDate),
        "Kwota brutto": money(expense.grossAmount),
        "Status": expense.status,
        "Opis": expense.description
      }))
    },
    documents: {
      filename: "raport-dokumenty.xls",
      columns: ["Beneficjent", "Tytul", "Kategoria", "Status", "Notatka"],
      rows: data.documents.map((document) => ({
        "Beneficjent": beneficiaryName(document.beneficiaryId),
        "Tytul": document.title,
        "Kategoria": document.category,
        "Status": document.status,
        "Notatka": document.note
      }))
    },
    calendar: {
      filename: "raport-kalendarz.xls",
      columns: ["Beneficjent", "Tytul", "Start", "Koniec", "Status", "Notatka"],
      rows: data.calendar.map((event) => ({
        "Beneficjent": beneficiaryName(event.beneficiaryId),
        "Tytul": event.title,
        "Start": formatDateTime(event.startAt),
        "Koniec": formatDateTime(event.endAt),
        "Status": event.status,
        "Notatka": event.note
      }))
    }
  };
  const config = reportConfig[type] || reportConfig.expenses;
  downloadExcelTable(config);
  showToast("Wygenerowano raport demo do Excela.");
}

function exportMentoringReport(scopeId) {
  const rows = mentoringReportRows(scopeId);
  const columns = [
    "Data",
    "Miesiac",
    "Typ mentora",
    "Imie i nazwisko mentora",
    "Cel z Harmonogramu Mentoringu",
    "Opis celu",
    "Planowana liczba godzin dla celu",
    "Zrealizowane godziny w danym wpisie",
    "Zrealizowane godziny narastajaco",
    "Pozostale godziny",
    "Forma realizacji",
    "Link do spotkania / materialow",
    "Link dla opiekuna projektu",
    "Opis realizacji",
    "Status spotkania",
    "Czy uwzglednic w sprawozdaniu miesiecznym",
    "Uwagi"
  ];
  downloadExcelTable({
    filename: `raport-godzin-mentoring-${scopeId}-${state.mentoringExportMonth}.xls`,
    columns,
    rows
  });
  showToast("Wygenerowano raport godzin do Excela.");
}

async function saveMarketingPackageItem(form) {
  const payload = formDataToObject(form);
  const item = state.marketingPackageItems.find((entry) => entry.id === payload.id);
  if (!item) return;
  const fileInput = form.querySelector('input[name="file"]');
  const errors = [];
  if (payload.link && !validateUrl(payload.link)) addValidationError(errors, "link", "Podaj poprawny link.");
  if (payload.status !== "brak" && !payload.link && !fileInput?.files?.length && !item.fileName && !payload.text) {
    addValidationError(errors, fileInput, "Dodaj link, plik albo opis materialu.");
  }
  const fileError = validateFiles(fileInput?.files);
  if (fileError) addValidationError(errors, fileInput, fileError);
  if (!showValidationErrors(form, errors)) return;
  const uploaded = await filesToPayload(form.querySelector('input[name="file"]')?.files);
  item.status = payload.status;
  item.link = payload.link || "";
  item.text = payload.text || "";
  if (uploaded.length) {
    const fileInput = form.querySelector('input[name="file"]');
    item.fileName = fileInput?.files?.[0]?.name || "material";
    item.fileData = uploaded[0].content;
  }
  renderMarketing();
  showToast("Zapisano element paczki marketingowej.");
}

function saveMarketingProfile(form) {
  state.marketingProfile = {
    ...state.marketingProfile,
    ...formDataToObject(form)
  };
  state.marketingProfileEditing = false;
  renderMarketing();
  showToast("Zapisano profil promocyjny.");
}

async function saveMarketingContest(form) {
  const payload = formDataToObject(form);
  const errors = [];
  if (!validateRequired(payload.name)) addValidationError(errors, "name", "To pole jest wymagane.");
  if (!validateRequired(payload.deadline)) addValidationError(errors, "deadline", "To pole jest wymagane.");
  if (payload.deadline && payload.status !== "archiwalny" && payload.deadline < dateKey(new Date())) {
    addValidationError(errors, "deadline", "Termin zgloszenia nie powinien byc wczesniejszy niz data dzisiejsza.");
  }
  if (payload.url && !validateUrl(payload.url)) addValidationError(errors, "url", "Podaj poprawny link.");
  const fileInput = form.querySelector('input[name="file"]');
  const fileError = validateFiles(fileInput?.files);
  if (fileError) addValidationError(errors, fileInput, fileError);
  if (!showValidationErrors(form, errors)) return;
  const uploaded = await filesToPayload(form.querySelector('input[name="file"]')?.files);
  const existing = state.marketingContests.find((contest) => contest.id === payload.id);
  const nextContest = {
    id: payload.id || `contest-${Date.now()}`,
    name: payload.name,
    organizer: payload.organizer,
    type: payload.type,
    description: payload.description,
    audience: payload.audience,
    deadline: payload.deadline,
    status: payload.status,
    url: payload.url,
    requiredMaterials: payload.requiredMaterials,
    owner: payload.owner,
    notes: payload.notes,
    fileName: uploaded.length ? form.querySelector('input[name="file"]')?.files?.[0]?.name || "material" : existing?.fileName || "",
    fileData: uploaded.length ? uploaded[0].content : existing?.fileData || ""
  };
  if (existing) {
    state.marketingContests = state.marketingContests.map((contest) => contest.id === existing.id ? nextContest : contest);
    showToast("Zapisano konkurs.");
  } else {
    state.marketingContests.push(nextContest);
    addNotification({
      title: "Dodano nowy konkurs w module Marketing",
      description: nextContest.description || `Termin zgloszen: ${nextContest.deadline || "-"}.`,
      type: "marketing_contest",
      module: "marketing",
      relatedObjectId: nextContest.id,
      relatedObjectName: nextContest.name,
      actionLabel: "Przejdz do konkursu"
    });
    showToast("Dodano konkurs.");
  }
  state.marketingContestFormOpen = false;
  state.marketingEditingContestId = "";
  renderMarketing();
}

function documentActor(action = "") {
  if (action === "authorized-sign") return { name: "Osoba upowazniona Akces", role: "Osoba upowazniona" };
  if (action === "project-sign" || action === "verify" || action === "return") return { name: "Julia Bareja", role: "Opiekun Projektu" };
  if (isAdmin()) return { name: "Admin", role: "Admin" };
  return { name: activeActor()?.name || "Jan Nowak", role: "Beneficjent" };
}

function workflowDocument(id) {
  return state.documentWorkflowDocs.find((document) => document.id === id);
}

function updateSignaturePath(document, roleMatch, nextState) {
  document.signaturePath = document.signaturePath.map((step) =>
    step.role.toLowerCase().includes(roleMatch.toLowerCase()) ? { ...step, state: nextState } : step
  );
}

function nextStatusAfterUpload(document) {
  if (document.status === "Oczekuje na podpis osoby upowaznionej") return "Podpisany przez wszystkie wymagane osoby";
  if (document.status === "Oczekuje na podpis Opiekuna Projektu") return "Oczekuje na podpis osoby upowaznionej";
  if (document.documentType === "contract") return "Oczekuje na weryfikacje Akces";
  if (document.documentType === "wst") return "Oczekuje na podpis Opiekuna Projektu";
  if (["formal", "other", "archive"].includes(document.documentType)) return "Oczekuje na weryfikacje Akces";
  return "Oczekuje na weryfikacje Akces";
}

function updateDocumentStep(document) {
  const steps = {
    "Oczekuje na dodanie pliku": "Beneficjent dodaje aktualny zalacznik PDF.",
    "Oczekuje na dodanie umowy przez Beneficjenta": "Beneficjent dodaje podpisana umowe akceleracyjna jako PDF.",
    "Oczekuje na dodanie podpisanego WST przez Beneficjenta": "Beneficjent dodaje podpisany WST jako PDF.",
    "Oczekuje na dodanie poprawnego pliku": "Beneficjent podmienia dokument na poprawna wersje PDF.",
    "Oczekuje na podpis Beneficjenta": "Beneficjent podpisuje dokument i dodaje plik PDF.",
    "Oczekuje na weryfikacje Akces": "Akces / Opiekun Projektu weryfikuje aktualny plik.",
    "Do poprawy": "Beneficjent poprawia dokument zgodnie z uwagami.",
    "Oczekuje na podpis Opiekuna Projektu": "Opiekun Projektu podpisuje / akceptuje dokument.",
    "Oczekuje na podpis osoby upowaznionej": "Osoba upowazniona po stronie Akces podpisuje dokument.",
    "Podpisany przez wszystkie wymagane osoby": "Dokument ma komplet wymaganych podpisow.",
    "Zaakceptowany": "Dokument zaakceptowany, nie wymaga dzialania.",
    "Archiwalny": "Dokument archiwalny tylko do podgladu i pobrania."
  };
  document.currentStep = steps[document.status] || document.currentStep;
}

function addDocumentHistory(document, actionType, actor, previousStatus, newStatus, comment, fileName = "", previousFileName = "", newFileName = "") {
  const timestamp = new Date().toISOString();
  document.history.push({
    id: `hist-${document.id}-${Date.now()}`,
    documentId: document.id,
    timestamp,
    actorName: actor.name,
    actorRole: actor.role,
    actionType,
    fileName,
    previousFileName,
    newFileName,
    previousStatus,
    newStatus,
    comment
  });
  document.updatedAt = timestamp;
}

async function saveDocumentPdf(form) {
  const payload = formDataToObject(form);
  const document = workflowDocument(payload.documentId);
  const input = form.querySelector('input[name="pdfFile"]');
  const file = input?.files?.[0];
  if (!document) return;
  const fileError = validatePdfFile(file);
  if (fileError && !showValidationErrors(form, [{ field: input, message: fileError }])) return;
  const [uploaded] = await filesToPayload([file], { pdfOnly: true, required: true });
  const actor = documentActor();
  const previousStatus = document.status;
  const previousFileName = document.currentFile?.name || "";
  if (document.currentFile) document.fileVersions.unshift({ ...document.currentFile });
  document.currentFile = {
    id: `file-${Date.now()}`,
    name: file.name,
    type: file.type || "application/pdf",
    addedBy: actor.name,
    addedByRole: actor.role,
    addedAt: new Date().toISOString(),
    content: uploaded.content
  };
  document.status = nextStatusAfterUpload(document);
  updateDocumentStep(document);
  if (document.documentType === "contract") updateSignaturePath(document, "Beneficjent", "podpisano");
  if (document.documentType === "wst") updateSignaturePath(document, "Beneficjent", "podpisano");
  if (document.status === "Oczekuje na podpis osoby upowaznionej") updateSignaturePath(document, "Opiekun", "podpisano");
  if (document.status === "Podpisany przez wszystkie wymagane osoby") updateSignaturePath(document, "upowazniona", "podpisano");
  addDocumentHistory(
    document,
    previousFileName ? "Podmieniono plik PDF" : "Dodano plik PDF",
    actor,
    previousStatus,
    document.status,
    previousFileName ? "Podmieniono aktualny zalacznik PDF." : "Dodano aktualny zalacznik PDF.",
    file.name,
    previousFileName,
    file.name
  );
  addNotification({
    title: previousFileName ? "Podmieniono plik dokumentu" : "Dodano plik dokumentu",
    description: `Nowy status: ${document.status}.`,
    type: document.status === "Do poprawy" ? "document_correction" : "document_status",
    module: "documents",
    relatedObjectId: document.id,
    relatedObjectName: document.title,
    actionLabel: "Przejdz do dokumentu"
  });
  renderDocuments();
  showToast(previousFileName ? "Podmieniono plik PDF i zapisano historie." : "Dodano plik PDF i zmieniono status dokumentu.");
}

function removeDocumentFile(documentId) {
  const document = workflowDocument(documentId);
  if (!document?.currentFile) return;
  const actor = documentActor("return");
  const previousStatus = document.status;
  const previousFile = document.currentFile;
  document.fileVersions.unshift({ ...previousFile });
  document.currentFile = null;
  document.status = "Oczekuje na dodanie poprawnego pliku";
  updateDocumentStep(document);
  addDocumentHistory(
    document,
    "Usunieto aktualny plik",
    actor,
    previousStatus,
    document.status,
    "Usunieto aktualny plik. Historia i poprzednia wersja zostaly zachowane.",
    previousFile.name,
    previousFile.name,
    ""
  );
  renderDocuments();
  showToast("Usunieto aktualny plik i zachowano wpis w historii.");
}

function applyDocumentAction(documentId, action) {
  const document = workflowDocument(documentId);
  if (!document) return;
  const actor = documentActor(action);
  const previousStatus = document.status;
  const verifyTarget = ["formal", "other"].includes(document.documentType) ? "Zaakceptowany" : "Oczekuje na podpis osoby upowaznionej";
  const actions = {
    verify: [verifyTarget, verifyTarget === "Zaakceptowany" ? "Zaakceptowano dokument" : "Zweryfikowano dokument", verifyTarget === "Zaakceptowany" ? "Plik zweryfikowany i zaakceptowany." : "Plik zweryfikowany i przekazany do kolejnego podpisu."],
    return: ["Do poprawy", "Zwrocono do poprawy", "Dokument wymaga poprawy przed dalszym obiegiem."],
    "project-sign": ["Oczekuje na podpis osoby upowaznionej", "Podpisano jako Opiekun Projektu", "Opiekun Projektu podpisal / zaakceptowal dokument."],
    "authorized-sign": ["Podpisany przez wszystkie wymagane osoby", "Dodano podpis osoby upowaznionej", "Osoba upowazniona podpisala dokument."],
    complete: ["Podpisany przez wszystkie wymagane osoby", "Oznaczono komplet podpisow", "Dokument podpisany przez wszystkie wymagane osoby."],
    archive: ["Archiwalny", "Przeniesiono do archiwum", "Dokument przeniesiono do archiwum."]
  };
  const [newStatus, actionType, comment] = actions[action] || [];
  if (!newStatus) return;
  document.status = newStatus;
  updateDocumentStep(document);
  if (action === "verify") updateSignaturePath(document, "Akces", "zweryfikowano");
  if (action === "project-sign") updateSignaturePath(document, "Opiekun", "podpisano");
  if (action === "authorized-sign" || action === "complete") updateSignaturePath(document, "upowazniona", "podpisano");
  addDocumentHistory(document, actionType, actor, previousStatus, document.status, comment, document.currentFile?.name || "");
  addNotification({
    title: actionType,
    description: comment,
    type: action === "return" ? "document_correction" : "document_status",
    module: "documents",
    relatedObjectId: document.id,
    relatedObjectName: document.title,
    actionLabel: "Przejdz do dokumentu"
  });
  renderDocuments();
  showToast("Wykonano akcje i zaktualizowano historie dokumentu.");
}

function saveDocumentComment(form) {
  const payload = formDataToObject(form);
  const document = workflowDocument(payload.documentId);
  if (!document) return;
  const errors = [];
  if (!validateRequired(payload.comment)) addValidationError(errors, "comment", "To pole jest wymagane.");
  if (!showValidationErrors(form, errors)) return;
  const actor = documentActor();
  const timestamp = new Date().toISOString();
  document.comments.push({
    id: `comment-${Date.now()}`,
    author: actor.name,
    role: actor.role,
    timestamp,
    text: payload.comment
  });
  addDocumentHistory(document, "Dodano komentarz", actor, document.status, document.status, payload.comment, document.currentFile?.name || "");
  addNotification({
    title: "Dodano komentarz do dokumentu",
    description: payload.comment,
    type: "project_comment",
    module: "documents",
    relatedObjectId: document.id,
    relatedObjectName: document.title,
    actionLabel: "Przejdz do komentarzy"
  });
  renderDocuments();
  showToast("Dodano komentarz i wpis w historii dokumentu.");
}

function emergencyChangeDocumentStatus(documentId, nextStatus) {
  const document = workflowDocument(documentId);
  if (!document) return;
  const actor = documentActor();
  const previousStatus = document.status;
  document.status = nextStatus;
  updateDocumentStep(document);
  addDocumentHistory(document, "Awaryjna zmiana statusu", actor, previousStatus, nextStatus, "Admin zmienil status awaryjnie.", document.currentFile?.name || "");
  renderDocuments();
  showToast("Admin awaryjnie zmienil status dokumentu.");
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
  const notificationOpen = event.target.closest("[data-notification-open]");
  if (notificationOpen) {
    openNotification(notificationOpen.dataset.notificationOpen);
    return;
  }

  const notificationItem = event.target.closest("[data-notification-id]");
  if (notificationItem && !event.target.closest("button")) {
    openNotification(notificationItem.dataset.notificationId);
    return;
  }

  const notificationRead = event.target.closest("[data-notification-read]");
  if (notificationRead) {
    state.notifications = state.notifications.map((item) =>
      item.id === notificationRead.dataset.notificationRead ? { ...item, read: true } : item
    );
    renderNotificationMenu();
    return;
  }

  if (event.target.closest("[data-notifications-mark-all]")) {
    state.notifications = state.notifications.map((item) => ({ ...item, read: true }));
    renderNotificationMenu();
    return;
  }

  if (event.target.closest("[data-notifications-clear-read]")) {
    state.notifications = state.notifications.filter((item) => !item.read);
    renderNotificationMenu();
    return;
  }

  if (event.target.closest("[data-notifications-history]")) {
    state.notificationsOpen = true;
    renderNotificationMenu();
    return;
  }

  const searchOpen = event.target.closest("[data-search-open]");
  if (searchOpen) {
    openSearchResult(searchOpen.dataset.searchOpen);
    return;
  }

  const searchItem = event.target.closest("[data-search-result]");
  if (searchItem && !event.target.closest("button")) {
    openSearchResult(searchItem.dataset.searchResult);
    return;
  }

  const notificationTrigger = event.target.closest("[data-notifications-toggle]");
  if (notificationTrigger) {
    state.notificationsOpen = !state.notificationsOpen;
    renderNotificationMenu();
    return;
  }

  if (state.notificationsOpen && !event.target.closest(".notification-menu")) {
    state.notificationsOpen = false;
    renderNotificationMenu();
  }

  if (state.searchOpen && !event.target.closest(".global-search")) {
    state.searchOpen = false;
    renderGlobalSearch();
  }

  const contextTrigger = event.target.closest("[data-context-toggle]");
  if (contextTrigger) {
    const isOpen = contextMenu.hidden;
    contextMenu.hidden = !isOpen;
    contextTrigger.setAttribute("aria-expanded", String(isOpen));
    return;
  }

  if (!event.target.closest(".brand-menu") && !contextMenu.hidden) {
    contextMenu.hidden = true;
    contextToggle.setAttribute("aria-expanded", "false");
  }

  if (event.target.closest("[data-sidebar-collapse]")) {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    window.localStorage.setItem("akces-sidebar-collapsed", String(state.sidebarCollapsed));
    if (state.sidebarCollapsed && !contextMenu.hidden) {
      contextMenu.hidden = true;
      contextToggle.setAttribute("aria-expanded", "false");
    }
    syncShellState();
    return;
  }

  if (event.target.closest("[data-sidebar-mobile-toggle]")) {
    state.mobileSidebarOpen = true;
    syncShellState();
    return;
  }

  if (event.target.closest("[data-sidebar-overlay]")) {
    state.mobileSidebarOpen = false;
    syncShellState();
    return;
  }

  const navButton = event.target.closest(".nav-button[data-view]");
  if (navButton) {
    state.startupProfileEditing = false;
    setView(navButton.dataset.view);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const startupProfileTab = event.target.closest("[data-startup-profile-tab]");
  if (startupProfileTab) {
    state.startupProfileTab = startupProfileTab.dataset.startupProfileTab;
    state.startupProfileEditing = false;
    renderStartupCard();
    return;
  }

  if (event.target.closest("[data-edit-startup-profile]")) {
    state.startupProfileEditing = !state.startupProfileEditing;
    renderStartupCard();
    return;
  }

  if (event.target.closest("[data-add-profile-person]")) {
    const profile = currentStartupProfile();
    updateStartupProfile({
      people: [
        ...profile.people,
        {
          name: "",
          function: "",
          projectRole: "",
          email: "",
          phone: "",
          type: "kontakt glowny",
          representation: "nie"
        }
      ]
    });
    state.startupProfileEditing = true;
    renderStartupCard();
    return;
  }

  const mentoringMainTab = event.target.closest("[data-mentoring-main-tab]");
  if (mentoringMainTab) {
    state.mentoringMainTab = mentoringMainTab.dataset.mentoringMainTab;
    state.mentoringSection = "info";
    state.mentoringGoalFormOpen = false;
    state.mentoringEntryFormOpen = false;
    if (state.mentoringMainTab === "lead") state.mentoringActiveMentorId = "lead-mentor";
    renderMentoring();
    return;
  }

  const openMentor = event.target.closest("[data-open-mentor]");
  if (openMentor) {
    state.mentoringActiveMentorId = openMentor.dataset.openMentor;
    state.mentoringSection = "info";
    state.mentoringGoalFormOpen = false;
    state.mentoringEntryFormOpen = false;
    renderMentoring();
    return;
  }

  if (event.target.closest("[data-close-mentor-detail]")) {
    state.mentoringActiveMentorId = "";
    state.mentoringSection = "info";
    renderMentoring();
    return;
  }

  const mentorSection = event.target.closest("[data-mentor-section]");
  if (mentorSection) {
    state.mentoringSection = mentorSection.dataset.mentorSection;
    state.mentoringGoalFormOpen = false;
    state.mentoringEntryFormOpen = false;
    renderMentoring();
    return;
  }

  if (event.target.closest("[data-open-goal-form]")) {
    state.mentoringGoalFormOpen = true;
    state.mentoringEditingGoalId = "";
    renderMentoring();
    return;
  }

  if (event.target.closest("[data-close-goal-form]")) {
    state.mentoringGoalFormOpen = false;
    state.mentoringEditingGoalId = "";
    renderMentoring();
    return;
  }

  const editGoal = event.target.closest("[data-edit-goal]");
  if (editGoal) {
    state.mentoringGoalFormOpen = true;
    state.mentoringEditingGoalId = editGoal.dataset.editGoal;
    renderMentoring();
    return;
  }

  const deleteGoal = event.target.closest("[data-delete-goal]");
  if (deleteGoal) {
    const mentor = mentoringMentor();
    mentor.goals = mentor.goals.filter((goal) => goal.id !== deleteGoal.dataset.deleteGoal);
    mentor.entries = mentor.entries.filter((entry) => entry.goalId !== deleteGoal.dataset.deleteGoal);
    renderMentoring();
    showToast("Usunieto cel i powiazane wpisy realizacji.");
    return;
  }

  if (event.target.closest("[data-open-entry-form]")) {
    const mentor = mentoringMentor();
    if (!mentor.goals.length) {
      showToast("Najpierw dodaj cel w Harmonogramie Mentoringu.");
      return;
    }
    state.mentoringEntryFormOpen = true;
    renderMentoring();
    return;
  }

  if (event.target.closest("[data-close-entry-form]")) {
    state.mentoringEntryFormOpen = false;
    renderMentoring();
    return;
  }

  const exportMentoring = event.target.closest("[data-export-mentoring-report]");
  if (exportMentoring) {
    exportMentoringReport(exportMentoring.dataset.exportMentoringReport);
    return;
  }

  const marketingTab = event.target.closest("[data-marketing-tab]");
  if (marketingTab) {
    state.marketingTab = marketingTab.dataset.marketingTab;
    state.marketingProfileEditing = false;
    state.marketingContestFormOpen = false;
    state.marketingEditingContestId = "";
    renderMarketing();
    return;
  }

  if (event.target.closest("[data-edit-marketing-profile]")) {
    state.marketingProfileEditing = true;
    renderMarketing();
    return;
  }

  if (event.target.closest("[data-cancel-marketing-profile]")) {
    state.marketingProfileEditing = false;
    renderMarketing();
    return;
  }

  const removeMarketingPackage = event.target.closest("[data-remove-marketing-package]");
  if (removeMarketingPackage) {
    const item = state.marketingPackageItems.find((entry) => entry.id === removeMarketingPackage.dataset.removeMarketingPackage);
    if (item) {
      item.status = "brak";
      item.link = "";
      item.text = "";
      item.fileName = "";
      item.fileData = "";
    }
    renderMarketing();
    showToast("Usunieto material z paczki marketingowej.");
    return;
  }

  if (event.target.closest("[data-open-marketing-contest-form]")) {
    state.marketingContestFormOpen = true;
    state.marketingEditingContestId = "";
    renderMarketing();
    return;
  }

  if (event.target.closest("[data-close-marketing-contest-form]")) {
    state.marketingContestFormOpen = false;
    state.marketingEditingContestId = "";
    renderMarketing();
    return;
  }

  const editMarketingContest = event.target.closest("[data-edit-marketing-contest]");
  if (editMarketingContest) {
    state.marketingContestFormOpen = true;
    state.marketingEditingContestId = editMarketingContest.dataset.editMarketingContest;
    renderMarketing();
    return;
  }

  const documentsTab = event.target.closest("[data-documents-tab]");
  if (documentsTab) {
    state.documentsTab = documentsTab.dataset.documentsTab;
    renderDocuments();
    return;
  }

  const removeDocument = event.target.closest("[data-remove-document-file]");
  if (removeDocument) {
    removeDocumentFile(removeDocument.dataset.removeDocumentFile);
    return;
  }

  const documentAction = event.target.closest("[data-document-action]");
  if (documentAction) {
    applyDocumentAction(documentAction.dataset.documentId, documentAction.dataset.documentAction);
    return;
  }

  if (event.target.closest("[data-open-address-book]")) {
    state.addressBookOpen = true;
    state.addressBookFormOpen = false;
    state.editingContactId = "";
    renderStart();
    return;
  }

  const closeAddressBook = event.target.closest("button[data-close-address-book]");
  const addressBookBackdropClick = event.target.classList.contains("address-book-backdrop");
  if (closeAddressBook || addressBookBackdropClick) {
    state.addressBookOpen = false;
    state.addressBookFormOpen = false;
    state.editingContactId = "";
    renderStart();
    return;
  }

  if (event.target.closest("[data-add-contact]")) {
    state.addressBookFormOpen = true;
    state.editingContactId = "";
    renderStart();
    return;
  }

  if (event.target.closest("[data-contact-form-close]")) {
    state.addressBookFormOpen = false;
    state.editingContactId = "";
    renderStart();
    return;
  }

  const editContact = event.target.closest("[data-edit-contact]");
  if (editContact) {
    state.addressBookFormOpen = true;
    state.editingContactId = editContact.dataset.editContact;
    renderStart();
    return;
  }

  const deleteContact = event.target.closest("[data-delete-contact]");
  if (deleteContact) {
    state.addressBookContacts = state.addressBookContacts.filter((contact) => contact.id !== deleteContact.dataset.deleteContact);
    state.addressBookFormOpen = false;
    state.editingContactId = "";
    renderStart();
    showToast("Usunieto kontakt z lokalnej ksiazki teleadresowej.");
    return;
  }

  const submitContact = event.target.closest("[data-submit-contact]");
  if (submitContact) {
    event.preventDefault();
    const form = submitContact.closest("#contact-form");
    if (!form) return;
    await saveContactFromForm(form);
    return;
  }

  if (event.target.closest("[data-address-book-panel]")) return;

  const closeButton = event.target.closest("button[data-close-calendar-modal]");
  const backdropClick = event.target.classList.contains("modal-backdrop");
  if (closeButton || backdropClick) {
    state.calendarModal = null;
    renderCalendar();
    return;
  }

  const go = event.target.closest("[data-go]");
  if (go) {
    state.startupProfileEditing = false;
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
  if (event.target.id === "global-search-input") {
    state.searchQuery = event.target.value;
    state.searchOpen = true;
    renderGlobalSearch();
    const input = document.querySelector("#global-search-input");
    input?.focus();
    input?.setSelectionRange(state.searchQuery.length, state.searchQuery.length);
    return;
  }

  if (event.target.id === "contact-search") {
    const position = event.target.selectionStart || event.target.value.length;
    state.contactSearch = event.target.value;
    renderStart();
    const searchInput = document.querySelector("#contact-search");
    searchInput?.focus();
    searchInput?.setSelectionRange(position, position);
    return;
  }

  if (["expense-search", "priority-filter", "detail-filter", "status-filter"].includes(event.target.id)) {
    filterExpenses();
  }
  if (["netAmount", "vatRate"].includes(event.target.id)) {
    calculateExpenseTotals();
  }

  const validationForm = event.target.closest("form");
  if (validationForm && event.target.matches("input, select, textarea")) {
    clearFieldError(event.target);
    const formError = validationForm.querySelector(".form-error");
    formError?.remove();
  }
});

document.addEventListener("dragover", (event) => {
  const uploadBox = event.target.closest("[data-document-upload-form]");
  if (!uploadBox) return;
  event.preventDefault();
  uploadBox.classList.add("is-dragging");
});

document.addEventListener("dragleave", (event) => {
  const uploadBox = event.target.closest("[data-document-upload-form]");
  if (!uploadBox) return;
  uploadBox.classList.remove("is-dragging");
});

document.addEventListener("drop", (event) => {
  const uploadBox = event.target.closest("[data-document-upload-form]");
  if (!uploadBox) return;
  event.preventDefault();
  uploadBox.classList.remove("is-dragging");
  const input = uploadBox.querySelector('input[name="pdfFile"]');
  if (input && event.dataTransfer?.files?.length) {
    const error = validatePdfFile(event.dataTransfer.files[0]);
    if (error) {
      setFieldError(uploadBox, input, error);
      showToast(error);
      return;
    }
    clearFieldError(input);
    input.files = event.dataTransfer.files;
    showToast(`Wybrano plik: ${event.dataTransfer.files[0].name}`);
  }
});

document.addEventListener("change", async (event) => {
  if (event.target.matches('input[type="file"]')) {
    const requiresPdf = event.target.accept?.includes("pdf") || event.target.name === "pdfFile";
    const error = validateFiles(event.target.files, { pdfOnly: requiresPdf });
    if (error) {
      setFieldError(event.target.closest("form") || document, event.target, error);
      showToast(error);
    } else {
      clearFieldError(event.target);
    }
  }

  if (event.target.closest("[data-mentoring-export-month]")) {
    state.mentoringExportMonth = event.target.value;
    return;
  }

  if (event.target.closest("[data-marketing-material-filter]")) {
    state.marketingMaterialFilter = event.target.value;
    renderMarketing();
    return;
  }

  if (event.target.closest("[data-marketing-contest-status-filter]")) {
    state.marketingContestStatusFilter = event.target.value;
    renderMarketing();
    return;
  }

  if (event.target.closest("[data-marketing-contest-type-filter]")) {
    state.marketingContestTypeFilter = event.target.value;
    renderMarketing();
    return;
  }

  const emergencyStatus = event.target.closest("[data-document-emergency-status]");
  if (emergencyStatus) {
    emergencyChangeDocumentStatus(emergencyStatus.dataset.documentEmergencyStatus, emergencyStatus.value);
    return;
  }

  if (event.target.id === "contact-category-filter") {
    state.contactCategory = event.target.value;
    renderStart();
    return;
  }

  if (["status-filter", "priority-filter", "detail-filter"].includes(event.target.id)) {
    filterExpenses();
    return;
  }

  if (event.target.id === "vatRate") {
    calculateExpenseTotals();
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

});

document.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  try {
    if (form.id === "contact-form") {
      await saveContactFromForm(form);
      return;
    }

    if (form.id === "startup-profile-form") {
      saveStartupProfileFromForm(form);
      return;
    }

    if (form.id === "mentoring-goal-form") {
      saveMentoringGoal(form);
      return;
    }

    if (form.id === "mentoring-entry-form") {
      saveMentoringEntry(form);
      return;
    }

    if (form.matches("[data-marketing-package-form]")) {
      await saveMarketingPackageItem(form);
      return;
    }

    if (form.id === "marketing-profile-form") {
      saveMarketingProfile(form);
      return;
    }

    if (form.id === "marketing-contest-form") {
      await saveMarketingContest(form);
      return;
    }

    if (form.matches("[data-document-upload-form]")) {
      await saveDocumentPdf(form);
      return;
    }

    if (form.matches("[data-document-comment-form]")) {
      saveDocumentComment(form);
      return;
    }

    if (form.id === "expense-form") {
      const payload = formDataToObject(form);
      const errors = [];
      ["beneficiaryId", "invoiceNumber", "contractor", "invoiceDate", "netAmount", "priorityGoal", "detailedGoal", "description"].forEach((field) => {
        if (!validateRequired(payload[field])) addValidationError(errors, field, "To pole jest wymagane.");
      });
      if (Number(payload.netAmount || 0) <= 0) addValidationError(errors, "netAmount", "Kwota netto musi byc wieksza niz 0.");
      const invoiceFiles = form.querySelector("#invoice-files")?.files;
      const otherFiles = form.querySelector("#other-files")?.files;
      if (!invoiceFiles?.length && !otherFiles?.length) addValidationError(errors, "invoice-files", "Dodaj przynajmniej jeden zalacznik.");
      const invoiceError = validateFiles(invoiceFiles);
      const otherError = validateFiles(otherFiles);
      if (invoiceError) addValidationError(errors, "invoice-files", invoiceError);
      if (otherError) addValidationError(errors, "other-files", otherError);
      if (!showValidationErrors(form, errors)) return;
      payload.actorId = state.actorId;
      payload.invoiceFiles = await filesToPayload(form.querySelector("#invoice-files")?.files);
      payload.otherFiles = await filesToPayload(form.querySelector("#other-files")?.files);
      await api("/api/expenses", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      showToast("Dodano wydatek i zalaczniki do lokalnej bazy.");
      await loadState();
      setView("expenses");
    }

    if (form.id === "calendar-form") {
      const payload = formDataToObject(form);
      const errors = [];
      ["title", "startAt", "endAt"].forEach((field) => {
        if (!validateRequired(payload[field])) addValidationError(errors, field, "To pole jest wymagane.");
      });
      if (!validateDateRange(payload.startAt, payload.endAt)) addValidationError(errors, "endAt", "Data zakonczenia nie moze byc wczesniejsza niz data rozpoczecia.");
      const calendarFileError = validateFiles(form.querySelector("#calendar-files")?.files);
      if (calendarFileError) addValidationError(errors, "calendar-files", calendarFileError);
      if (!showValidationErrors(form, errors)) return;
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
      exportOperationalReport(payload.type, payload.scopeBeneficiaryId);
    }

    if (form.id === "beneficiary-form") {
      const errors = [];
      const payload = formDataToObject(form);
      if (!validateRequired(payload.name)) addValidationError(errors, "name", "To pole jest wymagane.");
      if (!showValidationErrors(form, errors)) return;
      const beneficiary = await api("/api/beneficiaries", {
        method: "POST",
        body: JSON.stringify(payload)
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
    app.innerHTML = emptyState("Nie udalo sie zaladowac widoku", error.message);
});
