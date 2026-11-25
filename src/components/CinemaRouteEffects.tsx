import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function CinemaRouteEffects() {

  const {pathname} = useLocation();

  useLayoutEffect(() => {

    document.documentElement.dataset.cpTheme =
      localStorage.getItem("cp_theme") === "day"
        ? "day" : "night";

    window.scrollTo({
      top:0,
      left:0,
      behavior:"instant"
    });

  },[pathname]);

  return null;
}
