export default function Custom500() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">500</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-4">
        Server-side error occurred
      </h2>
      <p className="text-gray-500 mb-8">
        We're sorry, but something went wrong on our end.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Refresh the page
      </button>
    </div>
  );
}
