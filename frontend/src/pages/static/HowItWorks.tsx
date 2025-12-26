function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          How Career Lens Works
        </h1>
        <p className="mt-3 text-gray-600">
          Career Lens simplifies the hiring process by combining resume
          analysis, job matching, and application tracking for both
          applicants and recruiters.
        </p>
      </div>

      {/* Workflow Image */}
      <div>
        <img
          src="https://res.cloudinary.com/js14richardcloud/image/upload/v1766774422/writing-work-process_aypumf.jpg"
          alt="Career Lens workflow"
          className="w-full rounded-lg shadow-sm"
        />
      </div>

      {/* Applicant Flow */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          👤 Applicant Journey
        </h2>

        <ol className="space-y-3 list-decimal ml-6 text-gray-700">
          <li>Applicant creates an account and uploads a resume.</li>
          <li>
            The system analyzes the resume to extract skills and
            experience.
          </li>
          <li>
            Applicant explores available jobs and applies to suitable
            roles.
          </li>
          <li>
            A match score is generated based on job requirements.
          </li>
          <li>
            Applicant can track application status and view feedback.
          </li>
        </ol>
      </div>

      {/* Recruiter Flow */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          🧑‍💼 Recruiter Journey
        </h2>

        <ol className="space-y-3 list-decimal ml-6 text-gray-700">
          <li>
            Recruiter posts job openings with required skills and
            experience.
          </li>
          <li>
            Applications are automatically analyzed and ranked by match
            score.
          </li>
          <li>
            Recruiter reviews applicants and shortlists or rejects them.
          </li>
          <li>
            Applicants receive real-time updates on application status.
          </li>
        </ol>
      </div>

      {/* Outcome */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="text-gray-700">
          🎯 <strong>Outcome:</strong> Career Lens reduces recruiter
          workload, improves transparency for applicants, and enables
          faster, data-driven hiring decisions.
        </p>
      </div>
    </div>
  );
}

export default HowItWorks;
