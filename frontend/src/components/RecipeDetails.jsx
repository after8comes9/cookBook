import { useRecipesContext } from "../hooks/useRecipesContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const RecipeDetails = ({ recipe, getSelectedKey, toggleForm, isActive }) => {
  const { dispatch } = useRecipesContext();

  const handleClickDelete = async () => {
    const response = await fetch(
      "http://localhost:4000/api/recipes/" + recipe._id,
      {
        method: "DELETE",
      },
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_RECIPE", payload: json });
    }
  };

  const max = () => {
    isActive ? getSelectedKey("") : getSelectedKey(recipe);
  };

  const handleClickEdit = () => {
    toggleForm();
    getSelectedKey(recipe);
  };

  return (
    <motion.div layout className="recipe-details" onClick={max}>
      <motion.div layout className="coverImage">
        <motion.img layout src={recipe.image_secure_url} alt="recipe" />
      </motion.div>
      <motion.h4 layout>{recipe.title}</motion.h4>
      <motion.p layout>
        added&nbsp;
        {formatDistanceToNow(new Date(recipe.createdAt), {
          addSuffix: true,
        })}
      </motion.p>
      {isActive && (
        <motion.div
          layout="position"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="moreDetails"
        >
          <strong>Ingredients: </strong>
          <ul>
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>

          <strong>Instructions: </strong>
          <ol>
            {recipe.instructions.map((instruction, i) => (
              <li key={i}>{instruction}</li>
            ))}
          </ol>
        </motion.div>
      )}
      <motion.span
        layout
        className="material-symbols-outlined delete"
        onClick={handleClickDelete}
      >
        delete
      </motion.span>
      <motion.span
        layout
        className="material-symbols-outlined edit"
        onClick={handleClickEdit}
      >
        edit
      </motion.span>
    </motion.div>
  );
};

RecipeDetails.propTypes = {
  recipe: PropTypes.any,
  getSelectedKey: PropTypes.any,
  toggleForm: PropTypes.any,
};

export default RecipeDetails;
