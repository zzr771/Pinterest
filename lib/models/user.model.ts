import mongoose from "mongoose"

/**
 *    user._id: id created by Mongoose, used within mongoDB
 *          id: id returned by Clerk. Use this id to query the user's data.
 */
const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  imageUrl: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: String,
  about: String,
  website: String,
  username: { type: String, required: true, unique: true },

  created: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pin" }],
  saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pin" }],

  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  follower: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  hidePins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pin" }],
  blockUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  drafts: [
    {
      _id: { type: String, required: true },
      imageUrl: { type: String, required: true },
      expiredAt: { type: Number, required: true },
      title: String,
      description: String,
      link: String,
      imageSize: { width: Number, height: Number },
    },
  ],
})

// Prevent repetitive model creation
const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
