export const salonConfig = {
  name: 'Haarmonie Gelsenkirchen',
  shortName: 'Haarmonie',
  tagline: 'Ihr Friseur- & Beauty-Salon im Herzen von Gelsenkirchen',
  // FIKTIVE Adresse — existiert nicht
  address: 'Bahnhofstraße 24, 45879 Gelsenkirchen [fiktiv]',
  addressDisplay: 'Bahnhofstraße 24, 45879 Gelsenkirchen',
  city: 'Gelsenkirchen, NRW',
  // FIKTIVE Telefonnummer (erkennbar fiktiv)
  phone: '0209 123 456 8',
  phoneHref: 'tel:+4920912345680',
  // WhatsApp (wa.me erwartet internationale Ziffern ohne +). FIKTIV.
  whatsappNumber: '4920912345680',
  whatsappDisplay: '+49 209 123 456 8',
  // FIKTIVE E-Mail
  email: 'termin@haarmonie-demo.example',
  founded: '2013',
  highlights: ['Meisterbetrieb', 'Wella Premium Partner', 'Bio-Naturkosmetik'],
  openingHours: {
    weekdays: 'Di – Fr: 9:00 – 19:00 Uhr',
    saturday: 'Sa: 9:00 – 15:00 Uhr',
    closed: 'So & Mo: geschlossen',
  },
  // Maschinenlesbare Öffnungszeiten für die Slot-Generierung.
  // Schlüssel = JS getDay() (0 = So … 6 = Sa). null = geschlossen.
  bookingHours: {
    0: null,
    1: null,
    2: { open: '09:00', close: '19:00' },
    3: { open: '09:00', close: '19:00' },
    4: { open: '09:00', close: '19:00' },
    5: { open: '09:00', close: '19:00' },
    6: { open: '09:00', close: '15:00' },
  } as Record<number, { open: string; close: string } | null>,
  slotMinutes: 30,
  bookingDaysAhead: 21,
  googleMapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39665.71!2d7.0857!3d51.5177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8e63ba5d34bad%3A0x47a700cb3fc58ce!2sGelsenkirchen!5e0!3m2!1sde!2sde!4v1234567890',
  social: {
    instagram: 'https://kobiakov.dev',
    facebook: 'https://kobiakov.dev',
  },
} as const;

// Leistungen mit Dauer (Minuten) und Richtpreis — auch Basis der Online-Buchung.
export const services = [
  {
    id: 'damenschnitt',
    icon: 'Scissors',
    titleKey: 'service1Title',
    descKey: 'service1Desc',
    duration: 60,
    price: 'ab 39 €',
    color: 'blue',
  },
  {
    id: 'herrenschnitt',
    icon: 'User',
    titleKey: 'service2Title',
    descKey: 'service2Desc',
    duration: 30,
    price: 'ab 24 €',
    color: 'yellow',
  },
  {
    id: 'coloration',
    icon: 'Palette',
    titleKey: 'service3Title',
    descKey: 'service3Desc',
    duration: 90,
    price: 'ab 59 €',
    color: 'blue',
  },
  {
    id: 'straehnen',
    icon: 'Sparkles',
    titleKey: 'service4Title',
    descKey: 'service4Desc',
    duration: 120,
    price: 'ab 79 €',
    color: 'yellow',
  },
  {
    id: 'hochsteckfrisur',
    icon: 'Crown',
    titleKey: 'service5Title',
    descKey: 'service5Desc',
    duration: 60,
    price: 'ab 49 €',
    color: 'blue',
  },
  {
    id: 'kinderschnitt',
    icon: 'Baby',
    titleKey: 'service6Title',
    descKey: 'service6Desc',
    duration: 30,
    price: 'ab 16 €',
    color: 'yellow',
  },
] as const;

export type Service = (typeof services)[number];

export const stats = [
  { value: '12+', labelKey: 'stat1', icon: 'Clock' },
  { value: '3000+', labelKey: 'stat2', icon: 'Users' },
  { value: '4.9★', labelKey: 'stat3', icon: 'Star' },
  { value: '6', labelKey: 'stat4', icon: 'Scissors' },
] as const;

export const processSteps = [
  { step: 1, icon: 'CalendarDays', titleKey: 'step1Title', descKey: 'step1Desc' },
  { step: 2, icon: 'Bell', titleKey: 'step2Title', descKey: 'step2Desc' },
  { step: 3, icon: 'Scissors', titleKey: 'step3Title', descKey: 'step3Desc' },
  { step: 4, icon: 'Heart', titleKey: 'step4Title', descKey: 'step4Desc' },
] as const;

export const testimonials = [
  {
    id: 1,
    name: 'Sandra K.',
    location: 'Gelsenkirchen',
    rating: 5,
    text: 'Endlich ein Salon, in dem man online buchen kann! Kein Warten in der Telefonschleife mehr. Mein Balayage ist traumhaft geworden — ich komme definitiv wieder.',
  },
  {
    id: 2,
    name: 'Melanie B.',
    location: 'Gelsenkirchen-Buer',
    rating: 5,
    text: 'Tolle Beratung, super entspannte Atmosphäre und ein Ergebnis, das genau meinen Wünschen entspricht. Das Team nimmt sich wirklich Zeit für jeden Kunden.',
  },
  {
    id: 3,
    name: 'Familie Wagner',
    location: 'Gelsenkirchen',
    rating: 5,
    text: 'Wir gehen als ganze Familie hierher — vom Kinderschnitt bis zur Hochsteckfrisur für die Hochzeit. Immer pünktlich, immer freundlich. Absolute Empfehlung!',
  },
] as const;

export const projects = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    alt: 'Balayage Coloration',
    caption: 'Balayage in warmem Karamell, 2024',
    span: 'col-span-2 row-span-2',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
    alt: 'Moderner Herrenschnitt',
    caption: 'Klassischer Herrenschnitt mit Fade',
    span: '',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80',
    alt: 'Damenschnitt mit Föhnwelle',
    caption: 'Damenschnitt & Föhnwelle',
    span: '',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80',
    alt: 'Salon Interieur',
    caption: 'Unser Salon im Herzen von Gelsenkirchen',
    span: '',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
    alt: 'Hochsteckfrisur',
    caption: 'Brautstyling & Hochsteckfrisur, 2024',
    span: '',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&q=80',
    alt: 'Strähnen Highlights',
    caption: 'Highlights & Strähnentechnik',
    span: '',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=80',
    alt: 'Pflege und Styling',
    caption: 'Pflege, Glanz & Finish',
    span: 'col-span-2',
  },
] as const;
