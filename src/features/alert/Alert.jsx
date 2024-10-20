import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { alertActions } from "./alert.slice";

function Alert() {
  const dispatch = useDispatch();
  const location = useLocation();
  const alert = useSelector((state) => state.alert.value);
  const [visible, setVisible] = useState(false); // Controls opacity
  const [isMounted, setIsMounted] = useState(false); // Controls whether the alert is rendered
  let fadeOutTimer, displayTimer;

  // Clear alert on location change
  useEffect(() => {
    dispatch(alertActions.clear());
  }, [location, dispatch]);

  useEffect(() => {
    if (alert) {
      // When alert is available, render it first, then fade it in
      setIsMounted(true);

      // Clear any previous timers if they exist
      clearTimeout(fadeOutTimer);
      clearTimeout(displayTimer);

      // Fade-in effect after a slight delay to ensure mounting completes
      displayTimer = setTimeout(() => {
        setVisible(true);
      }, 50);

      // Set a timer to fade out the alert after 2 seconds
      fadeOutTimer = setTimeout(() => {
        setVisible(false); // Start fade-out

        // Clear the alert from state after fade-out transition completes
        setTimeout(() => {
          setIsMounted(false); // Unmount component after fade-out
          dispatch(alertActions.clear());
        }, 300); // Match this to CSS transition duration
      }, 2000);

      // Clean up timers when alert changes or component unmounts
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(displayTimer);
      };
    } else {
      // Ensure proper cleanup when alert is null
      setIsMounted(false);
      clearTimeout(fadeOutTimer);
      clearTimeout(displayTimer);
    }
  }, [alert, dispatch]);

  // If no alert and not visible, don't render anything
  if (!isMounted) return null;

  const successStyles = "bg-green-100 text-green-800 border-green-200";
  const failureStyles = "bg-red-100 text-red-800 border-red-200";

  const alertStyles =
    alert?.type === "alert-success" ? successStyles : failureStyles;

  return (
    <div
      className={`w-full mb-6 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full">
        <AlertMessage
          message={alert?.message}
          styles={alertStyles}
          onClose={() => {
            setVisible(false);
            setTimeout(() => {
              setIsMounted(false);
              dispatch(alertActions.clear());
            }, 300); // Match this to CSS transition duration
          }}
        />
      </div>
    </div>
  );
}

function AlertMessage({ message, styles, onClose }) {
  return (
    <div
      className={`alert w-full ${styles} p-4 rounded relative flex items-center`}
    >
      {message}
      <button
        type="button"
        className="ml-auto text-xl bg-transparent border-0 text-black opacity-50 hover:opacity-75"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
}

export default Alert;
