import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PublicationSchema = new Schema(
  {
    id: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    sentiment: {
      type: String,
      required: true
    },
    flags: {
      type: Number,
      default: 0,
      required: true
    },
    commentCount: {
      type: Number,
      default: 0,
      required: true
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Publication = mongoose.model("Publication", PublicationSchema);

export default Publication;
