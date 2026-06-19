import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar">
        <div className="logo">
          <NavLink to="/">Mobile Mechanic</NavLink>
        </div>

        <ul className="nav-links">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>

          <li>
            <NavLink to="/booking">Book Service</NavLink>
          </li>

          <li>
            <NavLink to="/services">Services</NavLink>
          </li>

          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;