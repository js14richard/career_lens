import { useEffect, useRef, useState } from "react";
import api from "../../../api/axios";

type UserProfile = {
  name: string;
  profile: {
    headline?: string;
    location?: string;
    pictureUrl?: string;
  };
};

type ResumeAnalysis = {
  skills: string[];
  summary?: string;
  experienceYears?: number;
};

function ProfileTab() {
  const resumeInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState<UserProfile | null>(null);

  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =======================
     Fetch User
  ======================== */
  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/user/me");
      setUser(res.data.user);
    };

    fetchUser();
  }, []);

  /* =======================
     Fetch Resume + Analysis
  ======================== */
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get("/resumes/me");
        const resumes = res.data?.resumes || [];

        if (resumes.length > 0) {
          const latest = resumes[0];

          setResumeId(latest._id);
          setResumeUrl(latest.fileUrl);

          if (latest.skills) {
            setAnalysis({
              skills: latest.skills,
              summary: latest.summary,
              experienceYears: latest.experienceYears,
            });
          }
        }
      } catch {
        // no resume
      }
    };

    fetchResume();
  }, []);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  /* =======================
     Upload Profile Photo
  ======================== */
  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const formData = new FormData();

    // MUST match backend
    formData.append("image", file);

    try {
      const res = await api.post("/user/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.user);
    } catch {
      setError("Failed to update profile picture");
    } finally {
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    }
  };

  /* =======================
     Upload + Auto Analyze Resume
  ======================== */
  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setError("Please select a resume file");
      return;
    }

    setLoading(true);
    resetMessages();

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const uploadRes = await api.post("/resumes/upload", formData);
      setResumeId(uploadRes.data.resumeId || uploadRes.data._id);
      setResumeUrl(uploadRes.data.fileUrl);

      const analyzeRes = await api.post("/resumes/analyze");
      setAnalysis({
        skills: analyzeRes.data.data.skills,
        summary: analyzeRes.data.data.summary,
        experienceYears:
          analyzeRes.data.data.experienceYears,
      });

      setSuccess("Resume uploaded and analyzed successfully");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Resume upload failed"
      );
    } finally {
      setLoading(false);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
      setResumeFile(null);
    }
  };

  /* =======================
     Delete Resume
  ======================== */
  const handleDeleteResume = async () => {
    if (!resumeId) return;

    setLoading(true);
    resetMessages();

    try {
      await api.delete(`/resumes/${resumeId}`);
      setResumeId(null);
      setResumeUrl(null);
      setAnalysis(null);
      setSuccess("Resume deleted successfully");
    } catch {
      setError("Failed to delete resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* =======================
          PROFILE HEADER
      ======================== */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={
              user?.profile.pictureUrl ||
              "https://via.placeholder.com/80"
            }
            className="w-20 h-20 rounded-full object-cover"
          />

          <button
            onClick={() => photoInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-2 py-1 rounded"
          >
            Change
          </button>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoUpload}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            {user?.name}
          </h2>

          {/* ✅ HEADLINE */}
          {user?.profile.headline && (
            <p className="text-gray-700">
              {user.profile.headline}
            </p>
          )}

          {/* ✅ LOCATION */}
          {user?.profile.location && (
            <p className="text-sm text-gray-500">
              {user.profile.location}
            </p>
          )}
        </div>
      </div>

      {/* =======================
          PROFILE INSIGHTS
      ======================== */}
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-3">
          Profile Insights
        </h3>

        {!analysis && (
          <p className="text-gray-600">
            Upload your resume to generate profile
            insights.
          </p>
        )}

        {analysis && (
          <>
            <p className="text-sm text-gray-700 mb-3">
              {analysis.summary}
            </p>

            <p className="text-sm text-gray-500 mb-4">
              {analysis.experienceYears ?? 0} year(s)
              experience
            </p>

            <div className="flex flex-wrap gap-2">
              {analysis.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-green-100 text-green-700 px-2 py-1 text-sm rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* =======================
          RESUME SECTION
      ======================== */}
      <div className="border rounded-lg p-6">
        <h3 className="font-semibold mb-3">Resume</h3>

        {error && (
          <p className="mb-3 text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-3 text-sm text-green-600">
            {success}
          </p>
        )}

        {!resumeId && (
          <>
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setResumeFile(e.target.files?.[0] || null)
              }
              className="mb-3"
            />

            <button
              onClick={handleResumeUpload}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Processing..." : "Upload Resume"}
            </button>
          </>
        )}

        {resumeId && (
          <div className="space-y-3">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline"
              >
                View Resume
              </a>
            )}

            <button
              onClick={handleDeleteResume}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Delete Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileTab;
