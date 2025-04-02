import mongoose from "mongoose";

const lostPersonSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  aadharCardNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[2-9]{1}[0-9]{11}$/,
  },
  dateReported: {
    type: Date,
    default: Date.now,
  },
  zipCode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/,
  },
  description: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  imageEmbedding: {
    type: [Number],
    required: true,
  },
});

module.exports = mongoose.model("LostPerson", lostPersonSchema);
