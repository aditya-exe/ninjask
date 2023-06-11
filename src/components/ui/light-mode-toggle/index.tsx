/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Switch } from "../Switch";
import { Sun, MoonStar } from "lucide-react";
import useDarkMode from "@/utils/useDarkMode";

const ThemeSwitch = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div className="flex items-center gap-x-2">
      <Sun />
      <Switch
        checked={darkTheme}
        onCheckedChange={handleMode}
        className={`${darkTheme ? "bg-blue-900" : "bg-orange-700"}`}
      />
      <MoonStar />
    </div>
  );
};

export default ThemeSwitch;
