import { Schema, model } from "mongoose";

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    permissions: {
      type: [String],
      default: [], // Ejemplo: ["manage_users", "view_dashboard"]
    },
  },
  {
    timestamps: true,
  }
);

export default model("Role", RoleSchema);
