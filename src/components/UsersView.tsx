import React from "react";
import { API_URL } from "../common/api";
import type { Role, Status, User } from "../common/user";
import { useAuth } from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import Button from "./Button";
import { PencilLine, Trash2 } from "lucide-react";
import UserForm from "./UserForm";

const url = new URL("/users", API_URL);

function UsersView() {
  const { authUser } = useAuth();
  const { loading, data, error, failed, refetch } = useFetch<User[], unknown>({
    endpoint: url.toString(),
    method: "get",
  });

  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [user, setUser] = React.useState<User | undefined>(undefined);

  if (authUser === null || authUser.role !== "admin") {
    return <h1>You don`t have the permissions!</h1>;
  }

  if (loading) {
    return <div>Loading</div>;
  }

  if (error || failed) {
    return <div>Error</div>;
  }

  return <div className="w-full h-full p-2">
      <div className="flex justify-around">
        <h1 className="text-4xl">Users</h1>
        <Button onClick={()=>{
          setUser(()=>undefined)
          dialogRef.current?.showModal()
        }}>Add user</Button>
      </div>
      <dialog className="absolute top-1/2 left-1/2 -translate-1/2" ref={dialogRef}>
        <UserForm user={user} callback={()=>{
          refetch()
          dialogRef.current?.close()
        }}/>
      </dialog>
      <div className="flex flex-wrap p-8 gap-4">
        {data &&
          data?.map((user) => {
            return (
              <UserView
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                profile_picture={user.profile_picture}
                role={user.role}
                status={user.status}
                refetch={refetch}
                edit={()=>{
                  setUser(()=>user)
                  dialogRef.current?.showModal()
                }}
                allowDeletion={user.id!==authUser?.id }
              />
            );
          })}
      </div>
    </div>;
}

type UserViewProps = {
  id:string
  name: string;
  username: string;
  profile_picture: string;
  role: Role;
  status: Status;
  refetch: ()=>void
  edit: ()=>void
  allowDeletion: boolean
};


function UserView({
  id,
  name,
  username,
  profile_picture,
  role,
  status,
  refetch,
  edit,
  allowDeletion
}: UserViewProps) {
  return (
    <div
      className={
        "border-4 rounded-md  p-2 h-auto flex flex-col items-center gap-0.5 " +
        (status === "active"
          ? "border-green-600"
          : status === "suspended"
          ? "border-yellow-300"
          : "border-red-600")
      }
    >
      <img src={profile_picture || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt={username} className="h-23" />
      <h1>Name: {name}</h1>
      <h2>Username: {username}</h2>
      <h3>Role: {role}</h3>
      
      <div className="w-full flex justify-evenly gap-2">
        <Button onClick={edit}>
          <PencilLine />
        </Button>
        {allowDeletion && <Button onClick={async()=>{
          await deleteUser(id)
          refetch()
        }}>
          <Trash2 />
        </Button>}
      </div>
    </div>
  );
}

async function deleteUser(id: string){
  const url = new URL(`/users/${id}`, API_URL)

  await fetch(url, {
    method: "delete"
  })
}

export default UsersView;
