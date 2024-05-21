import { Card, CardBody, CardTitle, Table } from "reactstrap";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ProjectTables = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchPopularRestaurants = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const { data } = await axios.get(
          "http://localhost:8080/api/admin/popular/restaurant",
          {
            withCredentials: true,
          }
        );

        if (data?.restaurants) {
          setTableData(data.restaurants);
        }
      } catch (error) {
        console.error("Error fetching top bookmarked restaurants:", error);
      }
    };

    fetchPopularRestaurants();
  }, []);

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h5">Restaurant Listing</CardTitle>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name's Restaurant</th>
                <th>Type Restaurant</th>
                <th>Status</th>
                <th>Favorites</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <img
                      src={tdata.image.url}
                      alt="restaurant avatar"
                      width="160"
                      height="90"
                    />
                  </td>
                  <td>
                    <h6 className="mb-0">{tdata.name}</h6>
                  </td>
                  <td>
                    {
                      dataTypeRestaurant.find(
                        (item) => item.value === tdata.type
                      )?.label
                    }
                  </td>
                  <td>
                    {tdata.status === true ? (
                      <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                    ) : (
                      <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                    )}
                  </td>
                  <td>{tdata.bookmarksCount}</td>
                  <td>{tdata.commentsCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

const dataTypeRestaurant = [
  { label: "Asian restaurant", value: "asianrestaurant" },
  { label: "European restaurant", value: "europeanrestaurant" },
  { label: "American restaurant", value: "americanrestaurant" },
  { label: "African restaurant", value: "africanrestaurant" },
];

export default ProjectTables;
