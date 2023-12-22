import { toast } from 'react-toastify';

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export function authHeader() {
  // return authorization header with jwt token
  const currentUser = getCurrentUser();
  const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
  if (currentUser && token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

export function logOut() {
  sessionStorage.clear();
  localStorage.clear();
  window.location = "/";
}

const handleOutsideClick = () => {
  toast.dismiss();
}

export function errorHandler(error) {
  document.addEventListener('click', handleOutsideClick, false);
  switch (error.response?.status) {
    case 401:
      if (error.response?.data?.message?.includes("Authentication Failed")) {
        toast.error(error.response?.data?.message);
        logOut();
      }
      break;
    case 400:
    case 409:
    case 422:
    case 500:
      toast(error.response?.data?.message || "Something went wrong", { style: { background: 'white', color: 'red' }, autoClose: 5000 });
      break;
    default: toast("Oops! Something went wrong", { style: { background: 'white', color: 'red' }, autoClose: 5000 });
  }
}
