import { Schema, model } from "mongoose";

const LogsLoginSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true } // Crea automáticamente createdAt y updatedAt
);

export default model("LogsLogin", LogsLoginSchema);
