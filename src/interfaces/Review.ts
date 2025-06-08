export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  hospital?: string;
  doctor?: string;
  createdAt: string;
}
