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
    myRetreats: string;
    billing: string;
    inventory: string;
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
  admin: {
    badge: string;
    nav: { overview: string; network: string; subscriptions: string; settings: string };
    dashboard: {
      eyebrow: string;
      title: string;
      subtitle: string;
      kpi: {
        agencies: string; hotels: string; bookings: string; gmv: string; offices: string;
        agenciesTooltip: string; hotelsTooltip: string; bookingsTooltip: string; gmvTooltip: string;
        agenciesSub: string; hotelsSub: string; bookingsSub: string; gmvSub: string;
      };
      quickActions: string;
      last30: string;
      exportReport: string;
      inviteAgency: string;
      inviteAgencyDesc: string;
      inviteHotel: string;
      inviteHotelDesc: string;
      createOffice: string;
      createOfficeDesc: string;
      pendingInvitations: string;
      pendingInvitationsTooltip: string;
      awaitingAcceptance: string;
      sendNewInvite: string;
      approvalQueue: string;
      approvalQueueTooltip: string;
      offices: string;
      noPending: string;
      noApprovals: string;
      orgsUnderReview: string;
      waiting: string;
      pendingReview: string;
      officesEyebrow: string;
      officesTitle: string;
      officesSubtitle: string;
      noOffices: string;
    };
    network: {
      title: string;
      createUser: string;
      tabs: { all: string; active: string; pending: string; suspended: string };
      subtitle: string;
      table: { user: string; email: string; type: string; organization: string; status: string; invitedBy: string; registered: string; lastLogin: string; actions: string };
      review: string;
      approve: string;
      reject: string;
      view: string;
      preview: string;
      suspend: string;
      reactivate: string;
      sendFeedback: string;
      deleteUser: string;
      deleteTitle: string;
      deleteWarning: string;
      deleteConfirmHint: (email: string) => string;
      deleteConfirmPlaceholder: string;
      deleteConfirm: string;
      deleting: string;
      showing: string;
      showingOf: string;
      noResults: string;
      searchPlaceholder: string;
      kindFilter: string;
      kindAll: string;
      filter: string;
      never: string;
    };
    invite: {
      title: string;
      subtitle: string;
      eyebrow: string;
      selectRole: string;
      email: string;
      emailPlaceholder: string;
      emailHint: string;
      country: string;
      office: string;
      officeHint: string;
      send: string;
      sending: string;
      success: string;
      roles: { agency: string; hotel: string; office: string };
      preview: string;
      previewRole: string;
      previewEmail: string;
      previewCountry: string;
      previewOffice: string;
      previewExpires: string;
      previewApproval: string;
      previewExpiresValue: string;
      previewApprovalValue: string;
      breadcrumb: string;
    };
    reviewDrawer: {
      title: string;
      pendingReview: string;
      details: string;
      joined: string;
      lastLogin: string;
      organization: string;
      phone: string;
      role: string;
      office: string;
      createdBy: string;
      submitted: string;
      adminNotes: string;
      notesPlaceholder: string;
      approve: string;
      reject: string;
      suspend: string;
      reactivate: string;
    };
    approve: { title: string; message: string; confirm: string; notification: string };
    reject: { title: string; reason: string; reasonPlaceholder: string; confirm: string; notification: string };
    subscriptions: {
      eyebrow: string; title: string; subtitle: string; plans: string;
      noPlans: string; noSubs: string; perMonth: string;
      commissionRate: string; activeMembers: string;
      editPlan: string; subscribers: string;
      stripeConnect: string; paymentOnboarding: string;
      member: string; type: string; plan: string;
      stripeStatus: string; action: string;
      starter: { name: string; desc: string };
      professional: { name: string; desc: string };
      enterprise: { name: string; desc: string };
      [key: string]: unknown;
    };
    settings: {
      eyebrow: string; title: string; subtitle: string; identity: string;
      platformName: string; supportEmail: string;
      commissions: string; agencyRate: string; officeFee: string;
      hotelNet: string; editRates: string;
      agencyHint: string; officeHint: string; hotelHint: string;
      currency: string; language: string;
      countriesTitle: string; addCountry: string; noCountries: string;
      flag: string; country: string; code: string;
      hotels: string; retreats: string;
      status: string; enabled: string;
      activeStatus: string; inactiveStatus: string;
    };
  };
  comingSoon: {
    eyebrow: string;
    title: string;
    subtitle: (role: string) => string;
    status: string;
    contact: string;
  };
  acceptInvite: {
    eyebrow: string;
    title: string;
    subtitle: string;
    name: string;
    namePlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    submit: string;
    submitting: string;
    expired: string;
    alreadyAccepted: string;
    invalidToken: string;
  };
  welcome: {
    title: (name: string) => string;
    subtitle: string;
    redirecting: string;
  };
  onboarding: {
    agency: { title: string; subtitle: string; description: string; country: string; city: string; phone: string; website: string; submit: string; skip: string };
    office: { title: string; subtitle: string; region: string; timezone: string; phone: string; submit: string; skip: string };
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
    admin: {
      badge: "ADMIN",
      nav: { overview: "Overview", network: "Network", subscriptions: "Subscriptions", settings: "Settings" },
      dashboard: {
        eyebrow: "PLATFORM OVERVIEW",
        title: "Platform Overview",
        subtitle: "Monitor your network performance and manage operations.",
        kpi: {
          agencies: "Active Agencies", hotels: "Listed Hotels", bookings: "Bookings", gmv: "Operations Volume", offices: "Offices",
          agenciesTooltip: "Total travel agencies registered and verified on the platform.",
          hotelsTooltip: "Wellness hotels currently listed in the HUMANA network.",
          bookingsTooltip: "Total confirmed reservations processed during the selected period.",
          gmvTooltip: "Gross Merchandise Value — total transaction volume across the network.",
          agenciesSub: "verified partners",
          hotelsSub: "in the network",
          bookingsSub: "in selected period",
          gmvSub: "total volume",
        },
        quickActions: "Quick Actions",
        last30: "Last 30 days",
        exportReport: "Export Report",
        inviteAgency: "Invite Agency",
        inviteAgencyDesc: "Send an invitation to onboard a new travel agency partner.",
        inviteHotel: "Invite Hotel",
        inviteHotelDesc: "Invite a wellness hotel to join the HUMANA network.",
        createOffice: "Create Office",
        createOfficeDesc: "Set up a new regional office to coordinate local operations.",
        pendingInvitations: "Pending Invitations",
        pendingInvitationsTooltip: "Invitations sent to agencies, hotels and offices that haven't been accepted yet.",
        awaitingAcceptance: "Awaiting acceptance",
        sendNewInvite: "Send new invite",
        approvalQueue: "Approval Queue",
        approvalQueueTooltip: "Agencies, hotels and offices pending admin approval. Review and manage them from the Network.",
        offices: "Regional Offices",
        noPending: "No pending invitations",
        noApprovals: "No organizations pending approval",
        orgsUnderReview: "Organizations under review",
        waiting: "waiting",
        pendingReview: "pending review",
        officesEyebrow: "Operational footprint",
        officesTitle: "HUMANA offices",
        officesSubtitle: "Regional hubs coordinating onboarding, standards and local partnerships.",
        noOffices: "No offices created yet.",
      },
      network: {
        title: "Network Members",
        subtitle: "Manage all platform users across hotels, agencies, and offices.",
        createUser: "+ CREATE USER",
        tabs: { all: "All", active: "Active", pending: "Pending", suspended: "Suspended" },
        table: { user: "User", email: "Email", type: "Type", organization: "Organization", status: "Status", invitedBy: "Invited by", registered: "Registered", lastLogin: "Last Login", actions: "Actions" },
        review: "Review",
        approve: "Approve",
        reject: "Reject",
        view: "View",
        preview: "Preview",
        suspend: "Suspend",
        reactivate: "Reactivate",
        sendFeedback: "Send Feedback",
        deleteUser: "Delete User",
        deleteTitle: "Delete user permanently",
        deleteWarning: "This action cannot be undone. All data associated with this user will be permanently deleted and they will no longer be able to access the platform.",
        deleteConfirmHint: (email: string) => `To confirm, type "${email}" below:`,
        deleteConfirmPlaceholder: "Type the email to confirm",
        deleteConfirm: "Delete permanently",
        deleting: "Deleting...",
        showing: "Showing",
        showingOf: "members",
        noResults: "No users found matching your criteria.",
        searchPlaceholder: "Search members...",
        kindFilter: "Type",
        kindAll: "All",
        filter: "Filter",
        never: "Never",
      },
      invite: {
        title: "Invite a new member to the network.",
        subtitle: "Fill in the details below. A link will be sent to activate the account.",
        eyebrow: "NEW MEMBER",
        selectRole: "ROLE",
        email: "EMAIL ADDRESS",
        emailPlaceholder: "marina@viajesglobal.com",
        emailHint: "A link will be sent to this address.",
        country: "COUNTRY",
        office: "ASSIGNED OFFICE",
        officeHint: "Auto-assigned based on country. Can be changed.",
        send: "SEND INVITE",
        sending: "Sending...",
        success: "Invitation sent successfully!",
        roles: { agency: "Agency", hotel: "Hotel", office: "Office" },
        preview: "INVITE PREVIEW",
        previewRole: "Role",
        previewEmail: "Email",
        previewCountry: "Country",
        previewOffice: "Office",
        previewExpires: "Link expires",
        previewApproval: "Approval",
        previewExpiresValue: "7 days",
        previewApprovalValue: "Not required",
        breadcrumb: "Create new member",
      },
      reviewDrawer: {
        title: "User Review",
        pendingReview: "Pending Review",
        details: "Details",
        joined: "Joined",
        lastLogin: "Last login",
        organization: "Organization",
        phone: "Phone",
        role: "Role",
        office: "Office",
        createdBy: "Created By",
        submitted: "Submitted",
        adminNotes: "Admin Notes",
        notesPlaceholder: "Add optional notes about this user...",
        approve: "Approve User",
        reject: "Reject",
        suspend: "Suspend",
        reactivate: "Reactivate",
      },
      approve: { title: "Approve User", message: "Are you sure you want to approve this user? They will receive an email notification and gain full access to the platform.", confirm: "Confirm Approval", notification: "The Office lead who created this request will also be notified of the approval." },
      reject: { title: "Reject User", reason: "Reason for rejection", reasonPlaceholder: "Explain why this user is being rejected. This will be sent to the Office lead who created the request...", confirm: "Confirm Rejection", notification: "The Office lead will receive an email notification with this reason." },
      subscriptions: {
        eyebrow: "SUBSCRIPTIONS",
        title: "Membership plans",
        subtitle: "Manage subscription tiers and Stripe Connect onboarding for network members.",
        plans: "Plans",
        noPlans: "No subscription plans configured yet.",
        noSubs: "No payment onboarding records yet.",
        perMonth: "/month",
        commissionRate: "commission rate",
        activeMembers: "active members",
        editPlan: "Edit Plan",
        subscribers: "subscribers",
        stripeConnect: "STRIPE CONNECT",
        paymentOnboarding: "Payment onboarding status",
        member: "Member",
        type: "Type",
        plan: "Plan",
        stripeStatus: "Stripe Status",
        action: "Action",
        starter: { name: "Starter", desc: "For agencies getting started with HUMANA." },
        professional: { name: "Professional", desc: "For growing agencies with regular bookings." },
        enterprise: { name: "Enterprise", desc: "For established agencies and hotel groups." },
      },
      settings: {
        eyebrow: "SETTINGS",
        title: "Settings",
        subtitle: "Platform configuration, commission rates, and country management.",
        identity: "Platform identity",
        platformName: "Platform Name",
        supportEmail: "Support Email",
        commissions: "Commission rates",
        agencyRate: "Agency Commission",
        officeFee: "HUMANA Office Fee",
        hotelNet: "Hotel / Creator Net",
        editRates: "Edit rates",
        agencyHint: "Default for Starter plan",
        officeHint: "Flat rate across all tiers",
        hotelHint: "Remaining after fees",
        currency: "Default Currency",
        language: "Default Language",
        countriesTitle: "Countries & Regions",
        addCountry: "+ Add Country",
        noCountries: "No countries configured yet.",
        flag: "Flag",
        country: "Country",
        code: "Code",
        hotels: "Hotels",
        retreats: "Retreats",
        status: "Status",
        enabled: "Enabled",
        activeStatus: "Active",
        inactiveStatus: "Inactive",
      },
    },
    comingSoon: {
      eyebrow: "COMING SOON",
      title: "Welcome",
      subtitle: (role) => `Your ${role} dashboard is being crafted.`,
      status: "Account Status",
      contact: "Contact",
    },
    acceptInvite: {
      eyebrow: "WELCOME TO HUMANA",
      title: "Activate Your Account",
      subtitle: "Complete your registration to get started.",
      name: "Full Name",
      namePlaceholder: "Your full name",
      password: "Password",
      passwordPlaceholder: "Minimum 8 characters",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      submit: "Activate My Account",
      submitting: "Activating...",
      expired: "This invitation has expired. Please contact your administrator.",
      alreadyAccepted: "This invitation has already been accepted.",
      invalidToken: "Invalid invitation link.",
    },
    welcome: {
      title: (name) => `Welcome to HUMANA, ${name}`,
      subtitle: "Your account has been activated successfully.",
      redirecting: "Redirecting you now...",
    },
    onboarding: {
      agency: { title: "Complete Your Profile", subtitle: "Tell us about your travel agency.", description: "Description", country: "Country", city: "City", phone: "Phone", website: "Website", submit: "Complete Setup", skip: "Skip for now" },
      office: { title: "Complete Your Profile", subtitle: "Set up your regional office.", region: "Region", timezone: "Timezone", phone: "Phone", submit: "Complete Setup", skip: "Skip for now" },
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
    admin: {
      badge: "ADMIN",
      nav: { overview: "Dashboard", network: "Red", subscriptions: "Suscripciones", settings: "Configuración" },
      dashboard: {
        eyebrow: "RESUMEN DE PLATAFORMA",
        title: "Resumen de la plataforma",
        subtitle: "Monitorea el rendimiento de tu red y gestiona las operaciones.",
        kpi: {
          agencies: "Agencias activas", hotels: "Hoteles registrados", bookings: "Reservas", gmv: "Volumen de operaciones", offices: "Oficinas",
          agenciesTooltip: "Total de agencias de viaje registradas y verificadas en la plataforma.",
          hotelsTooltip: "Hoteles wellness listados actualmente en la red HUMANA.",
          bookingsTooltip: "Total de reservas confirmadas procesadas en el período seleccionado.",
          gmvTooltip: "Volumen total de transacciones realizadas a través de la red.",
          agenciesSub: "socios verificados",
          hotelsSub: "en la red",
          bookingsSub: "en período seleccionado",
          gmvSub: "volumen total",
        },
        quickActions: "Acciones rápidas",
        last30: "Últimos 30 días",
        exportReport: "Exportar Reporte",
        inviteAgency: "Invitar agencia",
        inviteAgencyDesc: "Envía una invitación para incorporar una nueva agencia de viajes.",
        inviteHotel: "Invitar hotel",
        inviteHotelDesc: "Invita a un hotel wellness a unirse a la red HUMANA.",
        createOffice: "Crear oficina",
        createOfficeDesc: "Configura una nueva oficina regional para coordinar operaciones locales.",
        pendingInvitations: "Invitaciones pendientes",
        pendingInvitationsTooltip: "Invitaciones enviadas a agencias, hoteles y oficinas que aún no fueron aceptadas.",
        awaitingAcceptance: "Esperando aceptación",
        sendNewInvite: "Enviar invitación",
        approvalQueue: "Cola de aprobación",
        approvalQueueTooltip: "Agencias, hoteles y oficinas pendientes de aprobación. Revisalas y gestionálas desde la Red.",
        offices: "Oficinas regionales",
        noPending: "Sin invitaciones pendientes",
        noApprovals: "Sin organizaciones pendientes de aprobación",
        orgsUnderReview: "Organizaciones en revisión",
        waiting: "en espera",
        pendingReview: "en revisión",
        officesEyebrow: "Presencia operativa",
        officesTitle: "Oficinas HUMANA",
        officesSubtitle: "Centros regionales que coordinan onboarding, estándares y alianzas locales.",
        noOffices: "No se han creado oficinas aún.",
      },
      network: {
        title: "Miembros de la red",
        subtitle: "Gestiona todos los usuarios de la plataforma en hoteles, agencias y oficinas.",
        createUser: "+ CREAR USUARIO",
        tabs: { all: "Todos", active: "Activos", pending: "Pendientes", suspended: "Suspendidos" },
        table: { user: "Usuario", email: "Email", type: "Tipo", organization: "Organización", status: "Estado", invitedBy: "Invitado por", registered: "Registro", lastLogin: "Último acceso", actions: "Acciones" },
        review: "Revisar",
        approve: "Aprobar",
        reject: "Rechazar",
        view: "Ver",
        preview: "Vista previa",
        suspend: "Suspender",
        reactivate: "Reactivar",
        sendFeedback: "Enviar comentarios",
        deleteUser: "Eliminar usuario",
        deleteTitle: "Eliminar usuario permanentemente",
        deleteWarning: "Esta acción no se puede deshacer. Todos los datos asociados a este usuario serán eliminados permanentemente y no podrá acceder a la plataforma.",
        deleteConfirmHint: (email: string) => `Para confirmar, escribe "${email}" a continuación:`,
        deleteConfirmPlaceholder: "Escribe el email para confirmar",
        deleteConfirm: "Eliminar permanentemente",
        deleting: "Eliminando...",
        showing: "Mostrando",
        showingOf: "miembros",
        noResults: "No se encontraron usuarios con esos criterios.",
        searchPlaceholder: "Buscar miembros...",
        kindFilter: "Tipo",
        kindAll: "Todos",
        filter: "Filtrar",
        never: "Nunca",
      },
      invite: {
        title: "Invita a un nuevo miembro a la red.",
        subtitle: "Completa los datos a continuación. Se enviará un enlace para activar la cuenta.",
        eyebrow: "NUEVO MIEMBRO",
        selectRole: "ROL",
        email: "CORREO ELECTRÓNICO",
        emailPlaceholder: "marina@viajesglobal.com",
        emailHint: "Se enviará un enlace a esta dirección.",
        country: "PAÍS",
        office: "OFICINA ASIGNADA",
        officeHint: "Asignada automáticamente por país. Se puede cambiar.",
        send: "ENVIAR INVITACIÓN",
        sending: "Enviando...",
        success: "¡Invitación enviada exitosamente!",
        roles: { agency: "Agencia", hotel: "Hotel", office: "Oficina" },
        preview: "VISTA PREVIA",
        previewRole: "Rol",
        previewEmail: "Email",
        previewCountry: "País",
        previewOffice: "Oficina",
        previewExpires: "El enlace expira",
        previewApproval: "Aprobación",
        previewExpiresValue: "7 días",
        previewApprovalValue: "No requerida",
        breadcrumb: "Crear nuevo miembro",
      },
      reviewDrawer: {
        title: "Revisar usuario",
        pendingReview: "Revisión Pendiente",
        details: "Detalles",
        joined: "Se unió",
        lastLogin: "Último acceso",
        organization: "Organización",
        phone: "Teléfono",
        role: "Rol",
        office: "Oficina",
        createdBy: "Creado por",
        submitted: "Enviado",
        adminNotes: "Notas del Administrador",
        notesPlaceholder: "Agregar notas opcionales sobre este usuario...",
        approve: "Aprobar Usuario",
        reject: "Rechazar",
        suspend: "Suspender",
        reactivate: "Reactivar",
      },
      approve: { title: "Aprobar usuario", message: "¿Estás seguro de aprobar a este usuario? Recibirá una notificación por correo y tendrá acceso completo a la plataforma.", confirm: "Confirmar Aprobación", notification: "El líder de Oficina que creó esta solicitud también será notificado de la aprobación." },
      reject: { title: "Rechazar usuario", reason: "Razón del rechazo", reasonPlaceholder: "Explica por qué se rechaza este usuario. Esto se enviará al líder de Oficina que creó la solicitud...", confirm: "Confirmar Rechazo", notification: "El líder de Oficina recibirá una notificación por correo con este motivo." },
      subscriptions: {
        eyebrow: "SUSCRIPCIONES",
        title: "Planes de membresía",
        subtitle: "Gestiona planes de suscripción y onboarding de Stripe Connect para miembros.",
        plans: "Planes",
        noPlans: "No hay planes de suscripción configurados aún.",
        noSubs: "No hay registros de onboarding de pago aún.",
        perMonth: "/mes",
        commissionRate: "tasa de comisión",
        activeMembers: "miembros activos",
        editPlan: "Editar Plan",
        subscribers: "suscriptores",
        stripeConnect: "STRIPE CONNECT",
        paymentOnboarding: "Estado de onboarding de pagos",
        member: "Miembro",
        type: "Tipo",
        plan: "Plan",
        stripeStatus: "Estado Stripe",
        action: "Acción",
        starter: { name: "Starter", desc: "Para agencias que comienzan con HUMANA." },
        professional: { name: "Professional", desc: "Para agencias en crecimiento con reservas regulares." },
        enterprise: { name: "Enterprise", desc: "Para agencias establecidas y grupos hoteleros." },
      },
      settings: {
        eyebrow: "CONFIGURACIÓN",
        title: "Configuración",
        subtitle: "Configuración de plataforma, comisiones y gestión de países.",
        identity: "Identidad de plataforma",
        platformName: "Nombre de Plataforma",
        supportEmail: "Email de Soporte",
        commissions: "Tasas de comisión",
        agencyRate: "Comisión Agencia",
        officeFee: "Tarifa Oficina HUMANA",
        hotelNet: "Neto Hotel / Creador",
        editRates: "Editar tasas",
        agencyHint: "Predeterminado para plan Starter",
        officeHint: "Tarifa fija en todos los planes",
        hotelHint: "Restante después de tarifas",
        currency: "Moneda por Defecto",
        language: "Idioma por Defecto",
        countriesTitle: "Países y Regiones",
        addCountry: "+ Agregar País",
        noCountries: "No hay países configurados aún.",
        flag: "Bandera",
        country: "País",
        code: "Código",
        hotels: "Hoteles",
        retreats: "Retiros",
        status: "Estado",
        enabled: "Habilitado",
        activeStatus: "Activo",
        inactiveStatus: "Inactivo",
      },
    },
    comingSoon: {
      eyebrow: "PRÓXIMAMENTE",
      title: "Bienvenido",
      subtitle: (role) => `Tu panel de ${role} está siendo diseñado.`,
      status: "Estado de cuenta",
      contact: "Contacto",
    },
    acceptInvite: {
      eyebrow: "BIENVENIDO A HUMANA",
      title: "Activa tu cuenta",
      subtitle: "Completa tu registro para comenzar.",
      name: "Nombre completo",
      namePlaceholder: "Tu nombre completo",
      password: "Contraseña",
      passwordPlaceholder: "Mínimo 8 caracteres",
      confirmPassword: "Confirmar contraseña",
      confirmPasswordPlaceholder: "Repite tu contraseña",
      submit: "Activar mi cuenta",
      submitting: "Activando...",
      expired: "Esta invitación ha expirado. Contacta a tu administrador.",
      alreadyAccepted: "Esta invitación ya fue aceptada.",
      invalidToken: "Enlace de invitación inválido.",
    },
    welcome: {
      title: (name) => `Bienvenido a HUMANA, ${name}`,
      subtitle: "Tu cuenta ha sido activada exitosamente.",
      redirecting: "Redirigiendo ahora...",
    },
    onboarding: {
      agency: { title: "Completa tu perfil", subtitle: "Cuéntanos sobre tu agencia de viajes.", description: "Descripción", country: "País", city: "Ciudad", phone: "Teléfono", website: "Sitio web", submit: "Completar configuración", skip: "Omitir por ahora" },
      office: { title: "Completa tu perfil", subtitle: "Configura tu oficina regional.", region: "Región", timezone: "Zona horaria", phone: "Teléfono", submit: "Completar configuración", skip: "Omitir por ahora" },
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
    admin: {
      badge: "ADMIN",
      nav: { overview: "Visão geral", network: "Rede", subscriptions: "Assinaturas", settings: "Configurações" },
      dashboard: {
        eyebrow: "VISÃO DA PLATAFORMA",
        title: "Visão geral da plataforma",
        subtitle: "Monitore o desempenho da sua rede e gerencie operações.",
        kpi: {
          agencies: "Agências ativas", hotels: "Hotéis registrados", bookings: "Reservas", gmv: "Volume de operações", offices: "Escritórios",
          agenciesTooltip: "Total de agências de viagem registradas e verificadas na plataforma.",
          hotelsTooltip: "Hotéis de bem-estar listados atualmente na rede HUMANA.",
          bookingsTooltip: "Total de reservas confirmadas processadas no período selecionado.",
          gmvTooltip: "Volume total de transações realizadas através da rede.",
          agenciesSub: "parceiros verificados",
          hotelsSub: "na rede",
          bookingsSub: "no período selecionado",
          gmvSub: "volume total",
        },
        quickActions: "Ações rápidas",
        last30: "Últimos 30 dias",
        exportReport: "Exportar Relatório",
        inviteAgency: "Convidar agência",
        inviteAgencyDesc: "Envie um convite para integrar uma nova agência de viagens parceira.",
        inviteHotel: "Convidar hotel",
        inviteHotelDesc: "Convide um hotel de bem-estar para se juntar à rede HUMANA.",
        createOffice: "Criar escritório",
        createOfficeDesc: "Configure um novo escritório regional para coordenar operações locais.",
        pendingInvitations: "Convites pendentes",
        pendingInvitationsTooltip: "Convites enviados a agências, hotéis e escritórios que ainda não foram aceitos.",
        awaitingAcceptance: "Aguardando aceitação",
        sendNewInvite: "Enviar convite",
        approvalQueue: "Fila de aprovação",
        approvalQueueTooltip: "Agências, hotéis e escritórios pendentes de aprovação. Revise e gerencie pela Rede.",
        offices: "Escritórios regionais",
        noPending: "Sem convites pendentes",
        noApprovals: "Sem organizações pendentes de aprovação",
        orgsUnderReview: "Organizações em revisão",
        waiting: "em espera",
        pendingReview: "em revisão",
        officesEyebrow: "Presença operacional",
        officesTitle: "Escritórios HUMANA",
        officesSubtitle: "Centros regionais que coordenam onboarding, padrões e parcerias locais.",
        noOffices: "Nenhum escritório criado ainda.",
      },
      network: {
        title: "Membros da rede",
        subtitle: "Gerencie todos os usuários da plataforma em hotéis, agências e escritórios.",
        createUser: "+ CRIAR USUÁRIO",
        tabs: { all: "Todos", active: "Ativos", pending: "Pendentes", suspended: "Suspensos" },
        table: { user: "Usuário", email: "Email", type: "Tipo", organization: "Organização", status: "Status", invitedBy: "Convidado por", registered: "Registro", lastLogin: "Último acesso", actions: "Ações" },
        review: "Revisar",
        approve: "Aprovar",
        reject: "Rejeitar",
        view: "Ver",
        preview: "Pré-visualizar",
        suspend: "Suspender",
        reactivate: "Reativar",
        sendFeedback: "Enviar feedback",
        deleteUser: "Excluir usuário",
        deleteTitle: "Excluir usuário permanentemente",
        deleteWarning: "Esta ação não pode ser desfeita. Todos os dados associados a este usuário serão excluídos permanentemente e ele não poderá mais acessar a plataforma.",
        deleteConfirmHint: (email: string) => `Para confirmar, digite "${email}" abaixo:`,
        deleteConfirmPlaceholder: "Digite o email para confirmar",
        deleteConfirm: "Excluir permanentemente",
        deleting: "Excluindo...",
        showing: "Mostrando",
        showingOf: "membros",
        noResults: "Nenhum usuário encontrado com esses critérios.",
        searchPlaceholder: "Buscar membros...",
        kindFilter: "Tipo",
        kindAll: "Todos",
        filter: "Filtrar",
        never: "Nunca",
      },
      invite: {
        title: "Convide um novo membro para a rede.",
        subtitle: "Preencha os dados abaixo. Um link será enviado para ativar a conta.",
        eyebrow: "NOVO MEMBRO",
        selectRole: "FUNÇÃO",
        email: "ENDEREÇO DE EMAIL",
        emailPlaceholder: "marina@viajesglobal.com",
        emailHint: "Um link será enviado para este endereço.",
        country: "PAÍS",
        office: "ESCRITÓRIO DESIGNADO",
        officeHint: "Atribuído automaticamente por país. Pode ser alterado.",
        send: "ENVIAR CONVITE",
        sending: "Enviando...",
        success: "Convite enviado com sucesso!",
        roles: { agency: "Agência", hotel: "Hotel", office: "Escritório" },
        preview: "PRÉVIA DO CONVITE",
        previewRole: "Função",
        previewEmail: "Email",
        previewCountry: "País",
        previewOffice: "Escritório",
        previewExpires: "Link expira em",
        previewApproval: "Aprovação",
        previewExpiresValue: "7 días",
        previewApprovalValue: "Não necessária",
        breadcrumb: "Criar novo membro",
      },
      reviewDrawer: {
        title: "Revisar usuário",
        pendingReview: "Revisão Pendente",
        details: "Detalhes",
        joined: "Ingressou",
        lastLogin: "Último acesso",
        organization: "Organização",
        phone: "Telefone",
        role: "Função",
        office: "Escritório",
        createdBy: "Criado por",
        submitted: "Enviado",
        adminNotes: "Notas do Administrador",
        notesPlaceholder: "Adicionar notas opcionais sobre este usuário...",
        approve: "Aprovar Usuário",
        reject: "Rejeitar",
        suspend: "Suspender",
        reactivate: "Reativar",
      },
      approve: { title: "Aprovar usuário", message: "Tem certeza que deseja aprovar este usuário? Ele receberá uma notificação por e-mail e terá acesso completo à plataforma.", confirm: "Confirmar Aprovação", notification: "O líder do Escritório que criou esta solicitação também será notificado da aprovação." },
      reject: { title: "Rejeitar usuário", reason: "Motivo da rejeição", reasonPlaceholder: "Explique por que este usuário está sendo rejeitado. Isso será enviado ao líder do Escritório que criou a solicitação...", confirm: "Confirmar Rejeição", notification: "O líder do Escritório receberá uma notificação por e-mail com este motivo." },
      subscriptions: {
        eyebrow: "ASSINATURAS",
        title: "Planos de membros",
        subtitle: "Gerencie planos de assinatura e onboarding do Stripe Connect para membros.",
        plans: "Planos",
        noPlans: "Nenhum plano de assinatura configurado ainda.",
        noSubs: "Nenhum registro de onboarding de pagamento ainda.",
        perMonth: "/mês",
        commissionRate: "taxa de comissão",
        activeMembers: "membros ativos",
        editPlan: "Editar Plano",
        subscribers: "assinantes",
        stripeConnect: "STRIPE CONNECT",
        paymentOnboarding: "Status de onboarding de pagamentos",
        member: "Membro",
        type: "Tipo",
        plan: "Plano",
        stripeStatus: "Status Stripe",
        action: "Ação",
        starter: { name: "Starter", desc: "Para agências iniciando com a HUMANA." },
        professional: { name: "Professional", desc: "Para agências em crescimento com reservas regulares." },
        enterprise: { name: "Enterprise", desc: "Para agências estabelecidas e grupos hoteleiros." },
      },
      settings: {
        eyebrow: "CONFIGURAÇÕES",
        title: "Configurações",
        subtitle: "Configuração da plataforma, comissões e gestão de países.",
        identity: "Identidade da plataforma",
        platformName: "Nome da Plataforma",
        supportEmail: "Email de Suporte",
        commissions: "Taxas de comissão",
        agencyRate: "Comissão Agência",
        officeFee: "Taxa Escritório HUMANA",
        hotelNet: "Líquido Hotel / Criador",
        editRates: "Editar taxas",
        agencyHint: "Padrão para plano Starter",
        officeHint: "Taxa fixa em todos os planos",
        hotelHint: "Restante após taxas",
        currency: "Moeda Padrão",
        language: "Idioma Padrão",
        countriesTitle: "Países e Regiões",
        addCountry: "+ Adicionar País",
        noCountries: "Nenhum país configurado ainda.",
        flag: "Bandeira",
        country: "País",
        code: "Código",
        hotels: "Hotéis",
        retreats: "Retiros",
        status: "Status",
        enabled: "Habilitado",
        activeStatus: "Ativo",
        inactiveStatus: "Inativo",
      },
    },
    comingSoon: {
      eyebrow: "EM BREVE",
      title: "Bem-vindo",
      subtitle: (role) => `Seu painel de ${role} está sendo preparado.`,
      status: "Status da conta",
      contact: "Contato",
    },
    acceptInvite: {
      eyebrow: "BEM-VINDO AO HUMANA",
      title: "Ative sua conta",
      subtitle: "Complete seu registro para começar.",
      name: "Nome completo",
      namePlaceholder: "Seu nome completo",
      password: "Senha",
      passwordPlaceholder: "Mínimo de 8 caracteres",
      confirmPassword: "Confirmar senha",
      confirmPasswordPlaceholder: "Repita sua senha",
      submit: "Ativar minha conta",
      submitting: "Ativando...",
      expired: "Este convite expirou. Entre em contato com seu administrador.",
      alreadyAccepted: "Este convite já foi aceito.",
      invalidToken: "Link de convite inválido.",
    },
    welcome: {
      title: (name) => `Bem-vindo ao HUMANA, ${name}`,
      subtitle: "Sua conta foi ativada com sucesso.",
      redirecting: "Redirecionando agora...",
    },
    onboarding: {
      agency: { title: "Complete seu perfil", subtitle: "Conte-nos sobre sua agência de viagens.", description: "Descrição", country: "País", city: "Cidade", phone: "Telefone", website: "Site", submit: "Concluir configuração", skip: "Pular por enquanto" },
      office: { title: "Complete seu perfil", subtitle: "Configure seu escritório regional.", region: "Região", timezone: "Fuso horário", phone: "Telefone", submit: "Concluir configuração", skip: "Pular por enquanto" },
    },
  },
};
