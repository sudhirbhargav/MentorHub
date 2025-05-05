import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import { NavigationSetter } from "./NavigationSetter";
import AppMentee from "./pages/mentee/appMentee";
import AppMentors from "./pages/mentors/appMentors";

function App() {
  return (
    <Router>
      <NavigationSetter /> {/* 👈 must be inside Router */}
      <Routes>
        <Route index path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to="/" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentee"
          element={
            <ProtectedRoute>
              <AppMentee />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor"
          element={
            <ProtectedRoute>
              <AppMentors />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
