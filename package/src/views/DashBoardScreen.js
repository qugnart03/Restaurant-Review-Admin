import { Col, Row } from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import ProjectTables from "../components/dashboard/ProjectTable";
import TopCards from "../components/dashboard/TopCards";
import Blog from "../components/dashboard/Post";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Activities from "../components/dashboard/Activities";
import { useNavigate } from "react-router-dom/dist";
import moment from "moment";

const DashBoardScreen = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    user: 0,
    post: 0,
    restaurant: 0,
  });

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        } else {
          const responseCounts = await axios.get(
            "http://localhost:8080/api/admin/total",
            {
              withCredentials: true,
            }
          );
          const { user, post, restaurant } = responseCounts.data.counts;
          setCounts({ user, post, restaurant });

          const responsePosts = await axios.get(
            "http://localhost:8080/api/admin/latest/post",
            {
              withCredentials: true,
            }
          );

          setPosts(responsePosts.data.posts);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div>
      {/***Top Cards***/}
      <Row>
        <Col sm="6" lg="4">
          <TopCards
            bg="bg-light-success text-success"
            title="TotalMember"
            subtitle="Member"
            earning={counts.user}
            icon="bi bi-person"
          />
        </Col>
        <Col sm="6" lg="4">
          <TopCards
            bg="bg-light-danger text-danger"
            title="Refunds"
            subtitle="Post Reviews"
            earning={counts.post}
            icon="bi bi-file-post"
          />
        </Col>
        <Col sm="6" lg="4">
          <TopCards
            bg="bg-light-warning text-warning"
            title="New Project"
            subtitle="Restaurant"
            earning={counts.restaurant}
            icon="bi bi-menu-up"
          />
        </Col>
      </Row>
      {/* **************************************************************************************************************** */}
      <Row>
        <Col sm="6" lg="6" xl="7" xxl="8">
          <SalesChart />
        </Col>
        <Col sm="6" lg="6" xl="5" xxl="4">
          <Activities />
        </Col>
      </Row>
      {/* **************************************************************************************************************** */}
      <Row>
        <Col lg="12">
          <ProjectTables />
        </Col>
      </Row>
      {/* **************************************************************************************************************** */}
      <Row>
        {posts.map((post, index) => (
          <Col sm="6" lg="6" xl="3" key={post._id}>
            <Blog
              image={post.image}
              title={post.title}
              postedBy={post.postedBy[0].name}
              createAt={getTimeDifference(post.createdAt)}
              countLike={post.countLike}
              color={post.btnbg}
            />
          </Col>
        ))}
      </Row>
    </div>
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

export default DashBoardScreen;
