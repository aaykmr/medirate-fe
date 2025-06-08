import { Hospital } from "./Hospital";
import { Review } from "./Review";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital?: Hospital;
  averageRating: number;
  reviews: Review[];
  // Add other doctor-specific properties here
}
