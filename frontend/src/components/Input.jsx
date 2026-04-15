export default function Input({ placeholder, onChange }) {
  return (
    <input
      className="border rounded-xl px-4 py-2 w-full"
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}
