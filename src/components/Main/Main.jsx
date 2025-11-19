import React, { useState, useEffect, useContext } from "react";
import Popup from "../Popup/Popup";
import NewCard from "../NewCard/NewCard";
import EditProfile from "../EditProfile/EditProfile";
import ImagePopup from "../ImagePopup/ImagePopup";
import RemoveCard from "../RemoveCard/RemoveCard";
import EditAvatar from "../EditAvatar/EditAvatar";
import Card from "../Card/Card";
import avatar from "../../assets/images/JacquesC.jpg";
import editIcon from "../../assets/images/Vector1.png";
import addIcon from "../../assets/images/Add_Button.png";
import trashIcon from "../../assets/images/Trash.svg";
import heartIcon from "../../assets/images/Vector2_corazon.svg";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import api from "../../utils/apiInstance.js"; // o "../utils/apiInstance.js" según la ruta

import "./Main.css";

function Main({
  cards,
  onCardLike,
  onCardDelete,
  onAddCard,
  onOpenPopup,
  onClosePopup,
  popup,
}) {
  const { currentUser, handleUpdateUser, handleUpdateAvatar } =
    useContext(CurrentUserContext);

  const [cardToDelete, setCardToDelete] = useState(null);

  const openEditProfilePopup = () => {
    onOpenPopup({
      title: "Editar perfil",
      children: <EditProfile onClose={onClosePopup} />,
    });
  };

  const openAddCardPopup = () => {
    onOpenPopup({
      title: "Nuevo lugar",
      children: <NewCard onClose={onClosePopup} onAddCard={onAddCard} />,
    });
  };

  const openImagePopup = (card) => {
    onOpenPopup({
      title: "Imagen",
      children: <ImagePopup card={card} onClose={onClosePopup} />,
    });
  };

  const openDeleteCardPopup = (card) => {
    console.log("Card to delete:", card);
    setCardToDelete(card);
  };

  useEffect(() => {
    if (cardToDelete) {
      onOpenPopup({
        title: "¿Estás seguro/a?",
        children: (
          <RemoveCard onClose={onClosePopup} onConfirm={handleDeleteConfirm} />
        ),
      });
    }
  }, [cardToDelete]);

  const handleDeleteConfirm = () => {
    if (cardToDelete && cardToDelete._id) {
      onCardDelete(cardToDelete._id);
      setCardToDelete(null);
      onClosePopup();
    }
  };

  const openAvatarPopup = () => {
    onOpenPopup({
      title: "Cambiar foto de perfil",
      children: (
        <EditAvatar
          onClose={onClosePopup}
          onUpdateAvatar={handleUpdateAvatar}
        />
      ),
    });
  };

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__image-container">
          <img
            src={currentUser.avatar ? currentUser.avatar : avatar}
            alt="Avatar"
            className="profile__avatar"
          />
          <div className="profile__avatar-overlay" onClick={openAvatarPopup}>
            <img
              src={editIcon}
              alt="Editar avatar"
              className="profile__avatar-edit-icon"
            />
          </div>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <p className="profile__occupation">{currentUser.about}</p>
          <button
            className="profile__edit-button"
            onClick={openEditProfilePopup}
          >
            <img
              src={editIcon}
              alt="Editar perfil"
              className="profile__edit-icon"
            />
          </button>
        </div>

        {/* Parte 3: Add - Button */}
        <button className="profile__add-button" onClick={openAddCardPopup}>
          <img src={addIcon} alt="Add Button" className="profile__add-icon" />
        </button>
      </section>

      {/* Sección 2: ELEMENTOS */}
      <section>
        <ul className="elements">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardLike={onCardLike}
              onDelete={openDeleteCardPopup}
              onOpenImagePopup={openImagePopup}
              trashIcon={trashIcon}
              isLiked={
                typeof card.isLiked === "boolean"
                  ? card.isLiked
                  : Array.isArray(card.likes) &&
                    currentUser &&
                    currentUser._id &&
                    card.likes.some((like) => like === currentUser._id)
              }
            />
          ))}
        </ul>
      </section>

      {/* Renderización condicional del popup */}
      {popup && (
        <Popup
          onClose={onClosePopup}
          title={popup.title}
          className="popup_opened"
        >
          {popup.children}
        </Popup>
      )}
    </main>
  );
}

export default Main;
