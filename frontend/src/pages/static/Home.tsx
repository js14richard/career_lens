function Home() {
  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Career Lens
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            An AI-assisted job portal that helps recruiters find the
            right candidates faster and gives applicants transparent
            feedback on their job applications.
          </p>

          <p className="mt-3 text-gray-600">
            Career Lens analyzes resumes, calculates job match scores,
            and streamlines the hiring process by reducing irrelevant
            applications.
          </p>

          {/* CTA */}
          <div className="mt-6 flex gap-4">
            <a
              href="/jobs"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Explore Jobs
            </a>

            <a
              href="/how-it-works"
              className="border border-gray-300 px-5 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
            >
              How It Works
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div>
          <img
            src="https://res.cloudinary.com/js14richardcloud/image/upload/v1766772529/home-image_qrvxlq.jpg"
            alt="Career Lens AI Job Portal"
            className="w-full rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Why Career Lens */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-900">
          Why Career Lens?
        </h2>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-5">
            <h3 className="font-semibold text-lg">
              Smart Resume Analysis
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Automatically extracts skills and experience from resumes
              to reduce manual screening.
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <h3 className="font-semibold text-lg">
              Match Score & Insights
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Provides a job match score and highlights skill gaps for
              better hiring decisions.
            </p>
          </div>

          <div className="border rounded-lg p-5">
            <h3 className="font-semibold text-lg">
              Transparent Hiring
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Applicants can track application status and understand
              why they were shortlisted or rejected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
