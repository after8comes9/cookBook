import { useAuthContext } from "./useAuthContext.jsx";
import { useRecipesContext } from "./useRecipesContext.jsx";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: recipesDispatch } = useRecipesContext();

  const logout = () => {
    //remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    recipesDispatch({ type: "SET_RECIPES", payload: null });
  };

  return { logout };
};
