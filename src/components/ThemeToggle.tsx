  import { Moon, Sun, Laptop } from "lucide-react";
  import { useTheme } from "next-themes";

  export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
      <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-full p-1">
        <button
          onClick={() => setTheme("light")}
          className={`p-2 rounded-full transition-colors ${
            theme === "light" 
              ? "bg-white text-black" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`p-2 rounded-full transition-colors ${
            theme === "dark" 
              ? "bg-white text-black" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Moon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`p-2 rounded-full transition-colors ${
            theme === "system" 
              ? "bg-white text-black" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Laptop className="h-4 w-4" />
        </button>
      </div>
    );
  }