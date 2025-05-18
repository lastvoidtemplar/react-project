import React from "react";
import { API_URL } from "../common/api";
import type { Role } from "../common/user";

type AuthUser = {
  id: string;
  name: string;
  username: string;
  role: Role;
};

type AuthError = {
  errorMsg: string;
};

type AuthResult = {
  loading: boolean;
  authUser: AuthUser | null;
  auth: (username: string, password: string) => Promise<AuthError | null>;
};

const AuthContext = React.createContext<AuthResult>({
  loading: true,
  authUser: null,
  auth: async () => {
    return {
      errorMsg: "Invalid auth function",
    };
  },
});

type AuthProviderProps = {
  children: React.JSX.Element;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);

  const auth = React.useCallback(
    async (username: string, password: string): Promise<AuthError | null> => {
      const url = new URL("/users", API_URL);
      url.searchParams.append("username", username);
      url.searchParams.append("password", password);

      let resp: Response;
      try {
        resp = await fetch(url.toString());
      } catch (error) {
        console.log(error);
        return {
          errorMsg: "Failed to connect to the server",
        };
      }

      if (!resp.ok) {
        return {
          errorMsg: "User doesn`t exists",
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any;
      try {
        data = await resp.json();
      } catch (error) {
        console.log(error);
        return {
          errorMsg: "Failed to json parse the response",
        };
      }

      if (!data[0]) {
        return {
          errorMsg: "User doesn`t exists",
        };
      }

      const newAuthUser: AuthUser = {
        id: data[0].id,
        name: data[0].name,
        username: data[0].username,
        role: data[0].role,
      };

      sessionStorage.setItem("user", JSON.stringify(newAuthUser));
      setAuthUser(newAuthUser);

      return null;
    },
    []
  );

  const value = React.useMemo(() => {
    return { loading, authUser, auth };
  }, [loading, authUser, auth]);

  React.useEffect(() => {
    const value = sessionStorage.getItem("user");
    if (value) {
      const savedUser = JSON.parse(value);
      setAuthUser(savedUser);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return React.useContext(AuthContext);
}
