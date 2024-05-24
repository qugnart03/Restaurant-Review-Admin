import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import UserComponent from "../components/UserComponent";
import { useNavigate } from "react-router-dom/dist";
import { UserProvider } from "../contexts/RestaurantContext";

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <UserProvider>
      <Row>
        <Col lg="12">
          <UserComponent />
        </Col>
        <Col></Col>
      </Row>
    </UserProvider>
  );
};

export default About;
