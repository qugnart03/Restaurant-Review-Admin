import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const RestaurantContext = createContext();

const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/restaurant/show",
        {
          withCredentials: true,
        }
      );
      if (data?.restaurants) {
        setRestaurants(data.restaurants);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <RestaurantContext.Provider value={[restaurants, setRestaurants]}>
      {children}
    </RestaurantContext.Provider>
  );
};

const useRestaurants = () => useContext(RestaurantContext);

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  const fetchMenus = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/admin/show/user",
        {
          withCredentials: true,
        }
      );
      if (data?.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <UserContext.Provider value={[users, setUsers]}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export { RestaurantProvider, useRestaurants, UserProvider, useUser };
