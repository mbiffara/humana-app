export type Locale = "en" | "es" | "pt";

export const locales: Locale[] = ["en", "es", "pt"];
export const defaultLocale: Locale = "en";

export type Retreat = {
  slug: string;
  image: string;
  tag: string;
  location: string;
  dates: string;
  title: string;
  property: string;
  description: string;
  price: string;
  commission: string;
  cta: string;
  fromLabel: string;
  perGuest: string;
};

type Dictionary = {
  login: {
    langSupport: string;
    eyebrow: string;
    headline: [string, string, string];
    subhead: string;
    networkLabel: string;
    cities: string;
    portal: string;
    title: string;
    intro: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    recover: string;
    remember: string;
    submit: string;
    joinPrompt: string;
    joinLink: string;
  };
  nav: {
    discover: string;
    bookings: string;
    clients: string;
    commissions: string;
    agencyName: string;
    agencyMeta: string;
  };
  hero: {
    eyebrow: string;
    headline: [string, string];
    subhead: string;
  };
  search: {
    destination: string;
    destinationValue: string;
    dates: string;
    datesValue: string;
    guests: string;
    guestsValue: string;
    experience: string;
    experienceValue: string;
    submit: string;
  };
  map: {
    eyebrow: string;
    title: string;
    legendActive: string;
    legendUpcoming: string;
    fullscreen: string;
    experiencesSingular: string;
    experiencesPlural: (n: number) => string;
    countries: {
      usa: string;
      mexico: string;
      brazil: string;
      spain: string;
      india: string;
      indonesia: string;
    };
  };
  retreats: {
    eyebrow: string;
    title: string;
    count: string;
    filters: { all: string; retreat: string; masterclass: string; corporate: string };
    seeAll: string;
    items: Retreat[];
  };
};

const sharedPerGuest = {
  en: " / guest",
  es: " / huésped",
  pt: " / hóspede",
};

export const dictionary: Record<Locale, Dictionary> = {
  en: {
    login: {
      langSupport: "Institutional support",
      eyebrow: "HUMANA.GLOBAL",
      headline: ["The global network", "connecting humanity", "with wellness."],
      subhead:
        "Exclusive access for hotels, travel agencies and operators integrated into the HUMANA network.",
      networkLabel: "International network",
      cities: "Miami · Buenos Aires · CDMX · Madrid · São Paulo",
      portal: "Access portal",
      title: "Sign in to your account.",
      intro: "Exclusive platform for verified members of the network.",
      emailLabel: "Email",
      emailPlaceholder: "your.email@company.com",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      recover: "Recover access",
      remember: "Keep me signed in on this trusted device",
      submit: "Access the platform",
      joinPrompt: "Does your organization want to join?",
      joinLink: "Request membership",
    },
    nav: {
      discover: "Discover",
      bookings: "Bookings",
      clients: "My clients",
      commissions: "Commissions",
      agencyName: "Viajes Éter",
      agencyMeta: "Agency · Madrid",
    },
    hero: {
      eyebrow: "Global network · 2026 Season",
      headline: [
        "Design your client's next",
        "transformative journey.",
      ],
      subhead:
        "Curated access to certified wellness hotels, purpose-driven retreats and international masterclasses. Transparent commission on every booking.",
    },
    search: {
      destination: "Destination",
      destinationValue: "City, country or property",
      dates: "Dates",
      datesValue: "May 14 — May 21",
      guests: "Guests",
      guestsValue: "2 adults · 1 room",
      experience: "Experience",
      experienceValue: "Retreat · Masterclass",
      submit: "Search",
    },
    map: {
      eyebrow: "Coverage · 14 active cities",
      title: "Global network available",
      legendActive: "Active experiences",
      legendUpcoming: "Upcoming",
      fullscreen: "Full-screen view →",
      experiencesSingular: "1 experience",
      experiencesPlural: (n) => `${n} experiences`,
      countries: {
        usa: "United States",
        mexico: "Mexico",
        brazil: "Brazil",
        spain: "Spain",
        india: "India",
        indonesia: "Indonesia",
      },
    },
    retreats: {
      eyebrow: "Open calendar",
      title: "Upcoming wellness retreats",
      count: "48 certified experiences available this season across 14 cities.",
      filters: {
        all: "All",
        retreat: "Retreat",
        masterclass: "Masterclass",
        corporate: "Corporate",
      },
      seeAll: "See full calendar →",
      items: [
        {
          slug: "mediterranean-silence",
          image: "/images/retreat-ibiza.jpg",
          tag: "Retreat · 7 nights",
          location: "Ibiza · Spain",
          dates: "May 12 — 19",
          title: "Mediterranean Silence",
          property: "Casa del Faro",
          description:
            "Conscious breathing, guided fasting and cliffside meditation sessions. Program certified by Global Wellness Institute.",
          price: "$ 5,240",
          commission: "12% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
        {
          slug: "root-and-ceremony",
          image: "/images/retreat-tulum.jpg",
          tag: "Masterclass · 4 days",
          location: "Tulum · Mexico",
          dates: "May 28 — Jun 1",
          title: "Root and Ceremony",
          property: "Hotel Itzamná",
          description:
            "Immersion in ancestral Mayan medicine, sunrise yoga and cacao circles guided by certified facilitators.",
          price: "$ 3,460",
          commission: "15% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
        {
          slug: "conscious-leadership",
          image: "/images/retreat-singapore.jpg",
          tag: "Corporate · 3 days",
          location: "Singapore",
          dates: "Jun 9 — 12",
          title: "Conscious Leadership",
          property: "Marina Bay Sanctuary",
          description:
            "Executive retreat for leadership teams. Somatic coaching, strategic sessions and vertical integration spaces.",
          price: "$ 6,910",
          commission: "10% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
        {
          slug: "ubud-roots",
          image: "/images/retreat-bali.jpg",
          tag: "Masterclass · 5 days",
          location: "Ubud · Bali",
          dates: "Jul 2 — 7",
          title: "Ubud Roots",
          property: "Ananda Villa",
          description:
            "Rainforest immersion, plant-based cuisine masterclass and breathwork with Balinese practitioners.",
          price: "$ 4,580",
          commission: "13% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
      ],
    },
  },
  es: {
    login: {
      langSupport: "Soporte institucional",
      eyebrow: "HUMANA.GLOBAL",
      headline: ["La red global", "que conecta a la humanidad", "con el bienestar."],
      subhead:
        "Acceso exclusivo para hoteles, agencias de turismo y operadores integrados a la red HUMANA.",
      networkLabel: "Red internacional",
      cities: "Miami · Buenos Aires · CDMX · Madrid · São Paulo",
      portal: "Portal de acceso",
      title: "Ingresa a tu cuenta.",
      intro: "Plataforma exclusiva para miembros verificados de la red.",
      emailLabel: "Email",
      emailPlaceholder: "tucorreo@empresa.com",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "••••••••",
      recover: "Recuperar acceso",
      remember: "Mantener sesión iniciada en este dispositivo de confianza",
      submit: "Acceder a la plataforma",
      joinPrompt: "¿Tu organización desea integrarse?",
      joinLink: "Solicitar incorporación",
    },
    nav: {
      discover: "Descubrir",
      bookings: "Reservas",
      clients: "Mis clientes",
      commissions: "Comisiones",
      agencyName: "Viajes Éter",
      agencyMeta: "Agencia · Madrid",
    },
    hero: {
      eyebrow: "Red global · Temporada 2026",
      headline: ["Diseña el próximo viaje", "transformador de tu cliente."],
      subhead:
        "Acceso curado a hoteles wellness certificados, retiros con propósito y masterclasses internacionales. Comisión transparente en cada reserva.",
    },
    search: {
      destination: "Destino",
      destinationValue: "Ciudad, país o propiedad",
      dates: "Fechas",
      datesValue: "14 may — 21 may",
      guests: "Huéspedes",
      guestsValue: "2 adultos · 1 hab.",
      experience: "Experiencia",
      experienceValue: "Retiro · Masterclass",
      submit: "Buscar",
    },
    map: {
      eyebrow: "Cobertura · 14 ciudades activas",
      title: "Red global disponible",
      legendActive: "Experiencias activas",
      legendUpcoming: "Próxima apertura",
      fullscreen: "Vista en pantalla completa →",
      experiencesSingular: "1 experiencia",
      experiencesPlural: (n) => `${n} experiencias`,
      countries: {
        usa: "Estados Unidos",
        mexico: "México",
        brazil: "Brasil",
        spain: "España",
        india: "India",
        indonesia: "Indonesia",
      },
    },
    retreats: {
      eyebrow: "Calendario abierto",
      title: "Próximos retiros wellness",
      count: "48 experiencias certificadas disponibles esta temporada en 14 ciudades.",
      filters: {
        all: "Todos",
        retreat: "Retiro",
        masterclass: "Masterclass",
        corporate: "Corporativo",
      },
      seeAll: "Ver calendario completo →",
      items: [
        {
          slug: "silencio-mediterraneo",
          image: "/images/retreat-ibiza.jpg",
          tag: "Retiro · 7 noches",
          location: "Ibiza · España",
          dates: "12 — 19 may",
          title: "Silencio Mediterráneo",
          property: "Casa del Faro",
          description:
            "Respiración consciente, ayuno guiado y sesiones de meditación en acantilado. Programa certificado por Global Wellness Institute.",
          price: "$ 5,240",
          commission: "Comisión 12%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
        {
          slug: "raiz-y-ceremonia",
          image: "/images/retreat-tulum.jpg",
          tag: "Masterclass · 4 días",
          location: "Tulum · México",
          dates: "28 may — 1 jun",
          title: "Raíz y Ceremonia",
          property: "Hotel Itzamná",
          description:
            "Inmersión en medicina ancestral maya, yoga al amanecer y círculos de cacao guiados por facilitadores certificados.",
          price: "$ 3,460",
          commission: "Comisión 15%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
        {
          slug: "liderazgo-consciente",
          image: "/images/retreat-singapore.jpg",
          tag: "Corporativo · 3 días",
          location: "Singapur",
          dates: "9 — 12 jun",
          title: "Liderazgo Consciente",
          property: "Marina Bay Sanctuary",
          description:
            "Retiro ejecutivo para equipos directivos. Coaching somático, sesiones estratégicas y espacios de integración vertical.",
          price: "$ 6,910",
          commission: "Comisión 10%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
        {
          slug: "raices-ubud",
          image: "/images/retreat-bali.jpg",
          tag: "Masterclass · 5 días",
          location: "Ubud · Bali",
          dates: "2 — 7 jul",
          title: "Raíces de Ubud",
          property: "Ananda Villa",
          description:
            "Inmersión en selva tropical, masterclass de cocina plant-based y respiración con practicantes balineses.",
          price: "$ 4,580",
          commission: "Comisión 13%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
      ],
    },
  },
  pt: {
    login: {
      langSupport: "Suporte institucional",
      eyebrow: "HUMANA.GLOBAL",
      headline: ["A rede global", "que conecta a humanidade", "com o bem-estar."],
      subhead:
        "Acesso exclusivo para hotéis, agências de turismo e operadores integrados à rede HUMANA.",
      networkLabel: "Rede internacional",
      cities: "Miami · Buenos Aires · CDMX · Madri · São Paulo",
      portal: "Portal de acesso",
      title: "Entre na sua conta.",
      intro: "Plataforma exclusiva para membros verificados da rede.",
      emailLabel: "Email",
      emailPlaceholder: "seu.email@empresa.com",
      passwordLabel: "Senha",
      passwordPlaceholder: "••••••••",
      recover: "Recuperar acesso",
      remember: "Manter sessão iniciada neste dispositivo confiável",
      submit: "Acessar a plataforma",
      joinPrompt: "Sua organização deseja integrar-se?",
      joinLink: "Solicitar incorporação",
    },
    nav: {
      discover: "Descobrir",
      bookings: "Reservas",
      clients: "Meus clientes",
      commissions: "Comissões",
      agencyName: "Viajes Éter",
      agencyMeta: "Agência · Madri",
    },
    hero: {
      eyebrow: "Rede global · Temporada 2026",
      headline: ["Desenhe a próxima viagem", "transformadora do seu cliente."],
      subhead:
        "Acesso curado a hotéis wellness certificados, retiros com propósito e masterclasses internacionais. Comissão transparente em cada reserva.",
    },
    search: {
      destination: "Destino",
      destinationValue: "Cidade, país ou propriedade",
      dates: "Datas",
      datesValue: "14 mai — 21 mai",
      guests: "Hóspedes",
      guestsValue: "2 adultos · 1 quarto",
      experience: "Experiência",
      experienceValue: "Retiro · Masterclass",
      submit: "Buscar",
    },
    map: {
      eyebrow: "Cobertura · 14 cidades ativas",
      title: "Rede global disponível",
      legendActive: "Experiências ativas",
      legendUpcoming: "Próxima abertura",
      fullscreen: "Tela cheia →",
      experiencesSingular: "1 experiência",
      experiencesPlural: (n) => `${n} experiências`,
      countries: {
        usa: "Estados Unidos",
        mexico: "México",
        brazil: "Brasil",
        spain: "Espanha",
        india: "Índia",
        indonesia: "Indonésia",
      },
    },
    retreats: {
      eyebrow: "Calendário aberto",
      title: "Próximos retiros wellness",
      count: "48 experiências certificadas disponíveis nesta temporada em 14 cidades.",
      filters: {
        all: "Todos",
        retreat: "Retiro",
        masterclass: "Masterclass",
        corporate: "Corporativo",
      },
      seeAll: "Ver calendário completo →",
      items: [
        {
          slug: "silencio-mediterraneo",
          image: "/images/retreat-ibiza.jpg",
          tag: "Retiro · 7 noites",
          location: "Ibiza · Espanha",
          dates: "12 — 19 mai",
          title: "Silêncio Mediterrâneo",
          property: "Casa del Faro",
          description:
            "Respiração consciente, jejum guiado e sessões de meditação na falésia. Programa certificado pelo Global Wellness Institute.",
          price: "$ 5.240",
          commission: "Comissão 12%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
        {
          slug: "raiz-e-cerimonia",
          image: "/images/retreat-tulum.jpg",
          tag: "Masterclass · 4 dias",
          location: "Tulum · México",
          dates: "28 mai — 1 jun",
          title: "Raiz e Cerimônia",
          property: "Hotel Itzamná",
          description:
            "Imersão em medicina ancestral maia, yoga ao amanhecer e círculos de cacau guiados por facilitadores certificados.",
          price: "$ 3.460",
          commission: "Comissão 15%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
        {
          slug: "lideranca-consciente",
          image: "/images/retreat-singapore.jpg",
          tag: "Corporativo · 3 dias",
          location: "Singapura",
          dates: "9 — 12 jun",
          title: "Liderança Consciente",
          property: "Marina Bay Sanctuary",
          description:
            "Retiro executivo para equipes de liderança. Coaching somático, sessões estratégicas e espaços de integração vertical.",
          price: "$ 6.910",
          commission: "Comissão 10%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
        {
          slug: "raizes-ubud",
          image: "/images/retreat-bali.jpg",
          tag: "Masterclass · 5 dias",
          location: "Ubud · Bali",
          dates: "2 — 7 jul",
          title: "Raízes de Ubud",
          property: "Ananda Villa",
          description:
            "Imersão na floresta, masterclass de culinária plant-based e respiração com praticantes balineses.",
          price: "$ 4.580",
          commission: "Comissão 13%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
      ],
    },
  },
};
