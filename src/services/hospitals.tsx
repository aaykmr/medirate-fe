import { Hospital } from "../interfaces/Hospital";
import { Review } from "../interfaces/Review";
import { fetchWithToken } from "./api";

export interface CreateHospitalData {
  name: string;
  address: string;
}
// Hospital endpoints
export const getHospitals = (): Promise<Hospital[]> =>
  fetchWithToken("/hospitals");

export const getHospital = (id: string): Promise<Hospital> =>
  fetchWithToken(`/hospitals/${id}`);

export const createHospital = (data: CreateHospitalData): Promise<Hospital> =>
  fetchWithToken("/hospitals", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateHospital = (
  id: string,
  data: Partial<CreateHospitalData>
): Promise<Hospital> =>
  fetchWithToken(`/hospitals/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteHospital = (id: string): Promise<void> =>
  fetchWithToken(`/hospitals/${id}`, {
    method: "DELETE",
  });

export const submitHospitalReview = (
  id: string,
  review: { rating: number; comment: string }
): Promise<Review> =>
  fetchWithToken(`/hospitals/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });
