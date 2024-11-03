import Link from "next/link";

export default function NoSitePage({ subdomain }: { subdomain: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            This domain is available!
          </h1>

          <p className="text-xl text-gray-600">
            <span className="font-semibold text-indigo-600">
              {subdomain}.aiwebsitebuilder.tech
            </span>{" "}
            could be your new website.
          </p>

          <div className="space-y-4 text-gray-600">
            <p>
              Create your own professional website in minutes using our
              AI-powered website builder.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                AI-powered design assistance
              </li>
              <li className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Free subdomain included
              </li>
              <li className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Live in minutes
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              Create Your Website Now
            </Link>
            <p className="text-sm text-gray-500">
              No credit card required • Free subdomain • Easy setup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
