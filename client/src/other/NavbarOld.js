import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from 'react-icons/cg';
import { GoGear } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import '../styles/Navbar.css';
import Swal from 'sweetalert2';

function Navbar () {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const handleLogout = () => {
        Swal.fire({
            title: 'Tancar sessió?',
            showDenyButton: true,
            confirmButtonText: `Sí`,
            denyButtonText: `Cancel·la`,
            confirmButtonColor: '#dc3545',
            denyButtonColor: '#6c757d',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                navigate('/inicisessio');
            }
        })
    }

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-logo">
                    <img src="/img/escut_passerells.png" alt="Logo" width="50px" height="50px" />
                </div>
                <ul className="navbar-links">
                    <li><Link to="/main">Menú</Link></li>
                    <li><Link to="/assaigs">Assaigs</Link></li>
                    <li><Link to="/diades">Diades</Link></li>
                    <li><Link to="/membres">Membres</Link></li>
                </ul>
                <div className="dropdown">
                    <CgProfile className="profile-icon" onClick={toggleDropdown} />
                    {dropdownOpen && (
                    <div className="dropdown-content">
                        <Link to="/perfil"><CgProfile className='icons-dropdown-items' />Perfil</Link>
                        <Link to="/configuracio"><GoGear className='icons-dropdown-items' />Configuració</Link>
                        <div className='dropdown-item' onClick={handleLogout}><IoLogOutOutline className='icons-dropdown-items' />Tanca sessió</div>
                    </div>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default Navbar;