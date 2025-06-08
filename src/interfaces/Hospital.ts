import { Doctor } from "./Doctor";
import { Review } from "./Review";

export interface Hospital {
  id: string;
  name: string;
  address: string;
  averageRating: number;
  reviews: Review[];
  doctors?: Doctor[];
  // Add other hospital-specific properties here
}
