import React from 'react';
import { Redirect } from "react-router-dom";

const LoginRequire = (OriginComponent) => {
  return function ExtendComponent() {
    const userLogin = localStorage.getItem("userLogin") ? JSON.parse(localStorage.getItem("userLogin")) : null
    return (
      !userLogin ? <Redirect to={{
        pathname: '/login'
      }} /> : <OriginComponent />
    )
  }
};

export default LoginRequire;
