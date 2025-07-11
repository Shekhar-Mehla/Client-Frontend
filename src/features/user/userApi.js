import { axiosApiCall } from "../../axios/axiosApiCall";

const USER_API_URL = `${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/auth`;

// Get new access token using refresh token | GET | PRIVATE
// This function is used to get a new access token using the refresh token
//  when the current access token is expired.

// export const getNewAccessJwt = () => {
//   return axiosApiCall({
//     method: "get",
//     url: `${USER_API_URL}/accessjwt`,
//     isPrivate: true,
//     useRefreshToken: true,
//   });
// };

//CREATE USER | POST |  SIGNUP |  PUBLIC
export const createUser = (userObj) => {
  return axiosApiCall({
    method: "post",
    url: `${USER_API_URL}/register`,
    data: userObj,
  });
};

// ACTIVATE USER | PATCH | PRIVATE
export const activateUser = (activationObj) => {
  return axiosApiCall({
    method: "patch",
    url: `${USER_API_URL}/activate-user`,
    data: activationObj,
  });
};

// LOGIN USER | POST | /login  | PUBLIC
export const loginUser = (loginData) => {
  return axiosApiCall({
    method: "post",
    url: `${USER_API_URL}/login`,
    data: loginData,
  });
};

// GET the user | GET | PRIVATE
export const getUser = () => {
  return axiosApiCall({
    method: "get",
    url: `${USER_API_URL}/user-info`,
    isPrivate: true,
  });
};

//CREATE USER | POST |  SIGNUP |  PUBLIC

//UPDATE USER ROLE  | FOR ADMIN

// UPDATE USER | PATCH | PRIVATE

//LOGOUT USER | POST | PRIVATE
export const logoutUser = (email) => {
  return axiosApiCall({
    method: "post",
    url: `${USER_API_URL}/logout`,
    data: { email },
    isPrivate: true,
  });
};

//FORGET PASSWORD | /forget-password | POST | PUBLIC
export const forgetPasswordEmail = (formData) => {
  return axiosApiCall({
    method: "post",
    url: `${USER_API_URL}/forget-password`,
    data: formData,
  });
};

// CHANGE PASSWORD | /change-password | PATCH
export const changePassword = (data) => {
  return axiosApiCall({
    method: "patch",
    url: `${USER_API_URL}/change-password`,
    data: data,
  });
};
