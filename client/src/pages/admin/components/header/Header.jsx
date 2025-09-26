import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDashboard, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaBell, FaComments, FaNewspaper, FaShopify, FaUser } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../../../constants";
import { createBook } from "../../../../services/index/books";
import { getAllOrders } from "../../../../services/index/orders";
import { createPost } from "../../../../services/index/posts";
import NavItem from "./NavItem";
import NavItemCollapse from "./NavItemCollapse";

const Header = () => {
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const windowSize = useWindowSize();

  // Obtener permisos desde el store
  const permissions = userState.userInfo?.permissions || [];

  const canViewDashboard     = permissions.includes("view_dashboard");
  const canManageUsers       = permissions.includes("manage_users");
  const canManageRoles       = permissions.includes("manage_roles");
  const canAccessComments    = permissions.includes("access_comments");
  const canManagePosts       = permissions.includes("manage_posts");
  const canManageBooks       = permissions.includes("manage_books");
  const canManageProducts    = permissions.includes("manage_products");
  const canManagePulpi       = permissions.includes("manage_pulpi");
  const canViewLoginLogs = permissions.includes("view_login_logs"); // 👈 NUEVO
  const canViewLogsSistema = permissions.includes("view_system_logs"); // ✅ NUEVO



  const defaultNav = canViewDashboard
    ? "dashboard"
    : canAccessComments
      ? "comments"
      : canManageBooks
        ? "books"
        : canManageProducts
          ? "tienda"
          : canManagePulpi
            ? "pulpi"
              : canViewLoginLogs
              ? "logs" 
                : canViewLogsSistema
                ? "logs_sistema" 
                : "dashboard";

  const [activeNavName, setActiveNavName] = useState(defaultNav);

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(userState.userInfo.token),
    refetchOnWindowFocus: false,
    enabled: !!userState.userInfo.token,
  });

  const unviewedOrdersCount = orders?.filter(o => !o.vistoPorAdmin).length || 0;

  const { mutate: mutateCreatePost, isLoading: isLoadingCreatePost } = useMutation({
    mutationFn: () => createPost({ token: userState.userInfo.token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("El post se creó correctamente, ¡edítalo ahora!");
      navigate(`/admin/posts/manage/edit/${data.slug}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: mutateCreateBook, isLoading: isLoadingCreateBook } = useMutation({
    mutationFn: () => createBook({ token: userState.userInfo.token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["books"]);
      toast.success("El libro se creó correctamente, ¡edítalo ahora!");
      navigate(`/admin/books/manage/edit/${data.slug}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleMenuHandler = () => setIsMenuActive(v => !v);

  useEffect(() => {
    setIsMenuActive(windowSize.width >= 1024);
  }, [windowSize.width]);

  const toggleSubMenu = (name) =>
    setOpenSubMenus(s => ({ ...s, [name]: !s[name] }));

  return (
    <header className="flex h-fit w-full items-center justify-between p-4 lg:h-full lg:max-w-[300px] lg:flex-col lg:items-start lg:justify-start lg:p-0">
      <Link to="/"><img src={images.Logo} alt="logo" className="w-16 lg:hidden" /></Link>
      <div className="cursor-pointer lg:hidden">
        {isMenuActive
          ? <AiOutlineClose className="w-6 h-6" onClick={toggleMenuHandler}/>
          : <AiOutlineMenu  className="w-6 h-6" onClick={toggleMenuHandler}/>
        }
      </div>

      {isMenuActive && (
        <div className="fixed inset-0 lg:static lg:h-full lg:w-full">
          <div className="fixed inset-0 bg-black opacity-50 lg:hidden" onClick={toggleMenuHandler}/>
          <div className="fixed top-0 bottom-0 left-0 z-50 w-3/4 overflow-y-auto bg-white p-4 lg:static lg:w-full lg:p-6 text-dark-hard">
            <Link to="/"><img src={images.Logo} alt="logo" className="w-16" /></Link>
            <h4 className="mt-10 font-bold text-[#C7C7C7]">MENU PRINCIPAL</h4>

            <div className="mt-6 flex flex-col gap-y-2">
              {/* Dashboard, Usuarios y Roles */}
              {(canViewDashboard || canManageUsers || canManageRoles || canViewLoginLogs || canViewLogsSistema) && (
                <>
                  {canViewDashboard && (
                    <NavItem
                      title="Dashboard"
                      link="/admin"
                      icon={<AiFillDashboard className="text-xl" />}
                      name="dashboard"
                      activeNavName={activeNavName}
                      setActiveNavName={setActiveNavName}
                    />
                  )}
                  {canManageUsers && (
                    <NavItem
                      title="Usuarios"
                      link="/admin/users/manage"
                      icon={<FaUser className="text-xl" />}
                      name="users"
                      activeNavName={activeNavName}
                      setActiveNavName={setActiveNavName}
                    />
                  )}
                  {canManageRoles && (
                    <NavItem
                      title="Roles"
                      link="/admin/roles/manage"
                      icon={<MdEditDocument className="text-xl" />}
                      name="roles"
                      activeNavName={activeNavName}
                      setActiveNavName={setActiveNavName}
                    />
                  )}
                  {canViewLoginLogs && (
                    <NavItem
                      title="Logs de Login"
                      link="/admin/logs"
                      icon={<MdEditDocument className="text-xl" />} // puedes cambiar el ícono si prefieres
                      name="logs"
                      activeNavName={activeNavName}
                      setActiveNavName={setActiveNavName}
                    />
                  )}
                  {canViewLogsSistema && (
                    <NavItem
                      title="Logs del Sistema"
                      link="/admin/logs/sistema"
                      icon={<MdEditDocument className="text-xl" />} // Puedes usar otro ícono si lo prefieres
                      name="logs_sistema"
                      activeNavName={activeNavName}
                      setActiveNavName={setActiveNavName}
                    />
                  )}

                </>
              )}

              {/* Comentarios y Posts */}
              {canAccessComments && (
                <NavItem
                  title="Comentarios"
                  link="/admin/comments"
                  icon={<FaComments className="text-xl" />}
                  name="comments"
                  activeNavName={activeNavName}
                  setActiveNavName={setActiveNavName}
                />
              )}

              {canManagePosts && (
                <NavItemCollapse
                  title="Publicaciones"
                  icon={<FaNewspaper className="text-xl" />}
                  name="posts"
                  activeNavName={activeNavName}
                  setActiveNavName={setActiveNavName}
                  isOpen={openSubMenus.posts}
                  onClick={() => toggleSubMenu("posts")}
                >
                  <Link to="/admin/posts/manage">Administra todos los posts</Link>
                  <button
                    disabled={isLoadingCreatePost}
                    onClick={() => mutateCreatePost()}
                    className="text-start disabled:opacity-60"
                  >
                    Agrega un nuevo post
                  </button>
                  <Link to="/admin/categories/manage">Categorías</Link>
                </NavItemCollapse>
              )}

              {/* Libros */}
              {canManageBooks && (
                <NavItemCollapse
                  title="Libros"
                  icon={<MdEditDocument className="text-xl" />}
                  name="books"
                  activeNavName={activeNavName}
                  setActiveNavName={setActiveNavName}
                  isOpen={openSubMenus.books}
                  onClick={() => toggleSubMenu("books")}
                >
                  <Link to="/admin/books/manage">Administra todos los libros</Link>
                  <button
                    disabled={isLoadingCreateBook}
                    onClick={() => mutateCreateBook()}
                    className="text-start disabled:opacity-60"
                  >
                    Agrega un nuevo libro
                  </button>
                  <Link to="/admin/book-categories/manage">Categorías de libros</Link>
                </NavItemCollapse>
              )}

              {/* Tienda */}
              {canManageProducts && (
                <NavItemCollapse
                  title="Tienda"
                  icon={
                    <div className="relative">
                      <FaShopify className="text-xl" />
                      {unviewedOrdersCount > 0 && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 ...">
                          {unviewedOrdersCount}
                        </div>
                      )}
                    </div>
                  }
                  name="tienda"
                  activeNavName={activeNavName}
                  setActiveNavName={setActiveNavName}
                  isOpen={openSubMenus.tienda}
                  onClick={() => toggleSubMenu("tienda")}
                >
                  <Link to="/admin/products/manage">Crear Producto</Link>
                  <Link to="/admin/products/manage/list">Lista de productos</Link>
                  <Link to="/admin/productCategories/list">Lista de categorías</Link>
                  <Link to="/admin/formaPago/create">Crear Forma de Pago</Link>
                  <Link to="/admin/formaPago/list">Formas de Pago</Link>
                  <Link to="/admin/orders" className="relative flex items-center">
                    Administrar Pedidos
                    {unviewedOrdersCount > 0 && (
                      <FaBell className="absolute -top-2 -right-2 text-red-500 text-xl" />
                    )}
                  </Link>
                </NavItemCollapse>
              )}

              {/* Pulpi */}
              {canManagePulpi && (
                <NavItemCollapse
                  title="Pulpi"
                  icon={<MdEditDocument className="text-xl" />}
                  name="pulpi"
                  activeNavName={activeNavName}
                  setActiveNavName={setActiveNavName}
                  isOpen={openSubMenus.pulpi}
                  onClick={() => toggleSubMenu("pulpi")}
                >
                  <Link to="/admin/pulpiComments">Administrar comentarios</Link>
                </NavItemCollapse>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
