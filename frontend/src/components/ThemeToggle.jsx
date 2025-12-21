import { useEffect, useState } from "react";
import { IoSunnyOutline } from "react-icons/io5";
import { CiDark } from "react-icons/ci";
import { Button } from "@/components/ui/button"

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  // First load: localStorage → system theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle(
        "dark",
        savedTheme === "dark"
      );
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (systemDark) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Toggle handler
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button onClick={toggleTheme} variant="outline">
      {theme === "dark" ? <CiDark /> : <IoSunnyOutline />}
      {theme === "dark" ? "Dark" : "Light"}
    </Button>
  );
};

export default ThemeToggle;