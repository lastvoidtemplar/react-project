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
  userId?: string;
  disabled: boolean;
  opened: boolean
};

function RecipeForm({ recipe, callback, userId, disabled, opened }: RecipeFormProps) {
  return (
    <>
      {recipe === undefined ? (
        <CreateRecipeForm callback={callback} userId={userId} />
      ) : (
        <EditRecipeForm
          callback={callback}
          recipe={recipe}
          disabled={disabled}
          opened={opened}
        />
      )}
    </>
  );
}

type CreateRecipeFormProps = {
  callback?: () => void;
  userId?: string;
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

    setProducts([]);
    setTags([]);
    setErrors([]);
  }, []);

  const onSubmit = React.useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const newRecipe: Recipe = {
        id: nanoid(24),
        user_id: userId!,
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

      clearInputs();

      if (callback) {
        callback();
      }
    },
    [userId, products, tags, callback, clearInputs]
  );

  if (!userId) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col gap-2 min-w-[50rem] p-4">
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
      <InputList tags={products} setTags={setProducts} labelText="Products: " />
      <InputList tags={tags} setTags={setTags} labelText="Tags: " />
      <ul className="text-red-600">
        {errors.map((err, ind) => {
          return <li key={ind}>{err}</li>;
        })}
      </ul>
      <Button onClick={onSubmit}>Create a Recipe</Button>
    </div>
  );
}

type EditRecipeFormProps = {
  recipe: Recipe;
  callback?: () => void;
  disabled: boolean;
  opened: boolean;
};

function EditRecipeForm({
  recipe,
  callback,
  disabled,
  opened,
}: EditRecipeFormProps) {
  const idRef = React.useRef<HTMLInputElement>(null);
  const userIdRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const shortDescriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const cookTimeRef = React.useRef<HTMLInputElement>(null);
  const pictureRef = React.useRef<HTMLInputElement>(null);
  const longDescriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const createdByRef = React.useRef<HTMLInputElement>(null);
  const updateByRef = React.useRef<HTMLInputElement>(null);

  const [products, setProducts] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);

  
  React.useLayoutEffect(() => {
    if (opened) {
      if (idRef.current) {
        idRef.current.value = recipe.id;
      }
      if (userIdRef.current) {
        userIdRef.current.value = recipe.user_id;
      }
      if (nameRef.current) {
        nameRef.current.value = recipe.name;
      }
      if (shortDescriptionRef.current) {
        shortDescriptionRef.current.value = recipe.short_description;
      }
      if (cookTimeRef.current) {
        cookTimeRef.current.value = recipe.cook_time.toString();
      }
      if (pictureRef.current) {
        pictureRef.current.value = recipe.picture;
      }
      if (longDescriptionRef.current) {
        longDescriptionRef.current.value = recipe.long_description;
      }
      if (createdByRef.current) {
        createdByRef.current.value = recipe.created_at;
      }
      if (updateByRef.current) {
        updateByRef.current.value = recipe.updated_at;
      }
      setProducts(recipe.products);
      setTags(recipe.tags);
      setErrors([]);
    }
  }, [recipe, opened]);

  const onSubmit = React.useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const newRecipe: Recipe = {
        id: idRef.current?.value || "",
        user_id: userIdRef.current?.value || "",
        name: nameRef.current?.value || "",
        short_description: shortDescriptionRef.current?.value || "",
        cook_time: parseFloat(cookTimeRef.current?.value || "0"),
        products: products,
        picture: pictureRef.current?.value || "",
        long_description: longDescriptionRef.current?.value || "",
        tags: tags,
        created_at: createdByRef.current?.value || "",
        updated_at: new Date().toISOString().split("T")[0],
      };

      const errors = validateRecipe(newRecipe);
      if (errors.length !== 0) {
        setErrors(errors);
        return;
      }

      const url = new URL(`/recipes/${recipe.id}`, API_URL);
      try {
        const resp = await fetch(url, {
          method: "put",
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

      if (callback) {
        callback();
      }
    },
    [recipe, callback, products, tags]
  );

  return (
    <div className="flex flex-col gap-2 min-w-96 p-4">
      <h1 className="text-2xl text-center">Edit User Form</h1>
      <Input inputType="text" labelText="Id" ref={idRef} disabled />
      <Input inputType="text" labelText="User Id" ref={userIdRef} disabled />
      <Input
        inputType="text"
        labelText="Name"
        ref={nameRef}
        disabled={disabled}
      />
      <TextArea
        labelText="Short Description"
        ref={shortDescriptionRef}
        disabled={disabled}
      />
      <Input
        inputType="number"
        labelText="Cook Time In Minutes"
        ref={cookTimeRef}
        disabled={disabled}
      />
      <Input
        inputType="url"
        labelText="Picture Url"
        ref={pictureRef}
        disabled={disabled}
      />
      <TextArea
        labelText="Long Description"
        ref={longDescriptionRef}
        disabled={disabled}
      />
      <InputList
        tags={products}
        setTags={setProducts}
        labelText="Products: "
        disabled={disabled}
      />
      <InputList
        tags={tags}
        setTags={setTags}
        labelText="Tags: "
        disabled={disabled}
      />
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
      <ul className="text-red-600">
        {errors.map((err, ind) => {
          return <li key={ind}>{err}</li>;
        })}
      </ul>
      <Button onClick={onSubmit}>Edit the Recipe</Button>
    </div>
  );
}

export default RecipeForm;
