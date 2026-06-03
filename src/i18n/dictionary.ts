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
    signingIn: string;
    errorInvalid: string;
    errorNetwork: string;
    joinPrompt: string;
    joinLink: string;
  };
  nav: {
    discover: string;
    bookings: string;
    clients: string;
    myRetreats: string;
    billing: string;
    inventory: string;
    agencyName: string;
    agencyMeta: string;
    signOut: string;
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
    popularDestinations: string;
    adultsLabel: string;
    childrenLabel: string;
    roomsLabel: string;
    experienceLabel: string;
    adultCount: (n: number) => string;
    roomCount: (n: number) => string;
  };
  map: {
    eyebrow: string;
    title: string;
    legendActive: string;
    legendUpcoming: string;
    fullscreen: string;
    back: string;
    experiencesSingular: string;
    experiencesPlural: (n: number) => string;
    countries: {
      usa: string;
      mexico: string;
      argentina: string;
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
    filters: { all: string; retreat: string; masterclass: string; meditation: string };
    seeAll: string;
    items: Retreat[];
  };
  dashboard: {
    createRetreatTitle: string;
    createRetreatDesc: string;
    createRetreatCta: string;
  };
  selectCountry: {
    title: string;
    heading: string;
    subtitle: string;
    retreatsTitle: string;
    retreatsDesc: string;
    hotelsTitle: string;
    hotelsDesc: string;
    explore: string;
  };
  exploreRetreats: {
    eyebrow: string;
    breadcrumb: string;
    title: string;
    subtitle: string;
    showing: (n: number) => string;
    sortBy: string;
    featured: string;
  };
  retreatDetail: {
    overview: string;
    program: string;
    included: string;
    aboutRetreat: string;
    duration: string;
    language: string;
    capacity: string;
    startingFrom: string;
    perGuest: string;
    commission: string;
    bookNow: string;
    selectDates: string;
    dayLabel: string;
    highlights: string;
  };
  selectDates: {
    title: string;
    subtitle: string;
    nightCount: (n: number) => string;
    selectedRange: string;
    continue: string;
    checkIn: string;
    checkOut: string;
  };
  selectAccommodation: {
    title: string;
    subtitle: string;
    preNights: string;
    postNights: string;
    guestsLabel: string;
    pricePerNight: string;
    selected: string;
    totalSummary: string;
    retreatPrice: string;
    accommodationPrice: string;
    totalPrice: string;
    continue: string;
  };
  assignClient: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    newClient: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    nationalityLabel: string;
    addClient: string;
    continue: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    orderSummary: string;
    retreat: string;
    client: string;
    dates: string;
    room: string;
    guests: string;
    subtotal: string;
    commissionLabel: string;
    total: string;
    paymentDetails: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardName: string;
    confirmPayment: string;
    processing: string;
  };
  confirmation: {
    title: string;
    subtitle: string;
    reservationId: string;
    commissionEarned: string;
    retreatLabel: string;
    clientLabel: string;
    datesLabel: string;
    roomLabel: string;
    totalPaid: string;
    viewBookings: string;
    backToDashboard: string;
    downloadVoucher: string;
  };
  exploreHotels: {
    breadcrumb: string;
    title: string;
    subtitle: string;
    showing: (n: number) => string;
  };
  hotelDetail: {
    overview: string;
    amenities: string;
    rooms: string;
    location: string;
    aboutHotel: string;
    createRetreatHere: string;
    priceFrom: string;
    perNight: string;
    rating: string;
    viewRooms: string;
    notFound: string;
    boutiqueHotel: string;
    info: string;
    capacity: string;
    personCount: (n: number) => string;
    bookNow: string;
    roomCount: (n: number) => string;
    activeRetreats: (n: number) => string;
    hotelSubtitle: string;
  };
  createRetreat: {
    title: string;
    steps: [string, string, string, string, string, string];
    step1: { title: string; subtitle: string; searchPlaceholder: string; addHotel: string };
    step2: {
      title: string;
      subtitle: string;
      name: string;
      type: string;
      duration: string;
      startDate: string;
      endDate: string;
      capacity: string;
      language: string;
      description: string;
      types: { retreat: string; masterclass: string; meditation: string };
    };
    step3: {
      title: string;
      subtitle: string;
      addDay: string;
      addActivity: string;
      time: string;
      activityName: string;
      description: string;
      removeDay: string;
    };
    step4: {
      title: string;
      subtitle: string;
      roomType: string;
      basePrice: string;
      retailPrice: string;
      commission: string;
      projectedRevenue: string;
      perGuest: string;
    };
    step5: {
      title: string;
      subtitle: string;
      dragDrop: string;
      setCover: string;
      remove: string;
      coverLabel: string;
    };
    step6: {
      title: string;
      subtitle: string;
      edit: string;
      publish: string;
      preview: string;
      section: { hotel: string; basicInfo: string; program: string; pricing: string; gallery: string };
    };
  };
  common: {
    back: string;
    next: string;
    save: string;
    cancel: string;
    close: string;
    loading: string;
    nights: (n: number) => string;
    guests: (n: number) => string;
    currency: (n: number) => string;
  };
  breadcrumb: {
    home: string;
    retreats: string;
    hotels: string;
    selectCountry: string;
    selectDates: string;
    selectAccommodation: string;
    assignClient: string;
    checkout: string;
    confirmation: string;
    createRetreat: string;
    inventory: string;
  };
  inventory: {
    eyebrow: string;
    title: string;
    subtitle: string;
    totalPlazas: string;
    soldPlazas: string;
    reservedPlazas: string;
    availablePlazas: string;
    all: string;
    active: string;
    soldOut: string;
    pending: string;
    resell: string;
    createRetreat: string;
    perNight: string;
    sold: string;
    reserved: string;
    available: string;
  };
};

const sharedPerGuest = {
  en: " / guest",
  es: " / huésped",
  pt: " / hóspede",
};

export const dictionary: Record<Locale, Dictionary> = {
  /* ───────────────────── ENGLISH ───────────────────── */
  en: {
    login: {
      langSupport: "Institutional support",
      eyebrow: "WELLNESS PLATFORM",
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
      signingIn: "Verifying access…",
      errorInvalid: "Invalid email or password.",
      errorNetwork: "We can't reach the network right now. Please try again.",
      joinPrompt: "Does your organization want to join?",
      joinLink: "Request membership",
    },
    nav: {
      discover: "Discover",
      bookings: "Bookings",
      clients: "My clients",
      myRetreats: "My Retreats",
      billing: "Billing",
      inventory: "Inventory",
      agencyName: "Viajes Éter",
      agencyMeta: "AGENCIA · ESPAÑA",
      signOut: "Sign out",
    },
    hero: {
      eyebrow: "Global network · 2026 Season",
      headline: ["Design your client's next", "transformative journey."],
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
      popularDestinations: "Popular destinations",
      adultsLabel: "Adults",
      childrenLabel: "Children",
      roomsLabel: "Rooms",
      experienceLabel: "Type of experience",
      adultCount: (n) => n === 1 ? "1 adult" : `${n} adults`,
      roomCount: (n) => n === 1 ? "1 room" : `${n} rooms`,
    },
    map: {
      eyebrow: "Coverage · 14 active cities",
      title: "Global network available",
      legendActive: "Active experiences",
      legendUpcoming: "Upcoming",
      fullscreen: "View full map",
      back: "Back",
      experiencesSingular: "1 experience",
      experiencesPlural: (n) => `${n} experiences`,
      countries: {
        usa: "United States",
        mexico: "Mexico",
        argentina: "Argentina",
        brazil: "Brazil",
        spain: "Spain",
        india: "India",
        indonesia: "Indonesia",
      },
    },
    retreats: {
      eyebrow: "Open calendar",
      title: "Upcoming wellness retreats",
      count: "8 certified experiences available this season across Mexico.",
      filters: { all: "All", retreat: "Retreat", masterclass: "Masterclass", meditation: "Meditation" },
      seeAll: "See full calendar →",
      items: [
        {
          slug: "arte-del-silencio",
          image: "/images/hoteles/the-house-of-aia.jpg",
          tag: "Retreat · 6 nights",
          location: "Riviera Maya · Mexico",
          dates: "Oct 4 — 10",
          title: "The Art of Silence",
          property: "The House of AïA",
          description:
            "Immersive silent retreat with mindfulness meditation, contemplative walks and guided breathwork at dawn.",
          price: "U$D 5,480",
          commission: "16% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
        {
          slug: "kundalini-awakening",
          image: "/images/hoteles/sanara-tulum.jpg",
          tag: "Retreat · 5 nights",
          location: "Tulum · Mexico",
          dates: "Nov 18 — 23",
          title: "Kundalini Awakening",
          property: "Sanara Tulum",
          description:
            "Daily Kundalini Yoga, energy activations, mantras and sound healing sessions facing the Caribbean Sea.",
          price: "U$D 4,960",
          commission: "18% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
        {
          slug: "reconexion-pacifico",
          image: "/images/hoteles/playa-viva.png",
          tag: "Retreat · 6 nights",
          location: "Guerrero · Mexico",
          dates: "Sep 15 — 21",
          title: "Pacific Reconnection",
          property: "Playa Viva",
          description:
            "Regenerative immersion on the Pacific coast with permaculture, sea turtle release and sunrise yoga.",
          price: "U$D 4,200",
          commission: "15% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
        {
          slug: "reset-nervous-system",
          image: "/images/hoteles/pepem-tulum.jpg",
          tag: "Retreat · 7 nights",
          location: "Tulum · Mexico",
          dates: "Jan 14 — 21",
          title: "Reset Nervous System",
          property: "Pepem Tulum",
          description:
            "Somatic breathwork, ice baths, deep meditation and rest therapies to regulate the nervous system.",
          price: "U$D 6,240",
          commission: "17% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
        {
          slug: "mindfulness-by-the-sea",
          image: "/images/hoteles/prana-del-mar.jpg",
          tag: "Retreat · 4 nights",
          location: "La Paz · Mexico",
          dates: "Sep 7 — 11",
          title: "Mindfulness by the Sea",
          property: "Prana del Mar",
          description:
            "Guided meditation facing the Sea of Cortez, gentle yoga and emotional regulation workshops.",
          price: "U$D 3,890",
          commission: "15% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
        {
          slug: "cacao-y-ceremonia",
          image: "/images/hoteles/kan-tulum.webp",
          tag: "Masterclass · 4 nights",
          location: "Tulum · Mexico",
          dates: "Dec 5 — 9",
          title: "Cacao & Ceremony",
          property: "Kan Tulum",
          description:
            "Immersion in ancestral Mayan medicine with cacao ceremonies, temazcal and sacred word circles.",
          price: "U$D 3,460",
          commission: "16% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
        {
          slug: "yoga-jungle-immersion",
          image: "/images/hoteles/xinalani.jpg",
          tag: "Retreat · 6 nights",
          location: "Jalisco · Mexico",
          dates: "Oct 20 — 26",
          title: "Yoga & Jungle Immersion",
          property: "Xinalani",
          description:
            "Yoga immersion in the Pacific jungle with daily practices, waterfall hikes and organic cuisine.",
          price: "U$D 4,580",
          commission: "16% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
        {
          slug: "surf-and-soul",
          image: "/images/hoteles/present-moment-retreat.jpg",
          tag: "Retreat · 5 nights",
          location: "Guerrero · Mexico",
          dates: "Nov 2 — 7",
          title: "Surf & Soul Reset",
          property: "Present Moment Retreat",
          description:
            "Surf, yoga and holistic wellness on the Pacific coast. Reconnect with your body through movement and ocean.",
          price: "U$D 3,750",
          commission: "15% commission",
          cta: "View availability →",
          fromLabel: "From",
          perGuest: sharedPerGuest.en,
        },
      ],
    },
    dashboard: {
      createRetreatTitle: "Design your own retreat at any hotel in the network",
      createRetreatDesc: "Create personalized experiences for your clients at +300 certified wellness hotels. Publish and manage your retreats from your agency panel.",
      createRetreatCta: "Create retreat",
    },
    selectCountry: {
      title: "Select your destination",
      heading: "Explore our destinations",
      subtitle: "Choose a country to explore available experiences",
      retreatsTitle: "Explore Retreats",
      retreatsDesc: "Purchase retreat spots and resell transformative experiences to your clients",
      hotelsTitle: "Book Spots",
      hotelsDesc: "Reserve rooms and create custom retreats to sell on the platform",
      explore: "Explore",
    },
    exploreRetreats: {
      eyebrow: "Available retreats",
      breadcrumb: "Retreats",
      title: "Explore Retreats",
      subtitle: "Curated wellness experiences across the globe",
      showing: (n) => `${n} retreats available`,
      sortBy: "Sort by",
      featured: "Featured",
    },
    retreatDetail: {
      overview: "Overview",
      program: "Program",
      included: "What's included",
      aboutRetreat: "About this retreat",
      duration: "Duration",
      language: "Language",
      capacity: "Max. capacity",
      startingFrom: "Starting from",
      perGuest: "per guest",
      commission: "Your commission",
      bookNow: "Book this retreat",
      selectDates: "Select dates",
      dayLabel: "Day",
      highlights: "Highlights",
    },
    selectDates: {
      title: "Select your dates",
      subtitle: "Choose check-in and check-out dates for your stay",
      nightCount: (n) => `${n} night${n !== 1 ? "s" : ""}`,
      selectedRange: "Selected range",
      continue: "Continue to accommodation",
      checkIn: "Check-in",
      checkOut: "Check-out",
    },
    selectAccommodation: {
      title: "Select accommodation",
      subtitle: "Choose your room type and additional nights",
      preNights: "Pre-retreat nights",
      postNights: "Post-retreat nights",
      guestsLabel: "Guests",
      pricePerNight: "per night",
      selected: "Selected",
      totalSummary: "Price summary",
      retreatPrice: "Retreat base price",
      accommodationPrice: "Additional nights",
      totalPrice: "Total",
      continue: "Continue to client",
    },
    assignClient: {
      title: "Assign a client",
      subtitle: "Select an existing client or create a new one",
      searchPlaceholder: "Search by name or email...",
      newClient: "New client",
      nameLabel: "Full name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      nationalityLabel: "Nationality",
      addClient: "Add client",
      continue: "Continue to checkout",
    },
    checkout: {
      title: "Checkout",
      subtitle: "Review your booking details and complete the reservation",
      orderSummary: "Order summary",
      retreat: "Retreat",
      client: "Client",
      dates: "Dates",
      room: "Room",
      guests: "Guests",
      subtotal: "Subtotal",
      commissionLabel: "Your commission (16%)",
      total: "Total to charge",
      paymentDetails: "Payment details",
      cardNumber: "Card number",
      expiryDate: "Expiry date",
      cvv: "CVV",
      cardName: "Name on card",
      confirmPayment: "Confirm & pay",
      processing: "Processing...",
    },
    confirmation: {
      title: "Booking confirmed!",
      subtitle: "The reservation has been successfully processed",
      reservationId: "Reservation ID",
      commissionEarned: "Commission earned",
      retreatLabel: "Retreat",
      clientLabel: "Client",
      datesLabel: "Dates",
      roomLabel: "Room",
      totalPaid: "Total paid",
      viewBookings: "View my bookings",
      backToDashboard: "Back to dashboard",
      downloadVoucher: "Download voucher",
    },
    exploreHotels: {
      breadcrumb: "Hotels",
      title: "Book Spots",
      subtitle: "Reserve rooms and create custom retreats to sell on the platform",
      showing: (n) => `${n} hotels available`,
    },
    hotelDetail: {
      overview: "Overview",
      amenities: "Amenities",
      rooms: "Rooms & Suites",
      location: "Location",
      aboutHotel: "About this property",
      createRetreatHere: "Create a retreat here",
      priceFrom: "From",
      perNight: "per night",
      rating: "Rating",
      viewRooms: "View rooms",
      notFound: "Hotel not found",
      boutiqueHotel: "Boutique Hotel",
      info: "Info",
      capacity: "Capacity",
      personCount: (n) => n === 1 ? "1 person" : `${n} people`,
      bookNow: "Book now",
      roomCount: (n) => n === 1 ? "1 room" : `${n} rooms`,
      activeRetreats: (n) => n === 1 ? "1 active retreat" : `${n} active retreats`,
      hotelSubtitle: "Holistic hotels assigned to your agency in this country.",
    },
    createRetreat: {
      title: "Create a new retreat",
      steps: ["Hotel", "Basic info", "Program", "Pricing", "Gallery", "Review"],
      step1: { title: "Select a hotel", subtitle: "Choose where your retreat will take place", searchPlaceholder: "Search hotels...", addHotel: "Add hotel not in network" },
      step2: {
        title: "Basic information",
        subtitle: "Define the core details of your retreat",
        name: "Retreat name",
        type: "Type",
        duration: "Duration (nights)",
        startDate: "Start date",
        endDate: "End date",
        capacity: "Max. capacity",
        language: "Language",
        description: "Description",
        types: { retreat: "Retreat", masterclass: "Masterclass", meditation: "Meditation" },
      },
      step3: {
        title: "Program",
        subtitle: "Design your day-by-day retreat program",
        addDay: "Add day",
        addActivity: "Add activity",
        time: "Time",
        activityName: "Activity name",
        description: "Description",
        removeDay: "Remove day",
      },
      step4: {
        title: "Pricing",
        subtitle: "Set prices for each room type and review your commission",
        roomType: "Room type",
        basePrice: "Base price",
        retailPrice: "Retail price",
        commission: "Commission",
        projectedRevenue: "Projected revenue",
        perGuest: "per guest",
      },
      step5: {
        title: "Gallery",
        subtitle: "Upload images for your retreat listing",
        dragDrop: "Drag & drop images here, or click to browse",
        setCover: "Set as cover",
        remove: "Remove",
        coverLabel: "Cover image",
      },
      step6: {
        title: "Review & publish",
        subtitle: "Review all details before publishing your retreat",
        edit: "Edit",
        publish: "Publish retreat",
        preview: "Preview listing",
        section: { hotel: "Hotel", basicInfo: "Basic information", program: "Program", pricing: "Pricing", gallery: "Gallery" },
      },
    },
    common: {
      back: "Back",
      next: "Next",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      loading: "Loading...",
      nights: (n) => `${n} night${n !== 1 ? "s" : ""}`,
      guests: (n) => `${n} guest${n !== 1 ? "s" : ""}`,
      currency: (n) => `$ ${n.toLocaleString()}`,
    },
    breadcrumb: {
      home: "Inicio",
      retreats: "Retreats",
      hotels: "Hotels",
      selectCountry: "Select country",
      selectDates: "Select dates",
      selectAccommodation: "Accommodation",
      assignClient: "Client",
      checkout: "Checkout",
      confirmation: "Confirmation",
      createRetreat: "Create retreat",
      inventory: "Inventory",
    },
    inventory: {
      eyebrow: "ROOM INVENTORY",
      title: "Your reserved rooms",
      subtitle: "Manage your reserved room inventory across the network. Resell rooms or create your own retreats.",
      totalPlazas: "Total rooms",
      soldPlazas: "Sold",
      reservedPlazas: "Reserved",
      availablePlazas: "Available",
      all: "All",
      active: "Active",
      soldOut: "Sold out",
      pending: "Pending",
      resell: "Resell room",
      createRetreat: "Create retreat",
      perNight: "/night",
      sold: "sold",
      reserved: "reserved",
      available: "available",
    },
  },

  /* ───────────────────── ESPAÑOL ───────────────────── */
  es: {
    login: {
      langSupport: "Soporte institucional",
      eyebrow: "PLATAFORMA WELLNESS",
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
      signingIn: "Verificando acceso…",
      errorInvalid: "Email o contraseña inválidos.",
      errorNetwork: "No podemos conectar con la red en este momento. Inténtalo de nuevo.",
      joinPrompt: "¿Tu organización desea integrarse?",
      joinLink: "Solicitar incorporación",
    },
    nav: {
      discover: "Descubrir",
      bookings: "Reservas",
      clients: "Mis clientes",
      myRetreats: "Mis Retiros",
      billing: "Facturación",
      inventory: "Inventario",
      agencyName: "Viajes Éter",
      agencyMeta: "AGENCIA · ESPAÑA",
      signOut: "Cerrar sesión",
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
      popularDestinations: "Destinos populares",
      adultsLabel: "Adultos",
      childrenLabel: "Niños",
      roomsLabel: "Habitaciones",
      experienceLabel: "Tipo de experiencia",
      adultCount: (n) => n === 1 ? "1 adulto" : `${n} adultos`,
      roomCount: (n) => n === 1 ? "1 hab." : `${n} hab.`,
    },
    map: {
      eyebrow: "Cobertura · 14 ciudades activas",
      title: "Red global disponible",
      legendActive: "Experiencias activas",
      legendUpcoming: "Próxima apertura",
      fullscreen: "Ver mapa completo",
      back: "Volver",
      experiencesSingular: "1 experiencia",
      experiencesPlural: (n) => `${n} experiencias`,
      countries: {
        usa: "Estados Unidos",
        mexico: "México",
        argentina: "Argentina",
        brazil: "Brasil",
        spain: "España",
        india: "India",
        indonesia: "Indonesia",
      },
    },
    retreats: {
      eyebrow: "Calendario abierto",
      title: "Próximos retiros wellness",
      count: "8 experiencias certificadas disponibles esta temporada en México.",
      filters: { all: "Todos", retreat: "Retiro", masterclass: "Masterclass", meditation: "Meditación" },
      seeAll: "Ver calendario completo →",
      items: [
        {
          slug: "arte-del-silencio",
          image: "/images/hoteles/the-house-of-aia.jpg",
          tag: "Retiro · 6 noches",
          location: "Riviera Maya · México",
          dates: "4 — 10 oct",
          title: "El Arte del Silencio",
          property: "The House of AïA",
          description:
            "Retiro inmersivo de silencio consciente con meditación mindfulness, caminatas contemplativas y respiración guiada al amanecer.",
          price: "U$D 5,480",
          commission: "Comisión 16%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
        {
          slug: "kundalini-awakening",
          image: "/images/hoteles/sanara-tulum.jpg",
          tag: "Retiro · 5 noches",
          location: "Tulum · México",
          dates: "18 — 23 nov",
          title: "Kundalini Awakening",
          property: "Sanara Tulum",
          description:
            "Prácticas diarias de Kundalini Yoga, activaciones energéticas, mantras y sesiones de sound healing frente al Caribe.",
          price: "U$D 4,960",
          commission: "Comisión 18%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
        {
          slug: "reconexion-pacifico",
          image: "/images/hoteles/playa-viva.png",
          tag: "Retiro · 6 noches",
          location: "Guerrero · México",
          dates: "15 — 21 sep",
          title: "Reconexión Pacífico",
          property: "Playa Viva",
          description:
            "Inmersión regenerativa en la costa del Pacífico con permacultura, liberación de tortugas y yoga al amanecer.",
          price: "U$D 4,200",
          commission: "Comisión 15%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
        {
          slug: "reset-nervous-system",
          image: "/images/hoteles/pepem-tulum.jpg",
          tag: "Retiro · 7 noches",
          location: "Tulum · México",
          dates: "14 — 21 ene",
          title: "Reset Nervous System",
          property: "Pepem Tulum",
          description:
            "Breathwork somático, baños de hielo, meditación profunda y terapias de descanso para regular el sistema nervioso.",
          price: "U$D 6,240",
          commission: "Comisión 17%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
        {
          slug: "mindfulness-by-the-sea",
          image: "/images/hoteles/prana-del-mar.jpg",
          tag: "Retiro · 4 noches",
          location: "La Paz · México",
          dates: "7 — 11 sep",
          title: "Mindfulness by the Sea",
          property: "Prana del Mar",
          description:
            "Meditación guiada frente al Mar de Cortés, yoga suave y talleres de regulación emocional y atención plena.",
          price: "U$D 3,890",
          commission: "Comisión 15%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
        {
          slug: "cacao-y-ceremonia",
          image: "/images/hoteles/kan-tulum.webp",
          tag: "Masterclass · 4 noches",
          location: "Tulum · México",
          dates: "5 — 9 dic",
          title: "Cacao y Ceremonia",
          property: "Kan Tulum",
          description:
            "Inmersión en medicina ancestral maya con ceremonias de cacao, temazcal y círculos de palabra sagrada.",
          price: "U$D 3,460",
          commission: "Comisión 16%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
        {
          slug: "yoga-jungle-immersion",
          image: "/images/hoteles/xinalani.jpg",
          tag: "Retiro · 6 noches",
          location: "Jalisco · México",
          dates: "20 — 26 oct",
          title: "Yoga & Jungle Immersion",
          property: "Xinalani",
          description:
            "Inmersión de yoga en la jungla del Pacífico con prácticas diarias, senderismo a cascadas y cocina orgánica.",
          price: "U$D 4,580",
          commission: "Comisión 16%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
        {
          slug: "surf-and-soul",
          image: "/images/hoteles/present-moment-retreat.jpg",
          tag: "Retiro · 5 noches",
          location: "Guerrero · México",
          dates: "2 — 7 nov",
          title: "Surf & Soul Reset",
          property: "Present Moment Retreat",
          description:
            "Surf, yoga y bienestar holístico en la costa del Pacífico. Reconexión con el cuerpo a través del movimiento y el océano.",
          price: "U$D 3,750",
          commission: "Comisión 15%",
          cta: "Ver disponibilidad →",
          fromLabel: "Desde",
          perGuest: sharedPerGuest.es,
        },
      ],
    },
    dashboard: {
      createRetreatTitle: "Diseña tu propio retiro en cualquier hotel de la red",
      createRetreatDesc: "Crea experiencias personalizadas para tus clientes en +300 hoteles wellness certificados. Publica y gestiona tus retiros desde tu panel de agencia.",
      createRetreatCta: "Crear retiro",
    },
    selectCountry: {
      title: "Selecciona tu destino",
      heading: "Explora nuestros destinos",
      subtitle: "Elige un país para explorar las experiencias disponibles",
      retreatsTitle: "Explorar Retiros",
      retreatsDesc: "Compra plazas de retiros y revendé experiencias transformadoras a tus clientes",
      hotelsTitle: "Reservar Plazas",
      hotelsDesc: "Reserva alojamientos y crea retiros personalizados para vender en la plataforma",
      explore: "Explorar",
    },
    exploreRetreats: {
      eyebrow: "Retiros disponibles",
      breadcrumb: "Retiros",
      title: "Explorar Retiros",
      subtitle: "Experiencias de bienestar curadas en todo el mundo",
      showing: (n) => `${n} retiros disponibles`,
      sortBy: "Ordenar por",
      featured: "Destacados",
    },
    retreatDetail: {
      overview: "Descripción",
      program: "Programa",
      included: "Incluye",
      aboutRetreat: "Sobre este retiro",
      duration: "Duración",
      language: "Idioma",
      capacity: "Capacidad máx.",
      startingFrom: "Desde",
      perGuest: "por huésped",
      commission: "Tu comisión",
      bookNow: "Reservar este retiro",
      selectDates: "Seleccionar fechas",
      dayLabel: "Día",
      highlights: "Destacados",
    },
    selectDates: {
      title: "Selecciona tus fechas",
      subtitle: "Elige las fechas de entrada y salida para tu estancia",
      nightCount: (n) => `${n} noche${n !== 1 ? "s" : ""}`,
      selectedRange: "Rango seleccionado",
      continue: "Continuar a alojamiento",
      checkIn: "Entrada",
      checkOut: "Salida",
    },
    selectAccommodation: {
      title: "Selecciona alojamiento",
      subtitle: "Elige tu tipo de habitación y noches adicionales",
      preNights: "Noches pre-retiro",
      postNights: "Noches post-retiro",
      guestsLabel: "Huéspedes",
      pricePerNight: "por noche",
      selected: "Seleccionado",
      totalSummary: "Resumen de precio",
      retreatPrice: "Precio base del retiro",
      accommodationPrice: "Noches adicionales",
      totalPrice: "Total",
      continue: "Continuar a cliente",
    },
    assignClient: {
      title: "Asignar un cliente",
      subtitle: "Selecciona un cliente existente o crea uno nuevo",
      searchPlaceholder: "Buscar por nombre o email...",
      newClient: "Nuevo cliente",
      nameLabel: "Nombre completo",
      emailLabel: "Email",
      phoneLabel: "Teléfono",
      nationalityLabel: "Nacionalidad",
      addClient: "Agregar cliente",
      continue: "Continuar a checkout",
    },
    checkout: {
      title: "Checkout",
      subtitle: "Revisa los detalles de tu reserva y completa la transacción",
      orderSummary: "Resumen del pedido",
      retreat: "Retiro",
      client: "Cliente",
      dates: "Fechas",
      room: "Habitación",
      guests: "Huéspedes",
      subtotal: "Subtotal",
      commissionLabel: "Tu comisión (16%)",
      total: "Total a cobrar",
      paymentDetails: "Datos de pago",
      cardNumber: "Número de tarjeta",
      expiryDate: "Fecha de vencimiento",
      cvv: "CVV",
      cardName: "Nombre en la tarjeta",
      confirmPayment: "Confirmar y pagar",
      processing: "Procesando...",
    },
    confirmation: {
      title: "¡Reserva confirmada!",
      subtitle: "La reservación ha sido procesada exitosamente",
      reservationId: "ID de reservación",
      commissionEarned: "Comisión ganada",
      retreatLabel: "Retiro",
      clientLabel: "Cliente",
      datesLabel: "Fechas",
      roomLabel: "Habitación",
      totalPaid: "Total pagado",
      viewBookings: "Ver mis reservas",
      backToDashboard: "Volver al dashboard",
      downloadVoucher: "Descargar voucher",
    },
    exploreHotels: {
      breadcrumb: "Hoteles",
      title: "Reservar Plazas",
      subtitle: "Reserva alojamientos y crea retiros personalizados para vender en la plataforma",
      showing: (n) => `${n} hoteles disponibles`,
    },
    hotelDetail: {
      overview: "Descripción",
      amenities: "Incluye",
      rooms: "Hospedajes",
      location: "Ubicación",
      aboutHotel: "Sobre esta propiedad",
      createRetreatHere: "Crear un retiro aquí",
      priceFrom: "Desde",
      perNight: "por noche",
      rating: "Calificación",
      viewRooms: "Ver habitación",
      notFound: "Hotel no encontrado",
      boutiqueHotel: "Hotel Boutique",
      info: "Info",
      capacity: "Capacidad",
      personCount: (n) => n === 1 ? "1 persona" : `${n} personas`,
      bookNow: "Reservar ahora",
      roomCount: (n) => n === 1 ? "1 hospedaje" : `${n} hospedajes`,
      activeRetreats: (n) => n === 1 ? "1 retiro activo" : `${n} retiros activos`,
      hotelSubtitle: "Hoteles holísticos asignados a tu agencia en este país.",
    },
    createRetreat: {
      title: "Crear un nuevo retiro",
      steps: ["Hotel", "Info básica", "Programa", "Precios", "Galería", "Revisión"],
      step1: { title: "Selecciona un hotel", subtitle: "Elige dónde se realizará tu retiro", searchPlaceholder: "Buscar hoteles...", addHotel: "Agregar hotel fuera de la red" },
      step2: {
        title: "Información básica",
        subtitle: "Define los detalles principales de tu retiro",
        name: "Nombre del retiro",
        type: "Tipo",
        duration: "Duración (noches)",
        startDate: "Fecha de inicio",
        endDate: "Fecha de fin",
        capacity: "Capacidad máxima",
        language: "Idioma",
        description: "Descripción",
        types: { retreat: "Retiro", masterclass: "Masterclass", meditation: "Meditación" },
      },
      step3: {
        title: "Programa",
        subtitle: "Diseña el programa día a día de tu retiro",
        addDay: "Agregar día",
        addActivity: "Agregar actividad",
        time: "Hora",
        activityName: "Nombre de actividad",
        description: "Descripción",
        removeDay: "Eliminar día",
      },
      step4: {
        title: "Precios",
        subtitle: "Define precios por tipo de habitación y revisa tu comisión",
        roomType: "Tipo de habitación",
        basePrice: "Precio base",
        retailPrice: "Precio venta",
        commission: "Comisión",
        projectedRevenue: "Ingreso proyectado",
        perGuest: "por huésped",
      },
      step5: {
        title: "Galería",
        subtitle: "Sube imágenes para tu listado de retiro",
        dragDrop: "Arrastra imágenes aquí, o haz clic para explorar",
        setCover: "Establecer como portada",
        remove: "Eliminar",
        coverLabel: "Imagen de portada",
      },
      step6: {
        title: "Revisar y publicar",
        subtitle: "Revisa todos los detalles antes de publicar tu retiro",
        edit: "Editar",
        publish: "Publicar retiro",
        preview: "Vista previa",
        section: { hotel: "Hotel", basicInfo: "Información básica", program: "Programa", pricing: "Precios", gallery: "Galería" },
      },
    },
    common: {
      back: "Volver",
      next: "Siguiente",
      save: "Guardar",
      cancel: "Cancelar",
      close: "Cerrar",
      loading: "Cargando...",
      nights: (n) => `${n} noche${n !== 1 ? "s" : ""}`,
      guests: (n) => `${n} huésped${n !== 1 ? "es" : ""}`,
      currency: (n) => `$ ${n.toLocaleString()}`,
    },
    breadcrumb: {
      home: "Inicio",
      retreats: "Retiros",
      hotels: "Hoteles",
      selectCountry: "Seleccionar país",
      selectDates: "Seleccionar fechas",
      selectAccommodation: "Alojamiento",
      assignClient: "Cliente",
      checkout: "Checkout",
      confirmation: "Confirmación",
      createRetreat: "Crear retiro",
      inventory: "Inventario",
    },
    inventory: {
      eyebrow: "INVENTARIO DE PLAZAS",
      title: "Tus plazas reservadas",
      subtitle: "Gestiona tu inventario de habitaciones reservadas en hoteles de la red. Revende plazas o crea retiros propios.",
      totalPlazas: "Total plazas",
      soldPlazas: "Vendidas",
      reservedPlazas: "Reservadas",
      availablePlazas: "Disponibles",
      all: "Todos",
      active: "Activos",
      soldOut: "Agotados",
      pending: "Pendientes",
      resell: "Revender plaza",
      createRetreat: "Crear retiro",
      perNight: "/noche",
      sold: "vendidas",
      reserved: "reservadas",
      available: "disponibles",
    },
  },

  /* ───────────────────── PORTUGUÊS ───────────────────── */
  pt: {
    login: {
      langSupport: "Suporte institucional",
      eyebrow: "PLATAFORMA WELLNESS",

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
      signingIn: "Verificando acesso…",
      errorInvalid: "Email ou senha inválidos.",
      errorNetwork: "Não conseguimos conectar à rede no momento. Tente novamente.",
      joinPrompt: "Sua organização deseja integrar-se?",
      joinLink: "Solicitar incorporação",
    },
    nav: {
      discover: "Descobrir",
      bookings: "Reservas",
      clients: "Meus clientes",
      myRetreats: "Meus Retiros",
      billing: "Faturação",
      inventory: "Inventário",
      agencyName: "Viajes Éter",
      agencyMeta: "AGENCIA · ESPAÑA",
      signOut: "Sair",
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
      popularDestinations: "Destinos populares",
      adultsLabel: "Adultos",
      childrenLabel: "Crianças",
      roomsLabel: "Quartos",
      experienceLabel: "Tipo de experiência",
      adultCount: (n) => n === 1 ? "1 adulto" : `${n} adultos`,
      roomCount: (n) => n === 1 ? "1 quarto" : `${n} quartos`,
    },
    map: {
      eyebrow: "Cobertura · 14 cidades ativas",
      title: "Rede global disponível",
      legendActive: "Experiências ativas",
      legendUpcoming: "Próxima abertura",
      fullscreen: "Ver mapa completo",
      back: "Voltar",
      experiencesSingular: "1 experiência",
      experiencesPlural: (n) => `${n} experiências`,
      countries: {
        usa: "Estados Unidos",
        mexico: "México",
        argentina: "Argentina",
        brazil: "Brasil",
        spain: "Espanha",
        india: "Índia",
        indonesia: "Indonésia",
      },
    },
    retreats: {
      eyebrow: "Calendário aberto",
      title: "Próximos retiros wellness",
      count: "8 experiências certificadas disponíveis nesta temporada no México.",
      filters: { all: "Todos", retreat: "Retiro", masterclass: "Masterclass", meditation: "Meditación" },
      seeAll: "Ver calendário completo →",
      items: [
        {
          slug: "arte-del-silencio",
          image: "/images/hoteles/the-house-of-aia.jpg",
          tag: "Retiro · 6 noites",
          location: "Riviera Maya · México",
          dates: "4 — 10 out",
          title: "A Arte do Silêncio",
          property: "The House of AïA",
          description:
            "Retiro imersivo de silêncio consciente com meditação mindfulness, caminhadas contemplativas e respiração guiada ao amanhecer.",
          price: "U$D 5.480",
          commission: "Comissão 16%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
        {
          slug: "kundalini-awakening",
          image: "/images/hoteles/sanara-tulum.jpg",
          tag: "Retiro · 5 noites",
          location: "Tulum · México",
          dates: "18 — 23 nov",
          title: "Kundalini Awakening",
          property: "Sanara Tulum",
          description:
            "Práticas diárias de Kundalini Yoga, ativações energéticas, mantras e sessões de sound healing frente ao Caribe.",
          price: "U$D 4.960",
          commission: "Comissão 18%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
        {
          slug: "reconexion-pacifico",
          image: "/images/hoteles/playa-viva.png",
          tag: "Retiro · 6 noites",
          location: "Guerrero · México",
          dates: "15 — 21 set",
          title: "Reconexão Pacífico",
          property: "Playa Viva",
          description:
            "Imersão regenerativa na costa do Pacífico com permacultura, soltura de tartarugas e yoga ao amanhecer.",
          price: "U$D 4.200",
          commission: "Comissão 15%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
        {
          slug: "reset-nervous-system",
          image: "/images/hoteles/pepem-tulum.jpg",
          tag: "Retiro · 7 noites",
          location: "Tulum · México",
          dates: "14 — 21 jan",
          title: "Reset Nervous System",
          property: "Pepem Tulum",
          description:
            "Breathwork somático, banhos de gelo, meditação profunda e terapias de descanso para regular o sistema nervoso.",
          price: "U$D 6.240",
          commission: "Comissão 17%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
        {
          slug: "mindfulness-by-the-sea",
          image: "/images/hoteles/prana-del-mar.jpg",
          tag: "Retiro · 4 noites",
          location: "La Paz · México",
          dates: "7 — 11 set",
          title: "Mindfulness by the Sea",
          property: "Prana del Mar",
          description:
            "Meditação guiada frente ao Mar de Cortez, yoga suave e workshops de regulação emocional e atenção plena.",
          price: "U$D 3.890",
          commission: "Comissão 15%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
        {
          slug: "cacao-y-ceremonia",
          image: "/images/hoteles/kan-tulum.webp",
          tag: "Masterclass · 4 noites",
          location: "Tulum · México",
          dates: "5 — 9 dez",
          title: "Cacau e Cerimônia",
          property: "Kan Tulum",
          description:
            "Imersão em medicina ancestral maia com cerimônias de cacau, temazcal e círculos de palavra sagrada.",
          price: "U$D 3.460",
          commission: "Comissão 16%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
        {
          slug: "yoga-jungle-immersion",
          image: "/images/hoteles/xinalani.jpg",
          tag: "Retiro · 6 noites",
          location: "Jalisco · México",
          dates: "20 — 26 out",
          title: "Yoga & Jungle Immersion",
          property: "Xinalani",
          description:
            "Imersão de yoga na selva do Pacífico com práticas diárias, trilhas a cachoeiras e cozinha orgânica.",
          price: "U$D 4.580",
          commission: "Comissão 16%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
        {
          slug: "surf-and-soul",
          image: "/images/hoteles/present-moment-retreat.jpg",
          tag: "Retiro · 5 noites",
          location: "Guerrero · México",
          dates: "2 — 7 nov",
          title: "Surf & Soul Reset",
          property: "Present Moment Retreat",
          description:
            "Surf, yoga e bem-estar holístico na costa do Pacífico. Reconexão com o corpo através do movimento e do oceano.",
          price: "U$D 3.750",
          commission: "Comissão 15%",
          cta: "Ver disponibilidade →",
          fromLabel: "A partir de",
          perGuest: sharedPerGuest.pt,
        },
      ],
    },
    dashboard: {
      createRetreatTitle: "Projete seu próprio retiro em qualquer hotel da rede",
      createRetreatDesc: "Crie experiências personalizadas para seus clientes em +300 hotéis wellness certificados. Publique e gerencie seus retiros a partir do seu painel de agência.",
      createRetreatCta: "Criar retiro",
    },
    selectCountry: {
      title: "Selecione seu destino",
      heading: "Explore nossos destinos",
      subtitle: "Escolha um país para explorar as experiências disponíveis",
      retreatsTitle: "Explorar Retiros",
      retreatsDesc: "Compre vagas de retiros e revenda experiências transformadoras aos seus clientes",
      hotelsTitle: "Reservar Vagas",
      hotelsDesc: "Reserve acomodações e crie retiros personalizados para vender na plataforma",
      explore: "Explorar",
    },
    exploreRetreats: {
      eyebrow: "Retiros disponíveis",
      breadcrumb: "Retiros",
      title: "Explorar Retiros",
      subtitle: "Experiências de bem-estar curadas ao redor do mundo",
      showing: (n) => `${n} retiros disponíveis`,
      sortBy: "Ordenar por",
      featured: "Destaques",
    },
    retreatDetail: {
      overview: "Visão geral",
      program: "Programa",
      included: "O que inclui",
      aboutRetreat: "Sobre este retiro",
      duration: "Duração",
      language: "Idioma",
      capacity: "Capacidade máx.",
      startingFrom: "A partir de",
      perGuest: "por hóspede",
      commission: "Sua comissão",
      bookNow: "Reservar este retiro",
      selectDates: "Selecionar datas",
      dayLabel: "Dia",
      highlights: "Destaques",
    },
    selectDates: {
      title: "Selecione suas datas",
      subtitle: "Escolha as datas de check-in e check-out para sua estadia",
      nightCount: (n) => `${n} noite${n !== 1 ? "s" : ""}`,
      selectedRange: "Período selecionado",
      continue: "Continuar para acomodação",
      checkIn: "Check-in",
      checkOut: "Check-out",
    },
    selectAccommodation: {
      title: "Selecione acomodação",
      subtitle: "Escolha seu tipo de quarto e noites adicionais",
      preNights: "Noites pré-retiro",
      postNights: "Noites pós-retiro",
      guestsLabel: "Hóspedes",
      pricePerNight: "por noite",
      selected: "Selecionado",
      totalSummary: "Resumo do preço",
      retreatPrice: "Preço base do retiro",
      accommodationPrice: "Noites adicionais",
      totalPrice: "Total",
      continue: "Continuar para cliente",
    },
    assignClient: {
      title: "Atribuir um cliente",
      subtitle: "Selecione um cliente existente ou crie um novo",
      searchPlaceholder: "Buscar por nome ou email...",
      newClient: "Novo cliente",
      nameLabel: "Nome completo",
      emailLabel: "Email",
      phoneLabel: "Telefone",
      nationalityLabel: "Nacionalidade",
      addClient: "Adicionar cliente",
      continue: "Continuar para checkout",
    },
    checkout: {
      title: "Checkout",
      subtitle: "Revise os detalhes da sua reserva e complete a transação",
      orderSummary: "Resumo do pedido",
      retreat: "Retiro",
      client: "Cliente",
      dates: "Datas",
      room: "Quarto",
      guests: "Hóspedes",
      subtotal: "Subtotal",
      commissionLabel: "Sua comissão (16%)",
      total: "Total a cobrar",
      paymentDetails: "Dados de pagamento",
      cardNumber: "Número do cartão",
      expiryDate: "Data de validade",
      cvv: "CVV",
      cardName: "Nome no cartão",
      confirmPayment: "Confirmar e pagar",
      processing: "Processando...",
    },
    confirmation: {
      title: "Reserva confirmada!",
      subtitle: "A reserva foi processada com sucesso",
      reservationId: "ID da reserva",
      commissionEarned: "Comissão ganha",
      retreatLabel: "Retiro",
      clientLabel: "Cliente",
      datesLabel: "Datas",
      roomLabel: "Quarto",
      totalPaid: "Total pago",
      viewBookings: "Ver minhas reservas",
      backToDashboard: "Voltar ao dashboard",
      downloadVoucher: "Baixar voucher",
    },
    exploreHotels: {
      breadcrumb: "Hotéis",
      title: "Reservar Vagas",
      subtitle: "Reserve acomodações e crie retiros personalizados para vender na plataforma",
      showing: (n) => `${n} hotéis disponíveis`,
    },
    hotelDetail: {
      overview: "Visão geral",
      amenities: "Comodidades",
      rooms: "Hospedagens",
      location: "Localização",
      aboutHotel: "Sobre esta propriedade",
      createRetreatHere: "Criar um retiro aqui",
      priceFrom: "A partir de",
      perNight: "por noite",
      rating: "Avaliação",
      viewRooms: "Ver quarto",
      notFound: "Hotel não encontrado",
      boutiqueHotel: "Hotel Boutique",
      info: "Info",
      capacity: "Capacidade",
      personCount: (n) => n === 1 ? "1 pessoa" : `${n} pessoas`,
      bookNow: "Reservar agora",
      roomCount: (n) => n === 1 ? "1 hospedagem" : `${n} hospedagens`,
      activeRetreats: (n) => n === 1 ? "1 retiro ativo" : `${n} retiros ativos`,
      hotelSubtitle: "Hotéis holísticos atribuídos à sua agência neste país.",
    },
    createRetreat: {
      title: "Criar um novo retiro",
      steps: ["Hotel", "Info básica", "Programa", "Preços", "Galeria", "Revisão"],
      step1: { title: "Selecione um hotel", subtitle: "Escolha onde seu retiro será realizado", searchPlaceholder: "Buscar hotéis...", addHotel: "Adicionar hotel fora da rede" },
      step2: {
        title: "Informações básicas",
        subtitle: "Defina os detalhes principais do seu retiro",
        name: "Nome do retiro",
        type: "Tipo",
        duration: "Duração (noites)",
        startDate: "Data de início",
        endDate: "Data de fim",
        capacity: "Capacidade máxima",
        language: "Idioma",
        description: "Descrição",
        types: { retreat: "Retiro", masterclass: "Masterclass", meditation: "Meditación" },
      },
      step3: {
        title: "Programa",
        subtitle: "Desenhe o programa dia a dia do seu retiro",
        addDay: "Adicionar dia",
        addActivity: "Adicionar atividade",
        time: "Horário",
        activityName: "Nome da atividade",
        description: "Descrição",
        removeDay: "Remover dia",
      },
      step4: {
        title: "Preços",
        subtitle: "Defina preços por tipo de quarto e revise sua comissão",
        roomType: "Tipo de quarto",
        basePrice: "Preço base",
        retailPrice: "Preço de venda",
        commission: "Comissão",
        projectedRevenue: "Receita projetada",
        perGuest: "por hóspede",
      },
      step5: {
        title: "Galeria",
        subtitle: "Envie imagens para seu anúncio de retiro",
        dragDrop: "Arraste imagens aqui, ou clique para explorar",
        setCover: "Definir como capa",
        remove: "Remover",
        coverLabel: "Imagem de capa",
      },
      step6: {
        title: "Revisar e publicar",
        subtitle: "Revise todos os detalhes antes de publicar seu retiro",
        edit: "Editar",
        publish: "Publicar retiro",
        preview: "Visualizar",
        section: { hotel: "Hotel", basicInfo: "Informações básicas", program: "Programa", pricing: "Preços", gallery: "Galeria" },
      },
    },
    common: {
      back: "Voltar",
      next: "Próximo",
      save: "Salvar",
      cancel: "Cancelar",
      close: "Fechar",
      loading: "Carregando...",
      nights: (n) => `${n} noite${n !== 1 ? "s" : ""}`,
      guests: (n) => `${n} hóspede${n !== 1 ? "s" : ""}`,
      currency: (n) => `$ ${n.toLocaleString()}`,
    },
    breadcrumb: {
      home: "Inicio",
      retreats: "Retiros",
      hotels: "Hotéis",
      selectCountry: "Selecionar país",
      selectDates: "Selecionar datas",
      selectAccommodation: "Acomodação",
      assignClient: "Cliente",
      checkout: "Checkout",
      confirmation: "Confirmação",
      createRetreat: "Criar retiro",
      inventory: "Inventário",
    },
    inventory: {
      eyebrow: "INVENTÁRIO DE VAGAS",
      title: "Suas vagas reservadas",
      subtitle: "Gerencie seu inventário de quartos reservados nos hotéis da rede. Revenda vagas ou crie seus próprios retiros.",
      totalPlazas: "Total vagas",
      soldPlazas: "Vendidas",
      reservedPlazas: "Reservadas",
      availablePlazas: "Disponíveis",
      all: "Todos",
      active: "Ativos",
      soldOut: "Esgotados",
      pending: "Pendentes",
      resell: "Revender vaga",
      createRetreat: "Criar retiro",
      perNight: "/noite",
      sold: "vendidas",
      reserved: "reservadas",
      available: "disponíveis",
    },
  },
};
