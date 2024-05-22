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

      {/* <Row>
      <Col lg="8" md="12" sm="12" className="mb-4">
        <UsersOverview />
      </Col>

      <Col lg="4" md="6" sm="12" className="mb-4">
        <UsersByDevice />
      </Col>

      <Col lg="4" md="6" sm="12" className="mb-4">
        <NewDraft />
      </Col>

      <Col lg="5" md="12" sm="12" className="mb-4">
        <Discussions />
      </Col>

      <Col lg="3" md="12" sm="12" className="mb-4">
        <TopReferrals />
      </Col>
    </Row> */}
    </Container>
  )
};

BlogOverview.propTypes = {
  /**
   * The small stats dataset.
   */
  smallStats: PropTypes.array
};

BlogOverview.defaultProps = {
  smallStats: [
    {
      label: "Posts",
      value: "2,390",
      percentage: "4.7%",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(0, 184, 216, 0.1)",
          borderColor: "rgb(0, 184, 216)",
          data: [1, 2, 1, 3, 5, 4, 7]
        }
      ]
    },
    {
      label: "Pages",
      value: "182",
      percentage: "12.4",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(23,198,113,0.1)",
          borderColor: "rgb(23,198,113)",
          data: [1, 2, 3, 3, 3, 4, 4]
        }
      ]
    },
    {
      label: "Comments",
      value: "8,147",
      percentage: "3.8%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(255,180,0,0.1)",
          borderColor: "rgb(255,180,0)",
          data: [2, 3, 3, 3, 4, 3, 3]
        }
      ]
    },
    {
      label: "New Customers",
      value: "29",
      percentage: "2.71%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(255,65,105,0.1)",
          borderColor: "rgb(255,65,105)",
          data: [1, 7, 1, 3, 1, 4, 8]
        }
      ]
    },
    {
      label: "Subscribers",
      value: "17,281",
      percentage: "2.4%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgb(0,123,255,0.1)",
          borderColor: "rgb(0,123,255)",
          data: [3, 2, 3, 2, 4, 5, 4]
        }
      ]
    }
  ]
};

export default withRouter(BlogOverview);
