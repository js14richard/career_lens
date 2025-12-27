import { Outlet, NavLink } from "react-router-dom";

function RecruiterDashboard() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">
        <h2 className="font-semibold mb-4">
          Recruiter Dashboard
        </h2>

        <nav className="space-y-2">
          <NavLink
            to="/recruiter/dashboard"
            end
            className={({ isActive }) =>
              isActive
                ? "block font-medium text-blue-600"
                : "block text-gray-700"
            }
          >
            Jobs
          </NavLink>

          <NavLink
            to="/recruiter/dashboard/jobs/create"
            className={({ isActive }) =>
              isActive
                ? "block font-medium text-blue-600"
                : "block text-gray-700"
            }
          >
            Create Job
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default RecruiterDashboard;
