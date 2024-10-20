import { NavLink } from "react-router-dom";

const base =
  "px-3 py-1.5 rounded  transition-colors duration-300 disabled:cursor-not-allowed tracking-wide focus:outline-none focus:ring ring-slate-300 focus:ring transition duration-200 focus:ring-offset-1 focus:ring-slate-300 ";

const button = "shadow text-slate-800";

const styles = {
  primary:
    base +
    " " +
    button +
    " " +
    "font-medium bg-blue-200 disabled:bg-blue-100 disabled:text-white hover:bg-blue-500  hover:text-white",
  link:
    base +
    " " +
    "hover:bg-slate-300 hover:bg-opacity-50 hover:text-slate-900 text-slate-600",
  secondary:
    base +
    " " +
    button +
    " " +
    "bg-slate-300 disabled:bg-slate-100 hover:bg-slate-400 hover:text-white disabled:text-slate-300",
};

function Button({
  children, // Button text
  className, // Allows for additional classes to be added
  disabled = false, // only disables button
  loading = false, // disables and displays spinner
  onClick,
  type, // Determines styling, types are 'primary', 'secondary' and 'link'
  to, // Providing a path as a string, switches the button to a NavLink
  title,
}) {
  if (to) {
    return (
      <NavLink to={to} className={styles[type]}>
        {children}
      </NavLink>
    );
  }

  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`${styles[type] + " " + className}`}
      title={title}
    >
      <div className="flex justify-center items-center">
        {loading && (
          <span className="inline-block animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4 mr-2  "></span>
        )}
        {children}
      </div>
    </button>
  );
}

export default Button;
