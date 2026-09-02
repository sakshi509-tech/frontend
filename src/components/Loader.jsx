import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading...", size = "medium" }) => {
  const sizeClass = size === "small" ? "h-4 w-4" : "h-6 w-6";

  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className={`${sizeClass} animate-spin`} />
      {text && <span>{text}</span>}
    </span>
  );
};

export default Loader;