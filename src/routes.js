import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Users from "./views/Users";
import BlogPosts from "./views/BlogPosts";
import LoginRequire from "./hoc/LoginRequire";
import LoginForm from "./views/LoginForm";
import Comments from "./views/Comments";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: LoginRequire(BlogOverview)
  },
  {
    path: "/login",
    exact: true,
    layout: null,
    component: LoginForm
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: LoginRequire(UserProfileLite)
  },
  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: LoginRequire(AddNewPost)
  },
  {
    path: "/edit-old-post/:id",
    layout: DefaultLayout,
    component: LoginRequire(AddNewPost)
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  // {
  //   path: "/components-overview",
  //   layout: DefaultLayout,
  //   component: LoginRequire(ComponentsOverview)
  // },
  {
    path: "/users",
    layout: DefaultLayout,
    component: LoginRequire(Users)
  },
  {
    path: "/comments",
    layout: DefaultLayout,
    component: LoginRequire(Comments)
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: LoginRequire(BlogPosts)
  }
];
