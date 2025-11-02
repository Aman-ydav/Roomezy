import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-gray-500 mb-6">Page Not Found</p>
      <Link to="/" className="text-blue-600 underline">
        Go Home
      </Link>
    </div>
  );
}
