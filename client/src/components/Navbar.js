import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { CgProfile } from 'react-icons/cg';
import { GoGear } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import '../styles/Navbar.css';

function Navbar () {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
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
                        <Link to="/tancasessio"><IoLogOutOutline className='icons-dropdown-items' />Tanca sessió</Link>
                    </div>
                    )}
                </div>


            </nav>

        </div>
    )
}

export default Navbar;