import React from "react";
import { Container } from "reactstrap";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main>
      <Container className="p-4" fluid>
        <Outlet />
      </Container>
    </main>
  );
};

export default AuthLayout;
