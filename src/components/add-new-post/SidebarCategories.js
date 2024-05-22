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
import { post as postCate } from "../../services/httpRequest"

const SidebarCategories = ({ title, setCateId, cateId }) => {
  const [cateTitle, setCateTitle] = useState("");
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

  return (
    <Card small className="mb-3">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <CardBody className="p-0">
        <ListGroup flush>
          <ListGroupItem className="px-3 pb-2">
            {cateList.map(cate => (
              <FormCheckbox className="mb-1" value={cate.id} key={cate.id} onClick={() => setCateId(cate.id)} checked={cateId == cate.id}>
                {cate.cat_title}
              </FormCheckbox>
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
