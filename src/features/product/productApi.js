import { axiosApiCall } from "../../axios/axiosApiCall";

const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL;

const productApiEndPoint = `${apiBaseUrl}/api/v1/product`;
export const getAllProductApi = () => {
  const obj = {
    url: productApiEndPoint,
    method: "get",
  };

  return axiosApiCall(obj);
};
// /filterProduct?categories=men&colors=White,Grey
export const getAllFilterProductApi = (query) => {
  console.log(query);
  const obj = {
    url: `${productApiEndPoint}/filterProduct${query}`,
    method: "get",
  };
  console.log(obj.url);
  return axiosApiCall(obj);
};
