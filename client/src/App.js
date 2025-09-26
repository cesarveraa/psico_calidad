import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import SearchResults from "./components/Search";
import AboutUs from "./pages/aboutUs/aboutUs";
import AdminLayout from "./pages/admin/AdminLayout";
import Admin from "./pages/admin/screens/Dashboard";
import LogsLogin from "./pages/admin/screens/Logs/LogsLogin";
import LogsSistema from "./pages/admin/screens/Logs/LogsSistema";
import AddEditComment from "./pages/admin/screens/PulpiComentarios/editComment";
import ListComments from "./pages/admin/screens/PulpiComentarios/listComments";
import CategoriesBooks from "./pages/admin/screens/bcategories/CategoriesBooks";
import EditCategoriesBooks from "./pages/admin/screens/bcategories/EditCategoriesBooks";
import EditBook from "./pages/admin/screens/books/EditBook";
import ManageBooks from "./pages/admin/screens/books/ManageBooks";
import Categories from "./pages/admin/screens/categories/Categories";
import EditCategories from "./pages/admin/screens/categories/EditCategories";
import Comments from "./pages/admin/screens/comments/Comments";
import EditFormaPago from "./pages/admin/screens/formasPago/EditFormaPago";
import FormaPagoList from "./pages/admin/screens/formasPago/FormaPagoList";
import CreateFormaPago from "./pages/admin/screens/formasPago/createFormaPago";
import EditPost from "./pages/admin/screens/posts/EditPost";
import ManagePosts from "./pages/admin/screens/posts/ManagePosts";
import CategoryList from "./pages/admin/screens/productos/CategoryList";
import CreateProduct from "./pages/admin/screens/productos/CreateProduct";
import EditCategory from "./pages/admin/screens/productos/EditCategory";
import EditProduct from "./pages/admin/screens/productos/EditProduct";
import ProductList from "./pages/admin/screens/productos/ManageProducts";
import OrderDetails from "./pages/admin/screens/productos/orderDetails";
import OrderList from "./pages/admin/screens/productos/orders";
import Roles from "./pages/admin/screens/roles/Roles";
import Users from "./pages/admin/screens/users/Users";
import AreaPage from "./pages/areas/areaPage";
import ArticleDetailPage from "./pages/articleDetail/ArticleDetailPage";
import BlogPage from "./pages/blog/BlogPage";
import ContactUs from "./pages/contact/contactUs";
import Docente from "./pages/docentes/docentePage";
import Estudiante from "./pages/estudiante/estudiantePage";
import FormacionContinua from "./pages/formacionContinua/formacionContinuaPage";
import HomePage from "./pages/home/HomePage";
import Iglesia from "./pages/iglesia/Iglesia";
import LoginPage from "./pages/login/LoginPage";
import NBooks from "./pages/nbooks/NBooks";
import Noticias from "./pages/noticias/NotiiciasPage";
import PostgradoCurso from "./pages/postgrado/postgradoCursoPage";
import Postgrado from "./pages/postgrado/postgradoPage";
import Pregrado from "./pages/pregrado/PregadoPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ResetPasswordPage from "./pages/profile/resetPasswordPage";
import RegisterPage from "./pages/register/RegisterPage";
import SCE from "./pages/sce/sce";
import ViewSchedulePage from "./pages/schedules/ViewSchedulePage";
import MakeHorariosPage from "./pages/schedules/makeSchedulesPage";
import HorariosPage from "./pages/schedules/schedulesPage";
import Semillas from "./pages/sembrandoSemillas/Semillas";
import OptionalSubjectsPage from "./pages/subjects/OptionalSubjectsPage";
import Subject from "./pages/subjects/subjectPage";
import CheckoutPage from "./pages/tienda/CheckoutPage";
import ProductsPage from "./pages/tienda/allProducts";
import CartPage from "./pages/tienda/carritoPage";
import ProductDetailPage from "./pages/tienda/productDetails";
import University from "./pages/universities/UniversityPage";
import ZonaAprendizaje from "./pages/zonaAprendizaje/ZonaAprendizaje";


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setIsDarkMode(savedMode === "true");
      if (savedMode === "true") {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  return (
    <div className={`App font-opensans ${isDarkMode ? "dark" : ""}`}>
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/sce" element={<SCE />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/Noticias" element={<Noticias />} />
        <Route path="/blog/:slug" element={<ArticleDetailPage />} />
        <Route path="/pregrado" element={<Pregrado />} />
        <Route path="/subjects/:slug" element={<Subject />} />
        <Route path="/armahorarios" element={<MakeHorariosPage />} />
        <Route path="/mi-horario" element={<ViewSchedulePage />} />
        <Route path="/universities/:slug" element={<University />} />
        <Route path="/postgrado" element={<Postgrado />} />
        <Route path="/optional-subjects" element={<OptionalSubjectsPage />} />
        <Route path="/area/:id" element={<AreaPage />} />
        <Route path="/formacioncontinua" element={<FormacionContinua />} />
        <Route path="/postgradocurso/:slug" element={<PostgradoCurso />} />
        <Route path="/docentes/:slug" element={<Docente />} />
        <Route path="/estudiante/:slug" element={<Estudiante />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/zona" element={<ZonaAprendizaje />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/iglesia" element={<Iglesia />} />
        <Route path="/semillas" element={<Semillas />} />
        <Route path="/nbooks" element={<NBooks />} />
        <Route path="/horarios" element={<HorariosPage />} />
        <Route path="/tienda" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/forget-password" element={<ResetPasswordPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="comments" element={<Comments />} />
          <Route path="posts/manage" element={<ManagePosts />} />
          <Route path="posts/manage/edit/:slug" element={<EditPost />} />
          <Route path="categories/manage" element={<Categories />} />
          <Route path="categories/manage/edit/:slug" element={<EditCategories />} />
          <Route path="users/manage" element={<Users />} />
          <Route path="roles/manage" element={<Roles />} />
          <Route path="books/manage" element={<ManageBooks />} />
          <Route path="products/manage" element={<CreateProduct />} />
          <Route path="products/manage/list" element={<ProductList />} />
          <Route path="products/manage/edit/:id" element={<EditProduct />} />
          <Route path="productCategories/list" element={<CategoryList />} />
          <Route path="productCategories/edit/:id" element={<EditCategory />} />
          <Route path="formaPago/create" element={<CreateFormaPago />} />
          <Route path="formaPago/list" element={<FormaPagoList />} />
          <Route path="formaPago/edit/:id" element={<EditFormaPago />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="books/manage/edit/:slug" element={<EditBook />} />
          <Route path="book-categories/manage" element={<CategoriesBooks />} />
          <Route path="book-categories/manage/edit/:bookCategoryId" element={<EditCategoriesBooks />} />
          <Route path="pulpiComments" element={<ListComments />} />
          <Route path="pulpiComments/edit/:id" element={<AddEditComment />} />
          <Route path="logs" element={<LogsLogin />} />
          <Route path="logs/sistema" element={<LogsSistema />} />



        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
