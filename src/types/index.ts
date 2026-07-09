export interface CastMember {
  name: string;
  character: string;
  photo: string;
}

export type MediaType = "movie" | "series";
export type MediaStatus = "released" | "ongoing" | "ended" | "upcoming";

export interface Movie {
  id: string;
  titleFa: string;
  titleEn: string;
  year: number;
  country: string[];
  genres: string[];
  duration: number;
  language: string;
  ageRating: string;
  status: MediaStatus;
  type: MediaType;
  seasons?: number;
  episodes?: number;
  poster: string;
  backdrop: string;
  trailerYT: string;
  clipYT: string;
  clipTitle: string;
  synopsis: string;
  director: string[];
  writer: string[];
  producer: string[];
  cast: CastMember[];
  studio: string;
  network: string;
  imdb: number;
  rottenTomatoes: number;
  metacritic: number;
  boxOffice?: string;
  awards?: string[];
  strengths: string[];
  weaknesses: string[];
  similarIds: string[];
  releaseDate: string;
  featured?: boolean;
}

export interface UserReview {
  id: string;
  movieId: string;
  username: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
}
