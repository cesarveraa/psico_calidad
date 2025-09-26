import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getUserProfile } from "../../services/index/users";
import Header from "./components/header/Header";

const AdminLayout = () => {
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const location = useLocation();

  // Obtenemos los permisos desde Redux
  const permissions = useSelector((state) => state.user.userInfo.permissions || []);

  const canViewDashboard     = permissions.includes("view_dashboard");
  const canAccessComments    = permissions.includes("access_comments");
  const canManageBooks       = permissions.includes("manage_books");
  const canManageProducts    = permissions.includes("manage_products");
  const canManagePulpi       = permissions.includes("manage_pulpi");
  const canViewLoginLogs     = permissions.includes("view_login_logs");
  const canViewLogsSistema   = permissions.includes("view_system_logs");

  // Redirección automática según permisos
  useEffect(() => {
    if (location.pathname === "/admin") {
      if (canViewDashboard)     return navigate("/admin");
      if (canAccessComments)    return navigate("/admin/comments");
      if (canManageBooks)       return navigate("/admin/books/manage");
      if (canManageProducts)    return navigate("/admin/products/manage");
      if (canManagePulpi)       return navigate("/admin/pulpiComments");
      if (canViewLoginLogs)     return navigate("/admin/logs"); 
      if (canViewLogsSistema)   return navigate("/admin/logs/sistema");

      // fallback
      return navigate("/admin");
    }
  }, [location.pathname, permissions, navigate]);

  // Cargar perfil si no está
  const {
    data: profileData,
    isLoading: profileIsLoading,
    error: profileError,
  } = useQuery({
    queryFn: () => {
      return getUserProfile({ token: userState.userInfo.token });
    },
    queryKey: ["profile"],
    onSuccess: (data) => {
      if (Array.isArray(data.roles) && data.roles.includes("visitante")) {
        navigate("/");
        toast.error("No tienes permiso para acceder al panel administrativo");
      }
    },
    onError: (err) => {
      console.log(err);
      navigate("/");
      toast.error("No tienes permiso para acceder al panel administrativo");
    },
  });

  if (profileIsLoading) {
    return (
      <div className="flex flex-col h-screen lg:flex-row bg-white">
        <header className="flex h-fit w-full items-center justify-between p-4 lg:h-full lg:max-w-[300px] lg:flex-col lg:items-start lg:justify-start lg:p-0">
          <Skeleton variant="rectangular" width={64} height={64} className="w-16 lg:hidden" />
          <Skeleton variant="rectangular" width={24} height={24} className="cursor-pointer lg:hidden" />
          <div className="fixed inset-0 lg:static lg:h-full lg:w-full">
            <Skeleton variant="rectangular" width="100%" height={64} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Box sx={{ mt: 4 }}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} variant="rectangular" width="100%" height={40} />
              ))}
            </Box>
          </div>
        </header>
        <main className="bg-[#F9F9F9] flex-1 p-4 lg:p-6 text-black">
          <div className="bg-white-dark text-black-dark p-4">
            <Skeleton variant="rectangular" width="100%" height={40} />
            <Skeleton variant="rectangular" width="100%" height={40} />
            <Skeleton variant="rectangular" width="100%" height={40} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen lg:flex-row bg-white">
      <Header />
      <main className="bg-[#F9F9F9] flex-1 p-4 lg:p-6 text-black">
        <div className="bg-white-dark text-black-dark p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
