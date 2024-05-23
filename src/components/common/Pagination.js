import React from "react"

const Pagination = ({ links, currentPage, handleGetPostLink }) => {
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        {links.map((link, index) => {
          return (
            <li key={index} className={`page-item ${link.active && "active"} ${!link.url && "disabled"}`}><div className="page-link" onClick={() => { handleGetPostLink(link.url + "&sortBy=created_at&sortOrder=desc") }}>{link.label}</div></li>
          )
        })}
      </ul>
    </nav>
  )
};

export default Pagination;
