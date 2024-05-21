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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import MenuModal from "./modal/MenuModal";

const RestaurantTable = () => {
  const [tableData, setTableData] = useState([]);
  const [modal, setModal] = useState(false);
  const [idRestaurant, setIdRestaurant] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState(true);
  const [image, setImage] = useState(null);
  const [urlImage, setUrlImage] = useState("");
  const [time, setTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (searchTerm) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/search/restaurant/${searchTerm}`,
        {
          withCredentials: true,
        }
      );
      if (data?.restaurants) {
        console.log(data);
        setTableData(data.restaurants);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error searching restaurants:", error);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchRestaurants();
      // setTableData([]);
    } else {
      handleSearch(searchTerm);
    }
  }, [searchTerm]);

  const fetchRestaurants = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/restaurant/show",
        {
          withCredentials: true,
        }
      );
      if (data?.restaurants) {
        console.log(data);
        setTableData(data.restaurants);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [currentPage]);

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return tableData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(tableData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const toggleModal = (idRestaurant) => {
    setIdRestaurant(idRestaurant);
    setModal(!modal);
    loadDataModal(idRestaurant);
  };

  const toggleModalCancel = () => {
    setModal(!modal);
  };

  const loadDataModal = async (idRestaurant) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/admin/restaurant/${idRestaurant}`,
        {
          withCredentials: true,
        }
      );

      if (data?.success) {
        const {
          name,
          type,
          phone,
          description,
          address,
          status,
          timeWork: { start, end },
          image: { url },
        } = data.restaurant;

        setName(name);
        setAddress(address);
        setType(type);
        setPhone(phone);
        setDescription(description);
        setStatus(status);
        setStartTime(start);
        setEndTime(end);
        setUrlImage(url);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);
      await axios.delete(
        `http://localhost:8080/api/admin/delete/restaurant/${id}`,
        {
          withCredentials: true,
        }
      );
      fetchRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const handleEdit = (idRestaurant) => {
    toggleModal(idRestaurant);
  };

  const handleSubmit = async () => {
    if (!name || !type || !phone || !description || !address || !status) {
      console.log("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("address", address);
    formData.append("timeWork", time);
    formData.append("phone", phone);
    formData.append("status", status);
    formData.append("image", image);
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/admin/update/restaurant/${idRestaurant}`,
        formData,
        {
          withCredentials: true,
        }
      );

      fetchRestaurants();
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

  const handleTimeChange = (e) => {
    const { id, value } = e.target;
    if (id === "startTime") {
      setStartTime(value);
    } else if (id === "endTime") {
      setEndTime(value);
    }

    setTime(startTime + " - " + endTime);
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    console.log(ll);
    setAddress(value);
  };

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const toggleMenuModal = () => {
    setIsMenuModalOpen(!isMenuModalOpen);
  };

  const handleMenuButtonClick = async (restaurantId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/restaurant/${restaurantId}/menus`,
        {
          withCredentials: true,
        }
      );
      if (!data.items.length <= 0) {
        setSelectedRestaurantId(restaurantId);
        toggleMenuModal();
      }
    } catch (error) {
      console.error("Error fetching restaurant menus:", error);
      toast.warn("No menus available for this restaurant");
    }
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
                <th>Phone</th>
                <th>Type</th>
                <th>Address</th>
                <th>Status</th>
                <th>Menu</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems().map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <img
                      src={tdata.image.url}
                      alt="restaurant avatar"
                      width="160"
                      height="90"
                    />
                  </td>
                  <td>
                    <h6 className="mb-0">{tdata.name}</h6>
                  </td>
                  <td>
                    <span>{tdata.phone}</span>
                  </td>
                  <td>
                    {
                      dataTypeRestaurant.find(
                        (item) => item.value === tdata.type
                      )?.label
                    }
                  </td>

                  <td>
                    <span>{tdata.address}</span>
                  </td>
                  <td>
                    {tdata.status === true ? (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td>
                    <Button
                      color="warning"
                      onClick={() => handleMenuButtonClick(tdata._id)}
                    >
                      Menu
                    </Button>

                    <MenuModal
                      isOpen={isMenuModalOpen}
                      toggle={toggleMenuModal}
                      restaurantId={selectedRestaurantId}
                    />
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
                  currentPage === Math.ceil(tableData.length / itemsPerPage)
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
          Edit Restaurant
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="nameRes">Name of restaurant</Label>
              <Input
                id="nameRes"
                name="name"
                placeholder="Enter name of restaurant..."
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="typeRes">Type of restaurant</Label>
              <Input
                id="typeRes"
                name="type"
                type="select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {dataTypeRestaurant.map((restaurantType) => (
                  <option
                    key={restaurantType.value}
                    value={restaurantType.value}
                  >
                    {restaurantType.label}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="phoneRes">Phone of restaurant</Label>
              <Input
                id="phoneRes"
                name="phone"
                placeholder="Enter phone of restaurant..."
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="descriptionRes">Description</Label>
              <Input
                id="descriptionRes"
                name="description"
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="addressRes">Address</Label>
              <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <FormGroup>
                    <Input
                      id="addressRes"
                      name="address"
                      {...getInputProps({
                        placeholder: "Search Places ...",
                        className: "location-search-input",
                      })}
                      key="input-address"
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <Label>Loading...</Label>}
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={`suggestion-${index}`}
                          {...getSuggestionItemProps(suggestion, {
                            className: suggestion.active
                              ? "suggestion-item--active"
                              : "suggestion-item",
                            style: suggestion.active
                              ? {
                                  backgroundColor: "#fafafa",
                                  cursor: "pointer",
                                }
                              : {
                                  backgroundColor: "#ffffff",
                                  cursor: "pointer",
                                },
                          })}
                        >
                          <div className="px-3 pt-1 pb-1">
                            {suggestion.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormGroup>
                )}
              </PlacesAutocomplete>
            </FormGroup>
            <FormGroup>
              <div className="row">
                <div className="col-md-6">
                  <FormGroup>
                    <Label for="startTime">Start Time</Label>
                    <Input
                      type="time"
                      id="startTime"
                      value={startTime}
                      onChange={handleTimeChange}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup>
                    <Label for="endTime">End Time</Label>
                    <Input
                      type="time"
                      id="endTime"
                      value={endTime}
                      onChange={handleTimeChange}
                    />
                  </FormGroup>
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="exampleFile">Image</Label>
              <Input
                id="exampleFile"
                name="image"
                type="file"
                onChange={handleImageChange}
              />

              {urlImage && <img src={urlImage} className="w-25 pt-3 h-40" />}
            </FormGroup>

            <Label for="statusRes">Status</Label>
            <FormGroup className="d-flex " tag="fieldset">
              <FormGroup check>
                <Input
                  name="statusRes"
                  type="radio"
                  value="true"
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Label check className="form-label">
                  Pending
                </Label>
              </FormGroup>
              <FormGroup className="mx-4" check>
                <Input
                  name="statusRes"
                  type="radio"
                  value="false"
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Label check className="form-label">
                  Suspending
                </Label>
              </FormGroup>
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

const dataTypeRestaurant = [
  { label: "Asian restaurant", value: "asianrestaurant" },
  { label: "European restaurant", value: "europeanrestaurant" },
  { label: "American restaurant", value: "americanrestaurant" },
  { label: "African restaurant", value: "africanrestaurant" },
];

export default RestaurantTable;