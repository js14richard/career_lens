import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../../api/axios";

type Job = {
  title: string;
  description: string;
  skills: string[];
  experience: number;
  type: string;
  location: string;
  isRemoteJob: boolean;
  salaryMin?: number;
  salaryMax?: number;
};

function EditJob() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${jobId}`);
        setJob(res.data.job);
      } catch {
        setError("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!job) return;

    const { name, value, type, checked } = e.target as HTMLInputElement;

    setJob({
      ...job,
      [name]:
        type === "checkbox"
          ? checked
          : name === "experience" ||
            name === "salaryMin" ||
            name === "salaryMax"
          ? Number(value)
          : value,
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!job) return;
    setJob({
      ...job,
      skills: e.target.value.split(",").map((s) => s.trim()),
    });
  };

  const handleSubmit = async () => {
  if (!jobId || !job) return;

  try {
    setSaving(true);
    await api.patch(`/jobs/${jobId}/update`, job);
    navigate(`/recruiter/dashboard/jobs/${jobId}`);
  } catch {
    setError("Failed to update job");
  } finally {
    setSaving(false);
  }
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="space-y-5 max-w-3xl">
      <h2 className="text-xl font-semibold">Edit Job</h2>

      {/* Job Title */}
      <div>
        <label className="text-sm font-medium">Job Title</label>
        <input
          name="title"
          className="border p-2 w-full"
          value={job.title}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows={5}
          className="border p-2 w-full"
          value={job.description}
          onChange={handleChange}
        />
      </div>

      {/* Skills */}
      <div>
        <label className="text-sm font-medium">
          Skills (comma separated)
        </label>
        <input
          className="border p-2 w-full"
          value={job.skills.join(", ")}
          onChange={handleSkillsChange}
        />
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-medium">Location</label>
        <input
          name="location"
          className="border p-2 w-full"
          value={job.location}
          onChange={handleChange}
        />
      </div>

      {/* Job Type */}
      <div>
        <label className="text-sm font-medium">Job Type</label>
        <select
          name="type"
          className="border p-2 w-full"
          value={job.type}
          onChange={handleChange}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      {/* Experience */}
      <div>
        <label className="text-sm font-medium">
          Experience (years)
        </label>
        <input
          type="number"
          name="experience"
          className="border p-2 w-full"
          value={job.experience}
          onChange={handleChange}
        />
      </div>

      {/* Remote */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isRemoteJob"
          checked={job.isRemoteJob}
          onChange={handleChange}
        />
        <label className="text-sm font-medium">Remote Job</label>
      </div>

      {/* Salary */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Salary Min</label>
          <input
            type="number"
            name="salaryMin"
            className="border p-2 w-full"
            value={job.salaryMin || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Salary Max</label>
          <input
            type="number"
            name="salaryMax"
            className="border p-2 w-full"
            value={job.salaryMax || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <Link
          to={`/recruiter/dashboard/jobs/${jobId}`}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back to Job Details
        </Link>
      </div>
    </div>
  );
}

export default EditJob;
