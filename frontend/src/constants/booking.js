// ---------- Servisler ----------
export const SERVICES = [
  {
    id: 'wartung',
    label: 'Allgemeine Wartung',
    desc: 'Inspektion, Ölwechsel und regelmäßige Wartungsarbeiten.',
    icon: 'icon-wrench',
  },
  {
    id: 'reifen',
    label: 'Reifenwechsel',
    desc: 'Saisonwechsel oder Ersatz einzelner Reifen.',
    icon: 'icon-tire',
  },
  {
    id: 'unbekannt',
    label: 'Unbekanntes Problem',
    desc: 'Etwas stimmt nicht, Sie wissen aber nicht was? Wir finden die Ursache.',
    icon: 'icon-search',
  },
];

export const getServiceById = (id) => SERVICES.find((s) => s.id === id);

// ---------- Fahrzeug ----------
export const BRANDS = [
  'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Opel', 'Ford',
  'Renault', 'Peugeot', 'Fiat', 'Škoda', 'Seat', 'Toyota', 'Hyundai',
  'Kia', 'Nissan', 'Mazda', 'Honda', 'Volvo', 'Mini', 'Smart',
  'Dacia', 'Citroën', 'Andere',
];

// ---------- Takvim ----------
export const DOW_HEADER = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
export const DAYS_DE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']; // getDay() sırasında
export const MONTHS_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

// ---------- Utils ----------
export const pad = (n) => String(n).padStart(2, '0');

export const toDateStr = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayStr = () => toDateStr(new Date());

export function formatDateLong(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${DAYS_DE[dt.getDay()]}, ${d}. ${MONTHS_DE[m - 1]} ${y}`;
}

// ---------- Boş booking state ----------
export const emptyBooking = {
  serviceType: null,
  problemNote: '',
  brand: '',
  brandOther: '',
  model: '',
  year: '',
  plate: '',
  date: null,
  startTime: null,
  customerName: '',
  customerPhone: '',
  customerEmail: '',
};

// ---------- Step validasyonları ----------
// Her fonksiyon: hata mesajı (string) veya null döner
export const validators = {
  1: (d) => (d.serviceType ? null : 'Bitte wählen Sie eine Leistung.'),

  2: (d) => {
    if (!d.brand) return 'Bitte wählen Sie eine Marke.';
    if (d.brand === 'Andere' && !d.brandOther.trim()) {
      return 'Bitte geben Sie die Marke an.';
    }
    if (!d.model.trim()) return 'Bitte geben Sie das Modell an.';
    return null;
  },

  3: (d) => {
    if (!d.date) return 'Bitte wählen Sie ein Datum.';
    if (!d.startTime) return 'Bitte wählen Sie eine Uhrzeit.';
    return null;
  },

  4: (d) => {
    if (!d.customerName.trim()) return 'Bitte geben Sie Ihren Namen an.';
    if (!d.customerPhone.trim()) return 'Bitte geben Sie Ihre Telefonnummer an.';
    if (!d.customerEmail.trim()) return 'Bitte geben Sie Ihre E-Mail-Adresse an.';
    // Basit email format kontrolü
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.customerEmail);
    if (!emailOk) return 'Ungültige E-Mail-Adresse.';
    return null;
  },

  5: () => null, // Özet adımı - validasyon yok
};

export const STEP_LABELS = [
  { num: 1, label: 'Service' },
  { num: 2, label: 'Fahrzeug' },
  { num: 3, label: 'Termin' },
  { num: 4, label: 'Kontakt' },
  { num: 5, label: 'Bestätigung' },
];