import { toast } from "react-toastify";

let isToastActive = false;

export const ToastError = (message) => {
  if (isToastActive) return;

  isToastActive = true;

  toast.error(`${message}`, {
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
