import { Row, Col } from "reactstrap";
import RestaurantTable from "../components/RestaurantComponent";
import { useNavigate } from "react-router-dom/dist";
import { useEffect } from "react";

const RestaurantPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <Row>
      <Col lg="12">
        <RestaurantTable />
      </Col>
      <Col></Col>
    </Row>
  );
};

export default RestaurantPage;
