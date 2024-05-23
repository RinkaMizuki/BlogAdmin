import React, { useEffect, useRef, useState } from "react"
import Pagination from "../components/common/Pagination";
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import defaultAvatar from "../images/user-profile/default.jpg"
import { get as getListComment, remove as removeCommnet } from "../services/httpRequest"

const Comments = () => {

  const removeAllRef = useRef(null);
  const removeAllBtnRef = useRef(null);
  const [removeComments, setRemoveComments] = useState([]);
  const [listComment, setListComment] = useState([]);
  const [links, setLinks] = useState([]);
  const [currPage, setCurrPage] = useState(1);

  const handleRemoveComment = async (commentId) => {
    try {
      const deleted = await removeCommnet(`/admin/comments/delete-comment/${commentId}`)
      console.log(deleted);
      handleGetCommentLink(`https://nhmhdemo.click/api/admin/comments?page=${currPage}&sortBy=created_at&sortOrder=desc`)
    } catch (error) {
      console.log(error);
    }
  }

  const handleRemoveAllComment = async () => {
    try {
      const deletedComments = await removeCommnet('/admin/comments/delete-multicomment', {
        commentIds: removeComments
      })
      console.log(deletedComments);
      handleGetCommentLink(`https://nhmhdemo.click/api/admin/comments?page=${currPage}&sortBy=created_at&sortOrder=desc`)
    } catch (error) {
      console.log(error);
    } finally {
      removeAllBtnRef.current.checked = false;
      setRemoveComments([]);
    }
  }

  const handleSelectAllComment = (isSelectedAll) => {
    setRemoveComments([]);
    Array.from(removeAllRef.current.children).forEach(function (trChild) {
      trChild.children[0].children[0].checked = isSelectedAll;
      if (isSelectedAll) {
        setRemoveComments(prev => prev.concat(+trChild.children[0].children[0].value))
      } else {
        setRemoveComments(prev => prev.filter(id => id != +trChild.children[0].children[0].value))
      }
    })
  }

  const handleGetCommentLink = async (link) => {
    const comments = await fetch(link, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json()).then(data => data)
    setListComment(comments.comments.data)
    setLinks(comments.comments.links);
    setCurrPage(comments.comments.current_page)
  }

  useEffect(() => {
    removeAllBtnRef.current.checked = false;
  }, [currPage])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const comments = await getListComment('/admin/comments?sortBy=created_at&sortOrder=desc');//?keyword=w&sortOrder=asc
        setListComment(comments.comments.data)
        setLinks(comments.comments.links)
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData()
  }, [])

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Comments" subtitle="Blog Comments" className="text-sm-left" />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          {removeComments.length ? <Row className="ml-2">
            <Col col="8">
              <Button className="btn btn-danger" onClick={handleRemoveAllComment}>Remove All</Button>
            </Col>
          </Row> : <React.Fragment></React.Fragment>}
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Active Comments</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      <input type="checkbox" name="removeAll" id="removeAll" onChange={(e) => handleSelectAllComment(e.target.checked)} ref={removeAllBtnRef} />
                    </th>
                    <th scope="col" className="border-0">
                      Id
                    </th>
                    <th scope="col" className="border-0">
                      Created At
                    </th>
                    <th scope="col" className="border-0">
                      User Name
                    </th>
                    <th scope="col" className="border-0">
                      Content
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody ref={removeAllRef}>
                  {listComment.map(cmt => (
                    <tr key={cmt.id}>
                      <td>
                        <input type="checkbox" name="remove" id="remove" value={cmt.id} onChange={(e) => {
                          if (e.target) {
                            if (e.target.checked) {
                              const newId = parseInt(e.target.value);
                              if (!isNaN(newId)) {
                                setRemoveComments(prev => prev.concat(newId));
                              }
                            }
                            else {
                              const newId = parseInt(e.target.value);
                              if (!isNaN(newId)) {
                                setRemoveComments(prev => prev.filter(id => id != newId));
                              }
                            }
                          }
                        }} />
                      </td>
                      <td>{cmt.id}</td>
                      <td>{new Date(cmt.created_at).toLocaleString()}</td>
                      <td className="d-flex align-items-center gap-3" style={{
                        borderBottom: "unset"
                      }}>
                        <img src={cmt.user.avatar || defaultAvatar} alt={cmt.user.url} style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }} />
                        {cmt.user.username}
                      </td>
                      <td>{cmt.comment_content}</td>
                      <td className="text-center">
                        <button className="btn btn-danger"
                          onClick={() => handleRemoveComment(cmt.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
        <Pagination links={links} currentPage={currPage} handleGetPostLink={handleGetCommentLink} />
      </Row>
    </Container>
  )
};

export default Comments;
