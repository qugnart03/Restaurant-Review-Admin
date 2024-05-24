import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const MenuModal = ({ isOpen, toggle, restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [menuModal, setMenuModal] = useState(false);
  const [idItem, setIdItem] = useState(null);
  const [image, setImage] = useState(null);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/restaurant/menu/${restaurantId}`,
        {
          withCredentials: true,
        }
      );
      const { success, menu } = response.data;
      if (success) {
        if (menu.items.length === 0) {
          return;
        }
        setMenuItems(menu.items);
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMenu();
    }
  }, [isOpen]);

  const toggleMenuModal = () => {
    setMenuModal(!menuModal);
  };

  const handleMenuEdit = (menuItem) => {
    setIdItem(menuItem._id);
    setName(menuItem.nameDish);
    setType(menuItem.typeDish);
    setPrice(menuItem.priceDish);
    setImageUrl(menuItem.image.url);
    toggleMenuModal();
  };

  const handleMenuDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/admin/delete/menu/${idItem}`,
        {
          withCredentials: true,
        }
      );
      fetchMenu();
      toggleMenuModal();
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleMenuUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("nameDish", name);
      formData.append("typeDish", type);
      formData.append("priceDish", price);
      if (image) {
        formData.append("image", image);
      }

      await axios.put(
        `http://localhost:8080/api/admin/update/menu/${idItem}`,
        formData,
        {
          withCredentials: true,
        }
      );
      fetchMenu();
      toggleMenuModal();
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result;
      setImageUrl(imgUrl);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Modal className="modal-lg" isOpen={isOpen} onClick={toggle}>
        <ModalHeader>Menu</ModalHeader>
        <ModalBody>
          {menuItems.length === 0 ? (
            <p>Menu trống</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img
                        src={item.image.url}
                        width="100"
                        height="100"
                        alt="Menu item"
                      />
                    </td>
                    <td>{item.typeDish}</td>
                    <td>{item.nameDish}</td>
                    <td>{item.priceDish}</td>
                    <td>
                      <Button
                        color="primary"
                        onClick={() => handleMenuEdit(item)}
                      >
                        Action
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => {
              toggle();
              // Đặt lại dữ liệu về trạng thái rỗng
              setMenuItems([]);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={menuModal} toggle={toggleMenuModal} className="modal-xl">
        <ModalHeader toggle={toggleMenuModal}>Edit Menu Item</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="type">Type</Label>
              <Input
                type="select"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {dataTypeDish.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input
                type="text"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="imageUrl">Image URL</Label>
              <Input
                type="file"
                id="imageUrl"
                name="image"
                onChange={handleImageChange}
              />
              {imageUrl && (
                <img src={imageUrl} alt="dish avatar" width="160" height="90" />
              )}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleMenuUpdate}>
            Update
          </Button>
          <Button color="danger" onClick={handleMenuDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleMenuModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const dataTypeDish = [
  { label: "Appetizer", value: "appetizer" },
  { label: "Main Course", value: "maincourse" },
  { label: "Dessert", value: "dessert" },
  { label: "Salad", value: "salad" },
  { label: "Soup", value: "soup" },
  { label: "Breakfast", value: "breakfast" },
];
export default MenuModal;
