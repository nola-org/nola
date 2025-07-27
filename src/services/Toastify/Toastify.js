import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let isToastActive = false;

export const Toastify = (message) => {
  if (isToastActive) return;

  isToastActive = true;

  toast(`${message}`, {
    onClose: () => {
      isToastActive = false;
    },
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
