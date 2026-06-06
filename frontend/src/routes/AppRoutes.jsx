import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TravelPlans
from "../pages/TravelPlans";
import ProtectedRoute
from "./ProtectedRoute";
import MyPlans
from "../pages/MyPlans";
import FindMatches
from "../pages/FindMatches";
import MyMatches from "../pages/MyMatches";
import Chat from "../pages/Chat";
import Chats from "../pages/Chats";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
<Route
  path="/travel-plans"
  element={
    <ProtectedRoute>
      <TravelPlans />
    </ProtectedRoute>
  }
/>



<Route
  path="/chat/:userId"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>

<Route
    path="/chats"
    element={
        <ProtectedRoute>
            <Chats />
        </ProtectedRoute>
    }
/>

<Route
  path="/find-matches"
  element={
    <ProtectedRoute>
      <FindMatches />
    </ProtectedRoute>
  }
/>


<Route
  path="/my-matches"
  element={
    <ProtectedRoute>
      <MyMatches />
    </ProtectedRoute>
  }
/>


<Route
  path="/my-plans"
  element={
    <ProtectedRoute>
      <MyPlans />
    </ProtectedRoute>
  }
/>

       <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;