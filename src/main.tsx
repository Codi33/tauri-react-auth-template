import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home.tsx";
import { AuthProvider } from "react-auth-kit";
import Login from "./components/Login.tsx";
import PrivateRoute from "./utils/PrivateRoute.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider authType={"cookie"} authName={"_auth"}>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          index
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path={"/login"} element={<Login />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
