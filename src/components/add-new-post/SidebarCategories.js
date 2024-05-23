import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  Button,
  InputGroup,
  InputGroupAddon,
  FormCheckbox,
  FormInput
} from "shards-react";
import { post as postCate, remove as deleteCate } from "../../services/httpRequest"

const SidebarCategories = ({ title, setCateId, cateId }) => {
  const [cateTitle, setCateTitle] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [newCateTitle, setNewCateTitle] = useState("");
  const [idCateEdit, setIdCateEdit] = useState("");
  const [cateList, setCateList] = useState(JSON.parse(localStorage.getItem('categories') || '[]'))
  const handleAddCate = async () => {
    try {
      const cateData = await postCate('/admin/categories/create-category', {
        cat_title: cateTitle.trim()
      })
      setCateList(prev => {
        prev.push(cateData.category)
        return prev;
      });
      const data = JSON.parse(localStorage.getItem('categories') || [])
      localStorage.getItem('categories', data.push(cateData.category))
      setCateTitle('')
    } catch (error) {
      console.log(error);
    }
  }

  const handleEditCate = (cate) => {
    setNewCateTitle(cate.cat_title)
    setIdCateEdit(cate.id);
    setIsEdit(true);
  }

  const handleSaveCate = async (cateId) => {
    try {
      const updatedCate = await postCate(`/admin/categories/update-cat/${cateId}`, {
        cat_title: newCateTitle
      })

      const listCateAfterUpdate = cateList.map(cate => {
        if (cate.id == updatedCate.category_after_update.id) {
          cate.cat_title = updatedCate.category_after_update.cat_title
        }
        return cate;
      })
      setCateList(listCateAfterUpdate)
      localStorage.setItem('categories', JSON.stringify(listCateAfterUpdate))
    } catch (error) {
      console.log(error);
    } finally {
      setIsEdit(false)
    }
  }

  const handleRemoveCate = async (id) => {
    try {
      const deletedCate = await deleteCate(`/admin/categories/delete-cat/${id}`)
      if (deletedCate.status === 200) {
        const listCateAfterDelete = cateList.filter(cate => cate.id != id);
        setCateList(listCateAfterDelete)
        localStorage.setItem('categories', JSON.stringify(listCateAfterDelete))
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card small className="mb-3">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <CardBody className="p-0">
        <ListGroup flush>
          <ListGroupItem className="px-3 pb-2 d-flex flex-column gap-1">
            {cateList.map(cate => (
              <div className="d-flex align-item-center justify-content-between">
                {(isEdit && cate.id == idCateEdit) ?
                  <input type="text" className="form-control" style={{
                    padding: 0,
                    paddingLeft: "5px",
                    height: "30px"
                  }} value={newCateTitle} onChange={(e) => setNewCateTitle(e.target.value)} placeholder="Enter new category" /> : <FormCheckbox className="mb-1" value={cate.id} key={cate.id} onClick={() => setCateId(cate.id)} checked={cateId == cate.id}>
                    {cate.cat_title}
                  </FormCheckbox>
                }
                <div className="d-flex align-items-center gap-1 ml-2">
                  {(isEdit && cate.id == idCateEdit) ? <>
                    <button className="btn btn-primary btn-sm" style={{
                      padding: "2px",
                      marginRight: "5px"
                    }} onClick={() => handleSaveCate(cate.id)}>Save</button>
                    <button className="btn btn-secondary btn-sm" style={{
                      padding: "2px",
                      marginRight: "5px"
                    }} onClick={() => setIsEdit(false)}>Cancel</button>
                  </> : <>
                    <button className="btn btn-primary btn-sm" style={{
                      padding: "2px",
                      marginRight: "5px"
                    }} onClick={() => handleEditCate(cate)}>Edit</button>
                    <button className="btn btn-danger btn-sm" style={{
                      padding: "2px"
                    }} onClick={() => handleRemoveCate(cate.id)}>Remove</button></>
                  }

                </div>
              </div>
            ))}
          </ListGroupItem>

          <ListGroupItem className="d-flex px-3">
            <InputGroup className="ml-auto">
              <FormInput placeholder="New category" onChange={(e) => setCateTitle(e.target.value)} value={cateTitle} />
              <InputGroupAddon type="append">
                <Button theme="white" className="px-2" onClick={handleAddCate}>
                  <i className="material-icons">add</i>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </ListGroupItem>
        </ListGroup>
      </CardBody>
    </Card>
  )
};

SidebarCategories.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

SidebarCategories.defaultProps = {
  title: "Categories"
};

export default SidebarCategories;
