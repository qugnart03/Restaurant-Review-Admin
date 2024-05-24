import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const EditRestaurantModal = ({ isOpen, toggle, restaurant, onSubmit }) => {
  const [name, setName] = useState(restaurant.name);
  const [type, setType] = useState(restaurant.type);
  // Add other state variables for restaurant fields

  const handleSubmit = () => {
    // Prepare restaurant data and submit
    const updatedRestaurant = { name, type /* Add other fields */ };
    onSubmit(updatedRestaurant);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Restaurant</ModalHeader>
      <ModalBody>
        <Form>
          {/* Form inputs for editing restaurant details */}
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          {/* Add other form inputs for other restaurant fields */}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditRestaurantModal;
