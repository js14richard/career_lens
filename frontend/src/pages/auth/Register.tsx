import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

type Role = "applicant" | "recruiter";

function Register() {
  const navigate = useNavigate();

  const initialFormState = {
    name: "",
    email: "",
    password: "",
    role: "applicant" as Role,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Register user (single API call)
      await api.post("/auth/register", formData);

      // ✅ Reset form after successful registration
      setFormData(initialFormState);

      // ✅ Redirect to login
      navigate("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-full max-w-md border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              name="name"
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full border rounded px-3 py-2"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full border rounded px-3 py-2"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              name="role"
              className="w-full border rounded px-3 py-2"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="applicant">Applicant</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
