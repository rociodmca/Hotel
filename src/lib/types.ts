import type { RoomHousekeepingStatus, RoomType } from "@prisma/client";

export type SerializedRoom = {
  id: string;
  title: string;
  slug: string;
  type: RoomType;
  description: string | null;
  basePrice: number;
  capacity: number;
  amenities: string[];
  images: string[];
  housekeeping: RoomHousekeepingStatus;
};
