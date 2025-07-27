import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link to="/">MyApp</Link>
        </div>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link to="/footer" className="text-white hover:text-gray-300">
            Footer
          </Link>
          <Link to="/navbar" className="text-white hover:text-gray-300">
            NavBar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;