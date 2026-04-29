export type Country = {
  id: string;
  name: string;
  code: string;
  flag: string;
  retreatCount: number;
  hotelCount: number;
};

export type RoomType = {
  id: string;
  name: string;
  description: string;
  maxGuests: number;
  pricePerNight: number;
  image: string;
};

export type Hotel = {
  id: string;
  slug: string;
  name: string;
  location: string;
  country: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  rating: number;
  amenities: string[];
  roomTypes: RoomType[];
};

export type ProgramDay = {
  day: number;
  title: string;
  activities: { time: string; name: string; description: string }[];
};

export type Facilitator = {
  name: string;
  role: "principal" | "asistente";
  bio: string;
};

export type RetreatData = {
  id: string;
  slug: string;
  name: string;
  hotelId: string;
  hotelName: string;
  location: string;
  country: string;
  type: "retreat" | "masterclass" | "corporate";
  startDate: string;
  endDate: string;
  nights: number;
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  price: number;
  commission: number;
  capacity: number;
  language: string;
  program: ProgramDay[];
  tag: string;
  included: string[];
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  nationality: string;
};

export type InventoryBlock = {
  id: string;
  hotelId: string;
  hotelName: string;
  location: string;
  country: string;
  roomTypeId: string;
  roomTypeName: string;
  totalRooms: number;
  soldRooms: number;
  reservedRooms: number;
  availableRooms: number;
  dateStart: string;
  dateEnd: string;
  pricePerNight: number;
  status: "active" | "sold_out" | "pending";
  image: string;
};
