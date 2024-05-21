import { Row, Col } from "reactstrap";
import Post from "../components/dashboard/Post";
import { useEffect, useState } from "react";

import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom/dist";

const Posts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);
  const [tableData, setTableData] = useState([]);
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/admin/show/post",
        {
          withCredentials: true,
        }
      );
      if (data?.posts) {
        console.log(data);
        setTableData(data.posts);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {/* --------------------------------------------------------------------------------*/}
      <h5 className="mb-3">Post Listing</h5>
      <Row>
        {tableData.map((post, index) => (
          <Col sm="6" lg="6" xl="3" key={index}>
            <Post
              image={post.image}
              title={post.title}
              content={post.content}
              postedBy={post.postedBy[0].name}
              countComment={post.countComment}
              createAt={getTimeDifference(post.createdAt)}
              countLike={post.countLike}
              color={post.btnbg}
            />
          </Col>
        ))}
      </Row>
      {/* --------------------------------------------------------------------------------*/}
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

export default Posts;
