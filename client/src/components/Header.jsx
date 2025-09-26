import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { images, stables } from "../constants";
import { getAllPosts } from "../services/index/posts";
import { logout } from "../store/actions/user";
import { FaMoon, FaSun } from "react-icons/fa"; // Importar iconos de luna y sol

const navItemsInfo = [
  { name: "Inicio", type: "link", href: "/" },
  { name: "Formación", type: "link", href: "/blog" },
  {
    name: "Nosotros",
    type: "dropdown",
    items: [
      { title: "Sobre nosotros", href: "/about" },
      { title: "Contactános", href: "/contact" },
    ],
  },
  {
    name: "Investigaciones",
    type: "dropdown",
    items: [
      { title: "SCE", href: "/sce" },
      { title: "Zona De Aprendizaje", href: "/zona" },
    ],
  },
  {
    name: "Iglesias",
    type: "dropdown",
    items: [
      { title: "Obras Sociales de la Iglesia", href: "/iglesia" },
      { title: "Sembrando Semillas", href: "/semillas" },
    ],
  },
  {
    name: "Más",
    type: "dropdown",
    items: [
      { title: "Psicopedia", href: "/nbooks" },
      { title: "Tienda", href: "/tienda" },
    ],
  },
];

const NavItem = ({ item }) => {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdownHandler = () => {
    setDropdown((curState) => !curState);
  };

  return (
    <li className="relative group">
      {item.type === "link" ? (
        <>
          <Link to={item.href} className="px-4 py-2 hover:text-blue-400">
            {item.name}
          </Link>
          <span className="cursor-pointer text-blue-500 absolute transition-all duration-500 font-bold right-0 top-0 group-hover:right-[90%] opacity-0 group-hover:opacity-100">
            /
          </span>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <button
            className="px-4 py-2 flex gap-x-1 items-center hover:text-blue-400"
            onClick={toggleDropdownHandler}
          >
            <span>{item.name}</span>
            <MdKeyboardArrowDown />
          </button>
          <div
            className={`${dropdown ? "block" : "hidden"
              } lg:hidden transition-all duration-500 pt-4 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-max`}
          >
            <ul className="bg-dark-soft lg:bg-white text-center flex flex-col shadow-lg rounded-lg overflow-hidden dark:bg-blue-950 text-green-400">
              {item.items.map((page, index) => (
                <Link
                  key={index}
                  to={page.href}
                  className="hover:bg-green-400 hover:text-white px-4 py-2 lg:text-dark-light-400"
                >
                  {page.title}
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

const Header = ({ onToggleDarkMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [navIsVisible, setNavIsVisible] = useState(false);
  const userState = useSelector((state) => state.user);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Estado para el modo oscuro
  const roles = userState.userInfo?.roles || [];

 // **YA** tenemos userState, así que definimos roles y visibilidad:
 const isVisitante = roles.some(
     (role) => role.toLowerCase() === "visitante"
   );
   // Solo mostramos Dashboard si NO es visitante
   const canSeeDashboard = !isVisitante;

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navVisibilityHandler = () => {
    setNavIsVisible((curState) => !curState);
  };

  const logoutHandler = () => {
    dispatch(logout());
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      try {
        const { data } = await getAllPosts(value);
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchButtonClick = () => {
    navigate(`/search?query=${searchTerm}`);
  };

  const toggleDarkModeHandler = () => {
    setDarkMode(!darkMode); // Cambiar el estado del modo oscuro
    onToggleDarkMode();
  };

  return (
    <section className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-green-400">
      <header className="container mx-auto px-5 flex justify-between py-4 items-center bg-transparent">
        <div className="flex items-center">
          <Link to="/">
            <img className="w-32 sm:w-40" src={images.Logo} alt="logo" />
          </Link>
          <div className="lg:hidden ml-4">
            {navIsVisible ? (
              <AiOutlineClose className="w-6 h-6" onClick={navVisibilityHandler} />
            ) : (
              <AiOutlineMenu className="w-6 h-6" onClick={navVisibilityHandler} />
            )}
          </div>
        </div>
        <div
          className={`${navIsVisible ? "right-0" : "-right-full"
            } transition-all duration-300 mt-[56px] lg:mt-0 bg-dark-hard lg:bg-transparent z-[49] flex flex-col w-full lg:w-auto justify-center lg:justify-end lg:flex-row fixed top-0 bottom-0 lg:static gap-x-9 items-center`}
        >
          <ul className="text-white items-center gap-y-5 lg:text-dark-soft flex flex-col lg:flex-row gap-x-2 font-semibold">
            {navItemsInfo.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </ul>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 py-2 rounded-full border-2 border-blue-500 focus:outline-none"
              placeholder="Buscar Noticias..."
            />
            <button
              onClick={handleSearchButtonClick}
              className="ml-2 px-4 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-300"
            >
              <AiOutlineSearch className="w-6 h-6" />
            </button>
            {searchResults.length > 0 && (
              <div className="absolute mt-1 bg-white shadow-lg rounded-lg w-full max-h-60 overflow-y-auto z-50">
                {searchResults.map((result) => (
                  <Link
                    key={result._id}
                    to={`/blog/${result.slug}`}
                    className="flex items-center gap-x-2 px-4 py-2 text-dark-soft hover:bg-gray-200"
                    onClick={() => setSearchResults([])}
                  >
                    <img
                      src={result.photo ? stables.UPLOAD_FOLDER_BASE_URL + result.photo : images.samplePostImage}
                      alt={result.title}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{result.title}</h4>
                      <p className="text-sm text-gray-500">{result.caption.substring(0, 50)}...</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={toggleDarkModeHandler} // Actualizado para usar la nueva función
            className="ml-4 border-2 border-blue-500 px-6 py-2 rounded-full text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            {darkMode ? <FaSun className="w-6 h-6" /> : <FaMoon className="w-6 h-6" />} {/* Icono basado en el estado */}
          </button>
          {userState.userInfo ? (
            <div className="text-white items-center gap-y-5 lg:text-dark-soft flex flex-col lg:flex-row gap-x-2 font-semibold">
              <div className="relative group">
                <div className="flex flex-col items-center">
                  <button
                    className="flex gap-x-1 items-center mt-5 lg:mt-0 border-2 border-blue-500 px-6 py-2 rounded-full text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
                    onClick={() => setProfileDropdown(!profileDropdown)}
                  >
                    <span>Cuenta</span>
                    <MdKeyboardArrowDown />
                  </button>
                  <div
                    className={`${profileDropdown ? "block" : "hidden"
                      } lg:hidden transition-all duration-500 pt-4 lg:absolute lg:bottom-0 lg:right-0 lg:transform lg:translate-y-full lg:group-hover:block w-max`}
                  >
                    <ul className="bg-dark-soft lg:bg-white text-center flex flex-col shadow-lg rounded-lg overflow-hidden dark:bg-blue-950 dark:text-green-400 lg:dark:bg-transparent">
                      {canSeeDashboard && (
                        <button
                          onClick={() => navigate("/admin")}
                          type="button"
                          className="hover:bg-dark-hard hover:text-white px-4 py-2 text-white lg:text-dark-soft dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-white"
                        >
                          Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => navigate("/profile")}
                        type="button"
                        className="hover:bg-dark-hard hover:text-white px-4 py-2 text-white lg:text-dark-soft dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-white"
                      >
                        Perfil
                      </button>

                      <button
                        onClick={logoutHandler}
                        type="button"
                        className="hover:bg-dark-hard hover:text-white px-4 py-2 text-white lg:text-dark-soft dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-white"
                      >
                        Logout
                      </button>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="mt-5 lg:mt-0 border-2 border-blue-500 px-6 py-2 rounded-full text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              Sign in
            </button>
          )}
        </div>
      </header>
    </section>
  );
};

export default Header;
