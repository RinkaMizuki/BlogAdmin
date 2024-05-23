import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import { get as getListUser, remove as removeUser } from "../services/httpRequest"
import defaultAvatar from "../images/user-profile/default.jpg"
import Pagination from "../components/common/Pagination";

const Users = () => {

  const [listUser, setListUser] = useState([]);
  const [links, setLinks] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [removeUsers, setRemoveUsers] = useState([]);
  const [userEdit, setUserEdit] = useState(null);
  const [file, setFile] = useState(null);
  const usernameRef = useRef(null);
  const phoneRef = useRef(null);
  const modelCloseRef = useRef(null);
  const removeAllRef = useRef(null);
  const removeAllBtnRef = useRef(null);
  const passwordRef = useRef(null);

  const handleGetUserLink = async (link) => {
    const users = await fetch(link, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json()).then(data => data)
    setListUser(users.users_list.data)
    setLinks(users.users_list.links);
    setCurrPage(users.users_list.current_page)
  }

  useEffect(() => {
    if (userEdit) {
      phoneRef.current.value = userEdit.phone;
      usernameRef.current.value = userEdit.username;
    }
  }, [userEdit])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const users = await getListUser('/admin/users?sortBy=created_at');//?keyword=w&sortOrder=asc
        setListUser(users.users_list.data)
        setLinks(users.users_list.links)
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserData()
  }, [])

  const handleRemoveAllUser = async () => {
    try {
      const deletedUsers = await removeUser('/admin/users/delete-multiuser', {
        userIds: removeUsers
      })
      console.log(deletedUsers);
      handleGetUserLink(`https://nhmhdemo.click/api/admin/users?page=${currPage}`)
    } catch (error) {
      console.log(error);
    } finally {
      removeAllBtnRef.current.checked = false;
      setRemoveUsers([]);
    }
  }

  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();
      formData.append('username', usernameRef.current.value);
      formData.append('password', passwordRef.current.value);
      formData.append('phone', phoneRef.current.value);
      formData.append('avatar', file);

      const updateUser = await fetch(`https://nhmhdemo.click/api/admin/users/update-user/${userEdit.id}`, {
        method: 'POST',
        body: formData,
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache",
        credentials: 'include',
      })
      console.log(updateUser);
      handleGetUserLink(`https://nhmhdemo.click/api/admin/users?page=${currPage}`)
    } catch (error) {
      console.log(error);
    } finally {
      setFile(null);
      usernameRef.current.value = "";
      passwordRef.current.value = "";
      phoneRef.current.value = "";
      modelCloseRef.current.click();
    }
  }
  console.log(removeUsers);

  const handleRemoveUser = async (userId) => {
    try {
      const deleted = await removeUser(`/admin/users/delete-user/${userId}`)
      console.log(deleted);
      handleGetUserLink(`https://nhmhdemo.click/api/admin/users?page=${currPage}`)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    removeAllBtnRef.current.checked = false;
  }, [currPage])

  const handleSelectAllUser = (isRemoveAll = false) => {
    setRemoveUsers([]);
    Array.from(removeAllRef.current.children).forEach(function (trChild) {
      trChild.children[0].children[0].checked = isRemoveAll;
      if (isRemoveAll) {
        setRemoveUsers(prev => prev.concat(+trChild.children[0].children[0].value))
      } else {
        setRemoveUsers(prev => prev.filter(id => id != +trChild.children[0].children[0].value))
      }
    })
  }
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Users" subtitle="Blog Users" className="text-sm-left" />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          {removeUsers.length ? <Row className="ml-2">
            <Col col="8">
              <Button className="btn btn-danger" onClick={handleRemoveAllUser}>Remove All</Button>
            </Col>
          </Row> : <React.Fragment></React.Fragment>}
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Active Users</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      <input type="checkbox" name="removeAll" id="removeAll" onChange={(e) => handleSelectAllUser(e.target.checked)} ref={removeAllBtnRef} />
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
                      Email
                    </th>
                    <th scope="col" className="border-0">
                      Phone
                    </th>
                    <th scope="col" className="border-0">
                      Role
                    </th>
                    <th scope="col" className="border-0 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody ref={removeAllRef}>
                  {listUser.map(user => (
                    <tr key={user.id}>
                      <td>
                        <input type="checkbox" name="remove" id="remove" value={user.id} onChange={(e) => {
                          if (e.target) {
                            if (e.target.checked) {
                              const newId = parseInt(e.target.value);
                              if (!isNaN(newId)) {
                                setRemoveUsers(prev => prev.concat(newId));
                              }
                            }
                            else {
                              const newId = parseInt(e.target.value);
                              if (!isNaN(newId)) {
                                setRemoveUsers(prev => prev.filter(id => id != newId));
                              }
                            }
                          }
                        }} />
                      </td>
                      <td>{user.id}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="d-flex align-items-center gap-3" style={{
                        borderBottom: "unset"
                      }}>
                        <img src={user.avatar || defaultAvatar} alt={user.url} style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }} />
                        {user.username}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.role.role_name}</td>
                      <td className="text-center">
                        <button type="button" className="btn btn-primary mr-3" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => {
                          setUserEdit(user)
                        }}>
                          Edit
                        </button>
                        <button className="btn btn-danger"
                          onClick={() => handleRemoveUser(user.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header align-items-center justify-content-start gap-3">
                    <label htmlFor="username" className="mb-0">Username: </label>
                    <input className="modal-title form-control" id="username" ref={usernameRef} />
                  </div>
                  <div className="modal-body d-flex flex-column gap-3">
                    <div>
                      <label htmlFor="phone" className="mb-0">Phone: </label>
                      <input className="modal-title form-control" id="phone" ref={phoneRef} />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-0">Email: </label>
                      <input className="modal-title form-control" disabled id="email" value={userEdit ? userEdit.email : ""} />
                    </div>
                    <div>
                      <label htmlFor="password" className="mb-0">Password: </label>
                      <input className="modal-title form-control" id="password" type="password" ref={passwordRef} placeholder="New password" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-0">Avatar: </label>
                      {!file ? <img src={userEdit ? (userEdit.avatar ? userEdit.avatar : defaultAvatar) : defaultAvatar} width={100} height={100} style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        margin: "10px 0 10px 10px"
                      }} /> : <img src={URL.createObjectURL(file)} width={100} height={100} style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                        margin: "10px 0 10px 10px"
                      }} />}
                      <input className="modal-title form-control" id="avatar" type="file" onChange={(e) => setFile(e.target.files[0])} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                    >Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleUpdateUser}>Save changes</button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Pagination links={links} currentPage={currPage} handleGetPostLink={handleGetUserLink} />
      </Row>

      {/* Default Dark Table */}
      {/* <Row>
        <Col>
          <Card small className="mb-4 overflow-hidden">
            <CardHeader className="bg-dark">
              <h6 className="m-0 text-white">Active Users</h6>
            </CardHeader>
            <CardBody className="bg-dark p-0 pb-3">
              <table className="table table-dark mb-0">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col" className="border-0">
                      #
                    </th>
                    <th scope="col" className="border-0">
                      First Name
                    </th>
                    <th scope="col" className="border-0">
                      Last Name
                    </th>
                    <th scope="col" className="border-0">
                      Country
                    </th>
                    <th scope="col" className="border-0">
                      City
                    </th>
                    <th scope="col" className="border-0">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Ali</td>
                    <td>Kerry</td>
                    <td>Russian Federation</td>
                    <td>Gdańsk</td>
                    <td>107-0339</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Clark</td>
                    <td>Angela</td>
                    <td>Estonia</td>
                    <td>Borghetto di Vara</td>
                    <td>1-660-850-1647</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Jerry</td>
                    <td>Nathan</td>
                    <td>Cyprus</td>
                    <td>Braunau am Inn</td>
                    <td>214-4225</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Colt</td>
                    <td>Angela</td>
                    <td>Liberia</td>
                    <td>Bad Hersfeld</td>
                    <td>1-848-473-7416</td>
                  </tr>
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row> */}
    </Container>
  )
};

export default Users;