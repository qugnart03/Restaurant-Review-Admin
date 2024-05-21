import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  CardSubtitle,
  ListGroupItem,
} from "reactstrap";
import axios from "axios";
import * as moment from "moment";

const Activities = () => {
  const [latestUsers, setLatestUsers] = useState([]);

  useEffect(() => {
    const fetchLatestUsers = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/latest/user",
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (data.success) {
          setLatestUsers(data.users);
        }
      } catch (error) {
        console.error("Error fetching latest users:", error);
      }
    };

    fetchLatestUsers();
  }, []);

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Activity</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          Number of participants
        </CardSubtitle>
        <ListGroup flush className="mt-4">
          {latestUsers.map((user, index) => (
            <ListGroupItem
              key={index}
              className="d-flex align-items-center p-3 border-0"
            >
              <img
                className="rounded-circle me-3"
                src={
                  user.image && user.image.url
                    ? user.image.url
                    : "https://www.iconpacks.net/icons/1/free-user-icon-295-thumb.png"
                }
                alt={user.name}
                width="50"
                height="50"
              />
              <span>{user.name}</span>
              <small className="ms-auto text-muted text-small">
                {getTimeDifference(user.createdAt)}
              </small>
            </ListGroupItem>
          ))}
        </ListGroup>
      </CardBody>
    </Card>
  );
};

const getTimeDifference = (createdAt) => {
  const currentTime = moment();
  const createdTime = moment(createdAt);
  const duration = moment.duration(currentTime.diff(createdTime));
  const hours = duration.asHours();
  const minutes = duration.asMinutes();
  const seconds = duration.asSeconds();

  if (hours >= 24) {
    return createdTime.format("MMM Do YYYY");
  } else if (hours >= 1) {
    return Math.floor(hours) + " hours ago";
  } else if (minutes >= 1) {
    return Math.floor(minutes) + " minutes ago";
  } else {
    return Math.floor(seconds) + " seconds ago";
  }
};

export default Activities;
