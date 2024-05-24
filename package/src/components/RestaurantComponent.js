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

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import MenuModal from "./modal/MenuModal";
import { useRestaurants } from "../contexts/RestaurantContext";

const RestaurantTable = () => {
  const [modal, setModal] = useState(false);
  const [idRestaurant, setIdRestaurant] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [urlImage, setUrlImage] = useState("");
  const [time, setTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [restaurants, setRestaurants] = useRestaurants();

  const [currentRes, setCurrentRes] = useState(restaurants);
  //--------------------------------------------------------------//
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return currentRes.slice(indexOfFirstItem, indexOfLastItem);
  };

  useEffect(() => {
    setCurrentRes(restaurants);
  }, [restaurants]);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(currentRes.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  //--------------------------------------------------------------//

  //--------------------------------------------------------------//

  const [initialRes, setInitialRes] = useState([]);

  useEffect(() => {
    setInitialRes(restaurants);
  }, [restaurants]);

  const handleSearch = async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        setCurrentRes(initialRes);
        setCurrentPage(1);
        return;
      }

      const filteredRestaurants = [...initialRes];

      const filteredResults = filteredRestaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setCurrentRes(filteredResults);
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
      await axios.delete(
        `http://localhost:8080/api/admin/delete/restaurant/${id}`,
        {
          withCredentials: true,
        }
      );

      setCurrentRes(currentRes.filter((restaurant) => restaurant._id !== id));

      toast.success("Restaurant deleted successfully");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error("Error deleting restaurant");
    }
  };

  //--------------------------------------------------------------//

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hoursInt = parseInt(hours);
    const formattedHours = hoursInt < 10 ? `0${hoursInt}` : hoursInt.toString();
    return `${formattedHours}:${minutes}`;
  };

  //--------------------------------------------------------------//

  const toggleModal = (idRestaurant) => {
    if (idRestaurant) {
      setIdRestaurant(idRestaurant);
      loadDataModal(idRestaurant);
    }
    setModal(!modal);
  };

  const loadDataModal = async (idRestaurant) => {
    const restaurantToEdit = restaurants.find(
      (restaurant) => restaurant._id === idRestaurant
    );

    if (restaurantToEdit) {
      const {
        name,
        type,
        phone,
        description,
        address,
        timeWork: { start, end },
        image: { url },
      } = restaurantToEdit;

      setName(name);
      setAddress(address);
      setType(type);
      setPhone(phone);
      setDescription(description);

      setStartTime(formatTime(start));
      setEndTime(formatTime(end));
      setUrlImage(url);
    }
  };

  const handleEdit = (idRestaurant) => {
    toggleModal(idRestaurant);
  };
  console.log(restaurants);
  const handleSubmit = async () => {
    if (!name || !type || !phone || !description || !address) {
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
    formData.append("image", image);
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/admin/update/restaurant/${idRestaurant}`,
        formData,
        {
          withCredentials: true,
        }
      );

      const updatedRes = restaurants.map((res) =>
        res._id === idRestaurant
          ? {
              ...res,
              name: name,
              type: type,
              phone: phone,
              description: description,
              address: address,
              timeWork: { start: startTime, end: endTime },
              image: { ...res.image, url: urlImage },
            }
          : res
      );

      setRestaurants(updatedRes);
      setModal(false);

      toast.success("Update " + name + " success");
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

  //--------------------------------------------------------------//

  const handleTimeChange = (e) => {
    const { id, value } = e.target;
    if (id === "startTime") {
      setStartTime(formatTime(value));
    } else if (id === "endTime") {
      setEndTime(formatTime(value));
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
      const restaurant = restaurants.find(
        (restaurant) => restaurant._id === restaurantId
      );

      if (restaurant) {
        setSelectedRestaurantId(restaurantId);
        toggleMenuModal();
      }
    } catch (error) {
      console.error("Error fetching restaurant menus:", error);
      toast.error("Error fetching restaurant menus");
    }
  };

  return (
    <div>
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
                  currentPage === Math.ceil(currentRes.length / itemsPerPage)
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
      <Modal isOpen={modal} toggle={toggleModal} className="modal-xl">
        <ModalHeader toggle={toggleModal}>
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
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <MenuModal
        isOpen={isMenuModalOpen}
        toggle={toggleMenuModal}
        restaurantId={selectedRestaurantId}
      />

      <ToastContainer />
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
