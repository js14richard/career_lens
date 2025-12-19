import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../../../api/axios";

type Resume = {
  _id: string;
  fileUrl?: string;
  summary?: string;
  skills: string[];
  experienceYears?: number;
  workExperience: {
    _id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description?: string;
  }[];
};

function ApplicantProfile() {
  const location = useLocation();
  const app = location.state?.applicant;

  const [resume, setResume] = useState<Resume | null>(null);
  const [loadingResume, setLoadingResume] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      if (!app?.resumeId) {
        setLoadingResume(false);
        return;
      }

      try {
        const res = await api.get(`/resumes/${app.resumeId}`);
        setResume(res.data.resume);
      } catch (err) {
        console.error("Failed to fetch resume", err);
      } finally {
        setLoadingResume(false);
      }
    };

    fetchResume();
  }, [app]);

  if (!app) {
    return <p className="text-red-600">Applicant data not available</p>;
  }

  const profile = app.applicantId.profile;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* ================= TOP ACTION BAR ================= */}
      <div className="flex items-center gap-3">
        <Link
          to={-1 as any}
          className="border px-3 py-1.5 rounded text-sm hover:bg-gray-100"
        >
          ← Back
        </Link>

        {!loadingResume && resume?.fileUrl && (
          <a
            href={resume.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            Download Resume
          </a>
        )}
      </div>

      <h2 className="text-xl font-semibold">Applicant Profile</h2>

      {/* ================= BASIC INFO ================= */}
      <div className="flex items-center gap-4">
        {profile?.pictureUrl && (
          <img
            src={profile.pictureUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        )}

        <div>
          <p className="text-lg font-medium">{app.applicantId.name}</p>
          <p className="text-sm text-gray-600">{profile?.headline}</p>
          <p className="text-sm text-gray-500">{profile?.location}</p>
        </div>
      </div>

      {/* ================= CONTACT ================= */}
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Email:</span>{" "}
          {app.applicantId.email}
        </p>
        <p>
          <span className="font-medium">Phone:</span>{" "}
          {profile?.phone}
        </p>
      </div>

      {/* ================= AI ANALYSIS ================= */}
      <div className="border-t pt-4 space-y-3">
        <p className="font-medium">AI Match Analysis</p>

        <p className="text-sm">
          Match Score:{" "}
          <span className="font-medium text-green-600">
            {app.analysis?.matchScore}%
          </span>
        </p>

        {app.analysis?.summary && (
          <p className="text-sm text-gray-700">{app.analysis.summary}</p>
        )}

        {/* ❌ MISSING SKILLS AS RED TAGS */}
        {app.analysis?.missingSkills?.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 text-red-600">
              Missing Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {app.analysis.missingSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-red-100 text-red-700 border border-red-300 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= RESUME ================= */}
      <div className="border-t pt-4 space-y-4">
        <p className="font-medium">Resume Details</p>

        {loadingResume ? (
          <p className="text-sm text-gray-500">
            Loading resume details...
          </p>
        ) : resume ? (
          <>
            {resume.summary && (
              <p className="text-sm text-gray-700">{resume.summary}</p>
            )}

            {resume.experienceYears !== undefined && (
              <p className="text-sm">
                <span className="font-medium">Total Experience:</span>{" "}
                {resume.experienceYears} years
              </p>
            )}

            {/* ✅ CURRENT SKILLS (GREEN TAGS) */}
            {resume.skills?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Current Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-green-100 text-green-700 border border-green-300 text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* WORK EXPERIENCE */}
            {resume.workExperience?.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Work Experience</p>

                {resume.workExperience.map((exp) => (
                  <div
                    key={exp._id}
                    className="border rounded p-3"
                  >
                    <p className="font-medium">
                      {exp.role} — {exp.company}
                    </p>
                    <p className="text-xs text-gray-500">
                      {exp.startDate} – {exp.endDate}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Resume details unavailable
          </p>
        )}
      </div>
    </div>
  );
}

export default ApplicantProfile;
