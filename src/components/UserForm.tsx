import React, { type FormEvent } from "react";
import {
  getDefaultProfilePicture,
  validateUser,
  type Gender,
  type Role,
  type Status,
  type User,
} from "../common/user";
import Input from "./Input";
import TextArea from "./TextArea";
import Select from "./Select";
import Button from "./Button";
import { nanoid } from "nanoid";
import { API_URL } from "../common/api";

type UserFormProps = {
  user?: User;
  callback?: () => void;
};

function UserForm({ user, callback }: UserFormProps) {
  return (
    <>
      {user === undefined ? (
        <CreateUserForm callback={callback} />
      ) : (
        <EditUserForm user={user} callback={callback}/>
      )}
    </>
  );
}

type CreateUserFormProps = {
  callback?: () => void;
};

function CreateUserForm({ callback }: CreateUserFormProps) {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const genderRef = React.useRef<HTMLSelectElement>(null);
  const profilePictureRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const roleRef = React.useRef<HTMLSelectElement>(null);

  const [errors, setErrors] = React.useState<string[]>([]);

  const clearInputs = React.useCallback(() => {
    if (nameRef.current) {
      nameRef.current.value = "";
    }
    if (usernameRef.current) {
      usernameRef.current.value = "";
    }
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
    if (genderRef.current) {
      genderRef.current.value = "male";
    }
    if (profilePictureRef.current) {
      profilePictureRef.current.value = "";
    }
    if (descriptionRef.current) {
      descriptionRef.current.value = "";
    }
    if (roleRef.current) {
      roleRef.current.value = "user";
    }
    setErrors([]);
  }, []);

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

      clearInputs();

      if (callback) {
        callback();
      }
    },
    [callback, clearInputs]
  );

  return (
    <form className="flex flex-col gap-2 min-w-96 p-4" onSubmit={onSubmit}>
      <h1 className="text-2xl text-center">Create User Form</h1>
      <Input inputType="text" labelText="Name" ref={nameRef} />
      <Input inputType="text" labelText="Username" ref={usernameRef} />
      <Input inputType="password" labelText="Password" ref={passwordRef} />
      <Input
        inputType="url"
        labelText="Profile Picture Url"
        ref={profilePictureRef}
      />
      <TextArea labelText="Description" ref={descriptionRef} />
      <div className="flex gap-1 justify-around">
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
      <Button>Create a User</Button>
    </form>
  );
}

type EditUserFormProps = {
  user: User;
  callback?: () => void;
};

function EditUserForm({ user, callback }: EditUserFormProps) {
  const idRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const genderRef = React.useRef<HTMLSelectElement>(null);
  const profilePictureRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const roleRef = React.useRef<HTMLSelectElement>(null);
  const statusRef = React.useRef<HTMLSelectElement>(null);
  const createdByRef = React.useRef<HTMLInputElement>(null);
  const updateByRef = React.useRef<HTMLInputElement>(null);

  const [errors, setErrors] = React.useState<string[]>([]);

  React.useLayoutEffect(() => {
    if (idRef.current) {
      idRef.current.value = user.id;
    }
    if (nameRef.current) {
      nameRef.current.value = user.name;
    }
    if (usernameRef.current) {
      usernameRef.current.value = user.username;
    }
    if (passwordRef.current) {
      passwordRef.current.value = user.password;
    }
    if (genderRef.current) {
      genderRef.current.value = user.gender;
    }
    if (profilePictureRef.current) {
      profilePictureRef.current.value = user.profile_picture;
    }
    if (descriptionRef.current) {
      descriptionRef.current.value = user.description;
    }
    if (roleRef.current) {
      roleRef.current.value = user.role;
    }
    if (statusRef.current) {
      statusRef.current.value = user.status;
    }
    if (createdByRef.current) {
      createdByRef.current.value = user.created_at;
    }
    if (updateByRef.current) {
      updateByRef.current.value = user.updated_at;
    }
    setErrors([]);
  }, [user]);

  const onSubmit = React.useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const newUser: User = {
        id: idRef.current?.value || "",
        name: nameRef.current?.value || "",
        username: usernameRef.current?.value || "",
        password: passwordRef.current?.value || "",
        gender: genderRef.current?.value as Gender,
        role: roleRef.current?.value as Role,
        profile_picture: profilePictureRef.current?.value || "",
        description: descriptionRef.current?.value || "",
        status: statusRef.current?.value as Status,
        created_at: createdByRef.current?.value || "",
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

      const url = new URL(`/users/${user.id}`, API_URL);
      try {
        const resp = await fetch(url, {
          method: "put",
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

      if (callback) {
        callback();
      }
    },
    [user, callback]
  );

  return (
    <form className="flex flex-col gap-2 min-w-96 p-4" onSubmit={onSubmit}>
      <h1 className="text-2xl text-center">Edit User Form</h1>
     <Input inputType="text" labelText="Id" ref={idRef} disabled />
      <Input inputType="text" labelText="Name" ref={nameRef} />
      <Input inputType="text" labelText="Username" ref={usernameRef} />
      <Input inputType="text" labelText="Password" ref={passwordRef} />
      <Input
        inputType="url"
        labelText="Profile Picture Url"
        ref={profilePictureRef}
      />
      <TextArea labelText="Description" ref={descriptionRef} />
      <div className="flex gap-1 justify-around">
       <Select
          options={["male", "female", "croissant"]}
          labelText="Gender: "
          ref={genderRef}
        />
        <Select options={["user", "admin"]} labelText="Role " ref={roleRef} />

        <Select
          options={["active", "suspended", "deactivated"]}
          labelText="Status: "
          ref={statusRef}
        />
      </div>

      <div className="flex gap-2">
        <Input
          inputType="text"
          labelText="Created at: "
          ref={createdByRef}
          disabled
        />
        <Input
          inputType="text"
          labelText="Updated at: "
          ref={updateByRef}
          disabled
        />
      </div>
      <ul>
        {errors.map((err, ind) => {
          return <li key={ind}>{err}</li>;
        })}
      </ul>
      <Button>Edit the User</Button>
    </form>
  );
}

export default UserForm;
