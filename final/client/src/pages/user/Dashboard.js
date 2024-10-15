import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import UserMenu from "../../components/nav/UserMenu";
import { useState, useEffect } from "react";
import { FaRegCreditCard, FaPlus, FaCreditCard, FaEdit, FaTrashAlt } from "react-icons/fa";
import CardForm from "../../components/forms/CardForm";
import { Modal, Button, Popconfirm } from "antd";
import axios from "axios";

export default function UserDashboard() {
  const [auth] = useAuth();
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(
    localStorage.getItem("selectedCardId") || null
  );
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Evitar múltiples clics en guardar

  useEffect(() => {
    if (selectedCard) {
      setIsEditModalVisible(true);
    }
  }, [selectedCard]);

  const fetchCards = async () => {
    try {
      const { data } = await axios.get(`/api/credit-cards/customer/${auth?.id}`);
      setCards(data);
    } catch (error) {
      console.error("Error al cargar las tarjetas", error);
    }
  };

  const handleWalletClick = () => {
    setIsWalletModalVisible(true);
    fetchCards();
  };

  const toggleAddModal = () => {
    setIsAddModalVisible((prev) => !prev);
    setSelectedCard(null);
  };

  const handleCardSelect = (card) => {
    setSelectedCardId(card.id);
    localStorage.setItem("selectedCardId", card.id);
    setIsWalletModalVisible(false); // Cerrar modal después de seleccionar
  };

  const handleEdit = (card) => {
    setSelectedCard(card);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/credit-cards/${id}`);
      setCards(cards.filter((card) => card.id !== id));
      setSelectedCard(null);
      localStorage.removeItem("selectedCardId");
    } catch (error) {
      console.error("Error al eliminar la tarjeta", error);
    }
  };

  const handleSave = async (newDetails) => {
    try {
      setIsSaving(true); // Evitar múltiples clics
      if (selectedCard) {
        await axios.put(`/api/credit-cards/${selectedCard.id}`, newDetails);
        setCards(
          cards.map((card) =>
            card.id === selectedCard.id ? { ...card, ...newDetails } : card
          )
        );
      } else {
        const { data } = await axios.post("/api/credit-cards", newDetails);
        setCards([...cards, data]);
      }
      setIsAddModalVisible(false);
      setIsEditModalVisible(false);
      setSelectedCard(null);
      window.location.reload(); // Recargar la página automáticamente
    } catch (error) {
      console.error("Error al guardar la tarjeta", error);
    } finally {
      setIsSaving(false); // Permitir clics nuevamente
    }
  };

  return (
    <>
      <Jumbotron title={`Hola ${auth?.names}`} subTitle="Dashboard" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="p-3 mt-2 mb-2 h4 bg-light">Información de Usuario</div>
            <ul className="list-group">
              <li className="list-group-item">Nombres: {auth?.names}</li>
              <li className="list-group-item">Apellidos: {auth?.lastNames}</li>
              <li className="list-group-item">Celular: {auth?.phoneNumber}</li>
              <li className="list-group-item">Dirección: {auth?.address}</li>
            </ul>

            <div className="mt-4 d-flex align-items-center">
              <FaRegCreditCard
                size={60}
                onClick={handleWalletClick}
                style={{ cursor: "pointer", marginRight: "10px" }}
              />
              <Button
                className="btn btn-outline-dark"
                icon={<FaPlus />}
                onClick={toggleAddModal}
              >
                Agregar Tarjeta
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Ver y Seleccionar Tarjetas */}
      <Modal
        title="Métodos de Pago"
        visible={isWalletModalVisible}
        onCancel={() => setIsWalletModalVisible(false)}
        footer={null}
      >
        {cards.map((card) => (
          <div key={card.id} className="d-flex align-items-center mb-2">
            <FaCreditCard size={20} className="me-2" />
            <span>**** **** **** {card.ccNumber.slice(-4)}</span>
            <Button className="ms-auto" onClick={() => handleCardSelect(card)}>
              Seleccionar
            </Button>
            <Button
              className="ms-2"
              icon={<FaEdit />}
              onClick={() => handleEdit(card)}
            >
              Editar
            </Button>
            <Popconfirm
              title="¿Estás seguro de eliminar esta tarjeta?"
              onConfirm={() => handleDelete(card.id)}
              okText="Sí"
              cancelText="No"
            >
              <Button icon={<FaTrashAlt />} danger className="ms-2">
                Eliminar
              </Button>
            </Popconfirm>
          </div>
        ))}
      </Modal>

      {/* Modal para Agregar Nueva Tarjeta */}
      <Modal
        title="Agregar Nueva Tarjeta"
        visible={isAddModalVisible}
        onCancel={toggleAddModal}
        footer={null}
      >
        <CardForm
          setCardDetails={handleSave}
          isEdit={false}
          customerId={auth?.id}
        />
      </Modal>

      {/* Modal para Editar Tarjeta */}
      <Modal
        title="Editar Tarjeta"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <CardForm
          cardDetails={selectedCard}
          setCardDetails={handleSave}
          isEdit={true}
          customerId={auth?.id}
        />
      </Modal>
    </>
  );
}
