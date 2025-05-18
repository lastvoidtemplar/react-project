import { Link, Outlet } from "react-router";

function Layout() {
  return (
    <>
      <header>
        <nav className="flex justify-evenly items-center p-2 border-2">
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
      </header>
      <main className="w-full grow flex flex-col justify-center items-center">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
