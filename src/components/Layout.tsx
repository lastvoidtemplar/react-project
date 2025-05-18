import { Link, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

function Layout() {
  const {loading, authUser, logout} = useAuth()

  return (
    <>
      <header className="flex border-2">
        <nav className="grow flex justify-evenly items-center p-2 ">
          <Link className="text-2xl" to="/">
            Home
          </Link>
          <Link className="text-2xl" to="/users">
            User Management
          </Link>
          <Link className="text-2xl" to="/recipes">
            Recipes
          </Link>
        </nav>
        {!loading && authUser &&<div className="flex gap-1 justify-center items-center mr-6">
          <h1>Profile: {authUser.name}</h1>
          <button className="px-2 py-1 border-2 rounded-sm" onClick={logout}>Logout</button>
        </div>}
      </header>
      <main className="w-full grow flex flex-col justify-center items-center">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
