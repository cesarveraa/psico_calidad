import { Schema, model } from "mongoose";

const LogsSistemaSchema = new Schema(
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
    sistema: {
      type: String,
      enum: [
        "view_dashboard",
        "manage_users",
        "manage_roles",
        "access_comments",
        "manage_posts",
        "manage_books",
        "manage_products",
        "manage_pulpi",
        "view_login_logs",
        "view_system_logs",
      ],
      required: true,
    },
    accion: {
      type: String,
      default: "Sin acción registrada",
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true } // Crea createdAt y updatedAt automáticamente
);

export default model("LogsSistema", LogsSistemaSchema);
