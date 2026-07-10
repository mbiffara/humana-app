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
      reviewFromNetwork: string;
      pendingReview: string;
      officesEyebrow: string;
      officesTitle: string;
      officesSubtitle: string;
      noOffices: string;
      officeCard: {
        operational: string;
        staff: string;
        agencies: string;
        properties: string;
        hotels: string;
      };
    };
    network: {
      title: string;
      createUser: string;
      tabs: { all: string; active: string; pending: string; suspended: string };
      subtitle: string;
      table: {
        user: string; email: string; type: string; organization: string;
        status: string; invitedBy: string; invitedAt: string; lastLogin: string;
        actions: string; onboarding: string;
        tooltipUser: string; tooltipOrganization: string; tooltipType: string;
        tooltipStatus: string; tooltipInvitedBy: string; tooltipInvitedAt: string;
        tooltipOnboarding: string;
      };
      status: { active: string; pending: string; suspended: string; rejected: string };
      onboardingComplete: string;
      onboardingPending: string;
      review: string;
      approve: string;
      reject: string;
      view: string;
      preview: string;
      suspend: string;
      reactivate: string;
      sendFeedback: string;
      resendInvitation: string;
      resendSuccess: string;
      resendCooldown: string;
      resendFailed: string;
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
      review: string;
      suspend: string;
      reactivate: string;
    };
    approve: { title: string; message: string; confirm: string; notification: string };
    reject: { title: string; reason: string; reasonPlaceholder: string; confirm: string; notification: string };
    suspendModal: { title: string; message: string; confirm: string; warning: string };
    reactivateModal: { title: string; message: string; confirm: string };
    subscriptions: {
      eyebrow: string; title: string; subtitle: string; plans: string;
      noPlans: string; noSubs: string; noSubsHint: string; perMonth: string;
      commissionRate: string; activeMembers: string;
      editPlan: string; editPriceTitle: string; editPriceLabel: string; editPriceSave: string; editPriceSaving: string; subscribers: string;
      stripeConnect: string; paymentOnboarding: string; paymentOnboardingSubtitle: string;
      member: string; type: string; plan: string;
      status: string; amount: string; action: string;
      starter: { name: string; desc: string };
      professional: { name: string; desc: string };
      enterprise: { name: string; desc: string };
      [key: string]: unknown;
    };
    settings: {
      eyebrow: string; title: string; subtitle: string;
      profile: string; adminName: string; supportEmail: string; save: string; saving: string;
      commissions: string; agencyRate: string; officeFee: string;
      hotelNet: string; ratesNote: string;
      agencyHint: string; officeHint: string; hotelHint: string;
      countriesTitle: string; addCountry: string; noCountries: string;
      flag: string; country: string;
      enabled: string; enabledHint: string;
      confirmDisableHint: string; confirmEnableHint: string;
      disable: string; enable: string;
      addCountryTitle: string; countryName: string; countryCode: string;
      creating: string; create: string;
      deleteCountry: string; deleteCountryWarning: string;
      deleteCountryType: (name: string) => string;
      deleteCountryPassword: string; deleting: string; delete: string;
      cancel: string;
    };
  };
  comingSoon: {
    eyebrow: string;
    title: string;
    subtitle: (role: string) => string;
    description: string;
    status: string;
    contact: string;
    contactCta: string;
    signOut: string;
  };
  acceptInvite: {
    eyebrow: string;
    title: string;
    subtitle: string;
    email: string;
    country: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    terms: string;
    termsLink: string;
    privacyLink: string;
    submit: string;
    next: string;
    submitting: string;
    expired: string;
    alreadyAccepted: string;
    invalidToken: string;
    errorTitle: string;
    backToLogin: string;
    validating: string;
    passwordMismatch: string;
    passwordTooShort: string;
    termsRequired: string;
    genericError: string;
  };
  onboarding: {
    header: { office: string; agency: string; hotel: string };
    stepOf: (current: number, total: number) => string;
    back: string;
    next: string;
    agency: { title: string; subtitle: string; orgName: string; firstName: string; lastName: string; phone: string; address: string; submit: string };
    office: {
      title: string;
      subtitle: string;
      orgName: string;
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
      submit: string;
    };
    hotel: {
      steps: [string, string, string, string];
      publish: string;
      /* Step 1 — Property Identity */
      step1Eyebrow: string;
      step1Title: string;
      step1Subtitle: string;
      firstName: string;
      lastName: string;
      ownerPhone: string;
      personalSection: string;
      hotelName: string;
      hotelNameHint: string;
      hotelNamePlaceholder: string;
      addressLabel: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      starsLabel: string;
      propertySection: string;
      contactSection: string;
      hotelPhoneLabel: string;
      contactEmailLabel: string;
      websiteLabel: string;
      checkInLabel: string;
      checkOutLabel: string;
      verificationTitle: string;
      verificationDescription: string;
      /* Step 2 — Room Inventory */
      step2Eyebrow: string;
      step2Title: string;
      step2Subtitle: string;
      roomConfigured: (count: number) => string;
      addRoomType: string;
      editRoomType: string;
      noRoomsTitle: string;
      noRoomsDescription: string;
      roomName: string;
      roomNamePlaceholder: string;
      roomDescription: string;
      roomDescriptionPlaceholder: string;
      maxGuests: string;
      totalUnits: string;
      baseRate: string;
      roomSize: string;
      bedTypeLabel: string;
      backToRooms: string;
      saveChanges: string;
      describeRoom: string;
      describeRoomSub: string;
      nextAvailability: string;
      /* Step 2 — Availability */
      availabilityTitle: string;
      availabilitySub: string;
      legendAvailable: string;
      legendSelected: string;
      legendBlocked: string;
      availableUnits: string;
      applyDates: string;
      blockDates: string;
      configuredBlocks: string;
      noBlocksYet: string;
      nextPhotos: string;
      /* Step 2 — Room Photos */
      roomPhotosTitle: string;
      roomPhotosSub: string;
      roomPhotosCover: string;
      roomPhotosMax: string;
      roomPhotosDrag: string;
      roomPhotosBrowse: string;
      roomPhotosFormats: string;
      doneWithRoom: string;
      deleteRoomTitle: string;
      deleteRoomDescription: (name: string) => string;
      deleteRoomConfirm: string;
      /* Step 3 — Amenities */
      step3Eyebrow: string;
      step3Title: string;
      step3Subtitle: string;
      guestFavorites: string;
      standoutAmenities: string;
      customAmenity: string;
      customPlaceholder: string;
      addButton: string;
      amenityCount: (selected: number, custom: number) => string;
      /* Step 4 — Photos */
      step4Eyebrow: string;
      step4Title: string;
      step4Subtitle: string;
      uploadDrag: string;
      uploadBrowse: string;
      uploadFormats: string;
      coverBadge: string;
      photoCount: (current: number, recommended: number) => string;
      dragToReorder: string;
      uploadMore: string;
      photoTipsTitle: string;
      photoTipsDescription: string;
      /* Step 2 — extra labels */
      editButton: string;
      roomDetailsSection: string;
      blockedLabel: string;
      unitsCount: (n: number) => string;
      photosCounter: (n: number, max: number) => string;
      blocksCount: (n: number) => string;
      availabilityLabel: string;
      photosLabel: string;
      perNight: string;
      starLabel: (n: number) => string;
      addressPlaceholder: string;
      amenityNames: Record<string, string>;
      /* Under Review */
      reviewEyebrow: string;
      reviewTitle: string;
      reviewSubtitle: (hotelName: string) => string;
      reviewStep1Label: string;
      reviewStep1Title: string;
      reviewStep2Label: string;
      reviewStep2Title: string;
      reviewStep2Description: string;
      reviewStep3Label: string;
      reviewStep3Title: string;
      reviewStep3Description: string;
      reviewDashboard: string;
      reviewViewSubmission: string;
      reviewQuestions: string;
      reviewContact: string;
      /* Tooltip for disabled Next */
      completeFields: string;
      addAtLeastOneRoom: string;
      roomNeedsPhotos: (name: string) => string;
      addAtLeastOneAmenity: string;
      addAtLeastOnePhoto: string;
    };
  };
  suspended: {
    title: string;
    subtitle: string;
    description: string;
    contact: string;
    contactEmail: string;
    backToLogin: string;
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
        pendingInvitationsTooltip: "Users who have been invited but haven't accepted the invitation yet.",
        awaitingAcceptance: "Awaiting acceptance via email",
        sendNewInvite: "Resend email from Network",
        approvalQueue: "Approval List",
        approvalQueueTooltip: "Agencies, hotels and offices pending admin approval. Review and manage them from the Network.",
        offices: "Regional Offices",
        noPending: "No pending invitations",
        noApprovals: "No organizations pending approval",
        orgsUnderReview: "Organizations under review",
        waiting: "waiting",
        reviewFromNetwork: "Review and manage from Network",
        pendingReview: "pending review",
        officesEyebrow: "Operational footprint",
        officesTitle: "HUMANA offices",
        officesSubtitle: "Regional hubs coordinating onboarding, standards and local partnerships.",
        noOffices: "No offices created yet.",
        officeCard: {
          operational: "Operational",
          staff: "Staff",
          agencies: "Agencies",
          properties: "Properties",
          hotels: "Hotels",
        },
      },
      network: {
        title: "Network Members",
        subtitle: "Manage all platform users across hotels, agencies, and offices.",
        createUser: "+ CREATE USER",
        tabs: { all: "All", active: "Active", pending: "Pending", suspended: "Suspended" },
        table: {
          user: "User", email: "Email", type: "Type", organization: "Organization",
          status: "Status", invitedBy: "Invited by", invitedAt: "Invite Date",
          lastLogin: "Last Login", actions: "Actions", onboarding: "Onboarding",
          tooltipUser: "Name and email of the platform member",
          tooltipOrganization: "Company or entity the member belongs to",
          tooltipType: "Organization type: Hotel, Agency, or Office",
          tooltipStatus: "Current account status on the platform",
          tooltipInvitedBy: "Organization that sent the invitation",
          tooltipInvitedAt: "Date the invitation was sent",
          tooltipOnboarding: "Whether the member has completed their profile setup",
        },
        status: { active: "Active", pending: "Pending", suspended: "Suspended", rejected: "Rejected" },
        onboardingComplete: "Complete",
        onboardingPending: "Pending",
        review: "Review",
        approve: "Approve",
        reject: "Reject",
        view: "View",
        preview: "Preview",
        suspend: "Suspend",
        reactivate: "Reactivate",
        sendFeedback: "Send Feedback",
        resendInvitation: "Resend Invitation",
        resendSuccess: "Invitation resent successfully",
        resendCooldown: "You can resend again in 2 minutes",
        resendFailed: "Failed to resend invitation",
        deleteUser: "Delete User",
        deleteTitle: "Delete user permanently",
        deleteWarning: "This action cannot be undone. All data associated with this user will be permanently deleted and they will no longer be able to access the platform.",
        deleteConfirmHint: (email: string) => `To confirm, type "${email}" below:`,
        deleteConfirmPlaceholder: "Type the email to confirm",
        deleteConfirm: "Delete",
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
        review: "Review",
        suspend: "Suspend",
        reactivate: "Reactivate",
      },
      approve: { title: "Approve User", message: "Are you sure you want to approve this user? They will receive an email notification and gain full access to the platform.", confirm: "Approve", notification: "The Office lead who created this request will also be notified of the approval." },
      reject: { title: "Reject User", reason: "Reason for rejection", reasonPlaceholder: "Explain why this user is being rejected. This will be sent to the Office lead who created the request...", confirm: "Confirm Rejection", notification: "The Office lead will receive an email notification with this reason." },
      suspendModal: { title: "Suspend User", message: "This user will be immediately blocked from accessing the platform. They will not be able to log in or use any features until their account is reactivated.", confirm: "Suspend", warning: "All active sessions will be invalidated." },
      reactivateModal: { title: "Reactivate User", message: "This user will regain full access to the platform and will be able to log in and use all features associated with their role.", confirm: "Reactivate" },
      subscriptions: {
        eyebrow: "SUBSCRIPTIONS",
        title: "Membership plans",
        subtitle: "Manage subscription tiers and Stripe Connect onboarding for network members.",
        plans: "Plans",
        noPlans: "No subscription plans configured yet.",
        noSubs: "No active subscriptions or payments yet",
        noSubsHint: "When members subscribe to a plan, their billing and payment activity will appear here.",
        perMonth: "/month",
        commissionRate: "commission for agencies",
        activeMembers: "active members",
        editPlan: "Edit Price",
        editPriceTitle: "Edit plan price",
        editPriceLabel: "Monthly price (USD)",
        editPriceSave: "Save",
        editPriceSaving: "Saving...",
        subscribers: "subscribers",
        stripeConnect: "SUBSCRIPTIONS & PAYMENTS",
        paymentOnboarding: "Active subscriptions",
        paymentOnboardingSubtitle: "Manage member subscriptions and track payment activity across the network.",
        member: "Member",
        type: "Type",
        plan: "Plan",
        status: "Status",
        amount: "Amount",
        action: "Action",
        starter: { name: "Starter", desc: "For agencies getting started with HUMANA." },
        professional: { name: "Professional", desc: "For growing agencies with regular bookings." },
        enterprise: { name: "Enterprise", desc: "For established agencies and hotel groups." },
      },
      settings: {
        eyebrow: "SETTINGS",
        title: "Settings",
        subtitle: "Admin profile, commission rates, and country management.",
        profile: "Admin profile",
        adminName: "Name",
        supportEmail: "Support Email",
        save: "Save",
        saving: "Saving...",
        commissions: "Commission rates",
        agencyRate: "Agency Commission",
        officeFee: "HUMANA Office Fee",
        hotelNet: "Hotel / Creator Net",
        ratesNote: "To modify commission rates, contact the development team.",
        agencyHint: "Applied on all bookings",
        officeHint: "Flat rate across all tiers",
        hotelHint: "Remaining after fees",
        countriesTitle: "Countries & Regions",
        addCountry: "Add Country",
        noCountries: "No countries configured yet.",
        flag: "Flag",
        country: "Country",
        enabled: "Enabled",
        enabledHint: "Disabled countries hide their hotels and retreats from the marketplace.",
        confirmDisableHint: "Hotels and retreats from this country will be hidden from the marketplace.",
        confirmEnableHint: "Hotels and retreats from this country will be visible in the marketplace.",
        disable: "Disable",
        enable: "Enable",
        addCountryTitle: "Add Country",
        countryName: "Country Name",
        countryCode: "ISO Code (2 letters)",
        creating: "Creating...",
        create: "Create",
        deleteCountry: "Delete Country",
        deleteCountryWarning: "This will permanently delete all hotels, retreats, agencies, and offices associated with this country. This action cannot be undone.",
        deleteCountryType: (name) => `Type "${name}" to confirm`,
        deleteCountryPassword: "Admin password",
        deleting: "Deleting...",
        delete: "Delete permanently",
        cancel: "Cancel",
      },
    },
    comingSoon: {
      eyebrow: "COMING SOON",
      title: "Welcome",
      subtitle: (role) => `Your ${role} dashboard is being crafted.`,
      description: "Your personalized dashboard with analytics, bookings, and management tools is currently in development and will be available soon.",
      status: "Account Status",
      contact: "Contact",
      contactCta: "Contact Support",
      signOut: "Sign out",
    },
    acceptInvite: {
      eyebrow: "Create Account",
      title: "Set your password",
      subtitle: "Choose a secure password for your HUMANA account.",
      email: "Email",
      country: "Country",
      password: "Password",
      passwordPlaceholder: "Minimum 8 characters",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      terms: "I agree to the HUMANA",
      termsLink: "Terms of Service",
      privacyLink: "Privacy Policy",
      submit: "Create Account",
      next: "Next",
      submitting: "Creating Account...",
      expired: "This invitation has expired. Please contact your administrator.",
      alreadyAccepted: "This invitation has already been accepted.",
      invalidToken: "Invalid invitation link.",
      errorTitle: "Invitation Error",
      backToLogin: "Back to Login",
      validating: "Validating invitation...",
      passwordMismatch: "Passwords do not match.",
      passwordTooShort: "Password must be at least 8 characters.",
      termsRequired: "You must agree to the Terms of Service and Privacy Policy.",
      genericError: "Something went wrong. Please try again.",
    },
    onboarding: {
      header: { office: "Office", agency: "Agency", hotel: "Hotel" },
      stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
      back: "Back",
      next: "Next",
      agency: { title: "Complete your profile", subtitle: "Tell us about yourself to get started.", orgName: "Agency Name", firstName: "First Name", lastName: "Last Name", phone: "Phone", address: "Address", submit: "Complete Setup" },
      office: {
        title: "Complete your profile",
        subtitle: "Tell us about yourself to get started.",
        orgName: "Office Name",
        firstName: "First Name",
        lastName: "Last Name",
        phone: "Phone",
        address: "Address",
        submit: "Complete Setup",
      },
      hotel: {
        steps: ["Identity", "Rooms", "Amenities", "Photos"],
        publish: "Publish",
        step1Eyebrow: "Step 1 of 4 \u00B7 Property Identity",
        step1Title: "Tell us about your property.",
        step1Subtitle: "Start with your personal details and the hotel\u2019s public name and location. We\u2019ll use this to verify the property before it joins the network.",
        firstName: "First Name",
        lastName: "Last Name",
        ownerPhone: "Your Phone",
        personalSection: "Your Details",
        hotelName: "Hotel Name",
        hotelNameHint: "This is how your property will appear across the HUMANA network.",
        hotelNamePlaceholder: "Casa del Faro",
        addressLabel: "Physical Address",
        descriptionLabel: "Description",
        descriptionPlaceholder: "A brief description of your property and its wellness philosophy...",
        starsLabel: "Star Rating",
        propertySection: "Property Details",
        contactSection: "Contact & Operations",
        hotelPhoneLabel: "Hotel Phone",
        contactEmailLabel: "Contact Email",
        websiteLabel: "Website",
        checkInLabel: "Check-in Time",
        checkOutLabel: "Check-out Time",
        verificationTitle: "Verification required",
        verificationDescription: "After submission, our team will verify your property details within 24\u201348 hours before listing it on the network.",
        step2Eyebrow: "Step 2 of 4 \u00B7 Room Inventory",
        step2Title: "Configure your room types.",
        step2Subtitle: "Add each room category you offer along with the total number of units available.",
        roomConfigured: (count: number) => `${count} room type${count !== 1 ? "s" : ""} configured`,
        addRoomType: "Add Room Type",
        editRoomType: "Edit Room Type",
        noRoomsTitle: "No rooms added yet",
        noRoomsDescription: "Add at least one room type with pricing and capacity to continue.",
        roomName: "Room Name",
        roomNamePlaceholder: "e.g. Ocean Suite",
        roomDescription: "Short Description",
        roomDescriptionPlaceholder: "e.g. Sea-facing, 60 m\u00B2",
        maxGuests: "Max Guests",
        totalUnits: "Total Units",
        baseRate: "Base Rate",
        roomSize: "Room Size",
        bedTypeLabel: "Bed Type",
        backToRooms: "Back to rooms",
        saveChanges: "Save Changes",
        describeRoom: "Describe this room.",
        describeRoomSub: "Fill in the basic details for this room type.",
        nextAvailability: "Next: Availability",
        availabilityTitle: "Set availability.",
        availabilitySub: "Select date ranges and assign available units or block dates.",
        legendAvailable: "Available",
        legendSelected: "Selected",
        legendBlocked: "Blocked",
        availableUnits: "Units",
        applyDates: "Apply",
        blockDates: "Block",
        configuredBlocks: "Configured Blocks",
        noBlocksYet: "No availability blocks configured yet. Select dates on the calendar to begin.",
        nextPhotos: "Next: Photos",
        roomPhotosTitle: "Add room photos.",
        roomPhotosSub: "Upload up to 8 photos for this room type. The first photo will be the cover.",
        roomPhotosCover: "Cover",
        roomPhotosMax: "8 photos maximum",
        roomPhotosDrag: "Drag images here or",
        roomPhotosBrowse: "browse files",
        roomPhotosFormats: "JPG or PNG \u00B7 up to 8 MB each",
        doneWithRoom: "Done with this room",
        deleteRoomTitle: "Delete Room Type",
        deleteRoomDescription: (name: string) => `Are you sure you want to delete "${name}"? This action cannot be undone.`,
        deleteRoomConfirm: "Delete",
        step3Eyebrow: "Step 3 of 4 \u00B7 Amenities",
        step3Title: "Tell guests what your place offers.",
        step3Subtitle: "Select everything that applies. You can refine the list after publishing.",
        guestFavorites: "Guest Favorites",
        standoutAmenities: "Standout Amenities",
        customAmenity: "Custom Amenity",
        customPlaceholder: "e.g. Rooftop lounge, Bike rental...",
        addButton: "Add",
        amenityCount: (selected: number, custom: number) => `${selected} amenit${selected === 1 ? "y" : "ies"} selected${custom > 0 ? ` + ${custom} custom` : ""}`,
        step4Eyebrow: "Step 4 of 4 \u00B7 Property Photos",
        step4Title: "Show your property at its best.",
        step4Subtitle: "Upload at least five photos that represent the space as guests will experience it. Drag to reorder.",
        uploadDrag: "Drag images here or",
        uploadBrowse: "browse files",
        uploadFormats: "JPG or PNG \u00B7 up to 8 MB each \u00B7 Minimum 1600 \u00D7 1067 px",
        coverBadge: "Cover",
        photoCount: (current: number, recommended: number) => `${current} of a recommended ${recommended} photos`,
        dragToReorder: "Drag tiles to reorder",
        uploadMore: "Upload more",
        photoTipsTitle: "Photo tips",
        photoTipsDescription: "Properties with 8+ high-quality photos receive 40% more inquiries. Include rooms, common areas, views, and dining spaces.",
        editButton: "Edit",
        roomDetailsSection: "Room Details",
        blockedLabel: "Blocked",
        unitsCount: (n: number) => `${n} unit${n !== 1 ? "s" : ""}`,
        photosCounter: (n: number, max: number) => `${n} / ${max} photos`,
        blocksCount: (n: number) => `${n} block${n !== 1 ? "s" : ""}`,
        availabilityLabel: "Availability",
        photosLabel: "Photos",
        perNight: "/night",
        starLabel: (n: number) => `${n} star${n !== 1 ? "s" : ""}`,
        addressPlaceholder: "Start typing an address...",
        amenityNames: {
          wifi: "Wifi", pool: "Pool", spa: "Spa & Sauna", breakfast: "Breakfast",
          parking: "Parking", ac: "Air conditioning", "yoga-studio": "Yoga studio", gym: "Gym",
          "meditation-room": "Meditation room", "private-garden": "Private garden",
          "ocean-terrace": "Ocean terrace", "private-chef": "Private chef",
        },
        reviewEyebrow: "Submission Received",
        reviewTitle: "Your property is under review.",
        reviewSubtitle: (hotelName: string) => `Our team will verify the information and photos you submitted. Once approved, ${hotelName} will be visible to agencies in the HUMANA network.`,
        reviewStep1Label: "01 \u00B7 Submitted",
        reviewStep1Title: "Property submitted",
        reviewStep2Label: "02 \u00B7 In Progress \u00B7 24-48h",
        reviewStep2Title: "HUMANA review",
        reviewStep2Description: "Verifying property details, photos, and location accuracy",
        reviewStep3Label: "03 \u00B7 Next \u00B7 Publish",
        reviewStep3Title: "Listed on the network",
        reviewStep3Description: "Visible to agencies and available for bookings",
        reviewDashboard: "Return to Dashboard",
        reviewViewSubmission: "View Submission",
        reviewQuestions: "Questions about the review?",
        reviewContact: "Contact institutional support",
        completeFields: "Complete these fields:",
        addAtLeastOneRoom: "Add at least one room type",
        roomNeedsPhotos: (name: string) => `${name}: add photos`,
        addAtLeastOneAmenity: "Select at least one amenity",
        addAtLeastOnePhoto: "Add at least one photo",
      },
    },
    suspended: {
      title: "Account Suspended",
      subtitle: "Your access to the HUMANA platform has been suspended.",
      description: "If you believe this is an error or need more information, please contact our support team.",
      contact: "Contact Support",
      contactEmail: "info@humana.global",
      backToLogin: "Back to login",
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
        pendingInvitationsTooltip: "Usuarios invitados que aún no aceptaron la invitación.",
        awaitingAcceptance: "Esperando aceptación via email",
        sendNewInvite: "Reenviar email desde Red",
        approvalQueue: "Lista de aprobación",
        approvalQueueTooltip: "Agencias, hoteles y oficinas pendientes de aprobación. Revisalas y gestionálas desde la Red.",
        offices: "Oficinas regionales",
        noPending: "Sin invitaciones pendientes",
        noApprovals: "Sin organizaciones pendientes de aprobación",
        orgsUnderReview: "Organizaciones en revisión",
        waiting: "en espera",
        reviewFromNetwork: "Revisar y gestionar desde Red",
        pendingReview: "en revisión",
        officesEyebrow: "Presencia operativa",
        officesTitle: "Oficinas HUMANA",
        officesSubtitle: "Centros regionales que coordinan onboarding, estándares y alianzas locales.",
        noOffices: "No se han creado oficinas aún.",
        officeCard: {
          operational: "Operativa",
          staff: "Personal",
          agencies: "Agencias",
          properties: "Propiedades",
          hotels: "Hoteles",
        },
      },
      network: {
        title: "Miembros de la red",
        subtitle: "Gestiona todos los usuarios de la plataforma en hoteles, agencias y oficinas.",
        createUser: "+ CREAR USUARIO",
        tabs: { all: "Todos", active: "Activos", pending: "Pendientes", suspended: "Suspendidos" },
        table: {
          user: "Usuario", email: "Email", type: "Tipo", organization: "Organización",
          status: "Estado", invitedBy: "Invitado por", invitedAt: "Fecha Invitación",
          lastLogin: "Último acceso", actions: "Acciones", onboarding: "Onboarding",
          tooltipUser: "Nombre y email del miembro de la plataforma",
          tooltipOrganization: "Empresa o entidad a la que pertenece el miembro",
          tooltipType: "Tipo de organización: Hotel, Agencia u Oficina",
          tooltipStatus: "Estado actual de la cuenta en la plataforma",
          tooltipInvitedBy: "Organización que envió la invitación",
          tooltipInvitedAt: "Fecha en que se envió la invitación",
          tooltipOnboarding: "Si el miembro ha completado la configuración de su perfil",
        },
        status: { active: "Activo", pending: "Pendiente", suspended: "Suspendido", rejected: "Rechazado" },
        onboardingComplete: "Completo",
        onboardingPending: "Pendiente",
        review: "Revisar",
        approve: "Aprobar",
        reject: "Rechazar",
        view: "Ver",
        preview: "Vista previa",
        suspend: "Suspender",
        reactivate: "Reactivar",
        sendFeedback: "Enviar comentarios",
        resendInvitation: "Reenviar invitación",
        resendSuccess: "Invitación reenviada exitosamente",
        resendCooldown: "Podrás reenviar en 2 minutos",
        resendFailed: "Error al reenviar invitación",
        deleteUser: "Eliminar usuario",
        deleteTitle: "Eliminar usuario permanentemente",
        deleteWarning: "Esta acción no se puede deshacer. Todos los datos asociados a este usuario serán eliminados permanentemente y no podrá acceder a la plataforma.",
        deleteConfirmHint: (email: string) => `Para confirmar, escribe "${email}" a continuación:`,
        deleteConfirmPlaceholder: "Escribe el email para confirmar",
        deleteConfirm: "Eliminar",
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
        review: "Revisión",
        suspend: "Suspender",
        reactivate: "Reactivar",
      },
      approve: { title: "Aprobar usuario", message: "¿Estás seguro de aprobar a este usuario? Recibirá una notificación por correo y tendrá acceso completo a la plataforma.", confirm: "Aprobar", notification: "El líder de Oficina que creó esta solicitud también será notificado de la aprobación." },
      reject: { title: "Rechazar usuario", reason: "Razón del rechazo", reasonPlaceholder: "Explica por qué se rechaza este usuario. Esto se enviará al líder de Oficina que creó la solicitud...", confirm: "Confirmar Rechazo", notification: "El líder de Oficina recibirá una notificación por correo con este motivo." },
      suspendModal: { title: "Suspender Usuario", message: "Este usuario será bloqueado inmediatamente del acceso a la plataforma. No podrá iniciar sesión ni usar ninguna función hasta que su cuenta sea reactivada.", confirm: "Suspender", warning: "Todas las sesiones activas serán invalidadas." },
      reactivateModal: { title: "Reactivar Usuario", message: "Este usuario recuperará el acceso completo a la plataforma y podrá iniciar sesión y usar todas las funciones asociadas a su rol.", confirm: "Reactivar" },
      subscriptions: {
        eyebrow: "SUSCRIPCIONES",
        title: "Planes de membresía",
        subtitle: "Gestiona planes de suscripción y onboarding de Stripe Connect para miembros.",
        plans: "Planes",
        noPlans: "No hay planes de suscripción configurados aún.",
        noSubs: "No hay suscripciones ni pagos activos aún",
        noSubsHint: "Cuando los miembros se suscriban a un plan, su facturación y actividad de pago aparecerán aquí.",
        perMonth: "/mes",
        commissionRate: "comisión para agencias",
        activeMembers: "miembros activos",
        editPlan: "Editar Precio",
        editPriceTitle: "Editar precio del plan",
        editPriceLabel: "Precio mensual (USD)",
        editPriceSave: "Guardar",
        editPriceSaving: "Guardando...",
        subscribers: "suscriptores",
        stripeConnect: "SUSCRIPCIONES Y PAGOS",
        paymentOnboarding: "Suscripciones activas",
        paymentOnboardingSubtitle: "Gestiona las suscripciones de los miembros y el seguimiento de pagos en la red.",
        member: "Miembro",
        type: "Tipo",
        plan: "Plan",
        status: "Estado",
        amount: "Monto",
        action: "Acción",
        starter: { name: "Starter", desc: "Para agencias que comienzan con HUMANA." },
        professional: { name: "Professional", desc: "Para agencias en crecimiento con reservas regulares." },
        enterprise: { name: "Enterprise", desc: "Para agencias establecidas y grupos hoteleros." },
      },
      settings: {
        eyebrow: "CONFIGURACIÓN",
        title: "Configuración",
        subtitle: "Perfil de administrador, comisiones y gestión de países.",
        profile: "Perfil de administrador",
        adminName: "Nombre",
        supportEmail: "Email de Soporte",
        save: "Guardar",
        saving: "Guardando...",
        commissions: "Tasas de comisión",
        agencyRate: "Comisión Agencia",
        officeFee: "Tarifa Oficina HUMANA",
        hotelNet: "Neto Hotel / Creador",
        ratesNote: "Para modificar las tasas de comisión, contactar al equipo de desarrollo.",
        agencyHint: "Aplicado a todas las reservas",
        officeHint: "Tarifa fija en todos los planes",
        hotelHint: "Restante después de tarifas",
        countriesTitle: "Países y Regiones",
        addCountry: "Agregar País",
        noCountries: "No hay países configurados aún.",
        flag: "Bandera",
        country: "País",
        enabled: "Habilitado",
        enabledHint: "Los países deshabilitados ocultan sus hoteles y retiros del marketplace.",
        confirmDisableHint: "Los hoteles y retiros de este país se ocultarán del marketplace.",
        confirmEnableHint: "Los hoteles y retiros de este país serán visibles en el marketplace.",
        disable: "Deshabilitar",
        enable: "Habilitar",
        addCountryTitle: "Agregar País",
        countryName: "Nombre del País",
        countryCode: "Código ISO (2 letras)",
        creating: "Creando...",
        create: "Crear",
        deleteCountry: "Eliminar País",
        deleteCountryWarning: "Esto eliminará permanentemente todos los hoteles, retiros, agencias y oficinas asociados a este país. Esta acción no se puede deshacer.",
        deleteCountryType: (name) => `Escriba "${name}" para confirmar`,
        deleteCountryPassword: "Contraseña de administrador",
        deleting: "Eliminando...",
        delete: "Eliminar permanentemente",
        cancel: "Cancelar",
      },
    },
    comingSoon: {
      eyebrow: "PRÓXIMAMENTE",
      title: "Bienvenido",
      subtitle: (role) => `Tu panel de ${role} está siendo diseñado.`,
      description: "Tu dashboard personalizado con analíticas, reservas y herramientas de gestión está actualmente en desarrollo y estará disponible pronto.",
      status: "Estado de cuenta",
      contact: "Contacto",
      contactCta: "Contactar Soporte",
      signOut: "Cerrar sesión",
    },
    acceptInvite: {
      eyebrow: "Crear Cuenta",
      title: "Establece tu contraseña",
      subtitle: "Elige una contraseña segura para tu cuenta HUMANA.",
      email: "Email",
      country: "País",
      password: "Contraseña",
      passwordPlaceholder: "Mínimo 8 caracteres",
      confirmPassword: "Confirmar contraseña",
      confirmPasswordPlaceholder: "Repite tu contraseña",
      terms: "Acepto los",
      termsLink: "Términos de Servicio",
      privacyLink: "Política de Privacidad",
      submit: "Crear Cuenta",
      next: "Siguiente",
      submitting: "Creando cuenta...",
      expired: "Esta invitación ha expirado. Contacta a tu administrador.",
      alreadyAccepted: "Esta invitación ya fue aceptada.",
      invalidToken: "Enlace de invitación inválido.",
      errorTitle: "Error de Invitación",
      backToLogin: "Volver al inicio",
      validating: "Validando invitación...",
      passwordMismatch: "Las contraseñas no coinciden.",
      passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
      termsRequired: "Debes aceptar los Términos de Servicio y la Política de Privacidad.",
      genericError: "Algo salió mal. Intenta de nuevo.",
    },
    onboarding: {
      header: { office: "Oficina", agency: "Agencia", hotel: "Hotel" },
      stepOf: (current: number, total: number) => `Paso ${current} de ${total}`,
      back: "Atrás",
      next: "Siguiente",
      agency: { title: "Completa tu perfil", subtitle: "Cuéntanos sobre ti para comenzar.", orgName: "Nombre de la Agencia", firstName: "Nombre", lastName: "Apellido", phone: "Teléfono", address: "Dirección", submit: "Completar configuración" },
      office: {
        title: "Completa tu perfil",
        subtitle: "Cuéntanos sobre ti para comenzar.",
        orgName: "Nombre de la Oficina",
        firstName: "Nombre",
        lastName: "Apellido",
        phone: "Teléfono",
        address: "Dirección",
        submit: "Completar configuración",
      },
      hotel: {
        steps: ["Identidad", "Habitaciones", "Amenities", "Fotos"],
        publish: "Publicar",
        step1Eyebrow: "Paso 1 de 4 \u00B7 Identidad de la Propiedad",
        step1Title: "Cu\u00E9ntanos sobre tu propiedad.",
        step1Subtitle: "Comienza con tus datos personales, el nombre p\u00FAblico del hotel y su ubicaci\u00F3n. Usaremos esto para verificar la propiedad antes de incluirla en la red.",
        firstName: "Nombre",
        lastName: "Apellido",
        ownerPhone: "Tu Tel\u00E9fono",
        personalSection: "Tus Datos",
        hotelName: "Nombre del Hotel",
        hotelNameHint: "As\u00ED aparecer\u00E1 tu propiedad en toda la red HUMANA.",
        hotelNamePlaceholder: "Casa del Faro",
        addressLabel: "Direcci\u00F3n F\u00EDsica",
        descriptionLabel: "Descripci\u00F3n",
        descriptionPlaceholder: "Una breve descripci\u00F3n de tu propiedad y su filosof\u00EDa de bienestar...",
        starsLabel: "Clasificaci\u00F3n por Estrellas",
        propertySection: "Datos del Hotel",
        contactSection: "Contacto y Operaciones",
        hotelPhoneLabel: "Tel\u00E9fono del Hotel",
        contactEmailLabel: "Email de Contacto",
        websiteLabel: "Sitio Web",
        checkInLabel: "Hora de Check-in",
        checkOutLabel: "Hora de Check-out",
        verificationTitle: "Verificaci\u00F3n requerida",
        verificationDescription: "Despu\u00E9s del env\u00EDo, nuestro equipo verificar\u00E1 los detalles de tu propiedad en 24\u201348 horas antes de listarla en la red.",
        step2Eyebrow: "Paso 2 de 4 \u00B7 Inventario de Habitaciones",
        step2Title: "Configura tus tipos de habitaci\u00F3n.",
        step2Subtitle: "Agrega cada categor\u00EDa de habitaci\u00F3n que ofreces junto con el n\u00FAmero total de unidades disponibles.",
        roomConfigured: (count: number) => `${count} tipo${count !== 1 ? "s" : ""} de habitaci\u00F3n configurado${count !== 1 ? "s" : ""}`,
        addRoomType: "Agregar Tipo de Habitaci\u00F3n",
        editRoomType: "Editar Tipo de Habitaci\u00F3n",
        noRoomsTitle: "No hay habitaciones a\u00FAn",
        noRoomsDescription: "Agrega al menos un tipo de habitaci\u00F3n con precio y capacidad para continuar.",
        roomName: "Nombre de la Habitaci\u00F3n",
        roomNamePlaceholder: "ej. Suite Oce\u00E1nica",
        roomDescription: "Descripci\u00F3n Breve",
        roomDescriptionPlaceholder: "ej. Vista al mar, 60 m\u00B2",
        maxGuests: "M\u00E1x. Hu\u00E9spedes",
        totalUnits: "Unidades Totales",
        baseRate: "Tarifa Base",
        roomSize: "Tama\u00F1o",
        bedTypeLabel: "Tipo de Cama",
        backToRooms: "Volver a habitaciones",
        saveChanges: "Guardar Cambios",
        describeRoom: "Describe esta habitaci\u00F3n.",
        describeRoomSub: "Completa los detalles b\u00E1sicos de este tipo de habitaci\u00F3n.",
        nextAvailability: "Siguiente: Disponibilidad",
        availabilityTitle: "Configura la disponibilidad.",
        availabilitySub: "Selecciona rangos de fechas y asigna unidades disponibles o bloquea fechas.",
        legendAvailable: "Disponible",
        legendSelected: "Seleccionado",
        legendBlocked: "Bloqueado",
        availableUnits: "Unidades",
        applyDates: "Aplicar",
        blockDates: "Bloquear",
        configuredBlocks: "Bloques Configurados",
        noBlocksYet: "No hay bloques configurados a\u00FAn. Selecciona fechas en el calendario para comenzar.",
        nextPhotos: "Siguiente: Fotos",
        roomPhotosTitle: "Agrega fotos de la habitaci\u00F3n.",
        roomPhotosSub: "Sube hasta 8 fotos para este tipo de habitaci\u00F3n. La primera foto ser\u00E1 la portada.",
        roomPhotosCover: "Portada",
        roomPhotosMax: "8 fotos m\u00E1ximo",
        roomPhotosDrag: "Arrastra im\u00E1genes aqu\u00ED o",
        roomPhotosBrowse: "busca archivos",
        roomPhotosFormats: "JPG o PNG \u00B7 hasta 8 MB cada una",
        doneWithRoom: "Listo con esta habitación",
        deleteRoomTitle: "Eliminar Habitación",
        deleteRoomDescription: (name: string) => `¿Estás seguro de que quieres eliminar "${name}"? Esta acción no se puede deshacer.`,
        deleteRoomConfirm: "Eliminar",
        step3Eyebrow: "Paso 3 de 4 · Amenities",
        step3Title: "Dile a los huéspedes qué ofrece tu lugar.",
        step3Subtitle: "Selecciona todo lo que aplique. Puedes refinar la lista después de publicar.",
        guestFavorites: "Favoritas de los Hu\u00E9spedes",
        standoutAmenities: "Amenities Destacadas",
        customAmenity: "Amenity Personalizada",
        customPlaceholder: "ej. Terraza en la azotea, Alquiler de bicicletas...",
        addButton: "Agregar",
        amenityCount: (selected: number, custom: number) => `${selected} amenidad${selected !== 1 ? "es" : ""} seleccionada${selected !== 1 ? "s" : ""}${custom > 0 ? ` + ${custom} personalizada${custom !== 1 ? "s" : ""}` : ""}`,
        step4Eyebrow: "Paso 4 de 4 \u00B7 Fotos de la Propiedad",
        step4Title: "Muestra tu propiedad en su mejor momento.",
        step4Subtitle: "Sube al menos cinco fotos que representen el espacio tal como lo experimentar\u00E1n los hu\u00E9spedes. Arrastra para reordenar.",
        uploadDrag: "Arrastra im\u00E1genes aqu\u00ED o",
        uploadBrowse: "busca archivos",
        uploadFormats: "JPG o PNG \u00B7 hasta 8 MB cada una \u00B7 M\u00EDnimo 1600 \u00D7 1067 px",
        coverBadge: "Portada",
        photoCount: (current: number, recommended: number) => `${current} de ${recommended} fotos recomendadas`,
        dragToReorder: "Arrastra para reordenar",
        uploadMore: "Subir m\u00E1s",
        photoTipsTitle: "Consejos de fotos",
        photoTipsDescription: "Las propiedades con 8+ fotos de alta calidad reciben 40% m\u00E1s consultas. Incluye habitaciones, \u00E1reas comunes, vistas y espacios gastron\u00F3micos.",
        editButton: "Editar",
        roomDetailsSection: "Detalles de Habitaci\u00F3n",
        blockedLabel: "Bloqueado",
        unitsCount: (n: number) => `${n} unidad${n !== 1 ? "es" : ""}`,
        photosCounter: (n: number, max: number) => `${n} / ${max} fotos`,
        blocksCount: (n: number) => `${n} bloque${n !== 1 ? "s" : ""}`,
        availabilityLabel: "Disponibilidad",
        photosLabel: "Fotos",
        perNight: "/noche",
        starLabel: (n: number) => `${n} estrella${n !== 1 ? "s" : ""}`,
        addressPlaceholder: "Comienza a escribir una direcci\u00F3n...",
        amenityNames: {
          wifi: "Wifi", pool: "Piscina", spa: "Spa y Sauna", breakfast: "Desayuno",
          parking: "Estacionamiento", ac: "Aire acondicionado", "yoga-studio": "Estudio de yoga", gym: "Gimnasio",
          "meditation-room": "Sala de meditaci\u00F3n", "private-garden": "Jard\u00EDn privado",
          "ocean-terrace": "Terraza oce\u00E1nica", "private-chef": "Chef privado",
        },
        reviewEyebrow: "Env\u00EDo Recibido",
        reviewTitle: "Tu propiedad est\u00E1 en revisi\u00F3n.",
        reviewSubtitle: (hotelName: string) => `Nuestro equipo verificar\u00E1 la informaci\u00F3n y las fotos que enviaste. Una vez aprobado, ${hotelName} ser\u00E1 visible para las agencias en la red HUMANA.`,
        reviewStep1Label: "01 \u00B7 Enviado",
        reviewStep1Title: "Propiedad enviada",
        reviewStep2Label: "02 \u00B7 En Progreso \u00B7 24-48h",
        reviewStep2Title: "Revisi\u00F3n HUMANA",
        reviewStep2Description: "Verificando detalles de la propiedad, fotos y precisi\u00F3n de ubicaci\u00F3n",
        reviewStep3Label: "03 \u00B7 Siguiente \u00B7 Publicar",
        reviewStep3Title: "Listada en la red",
        reviewStep3Description: "Visible para agencias y disponible para reservas",
        reviewDashboard: "Volver al Dashboard",
        reviewViewSubmission: "Ver Env\u00EDo",
        reviewQuestions: "\u00BFPreguntas sobre la revisi\u00F3n?",
        reviewContact: "Contactar soporte institucional",
        completeFields: "Completa estos campos:",
        addAtLeastOneRoom: "Agrega al menos un tipo de habitaci\u00F3n",
        roomNeedsPhotos: (name: string) => `${name}: agrega fotos`,
        addAtLeastOneAmenity: "Selecciona al menos una amenidad",
        addAtLeastOnePhoto: "Agrega al menos una foto",
      },
    },
    suspended: {
      title: "Cuenta Suspendida",
      subtitle: "Tu acceso a la plataforma HUMANA ha sido suspendido.",
      description: "Si crees que esto es un error o necesitas más información, por favor contacta a nuestro equipo de soporte.",
      contact: "Contactar Soporte",
      contactEmail: "info@humana.global",
      backToLogin: "Volver al inicio de sesión",
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
        pendingInvitationsTooltip: "Usuários convidados que ainda não aceitaram o convite.",
        awaitingAcceptance: "Aguardando aceitação via email",
        sendNewInvite: "Reenviar email pela Rede",
        approvalQueue: "Lista de aprovação",
        approvalQueueTooltip: "Agências, hotéis e escritórios pendentes de aprovação. Revise e gerencie pela Rede.",
        offices: "Escritórios regionais",
        noPending: "Sem convites pendentes",
        noApprovals: "Sem organizações pendentes de aprovação",
        orgsUnderReview: "Organizações em revisão",
        waiting: "em espera",
        reviewFromNetwork: "Revisar e gerenciar pela Rede",
        pendingReview: "em revisão",
        officesEyebrow: "Presença operacional",
        officesTitle: "Escritórios HUMANA",
        officesSubtitle: "Centros regionais que coordenam onboarding, padrões e parcerias locais.",
        noOffices: "Nenhum escritório criado ainda.",
        officeCard: {
          operational: "Operacional",
          staff: "Equipe",
          agencies: "Agências",
          properties: "Propriedades",
          hotels: "Hotéis",
        },
      },
      network: {
        title: "Membros da rede",
        subtitle: "Gerencie todos os usuários da plataforma em hotéis, agências e escritórios.",
        createUser: "+ CRIAR USUÁRIO",
        tabs: { all: "Todos", active: "Ativos", pending: "Pendentes", suspended: "Suspensos" },
        table: {
          user: "Usuário", email: "Email", type: "Tipo", organization: "Organização",
          status: "Status", invitedBy: "Convidado por", invitedAt: "Data Convite",
          lastLogin: "Último acesso", actions: "Ações", onboarding: "Onboarding",
          tooltipUser: "Nome e email do membro da plataforma",
          tooltipOrganization: "Empresa ou entidade à qual o membro pertence",
          tooltipType: "Tipo de organização: Hotel, Agência ou Escritório",
          tooltipStatus: "Status atual da conta na plataforma",
          tooltipInvitedBy: "Organização que enviou o convite",
          tooltipInvitedAt: "Data em que o convite foi enviado",
          tooltipOnboarding: "Se o membro completou a configuração do perfil",
        },
        status: { active: "Ativo", pending: "Pendente", suspended: "Suspenso", rejected: "Rejeitado" },
        onboardingComplete: "Completo",
        onboardingPending: "Pendente",
        review: "Revisar",
        approve: "Aprovar",
        reject: "Rejeitar",
        view: "Ver",
        preview: "Pré-visualizar",
        suspend: "Suspender",
        reactivate: "Reativar",
        sendFeedback: "Enviar feedback",
        resendInvitation: "Reenviar convite",
        resendSuccess: "Convite reenviado com sucesso",
        resendCooldown: "Você poderá reenviar em 2 minutos",
        resendFailed: "Falha ao reenviar convite",
        deleteUser: "Excluir usuário",
        deleteTitle: "Excluir usuário permanentemente",
        deleteWarning: "Esta ação não pode ser desfeita. Todos os dados associados a este usuário serão excluídos permanentemente e ele não poderá mais acessar a plataforma.",
        deleteConfirmHint: (email: string) => `Para confirmar, digite "${email}" abaixo:`,
        deleteConfirmPlaceholder: "Digite o email para confirmar",
        deleteConfirm: "Excluir",
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
        review: "Revisão",
        suspend: "Suspender",
        reactivate: "Reativar",
      },
      approve: { title: "Aprovar usuário", message: "Tem certeza que deseja aprovar este usuário? Ele receberá uma notificação por e-mail e terá acesso completo à plataforma.", confirm: "Aprovar", notification: "O líder do Escritório que criou esta solicitação também será notificado da aprovação." },
      reject: { title: "Rejeitar usuário", reason: "Motivo da rejeição", reasonPlaceholder: "Explique por que este usuário está sendo rejeitado. Isso será enviado ao líder do Escritório que criou a solicitação...", confirm: "Confirmar Rejeição", notification: "O líder do Escritório receberá uma notificação por e-mail com este motivo." },
      suspendModal: { title: "Suspender Usuário", message: "Este usuário será imediatamente bloqueado de acessar a plataforma. Ele não poderá fazer login ou usar nenhuma funcionalidade até que sua conta seja reativada.", confirm: "Suspender", warning: "Todas as sessões ativas serão invalidadas." },
      reactivateModal: { title: "Reativar Usuário", message: "Este usuário recuperará o acesso completo à plataforma e poderá fazer login e usar todas as funcionalidades associadas ao seu perfil.", confirm: "Reativar" },
      subscriptions: {
        eyebrow: "ASSINATURAS",
        title: "Planos de membros",
        subtitle: "Gerencie planos de assinatura e onboarding do Stripe Connect para membros.",
        plans: "Planos",
        noPlans: "Nenhum plano de assinatura configurado ainda.",
        noSubs: "Nenhuma assinatura ou pagamento ativo ainda",
        noSubsHint: "Quando os membros assinarem um plano, a cobrança e atividade de pagamento aparecerão aqui.",
        perMonth: "/mês",
        commissionRate: "comissão para agências",
        activeMembers: "membros ativos",
        editPlan: "Editar Preço",
        editPriceTitle: "Editar preço do plano",
        editPriceLabel: "Preço mensal (USD)",
        editPriceSave: "Salvar",
        editPriceSaving: "Salvando...",
        subscribers: "assinantes",
        stripeConnect: "ASSINATURAS E PAGAMENTOS",
        paymentOnboarding: "Assinaturas ativas",
        paymentOnboardingSubtitle: "Gerencie as assinaturas dos membros e acompanhe a atividade de pagamentos na rede.",
        member: "Membro",
        type: "Tipo",
        plan: "Plano",
        status: "Status",
        amount: "Valor",
        action: "Ação",
        starter: { name: "Starter", desc: "Para agências iniciando com a HUMANA." },
        professional: { name: "Professional", desc: "Para agências em crescimento com reservas regulares." },
        enterprise: { name: "Enterprise", desc: "Para agências estabelecidas e grupos hoteleiros." },
      },
      settings: {
        eyebrow: "CONFIGURAÇÕES",
        title: "Configurações",
        subtitle: "Perfil do administrador, comissões e gestão de países.",
        profile: "Perfil do administrador",
        adminName: "Nome",
        supportEmail: "Email de Suporte",
        save: "Salvar",
        saving: "Salvando...",
        commissions: "Taxas de comissão",
        agencyRate: "Comissão Agência",
        officeFee: "Taxa Escritório HUMANA",
        hotelNet: "Líquido Hotel / Criador",
        ratesNote: "Para modificar as taxas de comissão, entre em contato com a equipe de desenvolvimento.",
        agencyHint: "Aplicado a todas as reservas",
        officeHint: "Taxa fixa em todos os planos",
        hotelHint: "Restante após taxas",
        countriesTitle: "Países e Regiões",
        addCountry: "Adicionar País",
        noCountries: "Nenhum país configurado ainda.",
        flag: "Bandeira",
        country: "País",
        enabled: "Habilitado",
        enabledHint: "Os países desabilitados ocultam seus hotéis e retiros do marketplace.",
        confirmDisableHint: "Os hotéis e retiros deste país serão ocultados do marketplace.",
        confirmEnableHint: "Os hotéis e retiros deste país serão visíveis no marketplace.",
        disable: "Desabilitar",
        enable: "Habilitar",
        addCountryTitle: "Adicionar País",
        countryName: "Nome do País",
        countryCode: "Código ISO (2 letras)",
        creating: "Criando...",
        create: "Criar",
        deleteCountry: "Excluir País",
        deleteCountryWarning: "Isso excluirá permanentemente todos os hotéis, retiros, agências e escritórios associados a este país. Esta ação não pode ser desfeita.",
        deleteCountryType: (name) => `Digite "${name}" para confirmar`,
        deleteCountryPassword: "Senha do administrador",
        deleting: "Excluindo...",
        delete: "Excluir permanentemente",
        cancel: "Cancelar",
      },
    },
    comingSoon: {
      eyebrow: "EM BREVE",
      title: "Bem-vindo",
      subtitle: (role) => `Seu painel de ${role} está sendo preparado.`,
      description: "Seu dashboard personalizado com análises, reservas e ferramentas de gestão está em desenvolvimento e estará disponível em breve.",
      status: "Status da conta",
      contact: "Contato",
      contactCta: "Contatar Suporte",
      signOut: "Sair",
    },
    acceptInvite: {
      eyebrow: "Criar Conta",
      title: "Defina sua senha",
      subtitle: "Escolha uma senha segura para sua conta HUMANA.",
      email: "Email",
      country: "País",
      password: "Senha",
      passwordPlaceholder: "Mínimo de 8 caracteres",
      confirmPassword: "Confirmar senha",
      confirmPasswordPlaceholder: "Repita sua senha",
      terms: "Aceito os",
      termsLink: "Termos de Serviço",
      privacyLink: "Política de Privacidade",
      submit: "Criar Conta",
      next: "Próximo",
      submitting: "Criando conta...",
      expired: "Este convite expirou. Entre em contato com seu administrador.",
      alreadyAccepted: "Este convite já foi aceito.",
      invalidToken: "Link de convite inválido.",
      errorTitle: "Erro de Convite",
      backToLogin: "Voltar ao login",
      validating: "Validando convite...",
      passwordMismatch: "As senhas não coincidem.",
      passwordTooShort: "A senha deve ter pelo menos 8 caracteres.",
      termsRequired: "Você deve aceitar os Termos de Serviço e a Política de Privacidade.",
      genericError: "Algo deu errado. Tente novamente.",
    },
    onboarding: {
      header: { office: "Escritório", agency: "Agência", hotel: "Hotel" },
      stepOf: (current: number, total: number) => `Passo ${current} de ${total}`,
      back: "Voltar",
      next: "Próximo",
      agency: { title: "Complete seu perfil", subtitle: "Conte-nos sobre você para começar.", orgName: "Nome da Agência", firstName: "Nome", lastName: "Sobrenome", phone: "Telefone", address: "Endereço", submit: "Concluir configuração" },
      office: {
        title: "Complete seu perfil",
        subtitle: "Conte-nos sobre você para começar.",
        orgName: "Nome do Escritório",
        firstName: "Nome",
        lastName: "Sobrenome",
        phone: "Telefone",
        address: "Endereço",
        submit: "Concluir configuração",
      },
      hotel: {
        steps: ["Identidade", "Quartos", "Amenities", "Fotos"],
        publish: "Publicar",
        step1Eyebrow: "Passo 1 de 4 \u00B7 Identidade da Propriedade",
        step1Title: "Conte-nos sobre sua propriedade.",
        step1Subtitle: "Comece com seus dados pessoais, o nome p\u00FAblico do hotel e sua localiza\u00E7\u00E3o. Usaremos isso para verificar a propriedade antes de inclu\u00ED-la na rede.",
        firstName: "Nome",
        lastName: "Sobrenome",
        ownerPhone: "Seu Telefone",
        personalSection: "Seus Dados",
        hotelName: "Nome do Hotel",
        hotelNameHint: "Assim sua propriedade aparecer\u00E1 em toda a rede HUMANA.",
        hotelNamePlaceholder: "Casa del Faro",
        addressLabel: "Endere\u00E7o F\u00EDsico",
        descriptionLabel: "Descri\u00E7\u00E3o",
        descriptionPlaceholder: "Uma breve descri\u00E7\u00E3o da sua propriedade e sua filosofia de bem-estar...",
        starsLabel: "Classifica\u00E7\u00E3o por Estrelas",
        propertySection: "Dados do Hotel",
        contactSection: "Contato e Opera\u00E7\u00F5es",
        hotelPhoneLabel: "Telefone do Hotel",
        contactEmailLabel: "Email de Contato",
        websiteLabel: "Site",
        checkInLabel: "Hor\u00E1rio de Check-in",
        checkOutLabel: "Hor\u00E1rio de Check-out",
        verificationTitle: "Verifica\u00E7\u00E3o necess\u00E1ria",
        verificationDescription: "Ap\u00F3s o envio, nossa equipe verificar\u00E1 os detalhes da sua propriedade em 24\u201348 horas antes de list\u00E1-la na rede.",
        step2Eyebrow: "Passo 2 de 4 \u00B7 Invent\u00E1rio de Quartos",
        step2Title: "Configure seus tipos de quarto.",
        step2Subtitle: "Adicione cada categoria de quarto que voc\u00EA oferece junto com o n\u00FAmero total de unidades dispon\u00EDveis.",
        roomConfigured: (count: number) => `${count} tipo${count !== 1 ? "s" : ""} de quarto configurado${count !== 1 ? "s" : ""}`,
        addRoomType: "Adicionar Tipo de Quarto",
        editRoomType: "Editar Tipo de Quarto",
        noRoomsTitle: "Nenhum quarto adicionado ainda",
        noRoomsDescription: "Adicione pelo menos um tipo de quarto com pre\u00E7o e capacidade para continuar.",
        roomName: "Nome do Quarto",
        roomNamePlaceholder: "ex. Su\u00EDte Oce\u00E2nica",
        roomDescription: "Descri\u00E7\u00E3o Breve",
        roomDescriptionPlaceholder: "ex. Vista para o mar, 60 m\u00B2",
        maxGuests: "M\u00E1x. H\u00F3spedes",
        totalUnits: "Unidades Totais",
        baseRate: "Tarifa Base",
        roomSize: "Tamanho",
        bedTypeLabel: "Tipo de Cama",
        backToRooms: "Voltar aos quartos",
        saveChanges: "Salvar Altera\u00E7\u00F5es",
        describeRoom: "Descreva este quarto.",
        describeRoomSub: "Preencha os detalhes b\u00E1sicos deste tipo de quarto.",
        nextAvailability: "Pr\u00F3ximo: Disponibilidade",
        availabilityTitle: "Configure a disponibilidade.",
        availabilitySub: "Selecione intervalos de datas e atribua unidades dispon\u00EDveis ou bloqueie datas.",
        legendAvailable: "Dispon\u00EDvel",
        legendSelected: "Selecionado",
        legendBlocked: "Bloqueado",
        availableUnits: "Unidades",
        applyDates: "Aplicar",
        blockDates: "Bloquear",
        configuredBlocks: "Blocos Configurados",
        noBlocksYet: "Nenhum bloco configurado ainda. Selecione datas no calend\u00E1rio para come\u00E7ar.",
        nextPhotos: "Pr\u00F3ximo: Fotos",
        roomPhotosTitle: "Adicione fotos do quarto.",
        roomPhotosSub: "Envie at\u00E9 8 fotos para este tipo de quarto. A primeira foto ser\u00E1 a capa.",
        roomPhotosCover: "Capa",
        roomPhotosMax: "8 fotos no m\u00E1ximo",
        roomPhotosDrag: "Arraste imagens aqui ou",
        roomPhotosBrowse: "procure arquivos",
        roomPhotosFormats: "JPG ou PNG \u00B7 at\u00E9 8 MB cada",
        doneWithRoom: "Pronto com este quarto",
        deleteRoomTitle: "Excluir Tipo de Quarto",
        deleteRoomDescription: (name: string) => `Tem certeza de que deseja excluir "${name}"? Esta ação não pode ser desfeita.`,
        deleteRoomConfirm: "Excluir",
        step3Eyebrow: "Passo 3 de 4 · Amenities",
        step3Title: "Diga aos h\u00F3spedes o que seu lugar oferece.",
        step3Subtitle: "Selecione tudo que se aplica. Você pode refinar a lista após a publicação.",
        guestFavorites: "Favoritas dos H\u00F3spedes",
        standoutAmenities: "Amenities em Destaque",
        customAmenity: "Amenity Personalizada",
        customPlaceholder: "ex. Terra\u00E7o no telhado, Aluguel de bicicletas...",
        addButton: "Adicionar",
        amenityCount: (selected: number, custom: number) => `${selected} comodidade${selected !== 1 ? "s" : ""} selecionada${selected !== 1 ? "s" : ""}${custom > 0 ? ` + ${custom} personalizada${custom !== 1 ? "s" : ""}` : ""}`,
        step4Eyebrow: "Passo 4 de 4 \u00B7 Fotos da Propriedade",
        step4Title: "Mostre sua propriedade no seu melhor.",
        step4Subtitle: "Envie pelo menos cinco fotos que representem o espa\u00E7o como os h\u00F3spedes o experimentar\u00E3o. Arraste para reordenar.",
        uploadDrag: "Arraste imagens aqui ou",
        uploadBrowse: "procure arquivos",
        uploadFormats: "JPG ou PNG \u00B7 at\u00E9 8 MB cada \u00B7 M\u00EDnimo 1600 \u00D7 1067 px",
        coverBadge: "Capa",
        photoCount: (current: number, recommended: number) => `${current} de ${recommended} fotos recomendadas`,
        dragToReorder: "Arraste para reordenar",
        uploadMore: "Enviar mais",
        photoTipsTitle: "Dicas de fotos",
        photoTipsDescription: "Propriedades com 8+ fotos de alta qualidade recebem 40% mais consultas. Inclua quartos, \u00E1reas comuns, vistas e espa\u00E7os gastron\u00F4micos.",
        editButton: "Editar",
        roomDetailsSection: "Detalhes do Quarto",
        blockedLabel: "Bloqueado",
        unitsCount: (n: number) => `${n} unidade${n !== 1 ? "s" : ""}`,
        photosCounter: (n: number, max: number) => `${n} / ${max} fotos`,
        blocksCount: (n: number) => `${n} bloco${n !== 1 ? "s" : ""}`,
        availabilityLabel: "Disponibilidade",
        photosLabel: "Fotos",
        perNight: "/noite",
        starLabel: (n: number) => `${n} estrela${n !== 1 ? "s" : ""}`,
        addressPlaceholder: "Comece a digitar um endere\u00E7o...",
        amenityNames: {
          wifi: "Wifi", pool: "Piscina", spa: "Spa e Sauna", breakfast: "Caf\u00E9 da manh\u00E3",
          parking: "Estacionamento", ac: "Ar condicionado", "yoga-studio": "Est\u00FAdio de yoga", gym: "Academia",
          "meditation-room": "Sala de medita\u00E7\u00E3o", "private-garden": "Jardim privado",
          "ocean-terrace": "Terra\u00E7o oce\u00E2nico", "private-chef": "Chef particular",
        },
        reviewEyebrow: "Envio Recebido",
        reviewTitle: "Sua propriedade est\u00E1 em revis\u00E3o.",
        reviewSubtitle: (hotelName: string) => `Nossa equipe verificar\u00E1 as informa\u00E7\u00F5es e fotos que voc\u00EA enviou. Ap\u00F3s a aprova\u00E7\u00E3o, ${hotelName} ser\u00E1 vis\u00EDvel para as ag\u00EAncias na rede HUMANA.`,
        reviewStep1Label: "01 \u00B7 Enviado",
        reviewStep1Title: "Propriedade enviada",
        reviewStep2Label: "02 \u00B7 Em Progresso \u00B7 24-48h",
        reviewStep2Title: "Revis\u00E3o HUMANA",
        reviewStep2Description: "Verificando detalhes da propriedade, fotos e precis\u00E3o da localiza\u00E7\u00E3o",
        reviewStep3Label: "03 \u00B7 Pr\u00F3ximo \u00B7 Publicar",
        reviewStep3Title: "Listada na rede",
        reviewStep3Description: "Vis\u00EDvel para ag\u00EAncias e dispon\u00EDvel para reservas",
        reviewDashboard: "Voltar ao Dashboard",
        reviewViewSubmission: "Ver Envio",
        reviewQuestions: "Perguntas sobre a revis\u00E3o?",
        reviewContact: "Contatar suporte institucional",
        completeFields: "Complete estes campos:",
        addAtLeastOneRoom: "Adicione pelo menos um tipo de quarto",
        roomNeedsPhotos: (name: string) => `${name}: adicione fotos`,
        addAtLeastOneAmenity: "Selecione pelo menos uma comodidade",
        addAtLeastOnePhoto: "Adicione pelo menos uma foto",
      },
    },
    suspended: {
      title: "Conta Suspensa",
      subtitle: "Seu acesso à plataforma HUMANA foi suspenso.",
      description: "Se você acredita que isso é um erro ou precisa de mais informações, entre em contato com nossa equipe de suporte.",
      contact: "Contatar Suporte",
      contactEmail: "info@humana.global",
      backToLogin: "Voltar ao login",
    },
  },
};
