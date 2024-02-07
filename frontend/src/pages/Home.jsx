import { useState, useEffect } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext.jsx";
import { useAuthContext } from "../hooks/useAuthContext.jsx";

// components
import RecipeDetails from "../components/RecipeDetails";
import RecipeForm from "../components/RecipeForm";

const Home = () => {
  const { recipes, dispatch } = useRecipesContext();
  const [addRecipe, setAddRecipe] = useState(false);
  const [recipeFocus, setRecipeFocus] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const { user } = useAuthContext();

  function toggleForm() {
    setAddRecipe((addRecipe) => !addRecipe);
    // setRecipeFocus((recipeFocus) => !recipeFocus);
  }

  console.log(recipeFocus);

  useEffect(() => {
    setIsLoading(true);

    const fetchRecipes = async () => {
      const response = await fetch("http://localhost:4000/api/recipes", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_RECIPES", payload: json });
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRecipes();
    }
  }, [dispatch]);

  return (
    <div className="home">
      {!addRecipe && (
        <button className="addRecipeBtn" type="button" onClick={toggleForm}>
          <span className="material-symbols-outlined">add</span>
          <p>Add recipe</p>
        </button>
      )}
      {!addRecipe && !isLoading && (
        <div className="recipes">
          {recipes &&
            recipes.map((recipe) =>
              recipe._id === recipeFocus._id ? (
                <RecipeDetails
                  isActive={true}
                  toggleForm={toggleForm}
                  recipe={recipe}
                  key={recipe._id}
                  getSelectedKey={(key) => setRecipeFocus(key)}
                />
              ) : (
                <RecipeDetails
                  isActive={false}
                  toggleForm={toggleForm}
                  recipe={recipe}
                  key={recipe._id}
                  getSelectedKey={(key) => setRecipeFocus(key)}
                />
              ),
            )}
        </div>
      )}
      {addRecipe && (
        <RecipeForm
          id={recipeFocus._id}
          title={recipeFocus.title}
          ingredients={recipeFocus.ingredients}
          instructions={recipeFocus.instructions}
          image={recipeFocus.image_secure_url}
          toggleForm={toggleForm}
        />
      )}
    </div>
  );
};

export default Home;
