import React from 'react';
import { useSelector } from 'react-redux';
import './NavBar.css';

const NavBar = () => {
    const token = useSelector((state) => state.authReducer.token);

    if (!token) {
        return null;
    }

    return (
        <header>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="/">2FA Demo</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href="/">Trang chủ <span className="sr-only">(current)</span></a>
                            </li>                            
                        </ul>
                        
                        <div className="dropdown">
                            <span className="text-light dropdown-toggle" id="userMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-user-circle-o fa-lg"></i> username
                            </span>
                            <div className="dropdown-menu" aria-labelledby="userMenu">
                                <button className="dropdown-item" type="button">Đăng xuất</button>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default NavBar

