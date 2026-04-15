export default function Landing() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-4">
        Get Meetings Booked Automatically
      </h1>

      <p className="text-gray-500 mb-6">
        Replace your outbound team with AI that books qualified calls for you.
      </p>

      <a href="/app">
        <button className="bg-black text-white px-6 py-3 rounded-xl">
          Get Started
        </button>
      </a>
    </div>
  );
}
