import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const recipe = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/recipes" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    description: z.string(),
    timeMinutes: z.number(),
    servings: z.number(),
    difficulty: z.string(),
    effort: z.string(),
    cost: z.string(),
    mood: z.string(),
    tags: z.array(z.string()),
    searchAliases: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    mainIngredients: z.array(z.string()).default([]),
    equipment: z.array(z.string()).optional(),
    diet: z.array(z.string()).optional(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string()
      })
    ),
    steps: z.array(
      z.object({
        title: z.string(),
        text: z.string()
      })
    )
  })
});

export const collections = { recipes: recipe };
