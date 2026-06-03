import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

export default function MedicalRoute({
  children
}) {

  const { user, loading } =
    useAuth();

  if (loading) {

    return <p>Loading...</p>;
  }

  if (!user) {

    return <Navigate to="/" />;
  }

  if (
    user.role !==
    "medical"
  ) {

    return (
      <Navigate
        to="/dashboard"
      />
    );
  }

  return children;
}