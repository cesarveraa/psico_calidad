import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Schema, model } from "mongoose";

const SelectedScheduleSchema = new Schema({
  subject:  { type: Schema.Types.ObjectId, ref: "Subject",  required: true },
  schedule: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
});

const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, required: true },
    sexo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String },

    // NUEVOS CAMPOS
    ci: { type: String, required: true },
    userID: { type: String, unique: true }, // Se genera automáticamente

    // Relación dinámica con modelo Role
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true
      }
    ],

    selectedSchedules: [SelectedScheduleSchema],
  },
  { timestamps: true }
);

// Middleware antes de guardar
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }

  // Generar userID si no existe
  if (!this.userID) {
    const currentYear = new Date().getFullYear();
    const paddedCI = this.ci.toString().padStart(4, "0");
    this.userID = `est${currentYear}${paddedCI}`;
  }

  next();
});

// JWT con ID y roles
UserSchema.methods.generateJWT = function () {
  return sign(
    { id: this._id, roles: this.roles },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// Comparar contraseñas
UserSchema.methods.comparePassword = function (enteredPassword) {
  return compare(enteredPassword, this.password);
};

export default model("User", UserSchema);
