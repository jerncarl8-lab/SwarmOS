export default function Landing() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold mb-4">
        Get Meetings Booked Automatically
      </h1>

      <p className="text-gray-500 mb-8 max-w-lg">
        Replace your outbound team with AI that books qualified calls for you.
        No manual work. No SDRs. Just meetings on your calendar.
      </p>

      <div className="flex gap-4">
        <a href="/app">
          <button className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-80 transition">
            Start Free Trial
          </button>
        </a>
        <a href="/app">
          <button className="border border-black text-black px-6 py-3 rounded-xl hover:bg-gray-50 transition">
            Book Demo
          </button>
        </a>
      </div>
    </div>
  );
}
