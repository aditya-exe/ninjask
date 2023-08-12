/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Switch } from "../Switch";
import useDarkMode from "@/utils/useDarkMode";
import { Icons } from "@/components/icons";

const ThemeSwitch = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div className="flex items-center gap-x-2">
      <Icons.Sun />
      <Switch
        checked={darkTheme}
        onCheckedChange={handleMode}
        className={`${darkTheme ? "bg-blue-900" : "bg-orange-700"}`}
      />
      <Icons.Star />
    </div>
  );
};

export default ThemeSwitch;
