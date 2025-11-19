import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import Main from "./Main/Main.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import api from "../utils/apiInstance.js";
import {
  authorize,
  register as apiRegister,
  login as saveToken,
  isAuthenticated,
  verifyToken,
  logout,
  getToken,
} from "../utils/auth.js";

function AppContent() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState(null);
  const [tooltip, setTooltip] = useState({
    open: false,
    success: false,
    message: "",
  });
  const [checkingToken, setCheckingToken] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === "/signin" || location.pathname === "/signup";

  const onOpenPopup = (cfg) => setPopup(cfg);
  const onClosePopup = () => setPopup(null);

  const loadData = async () => {
    const [user, list] = await Promise.all([
      api.getUserInfo(),
      api.getInitialCards(),
    ]);
    setCurrentUser(user);
    setCards(list);
  };

  useEffect(() => {
    const jwt = getToken();
    if (!jwt) {
      setCheckingToken(false);
      return;
    }
    verifyToken(jwt)
      .then((res) => {
        setEmail(res?.data?.email || "");
        return loadData();
      })
      .catch(() => logout())
      .finally(() => setCheckingToken(false));
  }, []);

  const handleUpdateUser = async (body) => {
    const updated = await api.updateUserInfo(body);
    setCurrentUser(updated);
  };
  const handleUpdateAvatar = async (body) => {
    const updated = await api.updateAvatar(body);
    setCurrentUser(updated);
  };

  const handleAddCard = async ({ name, link }) => {
    const created = await api.addCard({ name, link });
    setCards((prev) => [created, ...prev]);
  };
  const handleCardDelete = async (id) => {
    await api.deleteCard(id);
    setCards((prev) => prev.filter((c) => c._id !== id));
  };
  const handleCardLike = async (card) => {
    const likedByMe =
      typeof card.isLiked === "boolean"
        ? card.isLiked
        : Array.isArray(card.likes) && currentUser?._id
        ? card.likes.includes(currentUser._id)
        : false;
    const updated = await api.changeLikeCardStatus(card._id, likedByMe);
    setCards((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
  };

  const handleRegister = async ({ email, password }) => {
    try {
      await apiRegister({ email, password });
      return { success: true, message: "¡Correcto! Ya estás registrado." };
    } catch (e) {
      return {
        success: false,
        message: e.message || "Error al registrar",
      };
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const token = await authorize({ email, password });
      saveToken(token);
      const verified = await verifyToken(token);
      setEmail(verified?.data?.email || "");
      await loadData();
      return { success: true, message: "Sesión iniciada" };
    } catch (e) {
      return {
        success: false,
        message: "Uy, algo salió mal. Por favor, inténtalo de nuevo.",
      };
    }
  };

  const handleSignOut = () => {
    logout();
    setEmail("");
    setCurrentUser({});
    setCards([]);
    navigate("/signin", { replace: true });
  };

  if (checkingToken) return <div className="preloader">Cargando...</div>;

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
    >
      <div className="app">
        <Header email={email} onSignOut={handleSignOut} />
        <main className="main">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Main
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                    onAddCard={handleAddCard}
                    onOpenPopup={onOpenPopup}
                    onClosePopup={onClosePopup}
                    popup={popup}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <Login
                  onSubmit={handleLogin}
                  onResult={(ok, msg) =>
                    setTooltip({ open: true, success: !!ok, message: msg })
                  }
                />
              }
            />
            <Route
              path="/signup"
              element={
                <Register
                  onSubmit={handleRegister}
                  onResult={(ok, msg) =>
                    setTooltip({ open: true, success: !!ok, message: msg })
                  }
                />
              }
            />
            <Route
              path="*"
              element={<Navigate to={isAuthenticated() ? "/" : "/signin"} replace />}
            />
          </Routes>
        </main>
        {!isAuthPage && <Footer />}
        <InfoTooltip
          isOpen={tooltip.open}
          success={tooltip.success}
          message={tooltip.message}
          onClose={() => setTooltip((t) => ({ ...t, open: false }))}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
