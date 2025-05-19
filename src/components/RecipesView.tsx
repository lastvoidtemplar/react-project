import React from "react";
import { API_URL } from "../common/api";
import type { Recipe } from "../common/recipe";
import { useAuth } from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import Button from "./Button";
import type { User } from "../common/user";
import { PencilLine, Trash2 } from "lucide-react";
import RecipeForm from "./RecipeForm";

const urlRecipes = new URL("/recipes", API_URL);
const urlUsers = new URL("/users", API_URL);

function RecipesView() {
  const { authUser } = useAuth();

  const {
    loading: loadingRecipes,
    data: recipes,
    error: errorRecipes,
    failed: failedRecipes,
    refetch: refetchRecipes,
  } = useFetch<Recipe[], unknown>({
    endpoint: urlRecipes.toString(),
    method: "get",
  });

  const {
    loading: loadingUsers,
    data: users,
    error: errorUsers,
    failed: failedUsers,
    // refetch: refetchUsers,
  } = useFetch<User[], unknown>({
    endpoint: urlUsers.toString(),
    method: "get",
  });

  const mapUserIdsToUserNames = React.useMemo(() => {
    const map = new Map<string, string>();

    if (!users) {
      return map;
    }

    for (const user of users) {
      map.set(user.id, user.name);
    }

    return map;
  }, [users]);

  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [recipe, setRecipe] = React.useState<Recipe | undefined>(undefined);

  if (loadingRecipes || loadingUsers) {
    return <div>Loading</div>;
  }

  if (errorRecipes || failedRecipes) {
    return <div>Error Recipes</div>;
  }

  if (errorUsers || failedUsers) {
    return <div>Error Users</div>;
  }

  return (
    <div className="w-full h-full p-2">
      <div className="flex justify-around">
        <h1 className="text-4xl">Recipes</h1>
        {authUser && (
          <Button
            onClick={() => {
              setRecipe(() => undefined);
              dialogRef.current?.showModal();
            }}
          >
            Add Recipe
          </Button>
        )}
      </div>
      <dialog
        className="absolute top-1/2 left-1/2 -translate-1/2"
        ref={dialogRef}
      >
        <RecipeForm
          recipe={recipe}
          callback={() => {
            refetchRecipes();
            dialogRef.current?.close();
          }}
          userId={authUser?.id}
          disabled={!!recipe && authUser?.id !== recipe?.user_id}
        />
      </dialog>
      <div className="flex flex-wrap p-8 gap-4">
        {recipes &&
          recipes.map((recipe) => {
            return (
              <RecipeView
                key={recipe.id}
                id={recipe.id}
                authorName={
                  mapUserIdsToUserNames.get(recipe.user_id) || "Unknown"
                }
                name={recipe.name}
                picture={recipe.picture}
                cookTime={recipe.cook_time}
                shortDesc={recipe.short_description}
                refetch={refetchRecipes}
                edit={() => {
                  setRecipe(() => recipe);
                  dialogRef.current?.showModal();
                }}
                allowMutation={
                  authUser?.role === "admin" || authUser?.id === recipe.user_id
                }
              />
            );
          })}
      </div>
    </div>
  );
}

type RecipeViewProps = {
  id: string;
  authorName: string;
  name: string;
  picture: string;
  cookTime: number;
  shortDesc: string;
  refetch: () => void;
  edit: () => void;
  allowMutation: boolean;
};

function RecipeView({
  id,
  authorName,
  name,
  picture,
  cookTime,
  shortDesc,
  refetch,
  edit,
  allowMutation,
}: RecipeViewProps) {
  const summary = React.useMemo(() => {
    return shortDesc.slice(0, 150) + (shortDesc.length > 150 ? "..." : "");
  }, [shortDesc]);

  return (
    <div className="border-4 rounded-md p-2 h-auto flex flex-col items-center gap-0.5">
      <img src={picture} alt={name} className="h-23" />
      <h1>Name: {name}</h1>
      <h2>Author: {authorName}</h2>
      <h3>Cook Time: {cookTime}</h3>
      <p>{summary}</p>

      <div className="w-full flex justify-evenly gap-2">
        <Button onClick={edit}>
          <PencilLine />
        </Button>
        {allowMutation && (
          <Button
            onClick={async () => {
              await deleteRecipe(id);
              refetch();
            }}
          >
            <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
}

async function deleteRecipe(id: string) {
  const url = new URL(`/recipes/${id}`, API_URL);

  await fetch(url, {
    method: "delete",
  });
}

export default RecipesView;
