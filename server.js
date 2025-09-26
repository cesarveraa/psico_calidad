import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import connectDB from "./config/db.js";
import {
  errorResponserHandler,
  invalidPathHandler,
} from "./middleware/errorHandler.js";

// Routes
import PasswordHistory from "./routes/PasswordHistory.js";
import aboutRoutes from "./routes/aboutRoutes";
import areaRoutes from "./routes/areaRoutes";
import bookCategoriesRoutes from "./routes/bookCategoriesRoutes";
import bookRoutes from "./routes/bookRoutes";
import commentRoutes from "./routes/commentRoutes";
import contactUsRoutes from "./routes/contactRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import docenteRoutes from "./routes/docenteRoutes";
import estudianteRoutes from "./routes/estudianteRoutes";
import formaPagoRouter from "./routes/formaPagoRoutes";
import homePageRoutes from "./routes/homePageRoutes";
import logsLoginRoutes from "./routes/logsLoginRoutes.js";
import logsSistemaRoutes from "./routes/logsSistemaRoutes.js";
import orderRoutes from "./routes/orderRoutes";
import postCategoriesRoutes from "./routes/postCategoriesRoutes";
import postRoutes from "./routes/postRoutes";
import postgradoCurso from "./routes/postgradoCurso";
import productCategoriesRouter from "./routes/productCategoryRouter";
import productRouter from "./routes/productoRoutes";
import pulpiComentariosRouter from "./routes/pulpiComentariosRouter";
import rolesRoutes from "./routes/rolesRoutes.js";
import sceRoutes from "./routes/sceRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import universityRoutes from "./routes/universityRoutes";
import userRoutes from "./routes/userRoutes";
import zaRoutes from "./routes/zaRoutes";
import {
  initializeAboutUs,
  initializeContactUs,
  initializeDashboard,
  initializeHomePage,
  initializeProductCategories,
  initializeProducts,
  initializePulpiComentarios,
  initializeSCE,
  initializeZA,
} from "./utils/initializers";

dotenv.config();

connectDB().then(() => {
  initializeAboutUs();
  initializeContactUs();
  initializeHomePage();
  initializeSCE();
  initializeZA();
  initializeProducts();
  initializeProductCategories();
  initializeDashboard();
  initializePulpiComentarios();
  console.log("Database connected successfully.");
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Rutas principales
app.use("/api/users", userRoutes);
app.use("/api/roles", rolesRoutes); 
app.use("/api/passwords", PasswordHistory); 
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/post-categories", postCategoriesRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/homepage", homePageRoutes);
app.use("/api/contact", contactUsRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/docente", docenteRoutes);
app.use("/api/estudiantes", estudianteRoutes);
app.use("/api/postgradoCurso", postgradoCurso);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/sce", sceRoutes);
app.use("/api/za", zaRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/book-categories", bookCategoriesRoutes);
app.use("/api/products", productRouter);
app.use("/api/products/categories", productCategoriesRouter);
app.use("/api/formaPago", formaPagoRouter);
app.use("/api/order", orderRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/pulpi", pulpiComentariosRouter);

app.use("/api/logs", logsLoginRoutes);
app.use('/api/logsSistema', logsSistemaRoutes);

// Archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Middleware de errores
app.use(invalidPathHandler);
app.use(errorResponserHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
