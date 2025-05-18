import { NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import React, { type FormEvent } from "react";
import Input from "./Input";
import Button from "./Button";

function Login() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = React.useState<string>("");
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const from = React.useMemo(() => {
    return location.state.from;
  }, [location]);

  const onSubmit = React.useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!usernameRef.current || !passwordRef.current) {
        setError("Invalid refs!");
        return;
      }

      const err = await auth(
        usernameRef.current.value,
        passwordRef.current.value
      );
      if (err != null) {
        setError(err.errorMsg);
        return;
      }
      navigate(from, {
        replace: true,
      });
    },
    [auth, from, navigate]
  );

  return (
    <form
      className="w-96 gap-2 flex flex-col border-2 border-black rounded-sm p-2 justify-between"
      onSubmit={onSubmit}
    >
      <h1 className="text-center text-2xl flex justify-around">
        <NavLink
          className="border-2 rounded-sm px-2 py-1"
          to="/login"
          replace
          state={{ from: from }}
        >
          Login
        </NavLink>
        <NavLink to="/register" replace state={{ from: from }}>
          Register
        </NavLink>
      </h1>
      <Input inputType="text" labelText="Username: " ref={usernameRef} />
      <Input inputType="text" labelText="Password: " ref={passwordRef} />
      <p className="text-red-600">{error}</p>
      <Button>Login</Button>
    </form>
  );
}

export default Login;
