import { Col, Row } from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import ProjectTables from "../components/dashboard/ProjectTable";
import TopCards from "../components/dashboard/TopCards";
import Blog from "../components/dashboard/Post";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Activities from "../components/dashboard/Activities";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const DashBoardScreen = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    user: 0,
    post: 0,
    restaurant: 0,
  });
  const [posts, setPosts] = useState([]);

  const fetchCounts = useCallback(async (token) => {
    try {
      const responseCounts = await axios.get(
        "http://localhost:8080/api/admin/total",
        {
          withCredentials: true,
        }
      );
      const { user, post, restaurant } = responseCounts.data.counts;
      setCounts({ user, post, restaurant });
    } catch (error) {
      console.error("Error fetching counts:", error);
      // Handle error appropriately
    }
  }, []);

  const fetchPosts = useCallback(async (token) => {
    try {
      const responsePosts = await axios.get(
        "http://localhost:8080/api/admin/latest/post",
        {
          withCredentials: true,
        }
      );
      setPosts(responsePosts.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Handle error appropriately
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }
      await fetchCounts(token);
      await fetchPosts(token);
    };

    fetchData();
  }, [navigate, fetchCounts, fetchPosts]);

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

  return (
    <div>
      {/*** Top Cards ***/}
      <Row>
        <Col sm="6" lg="4">
          <TopCards
            bg="bg-light-success text-success"
            title="Total Member"
            subtitle="Members"
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
            title="New Projects"
            subtitle="Restaurants"
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
        {posts.map((post) => (
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

export default DashBoardScreen;
