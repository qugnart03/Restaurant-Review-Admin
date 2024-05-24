import {
  Card,
  CardTitle,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { useUser } from "../contexts/RestaurantContext";
import { ToastContainer, toast } from "react-toastify";

const UserComponent = () => {
  const [modal, setModal] = useState(false);
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [urlImage, setUrlImage] = useState("");
  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [users, setUsers] = useUser();

  const [currentUser, setCurrentUser] = useState(users);
  //--------------------------------------------------------------//
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return currentUser.slice(indexOfFirstItem, indexOfLastItem);
  };

  useEffect(() => {
    setCurrentUser(users);
  }, [users]);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(currentUser.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  //--------------------------------------------------------------//

  //--------------------------------------------------------------//
  const [initialUser, setInitialUser] = useState([]);

  useEffect(() => {
    setInitialUser(users);
  }, [users]);

  const handleSearch = async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        setCurrentUser(users);
        setCurrentPage(1);
        return;
      }

      const filteredUsers = [...initialUser];

      const filteredResults = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setCurrentUser(filteredResults);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching restaurants:", error);
    }
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  //--------------------------------------------------------------//

  //--------------------------------------------------------------//
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin/delete/user/${id}`, {
        withCredentials: true,
      });

      setCurrentUser(currentUser.filter((restaurant) => restaurant._id !== id));

      toast.success("Restaurant deleted successfully");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };
  //--------------------------------------------------------------//

  //--------------------------------------------------------------//
  const toggleModal = (id) => {
    setId(id);
    setModal(!modal);
    loadDataModal(id);
  };

  const toggleModalCancel = () => {
    setModal(!modal);
  };

  const loadDataModal = async (id) => {
    try {
      const userToEdit = users.find((user) => user._id === id);

      if (userToEdit) {
        const {
          email,
          name,
          phone,
          role,
          image: { url },
        } = userToEdit;

        setEmail(email !== null ? email : "");
        setName(name != null ? name : "");
        setPhone(phone !== null ? phone : "");
        setRole(role !== null ? role : "");
        setUrlImage(url !== null ? url : "");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleEdit = (id) => {
    toggleModal(id);
  };

  const handleSubmit = async () => {
    if (!name || !role || !phone) {
      console.log("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("image", image);
    formData.append("role", role);
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/admin/update/user/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      const updatedUsers = [...users];

      const index = updatedUsers.findIndex((user) => user._id === id);
      if (index !== -1) {
        updatedUsers[index] = {
          ...updatedUsers[index],
          name: name,
          phone: phone,
          role: role,
        };
      }

      setUsers(updatedUsers);

      toggleModalCancel();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result;
      setUrlImage(imgUrl);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <ToastContainer />
      <Card>
        <CardBody>
          <CardTitle tag="h5">Restaurant Listing</CardTitle>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={searchTerm}
              placeholder="Search restaurant..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems().map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <img
                      src={
                        tdata.image && tdata.image.url
                          ? tdata.image.url
                          : "https://www.iconpacks.net/icons/1/free-user-icon-295-thumb.png"
                      }
                      alt="restaurant avatar"
                      width="120"
                      height="80"
                    />
                  </td>
                  <td>
                    <h6 className="mb-0">{tdata.name}</h6>
                  </td>
                  <td>
                    <span>{tdata.email}</span>
                  </td>
                  <td>
                    <span>{tdata.phone}</span>
                  </td>

                  <td>
                    <span>
                      {
                        dataTypeUser.find((item) => item.value === tdata.role)
                          ?.label
                      }
                    </span>
                  </td>

                  <td
                    style={{
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={() => handleEdit(tdata._id)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDelete(tdata._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-end">
              {/* Previous Page Button */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
              {/* Page Number Buttons */}
              {pageNumbers.map((number) => (
                <li
                  key={number}
                  className={`page-item ${
                    currentPage === number ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
              {/* Next Page Button */}
              <li
                className={`page-item ${
                  currentPage === Math.ceil(currentUser.length / itemsPerPage)
                    ? "disabled"
                    : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </CardBody>
      </Card>

      {/* MODAL EDIT */}
      <Modal isOpen={modal} toggle={toggleModalCancel} className="modal-xl">
        <ModalHeader toggle={toggleModalCancel}>
          <i className="bi bi-gear me-2"></i>
          Edit User
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                readOnly
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter name of user..."
                name="name"
                type="email"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="phoneRes">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter phone of user..."
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="image">Image</Label>
              <Input
                id="exampleFile"
                name="image"
                type="file"
                onChange={handleImageChange}
              />

              {urlImage && <img src={urlImage} className="w-25 pt-3 h-40" />}
            </FormGroup>

            <FormGroup>
              <Label for="role">Role</Label>
              <Input
                id="role"
                name="role"
                type="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {dataTypeUser.map((dataTypeUser) => (
                  <option key={dataTypeUser.value} value={dataTypeUser.value}>
                    {dataTypeUser.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button color="secondary" onClick={toggleModalCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const dataTypeUser = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
  { label: "Own Restaurant", value: "ownrestaurant" },
];

export default UserComponent;
