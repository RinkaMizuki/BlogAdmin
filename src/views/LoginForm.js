import React, { useState } from "react"
import { withRouter } from 'react-router-dom';
import { post as postLoginUser } from "../services/httpRequest";

const LoginForm = ({ history }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const loginData = await postLoginUser('/login-user', {
        email,
        password
      });
      if (loginData.status == 403) {
        setPassword("")
        return;
      }
      localStorage.setItem('userLogin', JSON.stringify(loginData.user));
      history.push('/');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container" style={{
      marginTop: "250px"
    }}>
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          <h1 className="text-center mb-3">Đăng nhập</h1>
          <form action="" method="POST">
            <label htmlFor="email" id="email" className="form-label mb-2">Tên đăng nhập: </label>
            <input type="text" name="email" id="email" className="form-control mb-2" value={email} onChange={(e) => setEmail(e.target.value.trim())} />
            <span className="text-danger d-block text-small fst-italic mb-2"></span>
            <label htmlFor="password" id="password" className="form-label mb-2">Mật khẩu: </label>
            <input type="password" name="password" id="password" className="form-control mb-2" value={password} onChange={(e) => setPassword(e.target.value.trim())} />
            <span className="text-danger d-block text-small fst-italic mb-2"></span>
            <input type="button" name="btn_login" className="btn btn-primary" value="Đăng nhập" onClick={handleLogin} />
          </form>
        </div>
        <div className="col-md-4"></div>
      </div>
    </div>
  )
};

export default withRouter(LoginForm);
