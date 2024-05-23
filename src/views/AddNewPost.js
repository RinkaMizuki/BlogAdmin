import React, { useLayoutEffect, useState } from "react";
import { Container, Row, Col, Button } from "shards-react";
import { withRouter } from 'react-router-dom';

import PageTitle from "../components/common/PageTitle";
import RichEditor from "../components/add-new-post/RichEditor";
import SidebarCategories from "../components/add-new-post/SidebarCategories";

const AddNewPost = ({ location, history }) => {
  const [cateId, setCateId] = useState(0);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postThumb, setPostThumb] = useState("");
  const state = location ? location.state : null;

  const handleSavePost = async () => {
    const route = !state ? "create-post" : `update-post/${state.postEdit.id}`
    try {
      const formData = new FormData();
      formData.append("post_title", postTitle)
      formData.append("post_content", postContent)
      formData.append("post_thumbnail", postThumb instanceof File ? postThumb : null)
      formData.append("cat_id", cateId)
      const postData = await fetch(`https://nhmhdemo.click/api/admin/blog-posts/${route}`, {
        method: 'POST',
        body: formData,
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache",
        credentials: 'include',
      })
      console.log(postData);
    } catch (error) {
      console.log(error);
    } finally {
      setCateId(0);
      setPostContent("");
      setPostThumb("");
      setPostTitle("");
      history.push('/blog-posts');
    }
  }

  useLayoutEffect(() => {
    if (state) {
      setPostTitle(state.postEdit.post_title)
      setPostContent(state.postEdit.post_content);
      setCateId(state.postEdit.cat_id);
      setPostThumb(state.postEdit.post_thumbnail)
    }
  }, [state])

  return (
    <Container fluid className="main-content-container px-4 pb-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title={`${!state ? "Add New Post" : "Edit Old Post"}`} subtitle="Blog Posts" className="text-sm-left"
        />
      </Row>
      <Row>
        {/* RichEditor */}
        <Col lg="9" md="12">
          {postThumb && <img src={postThumb instanceof File ? URL.createObjectURL(postThumb) : postThumb} style={{
            width: "100%",
            height: "300px",
            objectFit: "contain",
            borderRadius: "10px"
          }} />}
          <RichEditor
            initValue={postContent}
            postContent={postContent}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            setPostContent={setPostContent}
            setPostThumb={setPostThumb}
          />

          <Row>
            <Col lg="4">
              <input type="file" name="thumbnail" id="thumbnail" onChange={(e) => {
                setPostThumb(e.target.files[0])
              }} className="form-control" />
            </Col>
            <Col lg="8" className="d-flex justify-content-end">
              <Button theme="white" className="px-2" onClick={handleSavePost}>
                <span>{!state ? "Add Post" : "Save Changes"}</span>
              </Button>
            </Col>
          </Row>
        </Col>

        {/* Sidebar Widgets */}
        <Col lg="3" md="12">
          {/* <SidebarActions /> */}
          <SidebarCategories setCateId={setCateId} cateId={cateId} />
        </Col>
      </Row>

    </Container>
  )
};

export default withRouter(AddNewPost);
