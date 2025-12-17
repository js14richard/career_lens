import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

function CreateJob() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState<number>(0);
  const [type, setType] = useState("full-time");
  const [location, setLocation] = useState("");
  const [isRemoteJob, setIsRemoteJob] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     SUBMIT HANDLER
  ======================= */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/jobs/create", {
        title,
        description,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience,
        type,
        location,
        isRemoteJob,
      });

      navigate("/recruiter/dashboard/jobs");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold">
        Create Job
      </h2>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium">
            Job Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={4}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* SKILLS */}
        <div>
          <label className="block text-sm font-medium">
            Skills (comma separated)
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, Node.js, MongoDB"
            className="w-full border rounded p-2"
          />
        </div>

        {/* EXPERIENCE */}
        <div>
          <label className="block text-sm font-medium">
            Experience Required (years)
          </label>
          <input
            type="number"
            value={experience}
            onChange={(e) =>
              setExperience(Number(e.target.value))
            }
            min={0}
            className="w-full border rounded p-2"
          />
        </div>

        {/* JOB TYPE */}
        <div>
          <label className="block text-sm font-medium">
            Job Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="full-time">
              Full-time
            </option>
            <option value="part-time">
              Part-time
            </option>
            <option value="internship">
              Internship
            </option>
          </select>
        </div>

        {/* LOCATION */}
        <div>
          <label className="block text-sm font-medium">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="w-full border rounded p-2"
          />
        </div>

        {/* REMOTE */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isRemoteJob}
            onChange={(e) =>
              setIsRemoteJob(e.target.checked)
            }
          />
          <label className="text-sm">
            Remote Job
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/recruiter/dashboard/jobs")
            }
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateJob;
