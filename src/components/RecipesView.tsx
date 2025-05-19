import React from "react";
import { API_URL } from "../common/api";
import type { Recipe } from "../common/recipe";
import { useAuth } from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import Button from "./Button";
import type { User } from "../common/user";
import { PencilLine, Trash2 } from "lucide-react";
import RecipeForm from "./RecipeForm";
import Select from "./Select";
import InputList from "./InputList";

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
  const [opened, setOpened] = React.useState(false)
  const [recipe, setRecipe] = React.useState<Recipe | undefined>(undefined);

  const usersName = React.useMemo(() => {
    if (!users) {
      return ["All"];
    }
    const names = users.map((user) => user.name);
    names.unshift("All");
    return names;
  }, [users]);

  const authorRef = React.useRef<HTMLSelectElement>(null);
  const viewRef = React.useRef<HTMLSelectElement>(null);
  const sortRef = React.useRef<HTMLSelectElement>(null);
  const [author, setAuthor] = React.useState<string>("All");
  const [tags, setTags] = React.useState<string[]>([]);
  const [view, setView] = React.useState<string>("All");
  const viewOptions = React.useMemo(() => ["All","1", "10", "20", "50"], []);
  const [sort, setSort] = React.useState<string>("Asc");
  const sortOptions = React.useMemo(() => ["Asc", "Desc"], []);

  const processedRecipes = React.useMemo(() => {
    if (!recipes) {
      return [];
    }
    return filterAndSortRecipes(
      recipes,
      view,
      sort,
      mapUserIdsToUserNames,
      author,
      tags
    );
  }, [recipes, view, sort, mapUserIdsToUserNames, author, tags]);

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
              setOpened(true)
              dialogRef.current?.showModal();
            }}
          >
            Add Recipe
          </Button>
        )}
      </div>
      <br />
      <div className="flex justify-around">
        <Select
          options={viewOptions}
          onChange={(v) => setView(v)}
          labelText="Views: "
          ref={viewRef}
        />
        <Select
          options={sortOptions}
          onChange={(s) => setSort(s)}
          labelText="Sort: "
          ref={sortRef}
        />
        <Select
          options={usersName}
          onChange={(a) => setAuthor(a)}
          labelText="Author: "
          ref={authorRef}
        />
        <InputList tags={tags} setTags={setTags} labelText="Tags: " />
      </div>
      <dialog
        className="absolute top-1/2 left-1/2 -translate-1/2"
        ref={dialogRef}
        onClose={()=>{setOpened(false)}}
      >
        <RecipeForm
          recipe={recipe}
          callback={() => {
            refetchRecipes();
            dialogRef.current?.close();
          }}
          userId={authUser?.id}
          disabled={!!recipe && authUser?.id !== recipe?.user_id}
          opened={opened}
        />
      </dialog>
      <div className="flex flex-wrap p-8 gap-4">
        {processedRecipes.map((recipe) => {
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
              tags={recipe.tags}
              refetch={refetchRecipes}
              edit={() => {
                setRecipe(() => recipe);
                setOpened(true)
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
  tags: string[];
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
  tags,
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
      <h3>Tags: {tags.join(", ")}</h3>
      <p>Summary: {summary}</p>

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

function filterAndSortRecipes(
  recipes: Recipe[],
  view: string,
  sort: string,
  mapUserIdsToUserNames: Map<string, string>,
  authorName: string,
  tags: string[]
): Recipe[] {
  const filterRecipes = recipes.filter((recipe) => {
    if (authorName !== "All") {
      const recipeAuthorName = mapUserIdsToUserNames.get(recipe.user_id);
      if (recipeAuthorName !== authorName) {
        return false;
      }
    }
    const isTagsSubset = tags.reduce((total, tag) => {
      return total && recipe.tags.includes(tag);
    }, true);

    if (!isTagsSubset) {
      return false;
    }
    return true;
  });

  const sortedRecipes = filterRecipes.sort((a, b) => {
    const m = sort === "Asc" ? 1 : -1;
    if (a.created_at > b.created_at) {
      return m;
    } else if (a.created_at < b.created_at) {
      return -m;
    } else {
      return 0;
    }
  });

  if (view === "All") {
    return sortedRecipes;
  }

  const take = parseInt(view);
  const slicedRecipes = sortedRecipes.slice(0, take);

  return slicedRecipes;
}

export default RecipesView;
