import { Schema, model } from "mongoose";

const Model = new Schema(
  {
    userId: { type: String, required: true },
    StoppedAtMovie: [
      {
        movieId: { type: String, required: true },
        at: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model("watch", Model);
