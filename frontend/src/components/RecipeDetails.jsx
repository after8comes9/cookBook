import { useRecipesContext } from "../hooks/useRecipesContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useAuthContext } from "../hooks/useAuthContext.jsx";
import toast from "react-hot-toast";
import { useRef } from "react";

const RecipeDetails = ({ recipe, getSelectedKey, toggleForm, isActive }) => {
  const { dispatch } = useRecipesContext();
  const { user } = useAuthContext();

  const dialogRef = useRef(null);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("Open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  const handleClickDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(
      "http://localhost:4000/api/recipes/" + recipe._id,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      },
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_RECIPE", payload: json });
      toast.success("recipe deleted");
    }
  };

  const max = () => {
    if (!isActive) {
      getSelectedKey(recipe);
    } else {
      getSelectedKey("");
    }
  };

  let deleteBtn = (e) => {
    toggleDialog();
    e.stopPropagation();
  };

  let confirmDeleteBtn = (e) => {
    handleClickDelete();
    e.stopPropagation();
  };

  let cancelBtn = (e) => {
    toggleDialog();
    e.stopPropagation();
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
        onClick={deleteBtn}
      >
        delete
      </motion.span>
      <motion.span
        layout
        className="material-symbols-outlined edit"
        onClick={(e) => {
          getSelectedKey(recipe);
          toggleForm();
          e.stopPropagation();
        }}
      >
        edit
      </motion.span>
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            toggleDialog();
            e.stopPropagation();
          }
        }}
      >
        Are you sure you want to delete your {recipe.title} recipe?
        <button onClick={confirmDeleteBtn}>delete</button>
        <button onClick={cancelBtn}>cancel</button>
      </dialog>
    </motion.div>
  );
};

RecipeDetails.propTypes = {
  recipe: PropTypes.any,
  getSelectedKey: PropTypes.any,
  toggleForm: PropTypes.any,
};

export default RecipeDetails;
