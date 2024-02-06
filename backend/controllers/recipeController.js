const Recipe = require("../models/recipeModel");
const mongoose = require("mongoose").default;
const { cloudinary } = require("../utils/cloudinary");

// get all recipes
const getRecipes = async (req, res) => {
  const user_id = req.user._id;

  const recipes = await Recipe.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(recipes);
};

// get a single recipe
const getRecipe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such recipe" });
  }

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return res.status(404).json({ error: "No such recipe" });
  }

  res.status(200).json(recipe);
};

// create a new recipe
const createRecipe = async (req, res) => {
  const { title, ingredients, instructions, previewSource } = req.body;

  // remove any empty fields in ingredients and instructions
  let cleanIngredients = ingredients.filter((str) => /\w+/.test(str));
  let cleanInstructions = instructions.filter((str) => /\w+/.test(str));

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (cleanIngredients.length === 0) {
    emptyFields.push("ingredients");
  }
  if (cleanInstructions.length === 0) {
    emptyFields.push("instructions");
  }
  if (!previewSource) {
    emptyFields.push("previewSource");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields", emptyFields });
  }

  // add to the database
  try {
    const uploadedImage = await cloudinary.uploader.upload(previewSource, {
      upload_preset: "ml_default",
    });
    console.log(uploadedImage);
    const image_secure_url = uploadedImage.secure_url;
    const image_public_id = uploadedImage.public_id;
    const user_id = req.user._id;
    const recipe = await Recipe.create({
      user_id,
      title,
      ingredients: cleanIngredients,
      instructions: cleanInstructions,
      image_secure_url,
      image_public_id,
    });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a recipe
const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such recipe" });
  }

  const recipe = await Recipe.findOneAndDelete({ _id: id });
  await cloudinary.uploader.destroy(recipe.image_public_id);

  if (!recipe) {
    return res.status(400).json({ error: "No such recipe" });
  }

  res.status(200).json(recipe);
};

// update a recipe
const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, instructions, previewSource } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such recipe" });
  }

  // remove any empty fields in ingredients and instructions
  let cleanIngredients = ingredients.filter((str) => /\w+/.test(str));
  let cleanInstructions = instructions.filter((str) => /\w+/.test(str));

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (cleanIngredients.length === 0) {
    emptyFields.push("ingredients");
  }
  if (cleanInstructions.length === 0) {
    emptyFields.push("instructions");
  }
  if (!previewSource) {
    emptyFields.push("previewSource");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields", emptyFields });
  }

  // add to the database
  try {
    const uploadedImage = await cloudinary.uploader.upload(previewSource, {
      upload_preset: "ml_default",
    });
    console.log(uploadedImage);
    const image_secure_url = uploadedImage.secure_url;
    const image_public_id = uploadedImage.public_id;
    const recipe = await Recipe.findOneAndUpdate(
      { _id: id },
      {
        title,
        ingredients: cleanIngredients,
        instructions: cleanInstructions,
        image_secure_url,
        image_public_id,
      },
      { returnDocument: "after" },
    );

    if (!recipe) {
      return res.status(400).json({ error: "No such recipe" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  deleteRecipe,
  updateRecipe,
};
