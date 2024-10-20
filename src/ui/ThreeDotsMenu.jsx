import { useState, useRef, useEffect } from "react";

export default function ThreeDotsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // Ref to track the dropdown menu element

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  // Close the dropdown if clicked outside of it
  useEffect(
    function () {
      function handleClickOutside(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    },
    [menuRef]
  );

  return (
    <div
      className="relative inline-block text-left rounded hover:shadow hover:bg-slate-100"
      ref={menuRef}
    >
      {/* Button */}
      <button
        className="flex items-center justify-center p-2 "
        type="button"
        onClick={toggleMenu}
      >
        {/* Three vertical dots using Tailwind */}
        <div className="flex flex-col items-center space-y-0.5">
          <span className="block w-1 h-1 bg-gray-700 rounded-full"></span>
          <span className="block w-1 h-1 bg-gray-700 rounded-full"></span>
          <span className="block w-1 h-1 bg-gray-700 rounded-full"></span>
        </div>
      </button>

      {/* Dummy Dropdown menu */}
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-slate-50 border border-gray-200 rounded shadow-lg z-10">
          <li>
            <a
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              href="#"
            >
              Item 1
            </a>
          </li>
          <li>
            <a
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              href="#"
            >
              Item 2
            </a>
          </li>
          <li>
            <a
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              href="#"
            >
              Item 3
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}
