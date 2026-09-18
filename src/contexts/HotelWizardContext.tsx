"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { hotelApi, type OrgProfile, type OrgVerificationUpdate } from "@/lib/api/hotel";
import { amenityIdForName } from "@/lib/amenity-catalog";
import {
  normalizeImageCategory,
  sanitizeEnvironments,
  type ImageCategory,
  type PhotoEntry,
} from "@/lib/property-catalog";
import { spaceToDraft, type CommonSpaceDraft } from "@/lib/space-catalog";
import {
  EMPTY_PROPERTY_FORM,
  propertyFormFromProfile,
  type PropertyFormValues,
} from "@/lib/property-form";
import { useAuth } from "@/contexts/AuthContext";

export type AvailabilityBlock = {
  id: string;
  startDate: string;
  endDate: string;
  units: number;
  blocked: boolean;
};

export type RoomTypeEntry = {
  id: string;
  name: string;
  description: string;
  maxGuests: number;
  totalUnits: number;
  baseRate: number;
  roomSize: number;
  bedType: string;
  bedsCount: number;
  amenities: string[];
  photos: string[];
  availability: AvailabilityBlock[];
};

/** A blank verification block — every text field empty, no networks, no
 *  declaration. Kept as a factory so no two states share the same object. */
export function emptyVerification(): OrgVerificationUpdate {
  return {
    legal_name: "",
    business_name: "",
    tax_id: "",
    primary_contact: "",
    primary_contact_role: "",
    commercial_registration: "",
    phone: "",
    contact_email: "",
    website: "",
    ownership_document_url: "",
    social_links: {},
    authorization_declared: false,
  };
}

/** Sessions saved before the verification block carry nothing, and an older
 *  one may carry a partial shape — fill the gaps rather than trust it. */
function migrateVerification(value: unknown): OrgVerificationUpdate {
  const base = emptyVerification();
  if (!value || typeof value !== "object") return base;
  const stored = value as Partial<OrgVerificationUpdate>;
  return {
    ...base,
    ...stored,
    social_links: { ...(stored.social_links ?? {}) },
    authorization_declared: !!stored.authorization_declared,
  };
}

/** The saved verification block. Fields an older API omits come back as
 *  undefined, which reads as "not filled in" rather than breaking the form. */
export function verificationFromOrg(org: OrgProfile): OrgVerificationUpdate {
  return {
    legal_name: org.legal_name ?? "",
    business_name: org.business_name ?? "",
    tax_id: org.tax_id ?? "",
    primary_contact: org.primary_contact ?? "",
    primary_contact_role: org.primary_contact_role ?? "",
    commercial_registration: org.commercial_registration ?? "",
    phone: org.phone ?? "",
    contact_email: org.contact_email ?? "",
    website: org.website ?? "",
    ownership_document_url: org.ownership_document_url ?? "",
    social_links: { ...(org.social_links ?? {}) },
    authorization_declared: !!org.authorization_declared_at,
  };
}

/** The wizard state is the shared property form plus the owner/identity fields
 *  and the per-step collections the wizard owns. */
export type HotelWizardState = PropertyFormValues & {
  /* Personal data */
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  /* Property identity */
  hotelName: string;
  address: string;
  description: string;
  /** "What makes your property special" — max 500 characters. */
  highlight: string;
  phone: string;
  contactEmail: string;
  /** The organization's legal identity, saved alongside step 1. */
  verification: OrgVerificationUpdate;
  /* Room types */
  roomTypes: RoomTypeEntry[];
  /* Common spaces */
  commonSpaces: CommonSpaceDraft[];
  /* Amenities */
  amenities: string[];
  customAmenities: string[];
  /* Property visual material */
  photos: PhotoEntry[];
  logoUrl: string;
  videoUrl: string;
  /* Wizard meta */
  currentStep: number;
};

const initial: HotelWizardState = {
  ...EMPTY_PROPERTY_FORM,
  ownerFirstName: "",
  ownerLastName: "",
  ownerPhone: "",
  hotelName: "",
  address: "",
  description: "",
  highlight: "",
  phone: "",
  contactEmail: "",
  verification: emptyVerification(),
  roomTypes: [],
  commonSpaces: [],
  amenities: [],
  customAmenities: [],
  photos: [],
  logoUrl: "",
  videoUrl: "",
  currentStep: 1,
};

const STORAGE_KEY = "humana.hotel-wizard";

/** Max photos per room type — keep in sync with the roomPhotosMax copy. */
export const MAX_ROOM_PHOTOS = 8;

type HotelWizardContextValue = {
  state: HotelWizardState;
  set: (patch: Partial<HotelWizardState>) => void;
  reset: () => void;
  addRoomType: (room: Omit<RoomTypeEntry, "id" | "photos" | "availability">) => void;
  updateRoomType: (id: string, room: Partial<RoomTypeEntry>) => void;
  removeRoomType: (id: string) => void;
  addRoomPhoto: (roomId: string, url: string) => void;
  removeRoomPhoto: (roomId: string, index: number) => void;
  swapRoomPhotoUrl: (roomId: string, oldUrl: string, newUrl: string) => void;
  addAvailabilityBlock: (roomId: string, block: Omit<AvailabilityBlock, "id">) => void;
  removeAvailabilityBlock: (roomId: string, blockId: string) => void;
  addCommonSpace: (space: CommonSpaceDraft) => void;
  updateCommonSpace: (localId: string, patch: Partial<CommonSpaceDraft>) => void;
  removeCommonSpace: (localId: string) => void;
  toggleAmenity: (amenity: string) => void;
  addCustomAmenity: (amenity: string) => void;
  removeCustomAmenity: (amenity: string) => void;
  addPhoto: (url: string) => void;
  removePhoto: (index: number) => void;
  reorderPhotos: (fromIndex: number, toIndex: number) => void;
  swapPhotoUrl: (oldUrl: string, newUrl: string) => void;
  setPhotoCategory: (index: number, category: ImageCategory) => void;
  setPhotoCover: (index: number) => void;
  /** True once the saved profile came back, so the state mirrors the server.
   *  Until then a field the owner never touched must not be written back. */
  profileLoaded: boolean;
  /** True once the profile fetch resolved at all — with a hotel, or with the
   *  "no hotel yet" answer. Either way the wizard's space list mirrors what is
   *  saved, which is what makes reconciling deletions safe. A failed fetch
   *  leaves it false and the save then only creates and updates. */
  commonSpacesLoaded: boolean;
  /** Where the profile fetch stands, and with it the verification block.
   *  "loaded" means the state mirrors what the organization holds and step 1
   *  may write it back; "failed" means step 1 must not, since the blank form
   *  would clear the stored legal identity; "loading" is neither yet, and the
   *  step waits rather than reporting a failure that has not happened. */
  verificationStatus: "loading" | "loaded" | "failed";
  videoTouched: boolean;
  markVideoTouched: () => void;
  hideBottomBar: boolean;
  setHideBottomBar: (v: boolean) => void;
  /** Gallery upload in flight. */
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
  /** Logo upload in flight — tracked apart from the gallery so each shows its
   *  own spinner, but both have to settle before the step can be saved. */
  isUploadingLogo: boolean;
  setIsUploadingLogo: (v: boolean) => void;
};

const HotelWizardContext = createContext<HotelWizardContextValue | null>(null);

/** Gallery entries used to be plain URLs — an old session migrates to the
 *  categorised shape with everything under "Other". */
function migratePhotos(value: unknown): PhotoEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): PhotoEntry[] => {
    if (typeof entry === "string") return [{ url: entry, category: "general" }];
    if (entry && typeof entry === "object" && typeof (entry as PhotoEntry).url === "string") {
      const photo = entry as { url: string; category?: unknown };
      return [{ url: photo.url, category: normalizeImageCategory(photo.category) }];
    }
    return [];
  });
}

function generateId(): string {
  return `rt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function HotelWizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HotelWizardState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [hideBottomBar, setHideBottomBar] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [commonSpacesLoaded, setCommonSpacesLoaded] = useState(false);
  const [verificationStatus, setVerificationStatus] =
    useState<HotelWizardContextValue["verificationStatus"]>("loading");
  const [videoTouched, setVideoTouched] = useState(false);
  const apiLoaded = useRef(false);
  const { user } = useAuth();

  // Hydrate the owner fields (step 1) from the authenticated user — they are
  // saved on the user record, not the hotel, so the profile fetch below
  // doesn't cover them.
  useEffect(() => {
    if (!user) return;
    setState((prev) => {
      const patch: Partial<HotelWizardState> = {};
      if (user.name && !prev.ownerFirstName && !prev.ownerLastName) {
        const [first, ...rest] = user.name.trim().split(/\s+/);
        patch.ownerFirstName = first;
        patch.ownerLastName = rest.join(" ");
      }
      if (user.phone && !prev.ownerPhone) {
        patch.ownerPhone = user.phone;
      }
      // The property's public email defaults to the account email until the
      // owner overrides it in step 1.
      if (user.email && !prev.contactEmail) {
        patch.contactEmail = user.email;
      }
      return Object.keys(patch).length > 0 ? { ...prev, ...patch } : prev;
    });
  }, [user]);

  // Hydrate: the DB is the source of truth — saved data always wins over
  // sessionStorage. Session data is only used while the API loads (so
  // in-progress edits reappear instantly) and as fallback when the API has
  // no hotel yet or is unreachable.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure room types have the fields added after the first release
        if (Array.isArray(parsed.roomTypes)) {
          parsed.roomTypes = parsed.roomTypes.map((rt: Record<string, unknown>) => ({
            photos: [],
            availability: [],
            ...rt,
            // Drafts saved before this form used the API's ids kept the bed
            // type capitalised ("King") — the payload wants it lowercase
            bedType: typeof rt.bedType === "string" ? rt.bedType.toLowerCase() : "double",
            bedsCount: typeof rt.bedsCount === "number" ? rt.bedsCount : 1,
            amenities: Array.isArray(rt.amenities) ? rt.amenities : [],
          }));
        }
        const merged = { ...initial, ...parsed };
        // Sessions saved before common spaces carry no list at all, and ones
        // saved before the gallery baseline carry entries without it
        merged.commonSpaces = Array.isArray(merged.commonSpaces)
          ? merged.commonSpaces.map((cs: Record<string, unknown>) => ({
              ...cs,
              photos: Array.isArray(cs.photos) ? cs.photos : [],
              savedPhotos: Array.isArray(cs.savedPhotos) ? cs.savedPhotos : [],
            }))
          : [];
        // Sessions saved before the property contract may carry a stale shape
        merged.environments = sanitizeEnvironments(merged.environments);
        // Sessions saved before the gallery categories held plain URLs
        merged.photos = migratePhotos(merged.photos);
        // Sessions saved before the verification block carry none at all
        merged.verification = migrateVerification(merged.verification);
        if (merged.hotelName || merged.ownerFirstName || merged.roomTypes.length > 0) {
          setState(merged);
        }
      }
    } catch {
      /* empty */
    }

    if (!apiLoaded.current) {
      apiLoaded.current = true;
      Promise.all([
        hotelApi.getProfile(),
        hotelApi.listAvailabilityBlocks().catch(() => ({ availability_blocks: [] })),
      ]).then(([res, blocksRes]) => {
        const h = res.hotel;
        // The answer arrived: whatever it says is what the server holds
        setCommonSpacesLoaded(true);

        // The organization exists before the hotel does, so the legal identity
        // hydrates even on a brand-new onboarding. Assigned wholesale, like
        // the property block: a truthy-only merge would keep a stale session
        // value and write it straight back on save.
        if (res.organization) {
          const verification = verificationFromOrg(res.organization);
          setState((prev) => ({ ...prev, verification }));
          setVerificationStatus("loaded");
        } else {
          // An answer without an organization is not a saved block we can
          // safely overwrite either.
          setVerificationStatus("failed");
        }

        // No hotel saved yet — keep whatever the session had
        if (!h) return;

        const patch: Partial<HotelWizardState> = {};

        // The property block is assigned wholesale, including the values the
        // server cleared (null / [] / ""): a truthy-only merge would keep a
        // stale sessionStorage answer and write it straight back on save.
        Object.assign(patch, propertyFormFromProfile(h));

        // Wizard-only identity fields keep the "only if present" merge so an
        // in-progress draft (and the account email prefill) is not wiped.
        if (h.name) patch.hotelName = h.name;
        if (h.address) patch.address = h.address;
        if (h.description) patch.description = h.description;
        if (h.highlight) patch.highlight = h.highlight;
        if (h.phone) patch.phone = h.phone;
        if (h.contact_email) patch.contactEmail = h.contact_email;

        // Hydrate room types, including their saved photos and blocked dates
        if (h.room_types && h.room_types.length > 0) {
          const blocks = blocksRes.availability_blocks;
          patch.roomTypes = h.room_types.map((rt) => ({
            id: `api_${rt.id}`,
            name: rt.name,
            description: rt.description || "",
            maxGuests: rt.capacity,
            totalUnits: rt.total_rooms || 1,
            baseRate: rt.price_per_night_cents / 100,
            roomSize: rt.area_sqm || 0,
            bedType: rt.bed_type || "double",
            bedsCount: rt.beds_count ?? 1,
            amenities: rt.amenities_list ?? [],
            photos: (rt.images ?? []).map((img) => img.image_url),
            availability: blocks
              .filter((b) => b.room_type_id === rt.id)
              .map((b) => ({
                id: `api_block_${b.id}`,
                startDate: b.starts_on,
                endDate: b.ends_on,
                // null units means the whole room type is closed
                units: b.units ?? rt.total_rooms ?? 1,
                blocked: true,
              })),
          }));
        }

        // Hydrate common spaces, including their saved photos. The saved list
        // wins wholesale — an empty one clears the session — but an API that
        // predates common spaces omits the key, and then the session stands.
        if (h.common_spaces) patch.commonSpaces = h.common_spaces.map(spaceToDraft);

        // Hydrate amenities — match stored display names back to catalog ids
        if (h.amenities && h.amenities.length > 0) {
          const amenityIds: string[] = [];
          const customNames: string[] = [];
          for (const a of h.amenities) {
            const id = amenityIdForName(a.name);
            if (id) amenityIds.push(id);
            else customNames.push(a.name);
          }
          patch.amenities = amenityIds;
          patch.customAmenities = customNames;
        }

        // Hydrate the gallery — the cover leads the grid, as in the batch
        // payload, and unknown API categories fall back to "Other".
        if (h.images && h.images.length > 0) {
          const images = [...h.images].sort(
            (a, b) => Number(b.is_cover) - Number(a.is_cover),
          );
          patch.photos = images.map((img) => ({
            url: img.image_url,
            category: normalizeImageCategory(img.category),
          }));
        }

        // Logo and video are server-owned like the property block: assign them
        // wholesale so a cleared value is not re-sent from a stale session.
        patch.logoUrl = h.logo_url ?? "";
        patch.videoUrl = h.video_url ?? "";

        if (Object.keys(patch).length > 0) {
          setState((prev) => ({ ...prev, ...patch }));
        }
        setProfileLoaded(true);
      }).catch(() => {
        // API unavailable — continue with session state
        setVerificationStatus("failed");
      });
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const set = useCallback((patch: Partial<HotelWizardState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setState(initial), []);

  const markVideoTouched = useCallback(() => setVideoTouched(true), []);

  const addRoomType = useCallback((room: Omit<RoomTypeEntry, "id" | "photos" | "availability">) => {
    setState((prev) => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { ...room, id: generateId(), photos: [], availability: [] }],
    }));
  }, []);

  const updateRoomType = useCallback((id: string, patch: Partial<RoomTypeEntry>) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === id ? { ...rt, ...patch } : rt
      ),
    }));
  }, []);

  const removeRoomType = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((rt) => rt.id !== id),
    }));
  }, []);

  const addRoomPhoto = useCallback((roomId: string, url: string) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === roomId && rt.photos.length < MAX_ROOM_PHOTOS
          ? { ...rt, photos: [...rt.photos, url] }
          : rt
      ),
    }));
  }, []);

  const removeRoomPhoto = useCallback((roomId: string, index: number) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === roomId
          ? { ...rt, photos: rt.photos.filter((_, i) => i !== index) }
          : rt
      ),
    }));
  }, []);

  const swapRoomPhotoUrl = useCallback((roomId: string, oldUrl: string, newUrl: string) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === roomId
          ? { ...rt, photos: rt.photos.map((u) => (u === oldUrl ? newUrl : u)) }
          : rt
      ),
    }));
  }, []);

  const addAvailabilityBlock = useCallback((roomId: string, block: Omit<AvailabilityBlock, "id">) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === roomId
          ? { ...rt, availability: [...rt.availability, { ...block, id: generateId() }] }
          : rt
      ),
    }));
  }, []);

  const removeAvailabilityBlock = useCallback((roomId: string, blockId: string) => {
    setState((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.map((rt) =>
        rt.id === roomId
          ? { ...rt, availability: rt.availability.filter((b) => b.id !== blockId) }
          : rt
      ),
    }));
  }, []);

  const addCommonSpace = useCallback((space: CommonSpaceDraft) => {
    setState((prev) => ({ ...prev, commonSpaces: [...prev.commonSpaces, space] }));
  }, []);

  const updateCommonSpace = useCallback((localId: string, patch: Partial<CommonSpaceDraft>) => {
    setState((prev) => ({
      ...prev,
      commonSpaces: prev.commonSpaces.map((cs) =>
        cs.localId === localId ? { ...cs, ...patch } : cs,
      ),
    }));
  }, []);

  const removeCommonSpace = useCallback((localId: string) => {
    setState((prev) => ({
      ...prev,
      commonSpaces: prev.commonSpaces.filter((cs) => cs.localId !== localId),
    }));
  }, []);

  const toggleAmenity = useCallback((amenity: string) => {
    setState((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }, []);

  const addCustomAmenity = useCallback((amenity: string) => {
    setState((prev) => {
      if (prev.customAmenities.includes(amenity)) return prev;
      return { ...prev, customAmenities: [...prev.customAmenities, amenity] };
    });
  }, []);

  const removeCustomAmenity = useCallback((amenity: string) => {
    setState((prev) => ({
      ...prev,
      customAmenities: prev.customAmenities.filter((a) => a !== amenity),
    }));
  }, []);

  const addPhoto = useCallback((url: string) => {
    setState((prev) => ({
      ...prev,
      photos: [...prev.photos, { url, category: "general" }],
    }));
  }, []);

  const removePhoto = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  }, []);

  const reorderPhotos = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => {
      if (fromIndex === toIndex) return prev;
      const photos = [...prev.photos];
      const [moved] = photos.splice(fromIndex, 1);
      photos.splice(toIndex, 0, moved);
      return { ...prev, photos };
    });
  }, []);

  const swapPhotoUrl = useCallback((oldUrl: string, newUrl: string) => {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.map((photo) =>
        photo.url === oldUrl ? { ...photo, url: newUrl } : photo,
      ),
    }));
  }, []);

  const setPhotoCategory = useCallback((index: number, category: ImageCategory) => {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.map((photo, i) => (i === index ? { ...photo, category } : photo)),
    }));
  }, []);

  /** The cover is the first photo of the batch, so promoting one moves it. */
  const setPhotoCover = useCallback((index: number) => {
    setState((prev) => {
      if (index <= 0 || index >= prev.photos.length) return prev;
      const photos = [...prev.photos];
      const [moved] = photos.splice(index, 1);
      photos.unshift(moved);
      return { ...prev, photos };
    });
  }, []);

  return (
    <HotelWizardContext.Provider
      value={{
        state,
        set,
        reset,
        addRoomType,
        updateRoomType,
        removeRoomType,
        addRoomPhoto,
        removeRoomPhoto,
        swapRoomPhotoUrl,
        addAvailabilityBlock,
        removeAvailabilityBlock,
        addCommonSpace,
        updateCommonSpace,
        removeCommonSpace,
        toggleAmenity,
        addCustomAmenity,
        removeCustomAmenity,
        addPhoto,
        removePhoto,
        reorderPhotos,
        swapPhotoUrl,
        setPhotoCategory,
        setPhotoCover,
        profileLoaded,
        commonSpacesLoaded,
        verificationStatus,
        videoTouched,
        markVideoTouched,
        hideBottomBar,
        setHideBottomBar,
        isUploading,
        setIsUploading,
        isUploadingLogo,
        setIsUploadingLogo,
      }}
    >
      {children}
    </HotelWizardContext.Provider>
  );
}

export function useHotelWizard() {
  const ctx = useContext(HotelWizardContext);
  if (!ctx)
    throw new Error("useHotelWizard must be used within HotelWizardProvider");
  return ctx;
}
