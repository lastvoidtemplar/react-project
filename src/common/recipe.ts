export type Recipe = {
  id: string;
  user_id: string;
  name: string;
  short_description: string;
  cook_time: number;
  products: string[];
  picture: string;
  long_description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export function validateRecipe(recipe: Recipe): string[] {
  const errors: string[] = [];

  if (recipe.name === "") {
    errors.push("Name is required!");
  }

  if (recipe.name.length > 80) {
    errors.push("Name length must less than 80!");
  }

  if (recipe.short_description.length > 256) {
    errors.push("Short description length must less than 256!");
  }

  if (recipe.cook_time <= 0) {
    errors.push("Cook time must be positive number!");
  }

  if (recipe.products.length === 0) {
    errors.push("Products are required!");
  }

  if (recipe.long_description.length > 2024) {
    errors.push("Long description length must less than 2024!");
  }

  try {
    if (recipe.picture === "") {
      errors.push("Picture url is required!");
    } else {
      new URL(recipe.picture);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    errors.push("Picture url must be valid url!");
  }

  return errors;
}
