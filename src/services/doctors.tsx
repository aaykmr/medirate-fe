import { Doctor } from "../interfaces/Doctor";
import { Review } from "../interfaces/Review";
import { fetchWithToken } from "./api";

export interface CreateDoctorData {
  name: string;
  specialty: string;
  hospitalId: string;
}
// Doctor endpoints
export const getDoctors = (): Promise<Doctor[]> => fetchWithToken("/doctors");

export const getDoctor = (id: string): Promise<Doctor> =>
  fetchWithToken(`/doctors/${id}`);

export const createDoctor = (data: CreateDoctorData): Promise<Doctor> =>
  fetchWithToken("/doctors", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateDoctor = (
  id: string,
  data: Partial<CreateDoctorData>
): Promise<Doctor> =>
  fetchWithToken(`/doctors/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteDoctor = (id: string): Promise<void> =>
  fetchWithToken(`/doctors/${id}`, {
    method: "DELETE",
  });

export const submitDoctorReview = (
  id: string,
  review: { rating: number; comment: string }
): Promise<Review> =>
  fetchWithToken(`/doctors/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
  });
