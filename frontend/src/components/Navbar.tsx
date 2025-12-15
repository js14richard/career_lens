import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <h1 className="text-xl font-bold">Career Lens</h1>

      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">
          Home
        </Link>
        <Link to="/about" className="text-gray-700 hover:text-blue-600">
          About
        </Link>
        <Link to="/features" className="text-gray-700 hover:text-blue-600">
          Features
        </Link>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        ) : (
          <>
            {role === "candidate" && (
              <Link
                to="/candidate/dashboard"
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
            )}

            {role === "recruiter" && (
              <Link
                to="/recruiter/dashboard"
                className="text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
