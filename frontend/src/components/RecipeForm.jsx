import { useState } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext.jsx";
import PropTypes from "prop-types";
import { useAuthContext } from "../hooks/useAuthContext.jsx";
import toast from "react-hot-toast";

const RecipeForm = (props) => {
  const { dispatch } = useRecipesContext();
  const { user } = useAuthContext();

  const initialState = [""];

  const [title, setTitle] = useState(props.title || "");
  const [ingredients, setIngredients] = useState(
    props.ingredients || initialState,
  );
  const [instructions, setInstructions] = useState(
    props.instructions || initialState,
  );
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState(props.image || "");
  const [isLoading, setIsLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const recipe = { title, ingredients, instructions, previewSource };

    const response = await fetch("http://localhost:4000/api/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
      setIsLoading(false);
    }
    if (response.ok) {
      /* setEmptyFields([]);
            setError(null);
            setTitle("");
            setIngredients([""]);
            setInstructions([""]);*/
      dispatch({ type: "CREATE_RECIPE", payload: json });
      setIsLoading(false);
      props.toggleForm();
      toast.success("recipe saved");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const recipe = { title, ingredients, instructions, previewSource };

    const response = await fetch(
      "http://localhost:4000/api/recipes/" + props.id,
      {
        method: "PATCH",
        body: JSON.stringify(recipe),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      dispatch({ type: "UPDATE_RECIPE", payload: json });
      props.toggleForm();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    props.toggleForm();
  };

  function addIngredient(index, newIngredient) {
    const newArray = ingredients.map((item, i) => {
      if (i === index) {
        // update one string inside the array
        return newIngredient;
      } else {
        // The rest don't change
        return item;
      }
    });
    setIngredients(newArray);
  }

  function addInstruction(index, newInstruction) {
    const newArray = instructions.map((item, i) => {
      if (i === index) {
        // update one string inside the array
        return newInstruction;
      } else {
        // The rest don't change
        return item;
      }
    });
    setInstructions(newArray);
  }

  let removeIngredient = (i) => {
    if (ingredients.length === 1) {
      return initialState;
    }
    return [...ingredients.slice(0, i).concat(...ingredients.slice(i + 1))];
  };

  let removeInstruction = (i) => {
    if (instructions.length === 1) {
      return initialState;
    }
    return [...instructions.slice(0, i).concat(...instructions.slice(i + 1))];
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setFileInputState(e.target.fileName);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  return (
    <form
      className="create"
      onSubmit={!props.title ? handleSubmit : handleUpdate}
    >
      {!props.title && <h3>Add a New Recipe</h3>}
      {props.title && <h3>Edit Recipe</h3>}

      <label>Recipe Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />
      <label>Ingredients:</label>
      <ul>
        {ingredients.map((ingredient, i) => (
          <li key={i}>
            <div className="listContent">
              <input
                type="string"
                onChange={(e) => {
                  let newIngredient = e.target.value;
                  addIngredient(i, newIngredient);
                }}
                value={ingredient}
                className={emptyFields.includes("ingredients") ? "error" : ""}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIngredients(removeIngredient(i));
                }}
                className="material-symbols-outlined trash"
              >
                delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div
        className="addListItem"
        onClick={(e) => {
          e.preventDefault();
          setIngredients([...ingredients, ""]);
        }}
      >
        <span className="material-symbols-outlined">add</span>
        <p className="addText">add an ingredient</p>
      </div>

      <label>Instructions:</label>
      <ol>
        {instructions.map((instruction, i) => (
          <li key={i}>
            <div className="listContent">
              <input
                type="string"
                onChange={(e) => {
                  let newInstruction = e.target.value;
                  addInstruction(i, newInstruction);
                }}
                value={instruction}
                className={emptyFields.includes("instructions") ? "error" : ""}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setInstructions(removeInstruction(i));
                }}
                className="material-symbols-outlined trash"
              >
                delete
              </button>
            </div>
          </li>
        ))}
      </ol>
      <div
        className="addListItem"
        onClick={(e) => {
          e.preventDefault();
          setInstructions([...instructions, ""]);
        }}
      >
        <span className="material-symbols-outlined">add</span>
        <p className="addText">add a step</p>
      </div>
      <label>Image:</label>
      <br />
      {previewSource && (
        <>
          <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
          <label className="addListItem" htmlFor="imageUpload">
            <span className="material-symbols-outlined">add</span>
            <p className="addText">Change the image</p>
          </label>
        </>
      )}
      {!previewSource && (
        <label htmlFor="imageUpload">
          <div
            className={
              emptyFields.includes("previewSource")
                ? "addListItem error"
                : "addListItem"
            }
          >
            <span className="material-symbols-outlined">add</span>
            <p className="addText">Upload an image</p>
          </div>
        </label>
      )}
      <input
        id="imageUpload"
        type="file"
        name="image"
        accept="image/*"
        style={{ visibility: "hidden" }}
        onChange={handleFileInputChange}
        value={fileInputState || ""}
        className={emptyFields.includes("previewSource") ? "error" : ""}
      />
      {error && <div className="error">{error}</div>}
      <button className="save" disabled={isLoading}>
        Save Recipe {isLoading && <span className="loader"></span>}
      </button>
      <button className="cancel" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
};

RecipeForm.propTypes = {
  toggleForm: PropTypes.any,
  title: PropTypes.any,
  ingredients: PropTypes.any,
  instructions: PropTypes.any,
  image: PropTypes.any,
  id: PropTypes.any,
};

export default RecipeForm;
