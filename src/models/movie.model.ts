import mongoose, { Schema, Document } from 'mongoose';

interface IRating {
  Source: string;
  Value: string;
}

interface IAward {
  nominee_category: string[];
  nominee_category_pt: string[];
  winner_category: string[];
  winner_category_pt: string[];
}

interface IMovie extends Document {
  title: string;
  title_pt: string;
  imdbId: string;
  year: number;
  director?: string;
  writer?: string;
  actors?: string;
  plot?: string;
  poster?: string;
  ratings?: IRating[];
  metascore?: string;
  imdbRating?: string;
  awards: IAward;
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  title_pt: { type: String },
  imdbId: { type: String },
  year: { type: Number, required: true },
  director: { type: String, default: "unknown" },
  writer: { type: String, default: "unknown" },
  actors: { type: String, default: "unknown" },
  plot: { type: String, default: "unknown" },
  poster: { type: String, default: "unknown" },
  ratings: [
    {
      Source: { type: String, default: "unknown" },
      Value: { type: String, default: "unknown" },
    },
  ],
  metascore: { type: String, default: "unknown" },
  imdbRating: { type: String, default: "unknown" },
  awards: {
    nominee_category: [{ type: String }],
    nominee_category_pt: [{ type: String }],
    winner_category: [{ type: String }],
    winner_category_pt: [{ type: String }],
  },
});

export default mongoose.model<IMovie>('Movie', MovieSchema);
