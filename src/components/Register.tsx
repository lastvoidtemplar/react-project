import React, { type FormEvent } from "react";
import { nanoid } from "nanoid";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import TextArea from "./TextArea";
import {
  getDefaultProfilePicture,
  validateUser,
  type Gender,
  type Role,
  type User,
} from "../common/user";
import { API_URL } from "../common/api";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

function Register() {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const genderRef = React.useRef<HTMLSelectElement>(null);
  const profilePictureRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const roleRef = React.useRef<HTMLSelectElement>(null);

  const [errors, setErrors] = React.useState<string[]>([]);

  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = React.useMemo(() => {
    return location.state.from;
  }, [location]);

  const onSubmit = React.useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const newUser: User = {
        id: nanoid(24),
        name: nameRef.current?.value || "",
        username: usernameRef.current?.value || "",
        password: passwordRef.current?.value || "",
        gender: genderRef.current?.value as Gender,
        role: roleRef.current?.value as Role,
        profile_picture: profilePictureRef.current?.value || "",
        description: descriptionRef.current?.value || "",
        status: "active",
        created_at: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString().split("T")[0],
      };

      if (newUser.profile_picture === "") {
        newUser.profile_picture = getDefaultProfilePicture(newUser.gender);
      }

      const errors = validateUser(newUser);
      if (errors.length !== 0) {
        setErrors(errors);
        return;
      }

      const url = new URL("/users", API_URL);
      try {
        const resp = await fetch(url, {
          method: "post",
          body: JSON.stringify(newUser),
        });
        if (!resp.ok) {
          setErrors(["Error while posting"]);
          return;
        }
      } catch (error) {
        console.log(error);
        setErrors(["Error while posting"]);
        return;
      }

      const err = await auth(newUser.username, newUser.password);
      if (err != null) {
        setErrors([err.errorMsg]);
        return;
      }
      navigate(from, {
        replace: true,
      });
    },
    [auth, from, navigate]
  );

  return (
    <form className="flex flex-col gap-2 min-w-96 p-4" onSubmit={onSubmit}>
      <h1 className="text-center text-2xl flex justify-around">
        <NavLink to="/login" replace state={{ from: from }}>
          Login
        </NavLink>
        <NavLink
          className="border-2 rounded-sm px-2 py-1"
          to="/register"
          replace
          state={{ from: from }}
        >
          Register
        </NavLink>
      </h1>
      <Input inputType="text" labelText="Name" ref={nameRef} />
      <Input inputType="text" labelText="Username" ref={usernameRef} />
      <Input inputType="password" labelText="Password" ref={passwordRef} />
      <Input
        inputType="url"
        labelText="Profile Picture Url"
        ref={profilePictureRef}
      />
      <TextArea labelText="Description" ref={descriptionRef} />
      <div className="flex justify-around">
        <Select
          options={["male", "female", "croissant"]}
          labelText="Gender: "
          ref={genderRef}
        />
        <Select options={["user", "admin"]} labelText="Role: " ref={roleRef} />
      </div>
      <ul className="text-red-600">
        {errors.map((err, ind) => {
          return <li key={ind}>{err}</li>;
        })}
      </ul>
      <Button>Register</Button>
    </form>
  );
}

export default Register;
