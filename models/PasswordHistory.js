// models/PasswordHistory.js
import { Schema, model } from "mongoose";

const PasswordHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Aquí guardamos el hash de la contraseña
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false }
  }
);

export default model("PasswordHistory", PasswordHistorySchema);
