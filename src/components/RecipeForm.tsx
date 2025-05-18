import React, { type FormEvent } from "react";
import { validateRecipe, type Recipe } from "../common/recipe";
import Input from "./Input";
import TextArea from "./TextArea";
import InputList from "./InputList";
import Button from "./Button";
import { nanoid } from "nanoid";
import { API_URL } from "../common/api";

type RecipeFormProps = {
  recipe?: Recipe;
  callback?: () => void;
  userId: string;
  disabled: boolean;
};

function RecipeForm({ recipe, callback, userId }: RecipeFormProps) {
  return (
    <>
      {recipe === undefined ? (
        <CreateRecipeForm callback={callback} userId={userId}/>
      ) : (
        <div>World</div>
      )}
    </>
  );
}

type CreateRecipeFormProps = {
  callback?: () => void;
  userId: string;
};

function CreateRecipeForm({ callback, userId }: CreateRecipeFormProps) {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const shortDescriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const cookTimeRef = React.useRef<HTMLInputElement>(null);
  const pictureRef = React.useRef<HTMLInputElement>(null);
  const longDescriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const [products, setProducts] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);

  const [errors, setErrors] = React.useState<string[]>([]);

  const clearInputs = React.useCallback(() => {
    if (nameRef.current) {
      nameRef.current.value = "";
    }
    if (shortDescriptionRef.current) {
      shortDescriptionRef.current.value = "";
    }
    if (cookTimeRef.current) {
      cookTimeRef.current.value = "0";
    }
    if (pictureRef.current) {
      pictureRef.current.value = "";
    }
    if (longDescriptionRef.current) {
      longDescriptionRef.current.value = "";
    }

    setProducts([])
    setTags([])
    setErrors([]);
  }, []);

  const onSubmit = React.useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const newRecipe: Recipe = {
        id: nanoid(24),
        user_id: userId,
        name: nameRef.current?.value || "",
        short_description: shortDescriptionRef.current?.value || "",
        cook_time: parseFloat(cookTimeRef.current?.value || "0"),
        products: products,
        picture: pictureRef.current?.value || "",
        long_description: longDescriptionRef.current?.value || "",
        tags: tags,
        created_at: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString().split("T")[0],
      };

      const errors = validateRecipe(newRecipe);
      if (errors.length !== 0) {
        setErrors(errors);
        return;
      }

      const url = new URL("/recipes", API_URL);
      try {
        const resp = await fetch(url, {
          method: "post",
          body: JSON.stringify(newRecipe),
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

      clearInputs()

      if (callback) {
        callback();
      }
    },
    [userId, products, tags, callback, clearInputs]
  );

  return (
    <div className="flex flex-col gap-2 min-w-[50rem] p-4" onSubmit={onSubmit}>
      <h1 className="text-2xl text-center">Recipe form</h1>
      <Input inputType="text" labelText="Name" ref={nameRef} />
      <TextArea labelText="Short Description" ref={shortDescriptionRef} />
      <Input
        inputType="number"
        labelText="Cook Time In Minutes"
        ref={cookTimeRef}
      />
      <Input inputType="url" labelText="Picture Url" ref={pictureRef} />
      <TextArea labelText="Long Description" ref={longDescriptionRef} />
      <InputList
        initialTags={products}
        onChange={(inp) => setProducts(inp)}
        labelText="Products: "
      />
      <InputList
        initialTags={tags}
        onChange={(inp) => setTags(inp)}
        labelText="Tags: "
      />
      <ul className="text-red-600">
        {errors.map((err, ind) => {
          return <li key={ind}>{err}</li>;
        })}
      </ul>
      <Button>Create a User</Button>
    </div>
  );
}

export default RecipeForm;
