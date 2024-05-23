import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";
import { get as getDashboardData } from "../services/httpRequest";
import { withRouter } from "react-router-dom";

import PageTitle from "./../components/common/PageTitle";
import SmallStats from "./../components/common/SmallStats";

const BlogOverview = ({ history }) => {
  const [dashboardData, setDashboardData] = useState([])

  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        const data = await getDashboardData('/admin');
        setDashboardData([data]);
        localStorage.setItem('categories', JSON.stringify(data.categories_list))
        if (data.status === 422) {
          localStorage.removeItem('userLogin')
          localStorage.removeItem('categories')
          history.push('/')
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchDataDashboard()
  }, [])
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle title="Blog Overview" subtitle="Dashboard" className="text-sm-left mb-3" />
      </Row>

      {/* Small Stats Blocks */}
      {dashboardData.length > 0 ? <Row>
        <Col className="col-lg mb-4">
          <SmallStats
            variation="1"
            label={"POSTS"}
            value={dashboardData[0].post_count}
          />
        </Col>
        <Col className="col-lg mb-4">
          <SmallStats
            variation="1"
            label={"CATEGORIES"}
            value={dashboardData[0].category_count}
          />
        </Col>
        <Col className="col-lg mb-4">
          <SmallStats
            variation="1"
            label={"COMMENTS"}
            value={dashboardData[0].comment_count}
          />
        </Col>
        <Col className="col-lg mb-4">
          <SmallStats
            variation="1"
            label={"USERS"}
            value={dashboardData[0].user_count}
          />
        </Col>
      </Row> : <>Loading...</>}

    </Container>
  )
};

export default withRouter(BlogOverview);
