import { isDigit, isLetter } from "./string";

export type Gender = "male" | "female" | "croissant";
export type Role = "admin" | "user";
export type Status = "active" | "suspended" | "deactivated";

export type User = {
  id: string;
  name: string;
  username: string;
  password: string;
  gender: Gender;
  role: Role;
  profile_picture: string;
  description: string;
  status: Status;
  created_at: string;
  updated_at: string;
};

export function validateUser(user: User): string[] {
  const errors: string[] = [];

  if (user.name === "") {
    errors.push("Name is required!");
  }

  if (user.username === "") {
    errors.push("Username is required!");
  }

  if (user.username.length > 15) {
    errors.push("Username length must less than 15!");
  }

  const usernameIsWord = user.username.split("").reduce((total, curr) => {
    return total && (isLetter(curr) || curr === "_");
  }, true);

  if (!usernameIsWord) {
    errors.push("Username must contain only a-z, A-Z and _");
  }

  const passowrdHasDigit = user.password.split("").reduce((total, curr) => {
    return total || isDigit(curr);
  }, false);

  const passwordHasSymbol = user.password.split("").reduce((total, curr) => {
    return total || (!isDigit(curr) && !isLetter(curr));
  }, false);

  if (user.password.length < 8) {
    errors.push("Password must be at least 8 symbol!");
  }

  if (!passowrdHasDigit) {
    errors.push("Password must contain at least 1 digit!");
  }

  if (!passwordHasSymbol) {
    errors.push("Password must contain at least 1 special symbol!");
  }

  try {
    if (user.profile_picture === "") {
      errors.push("Profile picture url is required!");
    } else {
      new URL(user.profile_picture);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    errors.push("Profile picture url must be valid url!");
  }

  if (user.description.length > 512) {
    errors.push("Description length must less than 512");
  }
  return errors;
}

export function getDefaultProfilePicture(gender: Gender): string {
  switch (gender) {
    case "male":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s";
    case "female":
      return "https://img.freepik.com/premium-vector/default-female-user-profile-icon-vector-illustration_276184-169.jpg";
    case "croissant":
      return "https://cdn-icons-png.flaticon.com/512/7627/7627796.png";
  }
}
