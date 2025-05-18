import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import AuthLayout from "./components/AuthLayout";
import Login from "./components/Login";
import UsersView from "./components/UsersView";
import Register from "./components/Register";
import RecipesView from "./components/RecipesView";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<AuthLayout/>}>
                <Route path="/users" element={<UsersView/>}/>
              </Route>
              <Route path="/recipes" element={<RecipesView/>  }/>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
