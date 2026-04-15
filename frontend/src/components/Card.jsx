export default function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border">
      {children}
    </div>
  );
}
