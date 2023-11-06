import { enqueueSnackbar } from "notistack";
import { TOKEN } from "./constants";

export const fetchData = (url, method = "GET", body) => {
  const token = JSON.parse(localStorage.getItem(TOKEN)) ? JSON.parse(localStorage.getItem(TOKEN)) : "";
  if (method.toLowerCase() === "get") {
    return fetch(url, {
      method: "GET",
      
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((res) => res.json());
  }
  return fetch(url, {
    method: method,
    
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },

    body: JSON.stringify(body),
  }).then((res) => res.json());
};
export const showSnackbar = (variant, message) => {
  enqueueSnackbar(message, { variant });
};

export const  handleClickCopy = (dataToCopy) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(dataToCopy)
      .then(function () {
        showSnackbar("success",  "Copy thành công", enqueueSnackbar);
      })
      .catch(function (err) {
        console.error("Lỗi khi sao chép dữ liệu vào clipboard:", err);
      });
  } else {
    console.warn("Trình duyệt không hỗ trợ Clipboard API");
  }
};