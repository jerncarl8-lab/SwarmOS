export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-black text-white px-4 py-2 rounded-xl hover:opacity-80 transition"
    >
      {children}
    </button>
  );
}
