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
  hotelWs: {
    badge: string;
    nav: { dashboard: string; calendar: string; rooms: string; retreats: string; bookings: string; settings: string };
    paywall: { eyebrow: string; title: string; body: string; cta: string };
    dashboard: {
      eyebrowWeek: (week: number) => string;
      welcome: (name: string) => string;
      roomsCount: (n: number) => string;
      memberSince: (date: string) => string;
      lastThirtyDays: string;
      kpis: {
        occupancy: string;
        occupancyDelta: (pts: number) => string;
        revenue: string;
        revenueDelta: (amount: string, month: string) => string;
        upcomingGuests: string;
        upcomingHint: (n: number) => string;
        activeRetreats: string;
        retreatsHint: (inProgress: number, upcoming: number) => string;
      };
      checkIns: {
        eyebrow: string;
        title: string;
        viewAll: string;
        today: string;
        inDays: (n: number) => string;
        empty: string;
        emptyHint: string;
      };
      retreats: {
        eyebrow: string;
        title: string;
        guests: (n: number) => string;
        inProgress: string;
        upcoming: string;
        empty: string;
        emptyHint: string;
      };
      quickActions: {
        title: string;
        blockDates: string;
        createRetreat: string;
        updatePricing: string;
      };
    };
    calendar: {
      title: string;
      subtitle: string;
      perNight: string;
      roomsLabel: string;
      operationalLabel: string;
      soldOut: string;
      blockedCount: (n: number) => string;
      legendBlocked: string;
      selectHint: string;
      unitsToBlock: string;
      allUnits: string;
      reasonPlaceholder: string;
      blockAction: string;
      cancel: string;
      blockedPeriods: string;
      noBlocks: string;
      unassigned: string;
      unassignedHint: string;
      empty: string;
      emptyHint: string;
      legendAvailable: string;
      legendLow: string;
      legendFull: string;
      today: string;
    };
    rooms: {
      title: string;
      subtitle: string;
      addRoom: string;
      numberPlaceholder: string;
      statuses: { available: string; out_of_service: string };
      empty: string;
      emptyHint: string;
      autoLabel: string;
      confirmDelete: string;
    };
    roomTypes: {
      eyebrow: string;
      title: string;
      subtitle: string;
      summary: (types: number, units: number, available: number) => string;
      addRoomType: string;
      empty: string;
      emptyHint: string;
      rate: string;
      units: string;
      available: string;
      maxGuests: string;
      occupancy: string;
      perNight: string;
      editDetails: string;
      manageUnits: string;
      delete: string;
      confirmDelete: string;
      statuses: { active: string; draft: string; inactive: string };
    };
    roomEditor: {
      createEyebrow: string;
      editEyebrow: string;
      stepOf: (n: number, total: number) => string;
      steps: { details: string; amenities: string; photos: string; availability: string; pricing: string };
      cancel: string;
      back: string;
      next: string;
      save: string;
      saving: string;
      saveError: string;
      preview: {
        title: string;
        capacity: string;
        units: string;
        bed: string;
        rate: string;
        amenities: string;
        pending: string;
        progress: string;
        guests: (n: number) => string;
        rooms: (n: number) => string;
        configured: (n: number) => string;
      };
      details: {
        title: string;
        subtitle: string;
        name: string;
        namePlaceholder: string;
        description: string;
        descriptionPlaceholder: string;
        maxGuests: string;
        totalUnits: string;
        unitsHint: string;
        bedType: string;
        bedTypes: {
          single: string;
          double: string;
          queen: string;
          king: string;
          twin: string;
          bunk: string;
          sofa_bed: string;
        };
        roomSize: string;
        status: string;
      };
      amenitiesStep: {
        title: string;
        subtitle: string;
        selected: (n: number) => string;
        groups: { features: string; bathroom: string; technology: string; outdoor: string };
        items: Record<string, string>;
        customGroup: string;
        customPlaceholder: string;
        addCustom: string;
      };
      photos: {
        title: string;
        subtitle: string;
        count: (n: number, max: number) => string;
        reorderHint: string;
        cover: string;
        dropHint: string;
        browse: string;
        formats: string;
        uploadFailed: string;
        retry: string;
        uploadFailedHint: string;
      };
      availability: {
        title: string;
        subtitle: string;
        totalUnits: (n: number) => string;
        legendAvailable: string;
        legendBlocked: string;
        legendBooked: string;
        blockDates: string;
        blockedDates: string;
        unitsBlocked: (n: number, total: number) => string;
        noBlocks: string;
        remove: string;
        unitsLabel: string;
        allUnits: string;
        reasonPlaceholder: string;
        from: string;
        to: string;
        add: string;
        cancel: string;
        hint: string;
        selectHint: string;
        selectedLabel: string;
      };
      pricing: {
        title: string;
        subtitle: string;
        baseRate: string;
        pricePerNight: string;
        currency: string;
        volumeTitle: string;
        volumeHint: string;
        addTier: string;
        roomsCol: string;
        periodCol: string;
        priceCol: string;
        vsBase: string;
        anyPeriod: string;
        minRooms: string;
        footnote: string;
      };
    };
    retreats: {
      title: string;
      subtitle: string;
      create: string;
      empty: string;
      emptyHint: string;
      stats: { duration: string; capacity: string; price: string; nextDate: string };
      nights: (n: number) => string;
      guestsMax: (n: number) => string;
      perPerson: string;
      editDetails: string;
      viewProgram: string;
      viewGallery: string;
      delete: string;
      confirmDelete: string;
      statuses: {
        draft: string;
        pending_review: string;
        active: string;
        upcoming: string;
        closed: string;
        cancelled: string;
      };
      wizard: {
        eyebrow: string;
        editEyebrow: string;
        title: string;
        subtitle: string;
        steps: { info: string; program: string; pricing: string; gallery: string; review: string };
        stepOf: (n: number, total: number) => string;
        back: string;
        next: string;
        saving: string;
        saveError: string;
        preview: {
          title: string;
          hotel: string;
          nameLabel: string;
          type: string;
          dates: string;
          capacity: string;
          program: string;
          basePrice: string;
          gallery: string;
          pending: string;
          progress: string;
          readyToPublish: string;
          daysCount: (n: number) => string;
          imagesCount: (n: number) => string;
          guests: (n: number) => string;
        };
        types: {
          wellness: string;
          spiritual: string;
          corporate: string;
          adventure: string;
          medical: string;
        };
        info: {
          title: string;
          subtitle: string;
          name: string;
          namePlaceholder: string;
          type: string;
          nights: string;
          startDate: string;
          endDate: string;
          endDateAuto: string;
          capacity: string;
          language: string;
          description: string;
          descriptionPlaceholder: string;
        };
        program: {
          title: string;
          subtitle: (n: number) => string;
          dayLabel: (n: number) => string;
          dayTitlePlaceholder: string;
          activitiesCount: (n: number) => string;
          addActivity: string;
          activityPlaceholder: string;
          facilitators: string;
          facilitatorCount: (n: number, max: number) => string;
          addFacilitator: string;
          facilitatorNamePlaceholder: string;
          specialtyPlaceholder: string;
          lead: string;
          assistant: string;
          included: string;
          addItem: string;
          itemPlaceholder: string;
        };
        pricing: {
          title: string;
          subtitle: string;
          room: string;
          roomsCapacity: string;
          pricePerGuest: string;
          totalPrice: string;
          include: string;
          includeHint: string;
          availabilityLabel: (n: number, total: number) => string;
          noAvailabilityLabel: string;
          coverageLabel: (covered: number, total: number) => string;
          coverageOk: string;
          coverageShort: string;
          guests: (n: number) => string;
          earningsTitle: string;
          agencyCommission: (pct: number) => string;
          officeCommission: (pct: number) => string;
          creatorIncome: (pct: number) => string;
          totalEarnings: string;
          empty: string;
          emptyHint: string;
        };
        gallery: {
          title: string;
          subtitle: string;
          dropHint: string;
          browse: string;
          formats: string;
          cover: string;
          reorderHint: string;
          previewCount: (n: number, max: number) => string;
          uploadFailed: string;
          retry: string;
          uploadFailedHint: string;
        };
        review: {
          title: string;
          subtitle: string;
          edit: string;
          hotel: string;
          basicInfo: string;
          nameLabel: string;
          typeLabel: string;
          durationLabel: string;
          capacityLabel: string;
          languageLabel: string;
          program: string;
          activitiesCount: (n: number) => string;
          facilitators: string;
          included: string;
          pricingRooms: string;
          roomsCount: (n: number) => string;
          perGuest: string;
          gallery: string;
          imagesCount: (n: number) => string;
          publish: string;
          publishing: string;
        };
        confirmation: {
          eyebrow: string;
          title: (name: string) => string;
          subtitle: string;
          reference: string;
          retreat: string;
          startDate: string;
          hotel: string;
          capacity: string;
          type: string;
          priceFrom: string;
          roomsConfigured: string;
          typesCount: (n: number) => string;
          viewRetreat: string;
          backToRetreats: string;
        };
      };
    };
    bookings: {
      eyebrow: string;
      title: string;
      calendarTitle: string;
      subtitle: string;
      searchPlaceholder: string;
      exportBtn: string;
      tabReservations: string;
      tabCalendar: string;
      kpis: { total: string; pending: string; revenue: string; occupancy: string };
      filters: { all: string; confirmed: string; pending: string; checkedIn: string; cancelled: string };
      empty: string;
      emptyHint: string;
      columns: { reference: string };
      statusLabels: Record<string, string>;
      confirmAction: string;
      cancelAction: string;
    };
    settings: {
      eyebrow: string;
      title: string;
      subtitle: string;
      tabs: Record<string, string>;
      property: {
        eyebrow: string;
        title: string;
        subtitle: string;
        descriptionLabel: string;
        starsLabel: string;
        checkInLabel: string;
        checkOutLabel: string;
        amenitiesTitle: string;
        amenitiesHint: string;
        customAmenities: string;
        customPlaceholder: string;
        addCustom: string;
        photosTitle: string;
        photosHint: string;
        cover: string;
        addPhotos: string;
      };
      profile: {
        eyebrow: string;
        hotelName: string;
        location: string;
        contactEmail: string;
        phone: string;
        save: string;
        saving: string;
        saved: string;
      };
      account: {
        eyebrow: string;
        changePasswordTitle: string;
        changePasswordHint: string;
        currentEmail: string;
        sendOtp: string;
        deactivateTitle: string;
        deactivateHint: string;
        deactivateAction: string;
        deleteAction: string;
        // Password reset modal
        passwordModalTitle: string;
        passwordModalHint: string;
        passwordModalSend: string;
        passwordModalSending: string;
        passwordModalSent: string;
        passwordModalSentHint: string;
        // Deactivate modal
        deactivateModalTitle: string;
        deactivateModalWarning: string;
        deactivateModalConfirm: string;
        deactivateModalCancel: string;
        deactivateModalProcessing: string;
        // Delete modal
        deleteModalTitle: string;
        deleteModalWarningStep1: string;
        deleteModalContinue: string;
        deleteModalStep2Hint: string;
        deleteModalConfirmPhrase: string;
        deleteModalDeleteForever: string;
        deleteModalDeleting: string;
        deleteModalCancel: string;
      };
      subscription: {
        eyebrow: string;
        title: string;
        subtitle: string;
        perMonth: string;
        commission: string;
        currentPlan: string;
        selectPlan: string;
        selecting: string;
        sponsoredTitle: string;
        sponsoredBody: string;
        features: Record<string, string>;
      };
      payments: {
        eyebrow: string;
        title: string;
        accountHolder: string;
        iban: string;
        swift: string;
        currency: string;
        country: string;
        save: string;
        saving: string;
        statusConfigured: string;
        statusPending: string;
        paymentsReceived: string;
        noPayments: string;
      };
    };
  };
  agencyWs: {
    badge: string;
    nav: {
      discover: string;
      clients: string;
      bookings: string;
      myRetreats: string;
      settings: string;
    };
    clients: {
      eyebrow: string;
      title: string;
      subtitle: string;
      addClient: string;
      searchPlaceholder: string;
      empty: string;
      emptyHint: string;
      columns: { name: string; email: string; phone: string; notes: string; bookings: string; created: string; actions: string };
      modal: { addTitle: string; editTitle: string; namePlaceholder: string; emailPlaceholder: string; phonePlaceholder: string; notesPlaceholder: string; save: string; saving: string; cancel: string };
      deleteTitle: string;
      deleteMessage: string;
      deleteConfirm: string;
      deleteCancel: string;
    };
    bookings: {
      eyebrow: string;
      title: string;
      subtitle: string;
      searchPlaceholder: string;
      exportBtn: string;
      empty: string;
      emptyHint: string;
      kpis: { total: string; confirmed: string; commission: string; volume: string };
      filters: { all: string; inquiry: string; confirmed: string; completed: string; cancelled: string };
      statusLabels: { inquiry: string; confirmed: string; completed: string; cancelled: string };
      columns: { reference: string; client: string; experience: string; dates: string; amount: string; commission: string; status: string };
    };
    settings: {
      eyebrow: string;
      title: string;
      subtitle: string;
      tabs: { profile: string; account: string; subscription: string; payments: string };
      profile: {
        eyebrow: string;
        agencyName: string;
        legalName: string;
        contactEmail: string;
        phone: string;
        location: string;
        website: string;
        taxId: string;
        save: string;
        saving: string;
        saved: string;
      };
      account: {
        eyebrow: string;
        changePasswordTitle: string;
        changePasswordHint: string;
        currentEmail: string;
        deactivateTitle: string;
        deactivateHint: string;
        deactivateAction: string;
        deleteAction: string;
        passwordModalTitle: string;
        passwordModalHint: string;
        passwordModalSend: string;
        passwordModalSending: string;
        passwordModalSent: string;
        passwordModalSentHint: string;
        deactivateModalTitle: string;
        deactivateModalWarning: string;
        deactivateModalCancel: string;
        deactivateModalConfirm: string;
        deactivateModalProcessing: string;
        deleteModalTitle: string;
        deleteModalWarningStep1: string;
        deleteModalCancel: string;
        deleteModalContinue: string;
        deleteModalStep2Hint: string;
        deleteModalConfirmPhrase: string;
        deleteModalDeleteForever: string;
        deleteModalDeleting: string;
      };
      subscription: {
        eyebrow: string;
        title: string;
        subtitle: string;
        perMonth: string;
        commission: string;
        currentPlan: string;
        selectPlan: string;
        selecting: string;
        features: Record<string, string>;
      };
      payments: { eyebrow: string; title: string; subtitle: string; comingSoon: string };
    };
    myRetreats: {
      eyebrow: string;
      title: string;
      subtitle: string;
      createRetreat: string;
      empty: string;
      emptyHint: string;
      filters: { all: string; draft: string; pending_review: string; active: string; closed: string };
      statusLabels: { draft: string; pending_review: string; active: string; upcoming: string; closed: string; cancelled: string };
      kpis: { total: string; active: string; draft: string; pending: string };
      columns: { name: string; hotel: string; dates: string; capacity: string; price: string; status: string; actions: string };
      deleteTitle: string;
      deleteMessage: string;
      deleteConfirm: string;
      deleteCancel: string;
      submitTitle: string;
      submitMessage: string;
      submitConfirm: string;
      submitCancel: string;
    };
  };
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
  resetPassword: {
    eyebrow: string;
    title: string;
    subtitle: string;
    newPassword: string;
    confirmPassword: string;
    placeholder: string;
    submit: string;
    submitting: string;
    success: string;
    successHint: string;
    errorInvalid: string;
    errorExpired: string;
    errorMismatch: string;
    errorMinLength: string;
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
    viewHotel: string;
    notFound: string;
    boutiqueHotel: string;
    info: string;
    capacity: string;
    personCount: (n: number) => string;
    bookNow: string;
    roomCount: (n: number) => string;
    activeRetreats: (n: number) => string;
    hotelSubtitle: string;
    bookLodging: string;
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
      status: { active: string; pending: string; suspended: string; rejected: string; changes_requested: string };
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
      pendingChangesNote: string;
      changesRequestedNote: string;
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
      popular: string; free: string; view: string; cancel: string;
      features: {
        emailSupport: string; prioritySupport: string; dedicatedSupport: string;
        basicAnalytics: string; advancedAnalytics: string; fullAnalytics: string;
        hotelAccess: string; retreatAccess: string; retreatCreation: string;
      };
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
      steps: [string, string, string, string, string];
      publish: string;
      /* Step 5 — Review & Status */
      step5Eyebrow: string;
      step5Title: string;
      step5Sub: string;
      reviewEdit: string;
      reviewHotelInfo: string;
      reviewRooms: string;
      reviewAmenities: string;
      reviewPhotos: string;
      reviewUnits: string;
      reviewPerNight: string;
      reviewGuests: string;
      reviewNoPhotos: string;
      reviewStatusDraftTitle: string;
      reviewStatusDraftBody: string;
      reviewStatusPendingTitle: string;
      reviewStatusPendingBody: string;
      reviewStatusApprovedTitle: string;
      reviewStatusApprovedBody: string;
      reviewStatusChangesTitle: string;
      reviewStatusChangesBody: string;
      reviewStatusFeedbackTitle: string;
      reviewStatusFeedbackBody: string;
      submitForReviewCta: string;
      publishChangesCta: string;
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
      legendLow: string;
      legendFullyBlocked: string;
      legendSelected: string;
      legendBlocked: string;
      availableUnits: string;
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
    hotelWs: {
      badge: "Hotel Partner",
      nav: { dashboard: "Dashboard", calendar: "Calendar", rooms: "Rooms", retreats: "Retreats", bookings: "Bookings", settings: "Settings" },
      paywall: {
        eyebrow: "SUBSCRIPTION REQUIRED",
        title: "Choose a plan to continue",
        body: "Select a subscription plan to unlock your hotel workspace and start managing your property, bookings, and retreats.",
        cta: "SELECT A PLAN",
      },
      dashboard: {
        eyebrowWeek: (week: number) => `Week ${week}`,
        welcome: (name: string) => `Welcome back, ${name}`,
        roomsCount: (n: number) => `${n} room${n === 1 ? "" : "s"}`,
        memberSince: (date: string) => `Member since ${date}`,
        lastThirtyDays: "Last 30 days",
        kpis: {
          occupancy: "Occupancy rate",
          occupancyDelta: (pts: number) => `${pts >= 0 ? "+" : ""}${pts}% vs. last month`,
          revenue: "Revenue this month",
          revenueDelta: (amount: string, month: string) => `${amount} vs. ${month}`,
          upcomingGuests: "Upcoming guests",
          upcomingHint: (n: number) => `Next 7 days · ${n} check-in${n === 1 ? "" : "s"} today`,
          activeRetreats: "Active retreats",
          retreatsHint: (inProgress: number, upcoming: number) =>
            `${inProgress} in progress · ${upcoming} upcoming`,
        },
        checkIns: {
          eyebrow: "Upcoming",
          title: "Next check-ins",
          viewAll: "View all",
          today: "Check-in today",
          inDays: (n: number) => `In ${n} day${n === 1 ? "" : "s"}`,
          empty: "No upcoming check-ins",
          emptyHint: "Reservations made through the HUMANA network will appear here.",
        },
        retreats: {
          eyebrow: "Retreats",
          title: "Active programs",
          guests: (n: number) => `${n} guests`,
          inProgress: "In progress",
          upcoming: "Upcoming",
          empty: "No active programs",
          emptyHint: "Publish a retreat to see it here.",
        },
        quickActions: {
          title: "Quick actions",
          blockDates: "Block dates",
          createRetreat: "Create new retreat",
          updatePricing: "Update room pricing",
        },
      },
      calendar: {
        title: "Availability Calendar",
        subtitle: "Room availability across your property, day by day.",
        perNight: "per night",
        roomsLabel: "rooms",
        operationalLabel: "operational",
        soldOut: "Sold out",
        blockedCount: (n: number) => `${n} blocked`,
        legendBlocked: "Blocked",
        selectHint: "Click a day, then another in the same row, to block a range.",
        unitsToBlock: "Units to block",
        allUnits: "All units",
        reasonPlaceholder: "Reason (optional)",
        blockAction: "Block dates",
        cancel: "Cancel",
        blockedPeriods: "Blocked periods",
        noBlocks: "No blocked periods in this month.",
        unassigned: "Unassigned bookings",
        unassignedHint: "Bookings without a room category. They are not counted in the per-type availability above.",
        empty: "Your room inventory starts here",
        emptyHint: "Define your room types to activate the availability calendar.",
        legendAvailable: "Available",
        legendLow: "Limited",
        legendFull: "Fully booked",
        today: "Today",
      },
      rooms: {
        title: "Rooms",
        subtitle: "Name, number, and manage every room in your property.",
        addRoom: "Add room",
        numberPlaceholder: "Room name or number",
        statuses: { available: "Available", out_of_service: "Out of service" },
        empty: "Your rooms will appear here",
        emptyHint: "Define your room types and their quantities to generate rooms.",
        autoLabel: "Auto-generated",
        confirmDelete: "Remove this room? Its booking history is preserved.",
      },
      roomTypes: {
        eyebrow: "Room inventory",
        title: "Manage your room types",
        subtitle: "Define the room categories offered at your property.",
        summary: (types: number, units: number, available: number) =>
          `${types} room type${types === 1 ? "" : "s"} · ${units} total units · ${available} available`,
        addRoomType: "Add room type",
        empty: "Your room inventory starts here",
        emptyHint: "Create your first room type to start receiving reservations.",
        rate: "Rate",
        units: "Units",
        available: "Available",
        maxGuests: "Max guests",
        occupancy: "Occupancy",
        perNight: "/night",
        editDetails: "Edit details",
        manageUnits: "Manage units",
        delete: "Delete",
        confirmDelete: "Delete this room type? Its rooms and pricing are removed too.",
        statuses: { active: "Active", draft: "Draft", inactive: "Inactive" },
      },
      roomEditor: {
        createEyebrow: "New room type",
        editEyebrow: "Edit room type",
        stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
        steps: {
          details: "Details",
          amenities: "Amenities",
          photos: "Photos",
          availability: "Availability",
          pricing: "Pricing",
        },
        cancel: "Cancel",
        back: "Back",
        next: "Next",
        save: "Save",
        saving: "Saving…",
        saveError: "We couldn't save your changes. Please try again.",
        preview: {
          title: "Room preview",
          capacity: "Capacity",
          units: "Units",
          bed: "Bed",
          rate: "Rate",
          amenities: "Amenities",
          pending: "Pending",
          progress: "Progress",
          guests: (n: number) => `${n} guest${n === 1 ? "" : "s"}`,
          rooms: (n: number) => `${n} room${n === 1 ? "" : "s"}`,
          configured: (n: number) => `${n} configured`,
        },
        details: {
          title: "Room details",
          subtitle: "Define the basic information and configuration for this room type.",
          name: "Room type name",
          namePlaceholder: "e.g. Jungle Suite",
          description: "Description",
          descriptionPlaceholder: "Describe the room, its views, and what makes it special…",
          maxGuests: "Max guests",
          totalUnits: "Total units",
          unitsHint: "Manage individual units",
          bedType: "Bed type",
          bedTypes: {
            single: "Single",
            double: "Double",
            queen: "Queen",
            king: "King",
            twin: "Twin",
            bunk: "Bunk",
            sofa_bed: "Sofa bed",
          },
          roomSize: "Room size (m²)",
          status: "Status",
        },
        amenitiesStep: {
          title: "Amenities",
          subtitle: "Select the amenities and features available in this room type.",
          selected: (n: number) => `${n} amenit${n === 1 ? "y" : "ies"} selected`,
          customGroup: "Custom amenities",
          customPlaceholder: "e.g. Fireplace, Tea ceremony set…",
          addCustom: "Add",
          groups: {
            features: "Room features",
            bathroom: "Bathroom",
            technology: "Technology",
            outdoor: "Outdoor & views",
          },
          items: {
            air_conditioning: "Air conditioning",
            private_terrace: "Private terrace",
            king_bed: "King bed",
            minibar: "Minibar",
            safe_box: "Safe box",
            desk: "Desk",
            closet: "Closet",
            outdoor_shower: "Outdoor shower",
            rainfall_shower: "Rainfall shower",
            organic_toiletries: "Organic toiletries",
            bathtub: "Bathtub",
            bidet: "Bidet",
            hair_dryer: "Hair dryer",
            free_wifi: "Free Wi-Fi",
            smart_tv: "Smart TV",
            bluetooth_speaker: "Bluetooth speaker",
            usb_charging: "USB charging",
            garden_view: "Garden view",
            hammock: "Hammock",
            ocean_view: "Ocean view",
            pool_access: "Pool access",
            private_plunge_pool: "Private plunge pool",
          },
        },
        photos: {
          title: "Room photos",
          subtitle: "Manage photos for this room type. Minimum 3, maximum 8. First photo is used as cover.",
          count: (n: number, max: number) => `${n} / ${max} photos`,
          reorderHint: "Drag to reorder · First one is the cover",
          cover: "Cover",
          dropHint: "Drag your images here",
          browse: "or click to select files",
          formats: "JPG, PNG or WebP · Max 10 MB each",
          uploadFailed: "Upload failed",
          retry: "Retry",
          uploadFailedHint: "Some images couldn't be uploaded. Retry or remove them to continue.",
        },
        availability: {
          title: "Availability",
          subtitle: "Set date-based availability and block dates for this room type.",
          totalUnits: (n: number) => `${n} total unit${n === 1 ? "" : "s"}`,
          legendAvailable: "Available",
          legendBlocked: "Blocked",
          legendBooked: "Booked",
          blockDates: "Block dates",
          blockedDates: "Blocked dates",
          unitsBlocked: (n: number, total: number) => `${n} of ${total} units blocked`,
          noBlocks: "No blocked periods for this room type.",
          remove: "Remove",
          unitsLabel: "Units to block",
          allUnits: "All units",
          reasonPlaceholder: "Reason (optional)",
          from: "From",
          to: "To",
          add: "Block dates",
          cancel: "Cancel",
          hint: "Blocked units are removed from the bookable inventory for the selected dates.",
          selectHint: "Click a start date and an end date on the calendar to block them.",
          selectedLabel: "Selected",
        },
        pricing: {
          title: "Pricing",
          subtitle: "Set rates and volume discounts for group bookings.",
          baseRate: "Base rate",
          pricePerNight: "Price per night (U$D)",
          currency: "Currency",
          volumeTitle: "Volume pricing",
          volumeHint: "Define custom rates based on the number of rooms booked. Each tier can have its own date range.",
          addTier: "Add tier",
          roomsCol: "Rooms",
          periodCol: "Period",
          priceCol: "Price / night",
          vsBase: "Vs base",
          anyPeriod: "All year",
          minRooms: "Min rooms",
          footnote: "The same volume tier can have different prices for different date ranges.",
        },
      },
      retreats: {
        title: "Your retreats",
        subtitle: "Create and manage wellness retreat programs hosted at your property.",
        create: "Create retreat",
        empty: "Your retreats start here",
        emptyHint: "Create your first wellness retreat program and share it with the HUMANA network.",
        stats: { duration: "Duration", capacity: "Capacity", price: "Price", nextDate: "Next date" },
        nights: (n: number) => `${n} night${n === 1 ? "" : "s"}`,
        guestsMax: (n: number) => `${n} guests max`,
        perPerson: "/person",
        editDetails: "Edit details",
        viewProgram: "View program",
        viewGallery: "View gallery",
        delete: "Delete",
        confirmDelete: "Delete this draft retreat? This can't be undone.",
        statuses: {
          draft: "Draft",
          pending_review: "In review",
          active: "Active",
          upcoming: "Upcoming",
          closed: "Closed",
          cancelled: "Cancelled",
        },
        wizard: {
          eyebrow: "Create new retreat",
          editEyebrow: "Edit retreat",
          title: "Create retreat at your property",
          subtitle: "Configure the retreat details to be hosted at your hotel.",
          steps: { info: "Info", program: "Program", pricing: "Pricing", gallery: "Gallery", review: "Review" },
          stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
          back: "Back",
          next: "Next",
          saving: "Saving…",
          saveError: "We couldn't save your changes. Please try again.",
          preview: {
            title: "Retreat preview",
            hotel: "Hotel",
            nameLabel: "Name",
            type: "Type",
            dates: "Dates",
            capacity: "Capacity",
            program: "Program",
            basePrice: "Base price",
            gallery: "Gallery",
            pending: "Pending",
            progress: "Progress",
            readyToPublish: "Ready to publish",
            daysCount: (n: number) => `${n} day${n === 1 ? "" : "s"}`,
            imagesCount: (n: number) => `${n} image${n === 1 ? "" : "s"}`,
            guests: (n: number) => `${n} guests`,
          },
          types: {
            wellness: "Wellness",
            spiritual: "Spiritual",
            corporate: "Corporate",
            adventure: "Adventure",
            medical: "Medical",
          },
          info: {
            title: "Basic information",
            subtitle: "Complete the general details of your retreat.",
            name: "Retreat name",
            namePlaceholder: "e.g. The Art of Silence",
            type: "Experience type",
            nights: "Duration (nights)",
            startDate: "Start date",
            endDate: "End date",
            endDateAuto: "(auto)",
            capacity: "Max capacity",
            language: "Retreat language",
            description: "Description",
            descriptionPlaceholder:
              "Describe the experience, its purpose, and what makes it unique…",
          },
          program: {
            title: "Retreat program",
            subtitle: (n: number) =>
              `Define the day-by-day activities for your ${n}-night retreat.`,
            dayLabel: (n: number) => `Day ${n}`,
            dayTitlePlaceholder: "e.g. Arrival & Welcome",
            activitiesCount: (n: number) => `${n} ${n === 1 ? "activity" : "activities"}`,
            addActivity: "Add activity",
            activityPlaceholder: "Activity name",
            facilitators: "Facilitators",
            facilitatorCount: (n: number, max: number) => `${n} of ${max}`,
            addFacilitator: "Add facilitator",
            facilitatorNamePlaceholder: "Full name",
            specialtyPlaceholder: "Specialty (e.g. Yoga and movement instructor)",
            lead: "Lead",
            assistant: "Assistant",
            included: "What's included",
            addItem: "Add item",
            itemPlaceholder: "e.g. Plant-based meals",
          },
          pricing: {
            title: "Room pricing",
            subtitle: "Set the price per person by room type for your retreat.",
            room: "Room",
            roomsCapacity: "Rooms / Capacity",
            pricePerGuest: "Price / Guest",
            include: "Include",
            includeHint: "Only the rooms you select will be bookable for this retreat.",
            availabilityLabel: (n: number, total: number) => `${n} of ${total} units free on your dates`,
            noAvailabilityLabel: "No availability on the retreat dates",
            coverageLabel: (covered: number, total: number) => `Selected rooms host up to ${covered} of ${total} guests`,
            coverageOk: "Maximum capacity covered",
            coverageShort: "Include more rooms to reach the retreat's maximum capacity.",
            totalPrice: "Total price",
            guests: (n: number) => `${n} guest${n === 1 ? "" : "s"}`,
            earningsTitle: "Total estimated earnings",
            agencyCommission: (pct: number) => `Agency commission (${pct}%)`,
            officeCommission: (pct: number) => `Office commission (${pct}%)`,
            creatorIncome: (pct: number) => `Creator income (${pct}%)`,
            totalEarnings: "Total estimated earnings",
            empty: "No room types yet",
            emptyHint: "Define your room types first so you can price the retreat per room.",
          },
          gallery: {
            title: "Image gallery",
            subtitle:
              "Upload photos of your property, common areas, and amenities. Minimum 3, maximum 10.",
            dropHint: "Drag your images here",
            browse: "or click to select files",
            formats: "JPG, PNG or WebP · Max 10 MB each",
            cover: "Cover",
            reorderHint: "Drag to reorder · First one is the cover",
            previewCount: (n: number, max: number) => `Preview (${n}/${max})`,
            uploadFailed: "Upload failed",
            retry: "Retry",
            uploadFailedHint:
              "Some images couldn't be uploaded. Retry or remove them to continue.",
          },
          review: {
            title: "Review & publish",
            subtitle: "Review all details before publishing your retreat.",
            edit: "Edit",
            hotel: "Hotel",
            basicInfo: "Basic information",
            nameLabel: "Name",
            typeLabel: "Type",
            durationLabel: "Duration",
            capacityLabel: "Capacity",
            languageLabel: "Language",
            program: "Program",
            activitiesCount: (n: number) => `${n} ${n === 1 ? "activity" : "activities"}`,
            facilitators: "Facilitators",
            included: "What's included",
            pricingRooms: "Pricing & rooms",
            roomsCount: (n: number) => `${n} room${n === 1 ? "" : "s"}`,
            perGuest: "/guest",
            gallery: "Gallery",
            imagesCount: (n: number) => `${n} image${n === 1 ? "" : "s"}`,
            publish: "Publish retreat",
            publishing: "Publishing…",
          },
          confirmation: {
            eyebrow: "Retreat published",
            title: (name: string) => `${name} published!`,
            subtitle: "Your retreat is now available on the HUMANA platform.",
            reference: "Reference",
            retreat: "Retreat",
            startDate: "Start date",
            hotel: "Hotel",
            capacity: "Capacity",
            type: "Type",
            priceFrom: "Price from",
            roomsConfigured: "Rooms configured",
            typesCount: (n: number) => `${n} type${n === 1 ? "" : "s"}`,
            viewRetreat: "View retreat",
            backToRetreats: "Back to retreats",
          },
        },
      },
      bookings: {
        eyebrow: "BOOKING MANAGEMENT",
        title: "Reservations",
        calendarTitle: "Availability Calendar",
        subtitle: "Manage bookings and reservations for your property.",
        searchPlaceholder: "Search by reference or guest…",
        exportBtn: "Export",
        tabReservations: "Reservations",
        tabCalendar: "Calendar",
        kpis: { total: "Total bookings", pending: "Pending", revenue: "Revenue", occupancy: "Occupancy" },
        filters: { all: "All", confirmed: "Confirmed", pending: "Pending", checkedIn: "Completed", cancelled: "Cancelled" },
        empty: "No bookings yet",
        emptyHint: "When agencies book your property, reservations will appear here.",
        columns: { reference: "Reference" },
        statusLabels: { inquiry: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" },
        confirmAction: "Confirm",
        cancelAction: "Cancel",
      },
      settings: {
        eyebrow: "SETTINGS",
        title: "Settings",
        subtitle: "Manage your hotel profile, account, subscription, and payments.",
        tabs: { profile: "Profile", property: "Property", account: "Account", subscription: "Subscription", payments: "Payments" },
        property: {
          eyebrow: "PROPERTY",
          title: "Property details",
          subtitle: "Keep your description, schedule, amenities, and photos up to date.",
          descriptionLabel: "Description",
          starsLabel: "Star rating",
          checkInLabel: "Check-in time",
          checkOutLabel: "Check-out time",
          amenitiesTitle: "Amenities",
          amenitiesHint: "Select everything your property offers.",
          customAmenities: "Custom amenities",
          customPlaceholder: "e.g. Fireplace, Tea ceremony set…",
          addCustom: "Add",
          photosTitle: "Photos",
          photosHint: "The first photo is the cover shown across the network.",
          cover: "Cover",
          addPhotos: "Add photos",
        },
        profile: {
          eyebrow: "HOTEL IDENTITY",
          hotelName: "Hotel name",
          location: "Location",
          contactEmail: "Email",
          phone: "Phone",
          save: "Save Changes",
          saving: "Saving…",
          saved: "Changes saved",
        },
        account: {
          eyebrow: "ACCOUNT & SECURITY",
          changePasswordTitle: "Change password",
          changePasswordHint: "Reset your password via a secure link sent to your email.",
          currentEmail: "Current email",
          sendOtp: "Send OTP",
          deactivateTitle: "Deactivate or delete account",
          deactivateHint: "Deactivating hides your property from the HUMANA network. Deleting removes all data permanently.",
          deactivateAction: "Deactivate Account",
          deleteAction: "Delete Account",
          passwordModalTitle: "Change Password",
          passwordModalHint: "We'll send a secure reset link to your registered email address.",
          passwordModalSend: "Send Reset Link",
          passwordModalSending: "Sending…",
          passwordModalSent: "Email Sent!",
          passwordModalSentHint: "Check your inbox for the reset link. It will expire in 1 hour.",
          deactivateModalTitle: "Deactivate Account",
          deactivateModalWarning: "Your property will be hidden from the HUMANA network. Active bookings will remain but no new bookings can be made. You can reactivate by contacting support.",
          deactivateModalConfirm: "Deactivate Account",
          deactivateModalCancel: "Cancel",
          deactivateModalProcessing: "Processing…",
          deleteModalTitle: "Delete Account",
          deleteModalWarningStep1: "This action is permanent and cannot be undone. All your data including hotel profile, room types, bookings, and retreat information will be permanently deleted.",
          deleteModalContinue: "Continue",
          deleteModalStep2Hint: "To confirm, type the phrase below:",
          deleteModalConfirmPhrase: "quiero eliminar mi cuenta de humana",
          deleteModalDeleteForever: "Delete Forever",
          deleteModalDeleting: "Deleting…",
          deleteModalCancel: "Cancel",
        },
        subscription: {
          eyebrow: "SUBSCRIPTION",
          title: "Choose Your Plan",
          subtitle: "Select the plan that best fits your hotel's needs.",
          sponsoredTitle: "Sponsored Access",
          sponsoredBody: "Your hotel has full access to the platform, sponsored by HUMANA. An active subscription plan is optional.",
          perMonth: "/month",
          commission: "commission",
          currentPlan: "Current Plan",
          selectPlan: "Select Plan",
          selecting: "Selecting…",
          features: {
            basic_listing: "Basic listing",
            email_support: "Email support",
            max_room_types: "Up to 5 room types",
            featured_listing: "Featured listing",
            priority_support: "Priority support",
            unlimited_room_types: "Unlimited room types",
            retreat_creation: "Retreat creation",
            analytics: "Analytics dashboard",
            premium_listing: "Premium listing",
            dedicated_support: "Dedicated support",
            unlimited_everything: "Unlimited everything",
            api_access: "API access",
            white_label: "White label",
          },
        },
        payments: {
          eyebrow: "PAYMENT RECEIVING",
          title: "Bank Account",
          accountHolder: "Account Holder Name",
          iban: "IBAN",
          swift: "SWIFT / BIC",
          currency: "Currency",
          country: "Country",
          save: "Save Bank Details",
          saving: "Saving…",
          statusConfigured: "Configured",
          statusPending: "Pending",
          paymentsReceived: "Payments Received",
          noPayments: "No payments received yet.",
        },
      },
    },
    agencyWs: {
      badge: "Agency Partner",
      nav: {
        discover: "Discover",
        clients: "Clients",
        bookings: "Bookings",
        myRetreats: "My Retreats",
        settings: "Settings",
      },
      clients: {
        eyebrow: "CLIENT MANAGEMENT",
        title: "Your Clients",
        subtitle: "Manage your client portfolio and booking history.",
        addClient: "Add Client",
        searchPlaceholder: "Search by name or email…",
        empty: "No clients yet",
        emptyHint: "Add your first client to start managing bookings.",
        columns: { name: "Name", email: "Email", phone: "Phone", notes: "Notes", bookings: "Bookings", created: "Created", actions: "Actions" },
        modal: { addTitle: "Add New Client", editTitle: "Edit Client", namePlaceholder: "Full name", emailPlaceholder: "email@example.com", phonePlaceholder: "+1 555 000 0000", notesPlaceholder: "Internal notes…", save: "Save", saving: "Saving…", cancel: "Cancel" },
        deleteTitle: "Delete Client",
        deleteMessage: "Are you sure you want to delete this client? This action cannot be undone.",
        deleteConfirm: "Delete",
        deleteCancel: "Cancel",
      },
      bookings: {
        eyebrow: "BOOKING HISTORY",
        title: "Your Bookings",
        subtitle: "Track all reservations and commissions earned.",
        searchPlaceholder: "Search bookings…",
        exportBtn: "Export",
        empty: "No bookings yet",
        emptyHint: "Your booking history will appear here once you make your first reservation.",
        kpis: { total: "Total Bookings", confirmed: "Confirmed", commission: "Commission Earned", volume: "Total Volume" },
        filters: { all: "All", inquiry: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" },
        statusLabels: { inquiry: "Pending", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" },
        columns: { reference: "Reference", client: "Client", experience: "Experience", dates: "Dates", amount: "Amount", commission: "Commission", status: "Status" },
      },
      settings: {
        eyebrow: "SETTINGS",
        title: "Agency Settings",
        subtitle: "Manage your agency profile and account preferences.",
        tabs: { profile: "Profile", account: "Account", subscription: "Subscription", payments: "Payments" },
        profile: {
          eyebrow: "AGENCY PROFILE",
          agencyName: "Agency Name",
          legalName: "Legal Name",
          contactEmail: "Contact Email",
          phone: "Phone",
          location: "Location",
          website: "Website",
          taxId: "Tax ID / NIF",
          save: "Save Changes",
          saving: "Saving…",
          saved: "Changes saved successfully",
        },
        account: {
          eyebrow: "ACCOUNT & SECURITY",
          changePasswordTitle: "Change Password",
          changePasswordHint: "We'll send a password reset link to your registered email.",
          currentEmail: "Current Email",
          deactivateTitle: "Account Status",
          deactivateHint: "Temporarily deactivate or permanently delete your account.",
          deactivateAction: "Deactivate",
          deleteAction: "Delete Account",
          passwordModalTitle: "Reset Password",
          passwordModalHint: "We'll send a secure reset link to your email address.",
          passwordModalSend: "Send Reset Link",
          passwordModalSending: "Sending…",
          passwordModalSent: "Email Sent",
          passwordModalSentHint: "Check your inbox for the reset link.",
          deactivateModalTitle: "Deactivate Account",
          deactivateModalWarning: "Your account will be suspended. You can reactivate it by contacting support.",
          deactivateModalCancel: "Cancel",
          deactivateModalConfirm: "Deactivate",
          deactivateModalProcessing: "Processing…",
          deleteModalTitle: "Delete Account",
          deleteModalWarningStep1: "This will permanently delete your agency account, all client data, and booking history. This cannot be undone.",
          deleteModalCancel: "Cancel",
          deleteModalContinue: "Continue",
          deleteModalStep2Hint: "Type the phrase below to confirm deletion:",
          deleteModalConfirmPhrase: "DELETE MY ACCOUNT",
          deleteModalDeleteForever: "Delete Forever",
          deleteModalDeleting: "Deleting…",
        },
        subscription: {
          eyebrow: "SUBSCRIPTION",
          title: "Choose Your Plan",
          subtitle: "Select the plan that best fits your agency's needs.",
          perMonth: "/month",
          commission: "commission",
          currentPlan: "Current Plan",
          selectPlan: "Select Plan",
          selecting: "Selecting…",
          features: {
            max_bookings: "Up to 10 bookings/month",
            max_bookings_unlimited: "Unlimited bookings",
            max_clients: "Up to 50 clients",
            max_clients_unlimited: "Unlimited clients",
            support_email: "Email support",
            support_priority: "Priority support",
            support_dedicated: "Dedicated support",
            analytics_basic: "Basic analytics",
            analytics_advanced: "Advanced analytics",
            analytics_full: "Full analytics suite",
            custom_branding: "Custom branding",
            api_access: "API access",
            white_label: "White label",
            sla: "99.9% SLA",
          },
        },
        payments: { eyebrow: "PAYMENTS", title: "Payment Settings", subtitle: "Configure how you receive commission payments.", comingSoon: "Payment settings coming soon." },
      },
      myRetreats: {
        eyebrow: "MY RETREATS",
        title: "Your Retreats",
        subtitle: "Create and manage retreats at partner hotels.",
        createRetreat: "Create Retreat",
        empty: "No retreats yet",
        emptyHint: "Create your first retreat to start offering curated wellness experiences.",
        filters: { all: "All", draft: "Draft", pending_review: "Under Review", active: "Active", closed: "Closed" },
        statusLabels: { draft: "Draft", pending_review: "Under Review", active: "Active", upcoming: "Upcoming", closed: "Closed", cancelled: "Cancelled" },
        kpis: { total: "Total Retreats", active: "Active", draft: "Drafts", pending: "Under Review" },
        columns: { name: "Retreat", hotel: "Hotel", dates: "Dates", capacity: "Capacity", price: "From", status: "Status", actions: "Actions" },
        deleteTitle: "Delete Retreat",
        deleteMessage: "Are you sure you want to delete this draft retreat? This action cannot be undone.",
        deleteConfirm: "Delete",
        deleteCancel: "Cancel",
        submitTitle: "Submit for Review",
        submitMessage: "Once submitted, the retreat will be reviewed by the HUMANA team before going live.",
        submitConfirm: "Submit",
        submitCancel: "Cancel",
      },
    },
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
    resetPassword: {
      eyebrow: "PASSWORD RESET",
      title: "Set your new password",
      subtitle: "Choose a secure password for your HUMANA account.",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      placeholder: "Minimum 8 characters",
      submit: "Reset Password",
      submitting: "Resetting…",
      success: "Password Reset!",
      successHint: "Your password has been updated. Redirecting to your dashboard…",
      errorInvalid: "This reset link is invalid or has already been used.",
      errorExpired: "This reset link has expired. Please request a new one.",
      errorMismatch: "Passwords do not match.",
      errorMinLength: "Password must be at least 8 characters.",
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
      viewHotel: "View hotel",
      notFound: "Hotel not found",
      boutiqueHotel: "Boutique Hotel",
      info: "Info",
      capacity: "Capacity",
      personCount: (n) => n === 1 ? "1 person" : `${n} people`,
      bookNow: "Book now",
      roomCount: (n) => n === 1 ? "1 room" : `${n} rooms`,
      activeRetreats: (n) => n === 1 ? "1 active retreat" : `${n} active retreats`,
      hotelSubtitle: "Holistic hotels assigned to your agency in this country.",
      bookLodging: "Book Lodging",
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
        status: { active: "Active", pending: "Pending", suspended: "Suspended", rejected: "Rejected", changes_requested: "Changes requested" },
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
        pendingChangesNote: "This hotel has unpublished changes. Approval is available once they publish their latest version.",
        changesRequestedNote: "Feedback sent — waiting for the hotel to publish their changes.",
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
        popular: "Popular",
        free: "Free",
        view: "View",
        cancel: "Cancel",
        features: {
          emailSupport: "Email support",
          prioritySupport: "Priority support",
          dedicatedSupport: "Dedicated support",
          basicAnalytics: "Basic analytics",
          advancedAnalytics: "Advanced analytics",
          fullAnalytics: "Full analytics",
          hotelAccess: "Hotel access",
          retreatAccess: "Retreat access",
          retreatCreation: "Retreat creation",
        },
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
        steps: ["Identity", "Rooms", "Amenities", "Photos", "Review"],
        step5Eyebrow: "Step 5 of 5 · Review & Status",
        step5Title: "Review your property",
        step5Sub: "Confirm everything below is correct. You can edit any section — changes are saved as you complete each step.",
        reviewEdit: "Edit",
        reviewHotelInfo: "Property information",
        reviewRooms: "Rooms",
        reviewAmenities: "Amenities",
        reviewPhotos: "Photos",
        reviewUnits: "units",
        reviewPerNight: "/ night",
        reviewGuests: "guests",
        reviewNoPhotos: "No photos added yet.",
        reviewStatusDraftTitle: "Ready to submit",
        reviewStatusDraftBody: "Review your property information and submit it for verification by our team.",
        reviewStatusPendingTitle: "Under review",
        reviewStatusPendingBody: "Our team is reviewing your property. You can keep refining your information — updates are saved and visible to the reviewers.",
        reviewStatusApprovedTitle: "Approved",
        reviewStatusApprovedBody: "Your property is part of the HUMANA network. Your full workspace is ready.",
        reviewStatusChangesTitle: "Unpublished changes",
        reviewStatusChangesBody: "You've made changes since your last submission. Publish them so our team reviews your latest version.",
        reviewStatusFeedbackTitle: "Changes requested",
        reviewStatusFeedbackBody: "Our team reviewed your property and has comments for you to address:",
        submitForReviewCta: "Submit for review",
        publishChangesCta: "Publish changes",
        publish: "Publish",
        step1Eyebrow: "Step 1 of 5 \u00B7 Property Identity",
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
        step2Eyebrow: "Step 2 of 5 \u00B7 Room Inventory",
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
        availabilitySub: "All dates are open for booking by default. Select a range to block dates when rooms are unavailable (seasonal closures, renovations).",
        legendAvailable: "Available",
        legendLow: "Low availability",
        legendFullyBlocked: "Fully blocked",
        legendSelected: "Selected",
        legendBlocked: "Blocked",
        availableUnits: "Units to block",
        blockDates: "Block",
        configuredBlocks: "Blocked Periods",
        noBlocksYet: "No blocked dates \u2014 every day is open for booking. Select a range on the calendar to block dates.",
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
        step3Eyebrow: "Step 3 of 5 \u00B7 Amenities",
        step3Title: "Tell guests what your place offers.",
        step3Subtitle: "Select everything that applies. You can refine the list after publishing.",
        guestFavorites: "Guest Favorites",
        standoutAmenities: "Standout Amenities",
        customAmenity: "Custom Amenity",
        customPlaceholder: "e.g. Rooftop lounge, Bike rental...",
        addButton: "Add",
        amenityCount: (selected: number, custom: number) => `${selected} amenit${selected === 1 ? "y" : "ies"} selected${custom > 0 ? ` + ${custom} custom` : ""}`,
        step4Eyebrow: "Step 4 of 5 \u00B7 Property Photos",
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
    hotelWs: {
      badge: "Hotel Partner",
      nav: { dashboard: "Dashboard", calendar: "Calendario", rooms: "Habitaciones", retreats: "Retiros", bookings: "Reservas", settings: "Configuración" },
      paywall: {
        eyebrow: "SUSCRIPCIÓN REQUERIDA",
        title: "Elige un plan para continuar",
        body: "Selecciona un plan de suscripción para desbloquear tu espacio de hotel y comenzar a gestionar tu propiedad, reservas y retiros.",
        cta: "SELECCIONAR UN PLAN",
      },
      dashboard: {
        eyebrowWeek: (week: number) => `Semana ${week}`,
        welcome: (name: string) => `Bienvenido de nuevo, ${name}`,
        roomsCount: (n: number) => `${n} ${n === 1 ? "habitación" : "habitaciones"}`,
        memberSince: (date: string) => `Miembro desde ${date}`,
        lastThirtyDays: "Últimos 30 días",
        kpis: {
          occupancy: "Tasa de ocupación",
          occupancyDelta: (pts: number) => `${pts >= 0 ? "+" : ""}${pts}% vs. mes anterior`,
          revenue: "Ingresos este mes",
          revenueDelta: (amount: string, month: string) => `${amount} vs. ${month}`,
          upcomingGuests: "Próximos huéspedes",
          upcomingHint: (n: number) => `Próximos 7 días · ${n} check-in${n === 1 ? "" : "s"} hoy`,
          activeRetreats: "Retiros activos",
          retreatsHint: (inProgress: number, upcoming: number) =>
            `${inProgress} en curso · ${upcoming} próximos`,
        },
        checkIns: {
          eyebrow: "Próximos",
          title: "Próximos check-ins",
          viewAll: "Ver todos",
          today: "Check-in hoy",
          inDays: (n: number) => `En ${n} día${n === 1 ? "" : "s"}`,
          empty: "Sin check-ins próximos",
          emptyHint: "Las reservas realizadas a través de la red HUMANA aparecerán aquí.",
        },
        retreats: {
          eyebrow: "Retiros",
          title: "Programas activos",
          guests: (n: number) => `${n} huéspedes`,
          inProgress: "En curso",
          upcoming: "Próximo",
          empty: "Sin programas activos",
          emptyHint: "Publica un retiro para verlo aquí.",
        },
        quickActions: {
          title: "Acciones rápidas",
          blockDates: "Bloquear fechas",
          createRetreat: "Crear nuevo retiro",
          updatePricing: "Actualizar precios de habitaciones",
        },
      },
      calendar: {
        title: "Calendario de Disponibilidad",
        subtitle: "Disponibilidad de habitaciones de tu propiedad, día a día.",
        perNight: "por noche",
        roomsLabel: "habitaciones",
        operationalLabel: "operativas",
        soldOut: "Completo",
        blockedCount: (n: number) => `${n} bloqueadas`,
        legendBlocked: "Bloqueado",
        selectHint: "Haz clic en un día y luego en otro de la misma fila para bloquear un rango.",
        unitsToBlock: "Unidades a bloquear",
        allUnits: "Todas las unidades",
        reasonPlaceholder: "Motivo (opcional)",
        blockAction: "Bloquear fechas",
        cancel: "Cancelar",
        blockedPeriods: "Períodos bloqueados",
        noBlocks: "No hay períodos bloqueados en este mes.",
        unassigned: "Reservas sin asignar",
        unassignedHint: "Reservas sin categoría de habitación. No se cuentan en la disponibilidad por tipo.",
        empty: "Tu inventario de habitaciones comienza aquí",
        emptyHint: "Define tus tipos de habitación para activar el calendario de disponibilidad.",
        legendAvailable: "Disponible",
        legendLow: "Limitada",
        legendFull: "Completo",
        today: "Hoy",
      },
      rooms: {
        title: "Habitaciones",
        subtitle: "Nombra, numera y gestiona cada habitación de tu propiedad.",
        addRoom: "Agregar habitación",
        numberPlaceholder: "Nombre o número de habitación",
        statuses: { available: "Disponible", out_of_service: "Fuera de servicio" },
        empty: "Tus habitaciones aparecerán aquí",
        emptyHint: "Define tus tipos de habitación y sus cantidades para generar habitaciones.",
        autoLabel: "Autogenerada",
        confirmDelete: "¿Quitar esta habitación? Su historial de reservas se conserva.",
      },
      roomTypes: {
        eyebrow: "Inventario de habitaciones",
        title: "Gestiona tus tipos de habitación",
        subtitle: "Define las categorías de habitación que ofrece tu propiedad.",
        summary: (types: number, units: number, available: number) =>
          `${types} tipo${types === 1 ? "" : "s"} de habitación · ${units} unidades totales · ${available} disponibles`,
        addRoomType: "Agregar tipo",
        empty: "Tu inventario de habitaciones comienza aquí",
        emptyHint: "Crea tu primer tipo de habitación para empezar a recibir reservas.",
        rate: "Tarifa",
        units: "Unidades",
        available: "Disponibles",
        maxGuests: "Huéspedes máx",
        occupancy: "Ocupación",
        perNight: "/noche",
        editDetails: "Editar detalles",
        manageUnits: "Gestionar unidades",
        delete: "Eliminar",
        confirmDelete: "¿Eliminar este tipo de habitación? Sus habitaciones y precios también se eliminan.",
        statuses: { active: "Activa", draft: "Borrador", inactive: "Inactiva" },
      },
      roomEditor: {
        createEyebrow: "Nuevo tipo de habitación",
        editEyebrow: "Editar tipo de habitación",
        stepOf: (n: number, total: number) => `Paso ${n} de ${total}`,
        steps: {
          details: "Detalles",
          amenities: "Amenidades",
          photos: "Fotos",
          availability: "Disponibilidad",
          pricing: "Precios",
        },
        cancel: "Cancelar",
        back: "Atrás",
        next: "Siguiente",
        save: "Guardar",
        saving: "Guardando…",
        saveError: "No pudimos guardar tus cambios. Inténtalo de nuevo.",
        preview: {
          title: "Vista previa",
          capacity: "Capacidad",
          units: "Unidades",
          bed: "Cama",
          rate: "Tarifa",
          amenities: "Amenidades",
          pending: "Pendiente",
          progress: "Progreso",
          guests: (n: number) => `${n} huésped${n === 1 ? "" : "es"}`,
          rooms: (n: number) => `${n} ${n === 1 ? "habitación" : "habitaciones"}`,
          configured: (n: number) => `${n} configuradas`,
        },
        details: {
          title: "Detalles de la habitación",
          subtitle: "Define la información básica y la configuración de este tipo de habitación.",
          name: "Nombre del tipo",
          namePlaceholder: "ej. Jungle Suite",
          description: "Descripción",
          descriptionPlaceholder: "Describe la habitación, sus vistas y qué la hace especial…",
          maxGuests: "Huéspedes máx",
          totalUnits: "Unidades totales",
          unitsHint: "Gestionar unidades individuales",
          bedType: "Tipo de cama",
          bedTypes: {
            single: "Individual",
            double: "Doble",
            queen: "Queen",
            king: "King",
            twin: "Twin",
            bunk: "Litera",
            sofa_bed: "Sofá cama",
          },
          roomSize: "Tamaño (m²)",
          status: "Estado",
        },
        amenitiesStep: {
          title: "Amenidades",
          subtitle: "Selecciona las amenidades y características disponibles en este tipo de habitación.",
          selected: (n: number) => `${n} amenidad${n === 1 ? "" : "es"} seleccionada${n === 1 ? "" : "s"}`,
          customGroup: "Amenidades personalizadas",
          customPlaceholder: "ej. Chimenea, Set de ceremonia de té…",
          addCustom: "Agregar",
          groups: {
            features: "Características",
            bathroom: "Baño",
            technology: "Tecnología",
            outdoor: "Exterior y vistas",
          },
          items: {
            air_conditioning: "Aire acondicionado",
            private_terrace: "Terraza privada",
            king_bed: "Cama king",
            minibar: "Minibar",
            safe_box: "Caja fuerte",
            desk: "Escritorio",
            closet: "Clóset",
            outdoor_shower: "Ducha exterior",
            rainfall_shower: "Ducha de lluvia",
            organic_toiletries: "Amenities orgánicos",
            bathtub: "Bañera",
            bidet: "Bidet",
            hair_dryer: "Secador de pelo",
            free_wifi: "Wi-Fi gratis",
            smart_tv: "Smart TV",
            bluetooth_speaker: "Parlante Bluetooth",
            usb_charging: "Carga USB",
            garden_view: "Vista al jardín",
            hammock: "Hamaca",
            ocean_view: "Vista al mar",
            pool_access: "Acceso a piscina",
            private_plunge_pool: "Piscina privada",
          },
        },
        photos: {
          title: "Fotos de la habitación",
          subtitle: "Gestiona las fotos de este tipo de habitación. Mínimo 3, máximo 8. La primera es la portada.",
          count: (n: number, max: number) => `${n} / ${max} fotos`,
          reorderHint: "Arrastra para reordenar · La primera es la portada",
          cover: "Portada",
          dropHint: "Arrastra tus imágenes aquí",
          browse: "o haz clic para seleccionar archivos",
          formats: "JPG, PNG o WebP · Máx 10 MB cada una",
          uploadFailed: "Error al subir",
          retry: "Reintentar",
          uploadFailedHint: "Algunas imágenes no se pudieron subir. Reintenta o quítalas para continuar.",
        },
        availability: {
          title: "Disponibilidad",
          subtitle: "Configura la disponibilidad por fechas y bloquea fechas para este tipo de habitación.",
          totalUnits: (n: number) => `${n} unidad${n === 1 ? "" : "es"} en total`,
          legendAvailable: "Disponible",
          legendBlocked: "Bloqueada",
          legendBooked: "Reservada",
          blockDates: "Bloquear fechas",
          blockedDates: "Fechas bloqueadas",
          unitsBlocked: (n: number, total: number) => `${n} de ${total} unidades bloqueadas`,
          noBlocks: "Sin períodos bloqueados para este tipo de habitación.",
          remove: "Quitar",
          unitsLabel: "Unidades a bloquear",
          allUnits: "Todas las unidades",
          reasonPlaceholder: "Motivo (opcional)",
          from: "Desde",
          to: "Hasta",
          add: "Bloquear fechas",
          cancel: "Cancelar",
          hint: "Las unidades bloqueadas se quitan del inventario reservable en las fechas seleccionadas.",
          selectHint: "Haz clic en una fecha de inicio y una de fin en el calendario para bloquearlas.",
          selectedLabel: "Seleccionado",
        },
        pricing: {
          title: "Precios",
          subtitle: "Define tarifas y descuentos por volumen para reservas grupales.",
          baseRate: "Tarifa base",
          pricePerNight: "Precio por noche (U$D)",
          currency: "Moneda",
          volumeTitle: "Precios por volumen",
          volumeHint: "Define tarifas según la cantidad de habitaciones reservadas. Cada nivel puede tener su propio rango de fechas.",
          addTier: "Agregar nivel",
          roomsCol: "Habitaciones",
          periodCol: "Período",
          priceCol: "Precio / noche",
          vsBase: "Vs base",
          anyPeriod: "Todo el año",
          minRooms: "Habitaciones mín",
          footnote: "El mismo nivel de volumen puede tener precios distintos para diferentes rangos de fechas.",
        },
      },
      retreats: {
        title: "Tus retiros",
        subtitle: "Crea y gestiona programas de retiro de bienestar en tu propiedad.",
        create: "Crear retiro",
        empty: "Tus retiros comienzan aquí",
        emptyHint: "Crea tu primer programa de retiro de bienestar y compártelo con la red HUMANA.",
        stats: { duration: "Duración", capacity: "Capacidad", price: "Precio", nextDate: "Próxima fecha" },
        nights: (n: number) => `${n} noche${n === 1 ? "" : "s"}`,
        guestsMax: (n: number) => `${n} huéspedes máx`,
        perPerson: "/persona",
        editDetails: "Editar detalles",
        viewProgram: "Ver programa",
        viewGallery: "Ver galería",
        delete: "Eliminar",
        confirmDelete: "¿Eliminar este borrador de retiro? Esta acción no se puede deshacer.",
        statuses: {
          draft: "Borrador",
          pending_review: "En revisión",
          active: "Activo",
          upcoming: "Próximo",
          closed: "Cerrado",
          cancelled: "Cancelado",
        },
        wizard: {
          eyebrow: "Crear nuevo retiro",
          editEyebrow: "Editar retiro",
          title: "Crea un retiro en tu propiedad",
          subtitle: "Configura los detalles del retiro que se hospedará en tu hotel.",
          steps: { info: "Info", program: "Programa", pricing: "Precios", gallery: "Galería", review: "Revisión" },
          stepOf: (n: number, total: number) => `Paso ${n} de ${total}`,
          back: "Atrás",
          next: "Siguiente",
          saving: "Guardando…",
          saveError: "No pudimos guardar tus cambios. Inténtalo de nuevo.",
          preview: {
            title: "Vista previa del retiro",
            hotel: "Hotel",
            nameLabel: "Nombre",
            type: "Tipo",
            dates: "Fechas",
            capacity: "Capacidad",
            program: "Programa",
            basePrice: "Precio base",
            gallery: "Galería",
            pending: "Pendiente",
            progress: "Progreso",
            readyToPublish: "Listo para publicar",
            daysCount: (n: number) => `${n} día${n === 1 ? "" : "s"}`,
            imagesCount: (n: number) => `${n} imagen${n === 1 ? "" : "es"}`,
            guests: (n: number) => `${n} huéspedes`,
          },
          types: {
            wellness: "Bienestar",
            spiritual: "Espiritual",
            corporate: "Corporativo",
            adventure: "Aventura",
            medical: "Médico",
          },
          info: {
            title: "Información básica",
            subtitle: "Completa los datos generales de tu retiro.",
            name: "Nombre del retiro",
            namePlaceholder: "ej. El Arte del Silencio",
            type: "Tipo de experiencia",
            nights: "Duración (noches)",
            startDate: "Fecha de inicio",
            endDate: "Fecha de fin",
            endDateAuto: "(auto)",
            capacity: "Capacidad máxima",
            language: "Idioma del retiro",
            description: "Descripción",
            descriptionPlaceholder:
              "Describe la experiencia, su propósito y qué la hace única…",
          },
          program: {
            title: "Programa del retiro",
            subtitle: (n: number) =>
              `Define las actividades día por día de tu retiro de ${n} noches.`,
            dayLabel: (n: number) => `Día ${n}`,
            dayTitlePlaceholder: "ej. Llegada y bienvenida",
            activitiesCount: (n: number) => `${n} actividad${n === 1 ? "" : "es"}`,
            addActivity: "Agregar actividad",
            activityPlaceholder: "Nombre de la actividad",
            facilitators: "Facilitadores",
            facilitatorCount: (n: number, max: number) => `${n} de ${max}`,
            addFacilitator: "Agregar facilitador",
            facilitatorNamePlaceholder: "Nombre completo",
            specialtyPlaceholder: "Especialidad (ej. Instructor de yoga y movimiento)",
            lead: "Principal",
            assistant: "Asistente",
            included: "Qué incluye",
            addItem: "Agregar ítem",
            itemPlaceholder: "ej. Comidas plant-based",
          },
          pricing: {
            title: "Precios por habitación",
            subtitle: "Define el precio por persona según el tipo de habitación para tu retiro.",
            room: "Habitación",
            roomsCapacity: "Habitaciones / Capacidad",
            pricePerGuest: "Precio / Huésped",
            include: "Incluir",
            includeHint: "Solo las habitaciones que selecciones estarán disponibles para reservar en este retiro.",
            availabilityLabel: (n: number, total: number) => `${n} de ${total} unidades libres en tus fechas`,
            noAvailabilityLabel: "Sin disponibilidad en las fechas del retiro",
            coverageLabel: (covered: number, total: number) => `Las habitaciones seleccionadas alojan hasta ${covered} de ${total} huéspedes`,
            coverageOk: "Capacidad máxima cubierta",
            coverageShort: "Incluye más habitaciones para alcanzar la capacidad máxima del retiro.",
            totalPrice: "Precio total",
            guests: (n: number) => `${n} huésped${n === 1 ? "" : "es"}`,
            earningsTitle: "Ingresos totales estimados",
            agencyCommission: (pct: number) => `Comisión de agencia (${pct}%)`,
            officeCommission: (pct: number) => `Comisión de oficina (${pct}%)`,
            creatorIncome: (pct: number) => `Ingreso del creador (${pct}%)`,
            totalEarnings: "Ingresos totales estimados",
            empty: "Aún no hay tipos de habitación",
            emptyHint: "Define primero tus tipos de habitación para poder fijar precios por habitación.",
          },
          gallery: {
            title: "Galería de imágenes",
            subtitle:
              "Sube fotos de tu propiedad, áreas comunes y amenidades. Mínimo 3, máximo 10.",
            dropHint: "Arrastra tus imágenes aquí",
            browse: "o haz clic para seleccionar archivos",
            formats: "JPG, PNG o WebP · Máx 10 MB cada una",
            cover: "Portada",
            reorderHint: "Arrastra para reordenar · La primera es la portada",
            previewCount: (n: number, max: number) => `Vista previa (${n}/${max})`,
            uploadFailed: "Error al subir",
            retry: "Reintentar",
            uploadFailedHint:
              "Algunas imágenes no se pudieron subir. Reintenta o quítalas para continuar.",
          },
          review: {
            title: "Revisar y publicar",
            subtitle: "Revisa todos los detalles antes de publicar tu retiro.",
            edit: "Editar",
            hotel: "Hotel",
            basicInfo: "Información básica",
            nameLabel: "Nombre",
            typeLabel: "Tipo",
            durationLabel: "Duración",
            capacityLabel: "Capacidad",
            languageLabel: "Idioma",
            program: "Programa",
            activitiesCount: (n: number) => `${n} actividad${n === 1 ? "" : "es"}`,
            facilitators: "Facilitadores",
            included: "Qué incluye",
            pricingRooms: "Precios y habitaciones",
            roomsCount: (n: number) => `${n} ${n === 1 ? "habitación" : "habitaciones"}`,
            perGuest: "/huésped",
            gallery: "Galería",
            imagesCount: (n: number) => `${n} imagen${n === 1 ? "" : "es"}`,
            publish: "Publicar retiro",
            publishing: "Publicando…",
          },
          confirmation: {
            eyebrow: "Retiro publicado",
            title: (name: string) => `¡${name} publicado!`,
            subtitle: "Tu retiro ya está disponible en la plataforma HUMANA.",
            reference: "Referencia",
            retreat: "Retiro",
            startDate: "Fecha de inicio",
            hotel: "Hotel",
            capacity: "Capacidad",
            type: "Tipo",
            priceFrom: "Precio desde",
            roomsConfigured: "Habitaciones configuradas",
            typesCount: (n: number) => `${n} tipo${n === 1 ? "" : "s"}`,
            viewRetreat: "Ver retiro",
            backToRetreats: "Volver a retiros",
          },
        },
      },
      bookings: {
        eyebrow: "GESTIÓN DE RESERVAS",
        title: "Reservas",
        calendarTitle: "Calendario de disponibilidad",
        subtitle: "Gestiona las reservas de tu propiedad.",
        searchPlaceholder: "Buscar por referencia o huésped…",
        exportBtn: "Exportar",
        tabReservations: "Reservas",
        tabCalendar: "Calendario",
        kpis: { total: "Total reservas", pending: "Pendientes", revenue: "Ingresos", occupancy: "Ocupación" },
        filters: { all: "Todas", confirmed: "Confirmadas", pending: "Pendientes", checkedIn: "Completadas", cancelled: "Canceladas" },
        empty: "Aún no hay reservas",
        emptyHint: "Cuando las agencias reserven tu propiedad, las reservas aparecerán aquí.",
        columns: { reference: "Referencia" },
        statusLabels: { inquiry: "Pendiente", confirmed: "Confirmada", completed: "Completada", cancelled: "Cancelada" },
        confirmAction: "Confirmar",
        cancelAction: "Cancelar",
      },
      settings: {
        eyebrow: "CONFIGURACIÓN",
        title: "Configuración",
        subtitle: "Administra el perfil de tu hotel, cuenta, suscripción y pagos.",
        tabs: { profile: "Perfil", property: "Propiedad", account: "Cuenta", subscription: "Suscripción", payments: "Pagos" },
        property: {
          eyebrow: "PROPIEDAD",
          title: "Detalles de la propiedad",
          subtitle: "Mantén al día tu descripción, horarios, amenidades y fotos.",
          descriptionLabel: "Descripción",
          starsLabel: "Clasificación por estrellas",
          checkInLabel: "Hora de check-in",
          checkOutLabel: "Hora de check-out",
          amenitiesTitle: "Amenidades",
          amenitiesHint: "Selecciona todo lo que ofrece tu propiedad.",
          customAmenities: "Amenidades personalizadas",
          customPlaceholder: "ej. Chimenea, Set de ceremonia de té…",
          addCustom: "Agregar",
          photosTitle: "Fotos",
          photosHint: "La primera foto es la portada que se muestra en la red.",
          cover: "Portada",
          addPhotos: "Agregar fotos",
        },
        profile: {
          eyebrow: "IDENTIDAD DEL HOTEL",
          hotelName: "Nombre del hotel",
          location: "Ubicación",
          contactEmail: "Email",
          phone: "Teléfono",
          save: "Guardar Cambios",
          saving: "Guardando…",
          saved: "Cambios guardados",
        },
        account: {
          eyebrow: "CUENTA Y SEGURIDAD",
          changePasswordTitle: "Cambiar contraseña",
          changePasswordHint: "Restablece tu contraseña con un enlace seguro enviado a tu email.",
          currentEmail: "Email actual",
          sendOtp: "Enviar OTP",
          deactivateTitle: "Desactivar o eliminar cuenta",
          deactivateHint: "Desactivar oculta tu propiedad de la red HUMANA. Eliminar borra todos los datos permanentemente.",
          deactivateAction: "Desactivar Cuenta",
          deleteAction: "Eliminar Cuenta",
          passwordModalTitle: "Cambiar Contraseña",
          passwordModalHint: "Enviaremos un enlace seguro de restablecimiento a tu email registrado.",
          passwordModalSend: "Enviar Enlace",
          passwordModalSending: "Enviando…",
          passwordModalSent: "¡Email Enviado!",
          passwordModalSentHint: "Revisa tu bandeja de entrada. El enlace expirará en 1 hora.",
          deactivateModalTitle: "Desactivar Cuenta",
          deactivateModalWarning: "Tu propiedad será ocultada de la red HUMANA. Las reservas activas permanecerán pero no se podrán hacer nuevas reservas. Puedes reactivar contactando a soporte.",
          deactivateModalConfirm: "Desactivar Cuenta",
          deactivateModalCancel: "Cancelar",
          deactivateModalProcessing: "Procesando…",
          deleteModalTitle: "Eliminar Cuenta",
          deleteModalWarningStep1: "Esta acción es permanente y no se puede deshacer. Todos tus datos incluyendo perfil del hotel, tipos de habitación, reservas e información de retiros serán eliminados permanentemente.",
          deleteModalContinue: "Continuar",
          deleteModalStep2Hint: "Para confirmar, escribe la frase a continuación:",
          deleteModalConfirmPhrase: "quiero eliminar mi cuenta de humana",
          deleteModalDeleteForever: "Eliminar Para Siempre",
          deleteModalDeleting: "Eliminando…",
          deleteModalCancel: "Cancelar",
        },
        subscription: {
          eyebrow: "SUSCRIPCIÓN",
          title: "Elige Tu Plan",
          subtitle: "Selecciona el plan que mejor se adapte a las necesidades de tu hotel.",
          sponsoredTitle: "Acceso Patrocinado",
          sponsoredBody: "Tu hotel cuenta con acceso completo a la plataforma, patrocinado por HUMANA. Un plan de suscripción activo es opcional.",
          perMonth: "/mes",
          commission: "comisión",
          currentPlan: "Plan Actual",
          selectPlan: "Seleccionar Plan",
          selecting: "Seleccionando…",
          features: {
            basic_listing: "Listado básico",
            email_support: "Soporte por email",
            max_room_types: "Hasta 5 tipos de habitación",
            featured_listing: "Listado destacado",
            priority_support: "Soporte prioritario",
            unlimited_room_types: "Tipos de habitación ilimitados",
            retreat_creation: "Creación de retiros",
            analytics: "Panel de analíticas",
            premium_listing: "Listado premium",
            dedicated_support: "Soporte dedicado",
            unlimited_everything: "Todo ilimitado",
            api_access: "Acceso a API",
            white_label: "Marca blanca",
          },
        },
        payments: {
          eyebrow: "RECEPCIÓN DE PAGOS",
          title: "Cuenta Bancaria",
          accountHolder: "Nombre del Titular",
          iban: "IBAN",
          swift: "SWIFT / BIC",
          currency: "Moneda",
          country: "País",
          save: "Guardar Datos Bancarios",
          saving: "Guardando…",
          statusConfigured: "Configurado",
          statusPending: "Pendiente",
          paymentsReceived: "Pagos Recibidos",
          noPayments: "No se han recibido pagos aún.",
        },
      },
    },
    agencyWs: {
      badge: "Socio Agencia",
      nav: {
        discover: "Descubrir",
        clients: "Clientes",
        bookings: "Reservas",
        myRetreats: "Mis Retiros",
        settings: "Configuración",
      },
      clients: {
        eyebrow: "GESTIÓN DE CLIENTES",
        title: "Tus Clientes",
        subtitle: "Administra tu cartera de clientes y su historial de reservas.",
        addClient: "Agregar Cliente",
        searchPlaceholder: "Buscar por nombre o email…",
        empty: "Aún no hay clientes",
        emptyHint: "Agrega tu primer cliente para comenzar a gestionar reservas.",
        columns: { name: "Nombre", email: "Email", phone: "Teléfono", notes: "Notas", bookings: "Reservas", created: "Creado", actions: "Acciones" },
        modal: { addTitle: "Agregar Nuevo Cliente", editTitle: "Editar Cliente", namePlaceholder: "Nombre completo", emailPlaceholder: "email@ejemplo.com", phonePlaceholder: "+1 555 000 0000", notesPlaceholder: "Notas internas…", save: "Guardar", saving: "Guardando…", cancel: "Cancelar" },
        deleteTitle: "Eliminar Cliente",
        deleteMessage: "¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.",
        deleteConfirm: "Eliminar",
        deleteCancel: "Cancelar",
      },
      bookings: {
        eyebrow: "HISTORIAL DE RESERVAS",
        title: "Tus Reservas",
        subtitle: "Rastrea todas las reservaciones y comisiones ganadas.",
        searchPlaceholder: "Buscar reservas…",
        exportBtn: "Exportar",
        empty: "Aún no hay reservas",
        emptyHint: "Tu historial de reservas aparecerá aquí una vez que realices tu primera reservación.",
        kpis: { total: "Total de Reservas", confirmed: "Confirmadas", commission: "Comisión Ganada", volume: "Volumen Total" },
        filters: { all: "Todas", inquiry: "Pendientes", confirmed: "Confirmadas", completed: "Completadas", cancelled: "Canceladas" },
        statusLabels: { inquiry: "Pendiente", confirmed: "Confirmada", completed: "Completada", cancelled: "Cancelada" },
        columns: { reference: "Referencia", client: "Cliente", experience: "Experiencia", dates: "Fechas", amount: "Monto", commission: "Comisión", status: "Estado" },
      },
      settings: {
        eyebrow: "CONFIGURACIÓN",
        title: "Configuración de Agencia",
        subtitle: "Gestiona el perfil de tu agencia y preferencias de cuenta.",
        tabs: { profile: "Perfil", account: "Cuenta", subscription: "Suscripción", payments: "Pagos" },
        profile: {
          eyebrow: "PERFIL DE AGENCIA",
          agencyName: "Nombre de Agencia",
          legalName: "Razón Social",
          contactEmail: "Email de Contacto",
          phone: "Teléfono",
          location: "Ubicación",
          website: "Sitio Web",
          taxId: "NIF / ID Fiscal",
          save: "Guardar Cambios",
          saving: "Guardando…",
          saved: "Cambios guardados exitosamente",
        },
        account: {
          eyebrow: "CUENTA Y SEGURIDAD",
          changePasswordTitle: "Cambiar Contraseña",
          changePasswordHint: "Enviaremos un enlace de restablecimiento a tu email registrado.",
          currentEmail: "Email Actual",
          deactivateTitle: "Estado de Cuenta",
          deactivateHint: "Desactiva temporalmente o elimina permanentemente tu cuenta.",
          deactivateAction: "Desactivar",
          deleteAction: "Eliminar Cuenta",
          passwordModalTitle: "Restablecer Contraseña",
          passwordModalHint: "Enviaremos un enlace seguro de restablecimiento a tu email.",
          passwordModalSend: "Enviar Enlace",
          passwordModalSending: "Enviando…",
          passwordModalSent: "Email Enviado",
          passwordModalSentHint: "Revisa tu bandeja de entrada para el enlace de restablecimiento.",
          deactivateModalTitle: "Desactivar Cuenta",
          deactivateModalWarning: "Tu cuenta será suspendida. Puedes reactivarla contactando a soporte.",
          deactivateModalCancel: "Cancelar",
          deactivateModalConfirm: "Desactivar",
          deactivateModalProcessing: "Procesando…",
          deleteModalTitle: "Eliminar Cuenta",
          deleteModalWarningStep1: "Esto eliminará permanentemente tu cuenta de agencia, todos los datos de clientes e historial de reservas. No se puede deshacer.",
          deleteModalCancel: "Cancelar",
          deleteModalContinue: "Continuar",
          deleteModalStep2Hint: "Escribe la frase a continuación para confirmar la eliminación:",
          deleteModalConfirmPhrase: "ELIMINAR MI CUENTA",
          deleteModalDeleteForever: "Eliminar para Siempre",
          deleteModalDeleting: "Eliminando…",
        },
        subscription: {
          eyebrow: "SUSCRIPCIÓN",
          title: "Elige Tu Plan",
          subtitle: "Selecciona el plan que mejor se adapte a las necesidades de tu agencia.",
          perMonth: "/mes",
          commission: "comisión",
          currentPlan: "Plan Actual",
          selectPlan: "Seleccionar Plan",
          selecting: "Seleccionando…",
          features: {
            max_bookings: "Hasta 10 reservas/mes",
            max_bookings_unlimited: "Reservas ilimitadas",
            max_clients: "Hasta 50 clientes",
            max_clients_unlimited: "Clientes ilimitados",
            support_email: "Soporte por email",
            support_priority: "Soporte prioritario",
            support_dedicated: "Soporte dedicado",
            analytics_basic: "Analítica básica",
            analytics_advanced: "Analítica avanzada",
            analytics_full: "Suite completa de analítica",
            custom_branding: "Marca personalizada",
            api_access: "Acceso API",
            white_label: "Marca blanca",
            sla: "SLA 99.9%",
          },
        },
        payments: { eyebrow: "PAGOS", title: "Configuración de Pagos", subtitle: "Configura cómo recibes los pagos de comisiones.", comingSoon: "Configuración de pagos próximamente." },
      },
      myRetreats: {
        eyebrow: "MIS RETIROS",
        title: "Tus Retiros",
        subtitle: "Crea y gestiona retiros en hoteles asociados.",
        createRetreat: "Crear Retiro",
        empty: "Aún no hay retiros",
        emptyHint: "Crea tu primer retiro para comenzar a ofrecer experiencias de bienestar curadas.",
        filters: { all: "Todos", draft: "Borrador", pending_review: "En Revisión", active: "Activos", closed: "Cerrados" },
        statusLabels: { draft: "Borrador", pending_review: "En Revisión", active: "Activo", upcoming: "Próximo", closed: "Cerrado", cancelled: "Cancelado" },
        kpis: { total: "Total Retiros", active: "Activos", draft: "Borradores", pending: "En Revisión" },
        columns: { name: "Retiro", hotel: "Hotel", dates: "Fechas", capacity: "Capacidad", price: "Desde", status: "Estado", actions: "Acciones" },
        deleteTitle: "Eliminar Retiro",
        deleteMessage: "¿Estás seguro de que quieres eliminar este retiro en borrador? Esta acción no se puede deshacer.",
        deleteConfirm: "Eliminar",
        deleteCancel: "Cancelar",
        submitTitle: "Enviar a Revisión",
        submitMessage: "Una vez enviado, el retiro será revisado por el equipo de HUMANA antes de publicarse.",
        submitConfirm: "Enviar",
        submitCancel: "Cancelar",
      },
    },
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
    resetPassword: {
      eyebrow: "RESTABLECER CONTRASEÑA",
      title: "Establece tu nueva contraseña",
      subtitle: "Elige una contraseña segura para tu cuenta HUMANA.",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar contraseña",
      placeholder: "Mínimo 8 caracteres",
      submit: "Restablecer Contraseña",
      submitting: "Restableciendo…",
      success: "¡Contraseña Restablecida!",
      successHint: "Tu contraseña ha sido actualizada. Redirigiendo a tu panel…",
      errorInvalid: "Este enlace de restablecimiento es inválido o ya fue utilizado.",
      errorExpired: "Este enlace ha expirado. Solicita uno nuevo.",
      errorMismatch: "Las contraseñas no coinciden.",
      errorMinLength: "La contraseña debe tener al menos 8 caracteres.",
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
      viewRooms: "Ver habitaciones",
      viewHotel: "Ver hotel",
      notFound: "Hotel no encontrado",
      boutiqueHotel: "Hotel Boutique",
      info: "Info",
      capacity: "Capacidad",
      personCount: (n) => n === 1 ? "1 persona" : `${n} personas`,
      bookNow: "Reservar ahora",
      roomCount: (n) => n === 1 ? "1 hospedaje" : `${n} hospedajes`,
      activeRetreats: (n) => n === 1 ? "1 retiro activo" : `${n} retiros activos`,
      hotelSubtitle: "Hoteles holísticos asignados a tu agencia en este país.",
      bookLodging: "Reservar Alojamiento",
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
        status: { active: "Activo", pending: "Pendiente", suspended: "Suspendido", rejected: "Rechazado", changes_requested: "Cambios solicitados" },
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
        pendingChangesNote: "Este hotel tiene cambios sin publicar. La aprobación estará disponible cuando publique su última versión.",
        changesRequestedNote: "Comentarios enviados — esperando que el hotel publique sus cambios.",
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
        popular: "Popular",
        free: "Gratis",
        view: "Ver",
        cancel: "Cancelar",
        features: {
          emailSupport: "Soporte por email",
          prioritySupport: "Soporte prioritario",
          dedicatedSupport: "Soporte dedicado",
          basicAnalytics: "Analíticas básicas",
          advancedAnalytics: "Analíticas avanzadas",
          fullAnalytics: "Analíticas completas",
          hotelAccess: "Acceso a hoteles",
          retreatAccess: "Acceso a retiros",
          retreatCreation: "Creación de retiros",
        },
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
        steps: ["Identidad", "Habitaciones", "Amenities", "Fotos", "Revisión"],
        step5Eyebrow: "Paso 5 de 5 · Revisión y Estado",
        step5Title: "Revisa tu propiedad",
        step5Sub: "Confirma que todo lo siguiente sea correcto. Puedes editar cualquier sección — los cambios se guardan al completar cada paso.",
        reviewEdit: "Editar",
        reviewHotelInfo: "Información de la propiedad",
        reviewRooms: "Habitaciones",
        reviewAmenities: "Amenities",
        reviewPhotos: "Fotos",
        reviewUnits: "unidades",
        reviewPerNight: "/ noche",
        reviewGuests: "huéspedes",
        reviewNoPhotos: "Aún no agregaste fotos.",
        reviewStatusDraftTitle: "Listo para enviar",
        reviewStatusDraftBody: "Revisa la información de tu propiedad y envíala para la verificación de nuestro equipo.",
        reviewStatusPendingTitle: "En revisión",
        reviewStatusPendingBody: "Nuestro equipo está revisando tu propiedad. Puedes seguir mejorando tu información — las actualizaciones se guardan y son visibles para los revisores.",
        reviewStatusApprovedTitle: "Aprobada",
        reviewStatusApprovedBody: "Tu propiedad es parte de la red HUMANA. Tu espacio de trabajo completo está listo.",
        reviewStatusChangesTitle: "Cambios sin publicar",
        reviewStatusChangesBody: "Hiciste cambios desde tu último envío. Publícalos para que nuestro equipo revise tu versión más reciente.",
        reviewStatusFeedbackTitle: "Cambios solicitados",
        reviewStatusFeedbackBody: "Nuestro equipo revisó tu propiedad y tiene comentarios para que atiendas:",
        submitForReviewCta: "Enviar a revisión",
        publishChangesCta: "Publicar cambios",
        publish: "Publicar",
        step1Eyebrow: "Paso 1 de 5 \u00B7 Identidad de la Propiedad",
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
        step2Eyebrow: "Paso 2 de 5 \u00B7 Inventario de Habitaciones",
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
        availabilitySub: "Todas las fechas est\u00E1n abiertas para reservas por defecto. Selecciona un rango para bloquear fechas cuando las habitaciones no est\u00E9n disponibles (cierres de temporada, renovaciones).",
        legendAvailable: "Disponible",
        legendLow: "Baja disponibilidad",
        legendFullyBlocked: "Totalmente bloqueado",
        legendSelected: "Seleccionado",
        legendBlocked: "Bloqueado",
        availableUnits: "Unidades a bloquear",
        blockDates: "Bloquear",
        configuredBlocks: "Per\u00EDodos Bloqueados",
        noBlocksYet: "No hay fechas bloqueadas \u2014 todos los d\u00EDas est\u00E1n abiertos para reservas. Selecciona un rango en el calendario para bloquear fechas.",
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
        step3Eyebrow: "Paso 3 de 5 · Amenities",
        step3Title: "Dile a los huéspedes qué ofrece tu lugar.",
        step3Subtitle: "Selecciona todo lo que aplique. Puedes refinar la lista después de publicar.",
        guestFavorites: "Favoritas de los Hu\u00E9spedes",
        standoutAmenities: "Amenities Destacadas",
        customAmenity: "Amenity Personalizada",
        customPlaceholder: "ej. Terraza en la azotea, Alquiler de bicicletas...",
        addButton: "Agregar",
        amenityCount: (selected: number, custom: number) => `${selected} amenidad${selected !== 1 ? "es" : ""} seleccionada${selected !== 1 ? "s" : ""}${custom > 0 ? ` + ${custom} personalizada${custom !== 1 ? "s" : ""}` : ""}`,
        step4Eyebrow: "Paso 4 de 5 \u00B7 Fotos de la Propiedad",
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
    hotelWs: {
      badge: "Hotel Partner",
      nav: { dashboard: "Dashboard", calendar: "Calendário", rooms: "Quartos", retreats: "Retiros", bookings: "Reservas", settings: "Configurações" },
      paywall: {
        eyebrow: "ASSINATURA NECESSÁRIA",
        title: "Escolha um plano para continuar",
        body: "Selecione um plano de assinatura para desbloquear seu espaço de hotel e começar a gerenciar sua propriedade, reservas e retiros.",
        cta: "SELECIONAR UM PLANO",
      },
      dashboard: {
        eyebrowWeek: (week: number) => `Semana ${week}`,
        welcome: (name: string) => `Bem-vindo de volta, ${name}`,
        roomsCount: (n: number) => `${n} quarto${n === 1 ? "" : "s"}`,
        memberSince: (date: string) => `Membro desde ${date}`,
        lastThirtyDays: "Últimos 30 dias",
        kpis: {
          occupancy: "Taxa de ocupação",
          occupancyDelta: (pts: number) => `${pts >= 0 ? "+" : ""}${pts}% vs. mês anterior`,
          revenue: "Receita deste mês",
          revenueDelta: (amount: string, month: string) => `${amount} vs. ${month}`,
          upcomingGuests: "Próximos hóspedes",
          upcomingHint: (n: number) => `Próximos 7 dias · ${n} check-in${n === 1 ? "" : "s"} hoje`,
          activeRetreats: "Retiros ativos",
          retreatsHint: (inProgress: number, upcoming: number) =>
            `${inProgress} em andamento · ${upcoming} próximos`,
        },
        checkIns: {
          eyebrow: "Próximos",
          title: "Próximos check-ins",
          viewAll: "Ver todos",
          today: "Check-in hoje",
          inDays: (n: number) => `Em ${n} dia${n === 1 ? "" : "s"}`,
          empty: "Sem check-ins próximos",
          emptyHint: "As reservas feitas através da rede HUMANA aparecerão aqui.",
        },
        retreats: {
          eyebrow: "Retiros",
          title: "Programas ativos",
          guests: (n: number) => `${n} hóspedes`,
          inProgress: "Em andamento",
          upcoming: "Próximo",
          empty: "Sem programas ativos",
          emptyHint: "Publique um retiro para vê-lo aqui.",
        },
        quickActions: {
          title: "Ações rápidas",
          blockDates: "Bloquear datas",
          createRetreat: "Criar novo retiro",
          updatePricing: "Atualizar preços dos quartos",
        },
      },
      calendar: {
        title: "Calendário de Disponibilidade",
        subtitle: "Disponibilidade de quartos da sua propriedade, dia a dia.",
        perNight: "por noite",
        roomsLabel: "quartos",
        operationalLabel: "operacionais",
        soldOut: "Esgotado",
        blockedCount: (n: number) => `${n} bloqueados`,
        legendBlocked: "Bloqueado",
        selectHint: "Clique num dia e depois noutro da mesma linha para bloquear um intervalo.",
        unitsToBlock: "Unidades a bloquear",
        allUnits: "Todas as unidades",
        reasonPlaceholder: "Motivo (opcional)",
        blockAction: "Bloquear datas",
        cancel: "Cancelar",
        blockedPeriods: "Períodos bloqueados",
        noBlocks: "Não há períodos bloqueados neste mês.",
        unassigned: "Reservas não atribuídas",
        unassignedHint: "Reservas sem categoria de quarto. Não são contadas na disponibilidade por tipo.",
        empty: "O seu inventário de quartos começa aqui",
        emptyHint: "Defina os seus tipos de quarto para ativar o calendário de disponibilidade.",
        legendAvailable: "Disponível",
        legendLow: "Limitada",
        legendFull: "Esgotado",
        today: "Hoje",
      },
      rooms: {
        title: "Quartos",
        subtitle: "Nomeie, numere e gerencie cada quarto da sua propriedade.",
        addRoom: "Adicionar quarto",
        numberPlaceholder: "Nome ou número do quarto",
        statuses: { available: "Disponível", out_of_service: "Fora de serviço" },
        empty: "Os seus quartos aparecerão aqui",
        emptyHint: "Defina os seus tipos de quarto e as suas quantidades para gerar quartos.",
        autoLabel: "Gerado automaticamente",
        confirmDelete: "Remover este quarto? O histórico de reservas é preservado.",
      },
      roomTypes: {
        eyebrow: "Inventário de quartos",
        title: "Gerencie os seus tipos de quarto",
        subtitle: "Defina as categorias de quarto oferecidas na sua propriedade.",
        summary: (types: number, units: number, available: number) =>
          `${types} tipo${types === 1 ? "" : "s"} de quarto · ${units} unidades no total · ${available} disponíveis`,
        addRoomType: "Adicionar tipo",
        empty: "O seu inventário de quartos começa aqui",
        emptyHint: "Crie o seu primeiro tipo de quarto para começar a receber reservas.",
        rate: "Tarifa",
        units: "Unidades",
        available: "Disponíveis",
        maxGuests: "Hóspedes máx",
        occupancy: "Ocupação",
        perNight: "/noite",
        editDetails: "Editar detalhes",
        manageUnits: "Gerenciar unidades",
        delete: "Excluir",
        confirmDelete: "Excluir este tipo de quarto? Os seus quartos e preços também serão removidos.",
        statuses: { active: "Ativo", draft: "Rascunho", inactive: "Inativo" },
      },
      roomEditor: {
        createEyebrow: "Novo tipo de quarto",
        editEyebrow: "Editar tipo de quarto",
        stepOf: (n: number, total: number) => `Etapa ${n} de ${total}`,
        steps: {
          details: "Detalhes",
          amenities: "Comodidades",
          photos: "Fotos",
          availability: "Disponibilidade",
          pricing: "Preços",
        },
        cancel: "Cancelar",
        back: "Voltar",
        next: "Próximo",
        save: "Salvar",
        saving: "Salvando…",
        saveError: "Não foi possível salvar as alterações. Tente novamente.",
        preview: {
          title: "Prévia do quarto",
          capacity: "Capacidade",
          units: "Unidades",
          bed: "Cama",
          rate: "Tarifa",
          amenities: "Comodidades",
          pending: "Pendente",
          progress: "Progresso",
          guests: (n: number) => `${n} hóspede${n === 1 ? "" : "s"}`,
          rooms: (n: number) => `${n} quarto${n === 1 ? "" : "s"}`,
          configured: (n: number) => `${n} configuradas`,
        },
        details: {
          title: "Detalhes do quarto",
          subtitle: "Defina as informações básicas e a configuração deste tipo de quarto.",
          name: "Nome do tipo",
          namePlaceholder: "ex. Jungle Suite",
          description: "Descrição",
          descriptionPlaceholder: "Descreva o quarto, as suas vistas e o que o torna especial…",
          maxGuests: "Hóspedes máx",
          totalUnits: "Unidades totais",
          unitsHint: "Gerenciar unidades individuais",
          bedType: "Tipo de cama",
          bedTypes: {
            single: "Solteiro",
            double: "Casal",
            queen: "Queen",
            king: "King",
            twin: "Twin",
            bunk: "Beliche",
            sofa_bed: "Sofá-cama",
          },
          roomSize: "Tamanho (m²)",
          status: "Status",
        },
        amenitiesStep: {
          title: "Comodidades",
          subtitle: "Selecione as comodidades e características disponíveis neste tipo de quarto.",
          selected: (n: number) => `${n} comodidade${n === 1 ? "" : "s"} selecionada${n === 1 ? "" : "s"}`,
          customGroup: "Comodidades personalizadas",
          customPlaceholder: "ex. Lareira, Kit de cerimônia do chá…",
          addCustom: "Adicionar",
          groups: {
            features: "Características",
            bathroom: "Banheiro",
            technology: "Tecnologia",
            outdoor: "Exterior e vistas",
          },
          items: {
            air_conditioning: "Ar-condicionado",
            private_terrace: "Terraço privativo",
            king_bed: "Cama king",
            minibar: "Frigobar",
            safe_box: "Cofre",
            desk: "Escrivaninha",
            closet: "Closet",
            outdoor_shower: "Ducha externa",
            rainfall_shower: "Chuveiro de chuva",
            organic_toiletries: "Amenities orgânicos",
            bathtub: "Banheira",
            bidet: "Bidê",
            hair_dryer: "Secador de cabelo",
            free_wifi: "Wi-Fi grátis",
            smart_tv: "Smart TV",
            bluetooth_speaker: "Caixa de som Bluetooth",
            usb_charging: "Carregamento USB",
            garden_view: "Vista para o jardim",
            hammock: "Rede",
            ocean_view: "Vista para o mar",
            pool_access: "Acesso à piscina",
            private_plunge_pool: "Piscina privativa",
          },
        },
        photos: {
          title: "Fotos do quarto",
          subtitle: "Gerencie as fotos deste tipo de quarto. Mínimo 3, máximo 8. A primeira é a capa.",
          count: (n: number, max: number) => `${n} / ${max} fotos`,
          reorderHint: "Arraste para reordenar · A primeira é a capa",
          cover: "Capa",
          dropHint: "Arraste as suas imagens aqui",
          browse: "ou clique para selecionar arquivos",
          formats: "JPG, PNG ou WebP · Máx 10 MB cada",
          uploadFailed: "Falha no envio",
          retry: "Tentar novamente",
          uploadFailedHint: "Algumas imagens não puderam ser enviadas. Tente novamente ou remova-as para continuar.",
        },
        availability: {
          title: "Disponibilidade",
          subtitle: "Configure a disponibilidade por datas e bloqueie datas para este tipo de quarto.",
          totalUnits: (n: number) => `${n} unidade${n === 1 ? "" : "s"} no total`,
          legendAvailable: "Disponível",
          legendBlocked: "Bloqueado",
          legendBooked: "Reservado",
          blockDates: "Bloquear datas",
          blockedDates: "Datas bloqueadas",
          unitsBlocked: (n: number, total: number) => `${n} de ${total} unidades bloqueadas`,
          noBlocks: "Sem períodos bloqueados para este tipo de quarto.",
          remove: "Remover",
          unitsLabel: "Unidades a bloquear",
          allUnits: "Todas as unidades",
          reasonPlaceholder: "Motivo (opcional)",
          from: "De",
          to: "Até",
          add: "Bloquear datas",
          cancel: "Cancelar",
          hint: "As unidades bloqueadas são removidas do inventário reservável nas datas selecionadas.",
          selectHint: "Clique em uma data de início e uma de fim no calendário para bloqueá-las.",
          selectedLabel: "Selecionado",
        },
        pricing: {
          title: "Preços",
          subtitle: "Defina tarifas e descontos por volume para reservas em grupo.",
          baseRate: "Tarifa base",
          pricePerNight: "Preço por noite (U$D)",
          currency: "Moeda",
          volumeTitle: "Preços por volume",
          volumeHint: "Defina tarifas de acordo com a quantidade de quartos reservados. Cada nível pode ter o seu próprio intervalo de datas.",
          addTier: "Adicionar nível",
          roomsCol: "Quartos",
          periodCol: "Período",
          priceCol: "Preço / noite",
          vsBase: "Vs base",
          anyPeriod: "O ano todo",
          minRooms: "Quartos mín",
          footnote: "O mesmo nível de volume pode ter preços diferentes para intervalos de datas distintos.",
        },
      },
      retreats: {
        title: "Os seus retiros",
        subtitle: "Crie e gerencie programas de retiro de bem-estar na sua propriedade.",
        create: "Criar retiro",
        empty: "Os seus retiros começam aqui",
        emptyHint: "Crie o seu primeiro programa de retiro de bem-estar e compartilhe com a rede HUMANA.",
        stats: { duration: "Duração", capacity: "Capacidade", price: "Preço", nextDate: "Próxima data" },
        nights: (n: number) => `${n} noite${n === 1 ? "" : "s"}`,
        guestsMax: (n: number) => `${n} hóspedes máx`,
        perPerson: "/pessoa",
        editDetails: "Editar detalhes",
        viewProgram: "Ver programa",
        viewGallery: "Ver galeria",
        delete: "Excluir",
        confirmDelete: "Excluir este rascunho de retiro? Esta ação não pode ser desfeita.",
        statuses: {
          draft: "Rascunho",
          pending_review: "Em revisão",
          active: "Ativo",
          upcoming: "Próximo",
          closed: "Encerrado",
          cancelled: "Cancelado",
        },
        wizard: {
          eyebrow: "Criar novo retiro",
          editEyebrow: "Editar retiro",
          title: "Crie um retiro na sua propriedade",
          subtitle: "Configure os detalhes do retiro que será hospedado no seu hotel.",
          steps: { info: "Info", program: "Programa", pricing: "Preços", gallery: "Galeria", review: "Revisão" },
          stepOf: (n: number, total: number) => `Etapa ${n} de ${total}`,
          back: "Voltar",
          next: "Próximo",
          saving: "Salvando…",
          saveError: "Não foi possível salvar as alterações. Tente novamente.",
          preview: {
            title: "Prévia do retiro",
            hotel: "Hotel",
            nameLabel: "Nome",
            type: "Tipo",
            dates: "Datas",
            capacity: "Capacidade",
            program: "Programa",
            basePrice: "Preço base",
            gallery: "Galeria",
            pending: "Pendente",
            progress: "Progresso",
            readyToPublish: "Pronto para publicar",
            daysCount: (n: number) => `${n} dia${n === 1 ? "" : "s"}`,
            imagesCount: (n: number) => `${n} imagem${n === 1 ? "" : "ns"}`,
            guests: (n: number) => `${n} hóspedes`,
          },
          types: {
            wellness: "Bem-estar",
            spiritual: "Espiritual",
            corporate: "Corporativo",
            adventure: "Aventura",
            medical: "Médico",
          },
          info: {
            title: "Informações básicas",
            subtitle: "Complete os dados gerais do seu retiro.",
            name: "Nome do retiro",
            namePlaceholder: "ex. A Arte do Silêncio",
            type: "Tipo de experiência",
            nights: "Duração (noites)",
            startDate: "Data de início",
            endDate: "Data de término",
            endDateAuto: "(auto)",
            capacity: "Capacidade máxima",
            language: "Idioma do retiro",
            description: "Descrição",
            descriptionPlaceholder:
              "Descreva a experiência, o seu propósito e o que a torna única…",
          },
          program: {
            title: "Programa do retiro",
            subtitle: (n: number) =>
              `Defina as atividades dia a dia do seu retiro de ${n} noites.`,
            dayLabel: (n: number) => `Dia ${n}`,
            dayTitlePlaceholder: "ex. Chegada e boas-vindas",
            activitiesCount: (n: number) => `${n} atividade${n === 1 ? "" : "s"}`,
            addActivity: "Adicionar atividade",
            activityPlaceholder: "Nome da atividade",
            facilitators: "Facilitadores",
            facilitatorCount: (n: number, max: number) => `${n} de ${max}`,
            addFacilitator: "Adicionar facilitador",
            facilitatorNamePlaceholder: "Nome completo",
            specialtyPlaceholder: "Especialidade (ex. Instrutor de yoga e movimento)",
            lead: "Principal",
            assistant: "Assistente",
            included: "O que está incluído",
            addItem: "Adicionar item",
            itemPlaceholder: "ex. Refeições plant-based",
          },
          pricing: {
            title: "Preços por quarto",
            subtitle: "Defina o preço por pessoa por tipo de quarto para o seu retiro.",
            room: "Quarto",
            roomsCapacity: "Quartos / Capacidade",
            pricePerGuest: "Preço / Hóspede",
            include: "Incluir",
            includeHint: "Somente os quartos que você selecionar estarão disponíveis para reserva neste retiro.",
            availabilityLabel: (n: number, total: number) => `${n} de ${total} unidades livres nas suas datas`,
            noAvailabilityLabel: "Sem disponibilidade nas datas do retiro",
            coverageLabel: (covered: number, total: number) => `Os quartos selecionados hospedam até ${covered} de ${total} hóspedes`,
            coverageOk: "Capacidade máxima coberta",
            coverageShort: "Inclua mais quartos para alcançar a capacidade máxima do retiro.",
            totalPrice: "Preço total",
            guests: (n: number) => `${n} hóspede${n === 1 ? "" : "s"}`,
            earningsTitle: "Receita total estimada",
            agencyCommission: (pct: number) => `Comissão da agência (${pct}%)`,
            officeCommission: (pct: number) => `Comissão do escritório (${pct}%)`,
            creatorIncome: (pct: number) => `Receita do criador (${pct}%)`,
            totalEarnings: "Receita total estimada",
            empty: "Ainda não há tipos de quarto",
            emptyHint: "Defina primeiro os seus tipos de quarto para poder precificar o retiro por quarto.",
          },
          gallery: {
            title: "Galeria de imagens",
            subtitle:
              "Envie fotos da sua propriedade, áreas comuns e comodidades. Mínimo 3, máximo 10.",
            dropHint: "Arraste as suas imagens aqui",
            browse: "ou clique para selecionar arquivos",
            formats: "JPG, PNG ou WebP · Máx 10 MB cada",
            cover: "Capa",
            reorderHint: "Arraste para reordenar · A primeira é a capa",
            previewCount: (n: number, max: number) => `Prévia (${n}/${max})`,
            uploadFailed: "Falha no envio",
            retry: "Tentar novamente",
            uploadFailedHint:
              "Algumas imagens não puderam ser enviadas. Tente novamente ou remova-as para continuar.",
          },
          review: {
            title: "Revisar e publicar",
            subtitle: "Revise todos os detalhes antes de publicar o seu retiro.",
            edit: "Editar",
            hotel: "Hotel",
            basicInfo: "Informações básicas",
            nameLabel: "Nome",
            typeLabel: "Tipo",
            durationLabel: "Duração",
            capacityLabel: "Capacidade",
            languageLabel: "Idioma",
            program: "Programa",
            activitiesCount: (n: number) => `${n} atividade${n === 1 ? "" : "s"}`,
            facilitators: "Facilitadores",
            included: "O que está incluído",
            pricingRooms: "Preços e quartos",
            roomsCount: (n: number) => `${n} quarto${n === 1 ? "" : "s"}`,
            perGuest: "/hóspede",
            gallery: "Galeria",
            imagesCount: (n: number) => `${n} imagem${n === 1 ? "" : "ns"}`,
            publish: "Publicar retiro",
            publishing: "Publicando…",
          },
          confirmation: {
            eyebrow: "Retiro publicado",
            title: (name: string) => `${name} publicado!`,
            subtitle: "O seu retiro já está disponível na plataforma HUMANA.",
            reference: "Referência",
            retreat: "Retiro",
            startDate: "Data de início",
            hotel: "Hotel",
            capacity: "Capacidade",
            type: "Tipo",
            priceFrom: "Preço a partir de",
            roomsConfigured: "Quartos configurados",
            typesCount: (n: number) => `${n} tipo${n === 1 ? "" : "s"}`,
            viewRetreat: "Ver retiro",
            backToRetreats: "Voltar aos retiros",
          },
        },
      },
      bookings: {
        eyebrow: "GESTÃO DE RESERVAS",
        title: "Reservas",
        calendarTitle: "Calendário de disponibilidade",
        subtitle: "Gerencie as reservas da sua propriedade.",
        searchPlaceholder: "Buscar por referência ou hóspede…",
        exportBtn: "Exportar",
        tabReservations: "Reservas",
        tabCalendar: "Calendário",
        kpis: { total: "Total reservas", pending: "Pendentes", revenue: "Receita", occupancy: "Ocupação" },
        filters: { all: "Todas", confirmed: "Confirmadas", pending: "Pendentes", checkedIn: "Concluídas", cancelled: "Canceladas" },
        empty: "Nenhuma reserva ainda",
        emptyHint: "Quando as agências reservarem sua propriedade, as reservas aparecerão aqui.",
        columns: { reference: "Referência" },
        statusLabels: { inquiry: "Pendente", confirmed: "Confirmada", completed: "Concluída", cancelled: "Cancelada" },
        confirmAction: "Confirmar",
        cancelAction: "Cancelar",
      },
      settings: {
        eyebrow: "CONFIGURAÇÕES",
        title: "Configurações",
        subtitle: "Gerencie o perfil do hotel, conta, assinatura e pagamentos.",
        tabs: { profile: "Perfil", property: "Propriedade", account: "Conta", subscription: "Assinatura", payments: "Pagamentos" },
        property: {
          eyebrow: "PROPRIEDADE",
          title: "Detalhes da propriedade",
          subtitle: "Mantenha sua descrição, horários, comodidades e fotos em dia.",
          descriptionLabel: "Descrição",
          starsLabel: "Classificação por estrelas",
          checkInLabel: "Horário de check-in",
          checkOutLabel: "Horário de check-out",
          amenitiesTitle: "Comodidades",
          amenitiesHint: "Selecione tudo o que sua propriedade oferece.",
          customAmenities: "Comodidades personalizadas",
          customPlaceholder: "ex. Lareira, Kit de cerimônia do chá…",
          addCustom: "Adicionar",
          photosTitle: "Fotos",
          photosHint: "A primeira foto é a capa exibida na rede.",
          cover: "Capa",
          addPhotos: "Adicionar fotos",
        },
        profile: {
          eyebrow: "IDENTIDADE DO HOTEL",
          hotelName: "Nome do hotel",
          location: "Localização",
          contactEmail: "Email",
          phone: "Telefone",
          save: "Salvar Alterações",
          saving: "Salvando…",
          saved: "Alterações salvas",
        },
        account: {
          eyebrow: "CONTA E SEGURANÇA",
          changePasswordTitle: "Alterar senha",
          changePasswordHint: "Redefina sua senha com um link seguro enviado para seu email.",
          currentEmail: "Email atual",
          sendOtp: "Enviar OTP",
          deactivateTitle: "Desativar ou excluir conta",
          deactivateHint: "Desativar oculta sua propriedade da rede HUMANA. Excluir remove todos os dados permanentemente.",
          deactivateAction: "Desativar Conta",
          deleteAction: "Excluir Conta",
          passwordModalTitle: "Alterar Senha",
          passwordModalHint: "Enviaremos um link seguro de redefinição para seu email registrado.",
          passwordModalSend: "Enviar Link",
          passwordModalSending: "Enviando…",
          passwordModalSent: "Email Enviado!",
          passwordModalSentHint: "Verifique sua caixa de entrada. O link expirará em 1 hora.",
          deactivateModalTitle: "Desativar Conta",
          deactivateModalWarning: "Sua propriedade será ocultada da rede HUMANA. Reservas ativas permanecerão mas novas reservas não poderão ser feitas. Você pode reativar entrando em contato com o suporte.",
          deactivateModalConfirm: "Desativar Conta",
          deactivateModalCancel: "Cancelar",
          deactivateModalProcessing: "Processando…",
          deleteModalTitle: "Excluir Conta",
          deleteModalWarningStep1: "Esta ação é permanente e não pode ser desfeita. Todos os seus dados incluindo perfil do hotel, tipos de quarto, reservas e informações de retiros serão permanentemente excluídos.",
          deleteModalContinue: "Continuar",
          deleteModalStep2Hint: "Para confirmar, digite a frase abaixo:",
          deleteModalConfirmPhrase: "quiero eliminar mi cuenta de humana",
          deleteModalDeleteForever: "Excluir Para Sempre",
          deleteModalDeleting: "Excluindo…",
          deleteModalCancel: "Cancelar",
        },
        subscription: {
          eyebrow: "ASSINATURA",
          title: "Escolha Seu Plano",
          subtitle: "Selecione o plano que melhor atende às necessidades do seu hotel.",
          sponsoredTitle: "Acesso Patrocinado",
          sponsoredBody: "Seu hotel conta com acesso completo à plataforma, patrocinado pela HUMANA. Um plano de assinatura ativo é opcional.",
          perMonth: "/mês",
          commission: "comissão",
          currentPlan: "Plano Atual",
          selectPlan: "Selecionar Plano",
          selecting: "Selecionando…",
          features: {
            basic_listing: "Listagem básica",
            email_support: "Suporte por email",
            max_room_types: "Até 5 tipos de quarto",
            featured_listing: "Listagem em destaque",
            priority_support: "Suporte prioritário",
            unlimited_room_types: "Tipos de quarto ilimitados",
            retreat_creation: "Criação de retiros",
            analytics: "Painel de análises",
            premium_listing: "Listagem premium",
            dedicated_support: "Suporte dedicado",
            unlimited_everything: "Tudo ilimitado",
            api_access: "Acesso à API",
            white_label: "Marca branca",
          },
        },
        payments: {
          eyebrow: "RECEBIMENTO DE PAGAMENTOS",
          title: "Conta Bancária",
          accountHolder: "Nome do Titular",
          iban: "IBAN",
          swift: "SWIFT / BIC",
          currency: "Moeda",
          country: "País",
          save: "Salvar Dados Bancários",
          saving: "Salvando…",
          statusConfigured: "Configurado",
          statusPending: "Pendente",
          paymentsReceived: "Pagamentos Recebidos",
          noPayments: "Nenhum pagamento recebido ainda.",
        },
      },
    },
    agencyWs: {
      badge: "Parceiro Agência",
      nav: {
        discover: "Descobrir",
        clients: "Clientes",
        bookings: "Reservas",
        myRetreats: "Meus Retiros",
        settings: "Configurações",
      },
      clients: {
        eyebrow: "GESTÃO DE CLIENTES",
        title: "Seus Clientes",
        subtitle: "Gerencie sua carteira de clientes e histórico de reservas.",
        addClient: "Adicionar Cliente",
        searchPlaceholder: "Buscar por nome ou email…",
        empty: "Nenhum cliente ainda",
        emptyHint: "Adicione seu primeiro cliente para começar a gerenciar reservas.",
        columns: { name: "Nome", email: "Email", phone: "Telefone", notes: "Notas", bookings: "Reservas", created: "Criado", actions: "Ações" },
        modal: { addTitle: "Adicionar Novo Cliente", editTitle: "Editar Cliente", namePlaceholder: "Nome completo", emailPlaceholder: "email@exemplo.com", phonePlaceholder: "+1 555 000 0000", notesPlaceholder: "Notas internas…", save: "Salvar", saving: "Salvando…", cancel: "Cancelar" },
        deleteTitle: "Excluir Cliente",
        deleteMessage: "Tem certeza de que deseja excluir este cliente? Esta ação não pode ser desfeita.",
        deleteConfirm: "Excluir",
        deleteCancel: "Cancelar",
      },
      bookings: {
        eyebrow: "HISTÓRICO DE RESERVAS",
        title: "Suas Reservas",
        subtitle: "Acompanhe todas as reservas e comissões recebidas.",
        searchPlaceholder: "Buscar reservas…",
        exportBtn: "Exportar",
        empty: "Nenhuma reserva ainda",
        emptyHint: "Seu histórico de reservas aparecerá aqui assim que você fizer sua primeira reserva.",
        kpis: { total: "Total de Reservas", confirmed: "Confirmadas", commission: "Comissão Recebida", volume: "Volume Total" },
        filters: { all: "Todas", inquiry: "Pendentes", confirmed: "Confirmadas", completed: "Concluídas", cancelled: "Canceladas" },
        statusLabels: { inquiry: "Pendente", confirmed: "Confirmada", completed: "Concluída", cancelled: "Cancelada" },
        columns: { reference: "Referência", client: "Cliente", experience: "Experiência", dates: "Datas", amount: "Valor", commission: "Comissão", status: "Status" },
      },
      settings: {
        eyebrow: "CONFIGURAÇÕES",
        title: "Configurações da Agência",
        subtitle: "Gerencie o perfil da sua agência e preferências da conta.",
        tabs: { profile: "Perfil", account: "Conta", subscription: "Assinatura", payments: "Pagamentos" },
        profile: {
          eyebrow: "PERFIL DA AGÊNCIA",
          agencyName: "Nome da Agência",
          legalName: "Razão Social",
          contactEmail: "Email de Contato",
          phone: "Telefone",
          location: "Localização",
          website: "Site",
          taxId: "CNPJ / ID Fiscal",
          save: "Salvar Alterações",
          saving: "Salvando…",
          saved: "Alterações salvas com sucesso",
        },
        account: {
          eyebrow: "CONTA E SEGURANÇA",
          changePasswordTitle: "Alterar Senha",
          changePasswordHint: "Enviaremos um link de redefinição para seu email cadastrado.",
          currentEmail: "Email Atual",
          deactivateTitle: "Status da Conta",
          deactivateHint: "Desative temporariamente ou exclua permanentemente sua conta.",
          deactivateAction: "Desativar",
          deleteAction: "Excluir Conta",
          passwordModalTitle: "Redefinir Senha",
          passwordModalHint: "Enviaremos um link seguro de redefinição para seu email.",
          passwordModalSend: "Enviar Link",
          passwordModalSending: "Enviando…",
          passwordModalSent: "Email Enviado",
          passwordModalSentHint: "Verifique sua caixa de entrada para o link de redefinição.",
          deactivateModalTitle: "Desativar Conta",
          deactivateModalWarning: "Sua conta será suspensa. Você pode reativá-la entrando em contato com o suporte.",
          deactivateModalCancel: "Cancelar",
          deactivateModalConfirm: "Desativar",
          deactivateModalProcessing: "Processando…",
          deleteModalTitle: "Excluir Conta",
          deleteModalWarningStep1: "Isso excluirá permanentemente sua conta de agência, todos os dados de clientes e histórico de reservas. Não pode ser desfeito.",
          deleteModalCancel: "Cancelar",
          deleteModalContinue: "Continuar",
          deleteModalStep2Hint: "Digite a frase abaixo para confirmar a exclusão:",
          deleteModalConfirmPhrase: "EXCLUIR MINHA CONTA",
          deleteModalDeleteForever: "Excluir para Sempre",
          deleteModalDeleting: "Excluindo…",
        },
        subscription: {
          eyebrow: "ASSINATURA",
          title: "Escolha Seu Plano",
          subtitle: "Selecione o plano que melhor atende às necessidades da sua agência.",
          perMonth: "/mês",
          commission: "comissão",
          currentPlan: "Plano Atual",
          selectPlan: "Selecionar Plano",
          selecting: "Selecionando…",
          features: {
            max_bookings: "Até 10 reservas/mês",
            max_bookings_unlimited: "Reservas ilimitadas",
            max_clients: "Até 50 clientes",
            max_clients_unlimited: "Clientes ilimitados",
            support_email: "Suporte por email",
            support_priority: "Suporte prioritário",
            support_dedicated: "Suporte dedicado",
            analytics_basic: "Análise básica",
            analytics_advanced: "Análise avançada",
            analytics_full: "Suite completa de análise",
            custom_branding: "Marca personalizada",
            api_access: "Acesso API",
            white_label: "Marca branca",
            sla: "SLA 99.9%",
          },
        },
        payments: { eyebrow: "PAGAMENTOS", title: "Configurações de Pagamento", subtitle: "Configure como você recebe os pagamentos de comissão.", comingSoon: "Configurações de pagamento em breve." },
      },
      myRetreats: {
        eyebrow: "MEUS RETIROS",
        title: "Seus Retiros",
        subtitle: "Crie e gerencie retiros em hotéis parceiros.",
        createRetreat: "Criar Retiro",
        empty: "Nenhum retiro ainda",
        emptyHint: "Crie seu primeiro retiro para começar a oferecer experiências de bem-estar curadas.",
        filters: { all: "Todos", draft: "Rascunho", pending_review: "Em Revisão", active: "Ativos", closed: "Encerrados" },
        statusLabels: { draft: "Rascunho", pending_review: "Em Revisão", active: "Ativo", upcoming: "Próximo", closed: "Encerrado", cancelled: "Cancelado" },
        kpis: { total: "Total de Retiros", active: "Ativos", draft: "Rascunhos", pending: "Em Revisão" },
        columns: { name: "Retiro", hotel: "Hotel", dates: "Datas", capacity: "Capacidade", price: "Desde", status: "Status", actions: "Ações" },
        deleteTitle: "Excluir Retiro",
        deleteMessage: "Tem certeza de que deseja excluir este retiro em rascunho? Esta ação não pode ser desfeita.",
        deleteConfirm: "Excluir",
        deleteCancel: "Cancelar",
        submitTitle: "Enviar para Revisão",
        submitMessage: "Uma vez enviado, o retiro será revisado pela equipe HUMANA antes de ser publicado.",
        submitConfirm: "Enviar",
        submitCancel: "Cancelar",
      },
    },
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
    resetPassword: {
      eyebrow: "REDEFINIR SENHA",
      title: "Defina sua nova senha",
      subtitle: "Escolha uma senha segura para sua conta HUMANA.",
      newPassword: "Nova senha",
      confirmPassword: "Confirmar senha",
      placeholder: "Mínimo 8 caracteres",
      submit: "Redefinir Senha",
      submitting: "Redefinindo…",
      success: "Senha Redefinida!",
      successHint: "Sua senha foi atualizada. Redirecionando para seu painel…",
      errorInvalid: "Este link de redefinição é inválido ou já foi utilizado.",
      errorExpired: "Este link expirou. Solicite um novo.",
      errorMismatch: "As senhas não coincidem.",
      errorMinLength: "A senha deve ter pelo menos 8 caracteres.",
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
      viewRooms: "Ver quartos",
      viewHotel: "Ver hotel",
      notFound: "Hotel não encontrado",
      boutiqueHotel: "Hotel Boutique",
      info: "Info",
      capacity: "Capacidade",
      personCount: (n) => n === 1 ? "1 pessoa" : `${n} pessoas`,
      bookNow: "Reservar agora",
      roomCount: (n) => n === 1 ? "1 hospedagem" : `${n} hospedagens`,
      activeRetreats: (n) => n === 1 ? "1 retiro ativo" : `${n} retiros ativos`,
      hotelSubtitle: "Hotéis holísticos atribuídos à sua agência neste país.",
      bookLodging: "Reservar Hospedagem",
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
        status: { active: "Ativo", pending: "Pendente", suspended: "Suspenso", rejected: "Rejeitado", changes_requested: "Alterações solicitadas" },
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
        pendingChangesNote: "Este hotel tem alterações não publicadas. A aprovação estará disponível quando publicar sua versão mais recente.",
        changesRequestedNote: "Comentários enviados — aguardando o hotel publicar suas alterações.",
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
        popular: "Popular",
        free: "Grátis",
        view: "Ver",
        cancel: "Cancelar",
        features: {
          emailSupport: "Suporte por email",
          prioritySupport: "Suporte prioritário",
          dedicatedSupport: "Suporte dedicado",
          basicAnalytics: "Análises básicas",
          advancedAnalytics: "Análises avançadas",
          fullAnalytics: "Análises completas",
          hotelAccess: "Acesso a hotéis",
          retreatAccess: "Acesso a retiros",
          retreatCreation: "Criação de retiros",
        },
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
        steps: ["Identidade", "Quartos", "Amenities", "Fotos", "Revisão"],
        step5Eyebrow: "Passo 5 de 5 · Revisão e Status",
        step5Title: "Revise sua propriedade",
        step5Sub: "Confirme que tudo abaixo está correto. Você pode editar qualquer seção — as alterações são salvas ao completar cada passo.",
        reviewEdit: "Editar",
        reviewHotelInfo: "Informações da propriedade",
        reviewRooms: "Quartos",
        reviewAmenities: "Amenities",
        reviewPhotos: "Fotos",
        reviewUnits: "unidades",
        reviewPerNight: "/ noite",
        reviewGuests: "hóspedes",
        reviewNoPhotos: "Nenhuma foto adicionada ainda.",
        reviewStatusDraftTitle: "Pronto para enviar",
        reviewStatusDraftBody: "Revise as informações da sua propriedade e envie para a verificação da nossa equipe.",
        reviewStatusPendingTitle: "Em revisão",
        reviewStatusPendingBody: "Nossa equipe está revisando sua propriedade. Você pode continuar aprimorando suas informações — as atualizações são salvas e visíveis para os revisores.",
        reviewStatusApprovedTitle: "Aprovada",
        reviewStatusApprovedBody: "Sua propriedade faz parte da rede HUMANA. Seu espaço de trabalho completo está pronto.",
        reviewStatusChangesTitle: "Alterações não publicadas",
        reviewStatusChangesBody: "Você fez alterações desde o último envio. Publique-as para que nossa equipe revise sua versão mais recente.",
        reviewStatusFeedbackTitle: "Alterações solicitadas",
        reviewStatusFeedbackBody: "Nossa equipe revisou sua propriedade e tem comentários para você atender:",
        submitForReviewCta: "Enviar para revisão",
        publishChangesCta: "Publicar alterações",
        publish: "Publicar",
        step1Eyebrow: "Passo 1 de 5 \u00B7 Identidade da Propriedade",
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
        step2Eyebrow: "Passo 2 de 5 \u00B7 Invent\u00E1rio de Quartos",
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
        availabilitySub: "Todas as datas est\u00E3o abertas para reservas por padr\u00E3o. Selecione um intervalo para bloquear datas quando os quartos n\u00E3o estiverem dispon\u00EDveis (fechamentos sazonais, renova\u00E7\u00F5es).",
        legendAvailable: "Dispon\u00EDvel",
        legendLow: "Baixa disponibilidade",
        legendFullyBlocked: "Totalmente bloqueado",
        legendSelected: "Selecionado",
        legendBlocked: "Bloqueado",
        availableUnits: "Unidades a bloquear",
        blockDates: "Bloquear",
        configuredBlocks: "Per\u00EDodos Bloqueados",
        noBlocksYet: "Nenhuma data bloqueada \u2014 todos os dias est\u00E3o abertos para reservas. Selecione um intervalo no calend\u00E1rio para bloquear datas.",
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
        step3Eyebrow: "Passo 3 de 5 · Amenities",
        step3Title: "Diga aos h\u00F3spedes o que seu lugar oferece.",
        step3Subtitle: "Selecione tudo que se aplica. Você pode refinar a lista após a publicação.",
        guestFavorites: "Favoritas dos H\u00F3spedes",
        standoutAmenities: "Amenities em Destaque",
        customAmenity: "Amenity Personalizada",
        customPlaceholder: "ex. Terra\u00E7o no telhado, Aluguel de bicicletas...",
        addButton: "Adicionar",
        amenityCount: (selected: number, custom: number) => `${selected} comodidade${selected !== 1 ? "s" : ""} selecionada${selected !== 1 ? "s" : ""}${custom > 0 ? ` + ${custom} personalizada${custom !== 1 ? "s" : ""}` : ""}`,
        step4Eyebrow: "Passo 4 de 5 \u00B7 Fotos da Propriedade",
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
