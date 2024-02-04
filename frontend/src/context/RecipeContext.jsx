import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

export const RecipesContext = createContext();

export const recipesReducer = (state, action) => {
  switch (action.type) {
    case "SET_RECIPES":
      return {
        recipes: action.payload,
      };
    case "CREATE_RECIPE":
      return {
        recipes: [action.payload, ...state.recipes],
      };
    case "UPDATE_RECIPE":
      return {
        recipes: state.recipes.map((item) =>
          item._id === action.payload._id ? action.payload : item,
        ),
      };

    case "DELETE_RECIPE":
      return {
        recipes: state.recipes.filter((r) => r._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const RecipesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipesReducer, {
    recipes: null,
  });

  return (
    <RecipesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RecipesContext.Provider>
  );
};

RecipesContextProvider.propTypes = {
  children: PropTypes.any,
};
