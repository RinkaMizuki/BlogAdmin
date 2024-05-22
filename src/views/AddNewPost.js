import React, { useState } from "react";
import { Container, Row, Col, Button } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import RichEditor from "../components/add-new-post/RichEditor";
import SidebarCategories from "../components/add-new-post/SidebarCategories";

const AddNewPost = () => {
  const [cateId, setCateId] = useState(0);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postThumb, setPostThumb] = useState("");

  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("post_title", postTitle)
      formData.append("post_content", postContent)
      formData.append("post_thumbnail", postThumb)
      formData.append("cat_id", cateId)
      const postData = await fetch(`https://nhmhdemo.click/api/admin/blog-posts/create-post`, {
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
    }
  }

  return (
    <Container fluid className="main-content-container px-4 pb-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Add New Post" subtitle="Blog Posts" className="text-sm-left"
        />
      </Row>

      <Row>
        {/* RichEditor */}
        <Col lg="9" md="12">
          <RichEditor
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            setPostContent={setPostContent}
            setPostThumb={setPostThumb}
          />
        </Col>

        {/* Sidebar Widgets */}
        <Col lg="3" md="12">
          {/* <SidebarActions /> */}
          <SidebarCategories setCateId={setCateId} cateId={cateId} />
        </Col>
      </Row>
      <Row>
        <Col lg="6">
          <input type="file" name="thumbnail" id="thumbnail" onChange={(e) => {
            setPostThumb(e.target.files[0])
          }} />
        </Col>
        <Col lg="6">
          <Button theme="white" className="px-2" onClick={handleCreatePost}>
            <span>Add New Post</span>
          </Button>
        </Col>
      </Row>
    </Container>
  )
};

export default AddNewPost;
