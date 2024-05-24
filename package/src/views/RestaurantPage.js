import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import RestaurantTable from "../components/RestaurantComponent";
import { useNavigate } from "react-router-dom";
import { RestaurantProvider } from "../contexts/RestaurantContext";

const RestaurantPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <RestaurantProvider>
      <Row>
        <Col lg="12">
          <RestaurantTable />
        </Col>
      </Row>
    </RestaurantProvider>
  );
};

export default RestaurantPage;
