/* eslint jsx-a11y/anchor-is-valid: 0 */

import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
} from "shards-react";
import { get as getPosts, remove as deletePost } from "../services/httpRequest"

import defaultAvatar from "../images/user-profile/default.jpg"
import PageTitle from "../components/common/PageTitle";
import Pagination from "../components/common/Pagination";
import { withRouter } from "react-router-dom";

const options = {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric'
}

class BlogPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postList: [],
      links: [],
      currentPage: 1,
    }

  }

  handleRemovePost = async (postId) => {
    try {
      const deletedPost = await deletePost(`/admin/blog-posts/delete-post/${postId}`);
      console.log(deletedPost);
      this.handleGetPostLink(`https://nhmhdemo.click/api/admin/blog-posts?page=${this.state.currentPage}`)
    } catch (error) {
      console.log(error);
    }
  }

  handleEditPost = (post) => {
    const { history } = this.props;
    // Push a new entry onto the history stack, with state
    history.push(`/edit-old-post/${post.id}`, { postEdit: post });
  }

  handleGetPostLink = async (link) => {
    const posts = await fetch(link, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json()).then(data => data)
    this.setPostList(posts.posts_list.data)
    this.setLinkList(posts.posts_list.links);
    this.setState({
      currentPage: posts.posts_list.current_page
    })
  }
  async componentDidMount() {
    const posts = await getPosts("/admin/blog-posts");
    this.setPostList(posts.posts_list.data)
    this.setLinkList(posts.posts_list.links);
    this.setState({
      currentPage: posts.posts_list.current_page
    })
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // Check if the specific prop has changed
  //   console.log(prevState);
  //   if (this.state.currentPage != prevState.currentPage) {
  //     // Perform some action when the prop changes
  //   }
  // }

  setPostList = (newPosts) => {
    this.setState({ postList: newPosts });
  }

  setLinkList = (newLinks) => {
    this.setState({ links: newLinks });
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Posts" subtitle="Blog Posts" className="text-sm-left" />
        </Row>

        <Row>
          {this.state.postList.map((post) => (
            <Col lg="3" md="6" sm="12" className="mb-4" key={post.id}>
              <Card small className="card-post card-post--1">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url(${post.post_thumbnail})`, position: "relative" }}
                >
                  <i className="fa-solid fa-rectangle-xmark" style={{
                    fontSize: "25px",
                    color: "red",
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    cursor: "pointer"
                  }}
                    onClick={() => this.handleRemovePost(post.id)}
                  ></i>
                  <Badge
                    pill
                    className={`card-post__category bg-blue`}
                  >
                    {post.category.cat_title}
                  </Badge>
                  <div className="card-post__author d-flex">
                    <a
                      href="#"
                      className="card-post__author-avatar card-post__author-avatar--small"
                      style={{ backgroundImage: `url('${post.user ? post.user.avatar : defaultAvatar}')` }}
                    >
                      Written by {post.created_by}
                    </a>
                  </div>
                </div>

                <CardBody>
                  <h5 className="card-title">
                    <div
                      className="text-fiord-blue"
                      style={{
                        cursor: "pointer"
                      }}
                      onClick={() => this.handleEditPost(post)}>
                      {post.post_title}
                    </div>
                  </h5>
                  <p className="card-text d-inline-block mb-3" dangerouslySetInnerHTML={{
                    __html: post.post_content
                  }} style={{
                    maxWidth: "100%",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    lineClamp: 5
                  }}></p>
                  <span className="text-muted">{new Intl.DateTimeFormat('en-GB', options).format(new Date(post.created_at))}</span>
                </CardBody>
              </Card>
            </Col>
          ))}
          <Pagination links={this.state.links} currentPage={this.state.currentPage} handleGetPostLink={this.handleGetPostLink} />
        </Row>

      </Container>
    );
  }
}

export default withRouter(BlogPosts);
