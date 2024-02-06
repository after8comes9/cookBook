const express = require("express");
const {
  getRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  updateRecipe,
} = require("../controllers/recipeController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// require auth for all recipe routes
router.use(requireAuth);

// GET all recipes
router.get("/", getRecipes);

// GET a single recipe
router.get("/:id", getRecipe);

// POST a new recipe
router.post("/", createRecipe);

// DELETE a recipe
router.delete("/:id", deleteRecipe);

// UPDATE a recipe
router.patch("/:id", updateRecipe);

module.exports = router;
