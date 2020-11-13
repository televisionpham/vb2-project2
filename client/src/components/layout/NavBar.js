import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slice/authSlice";
import "./NavBar.css";

const NavBar = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);  

  const handleLogout = (e) => {
    e.preventDefault();
    setTimeout(() => dispatch(logout()), 500)    
    if (props.history) {
      props.history.push('/login');
    }
  }

  return (
    <header>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="/">
            2FA Demo
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
              { token ?
            <ul className="navbar-nav mr-auto">                
              <li className="nav-item active">
                <a className="nav-link" href="/">
                  Trang chủ <span className="sr-only">(current)</span>
                </a>
              </li>
            </ul>
            :
            <ul className="navbar-nav ml-auto">                
              <li className="nav-item active">
                <a className="nav-link" href="/login">Đăng nhập</a>
              </li>
            </ul>
}
            { token ?
              <div className="dropdown">
                <span
                  className="text-light dropdown-toggle"
                  id="userMenu"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fa fa-user-circle-o fa-lg"></i> 
                </span>
                <div className="dropdown-menu" aria-labelledby="userMenu">
                  <button className="dropdown-item" type="button" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              </div>
              :
              null
            }
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
