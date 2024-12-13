import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="flex justify-center bg-cyan-800 text-white text-2xl font-bold p-4">
      <Link
        to="/"
        style={{
          paddingRight: "20px",
          fontSize: "20px",
          textDecoration: "none",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Home
      </Link>
      <Link
        to="/dashboard"
        style={{
          paddingLeft: "20px",
          fontSize: "20px",
          textDecoration: "none",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Dashboard
      </Link>
    </div>
  );
};

export default NavBar;
