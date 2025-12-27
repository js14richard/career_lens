function About() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          About Career Lens
        </h1>
        <p className="mt-3 text-gray-600">
          Career Lens is an AI-assisted job portal designed to improve
          hiring efficiency and bring transparency to the recruitment
          process.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-gray-700">
          <p>
            Traditional job portals often overwhelm recruiters with a
            large number of irrelevant applications, while applicants
            rarely receive meaningful feedback after applying.
          </p>

          <p>
            Career Lens addresses this challenge by analyzing resumes,
            matching candidate skills with job requirements, and
            generating a job match score for each application.
          </p>

          <p>
            Recruiters can make faster, data-driven decisions, while
            applicants can track their application status and understand
            where they stand in the hiring process.
          </p>
        </div>

        <div className="flex justify-end">
          <img
            src="https://res.cloudinary.com/js14richardcloud/image/upload/v1766774950/about-us_hqbx3j.jpg"
            alt="About Career Lens"
            className="w-full max-w-md rounded-lg shadow-sm"
          />
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="text-gray-700">
          🎯 <strong>Our Mission:</strong> To make hiring faster, fairer,
          and more transparent for both recruiters and job seekers.
        </p>
      </div>
    </div>
  );
}

export default About;
