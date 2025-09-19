import axios from "axios";
import { instance } from "../axios";
// 123321Aa#
// ----------Token---------
// export const postRefreshToken = async (body) => {
//   const data = await instance.post("/auth/token/refresh/", body);

//   return data;
// };

// export const postRefreshToken = async (body = null) => {
//   const config = {
//     withCredentials: true,
//   };

//   const data = await instance.post(
//     "/auth/token/refresh/",
//     body ?? {},
//     config
//   );

//   return data;
// };

// export const postRefreshToken = async (body = null) => {
//   const config = {
//     withCredentials: true,
//   };

//   const data = body
//     ? await instance.post("/auth/token/refresh/", body, config)
//     : await instance.post("/auth/token/refresh/", {}, config);

//   return data;
// };

export const postRefreshToken = async (body = null) => {
  const data = await instance.post(
    "/auth/token/refresh/",
    body ?? {}
  );
console.log("postRefreshToken", data);

  return data;
};

//  Google OAuth — refresh 
export const postRefreshCookie = async () => {
  const { data } = await instance.post("/auth/refresh-cookie/", null);
  
  console.log("postRefreshCookie", postRefreshCookie);
  
  return data;
};

export const postlogOut = async () => {
  const data = await instance.post("/auth/logout");

  return data;
};

// ----------Account---------
export const getAccountApi = async () => {
  const data = await instance.get("/users/me");
  return data;
};

export const putAccountApi = async ({ ...body }) => {
  const data = await instance.patch("/users/me", body);
  return data;
};

export const getAccountId = async (id) => {
  try {
    // const { data } = await instance.get(`/public/users/${id}/ads`);
    const { data } = await instance.get(`/users/${id}/`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// =======
// export const postAccoutApi = async (body) => {
//   const { data } = await instance.put(`/accounts`, body);
//   return data;
// };

// export const putAccoutApi = async ({ ...body }, id) => {
//   const { data } = await instance.put(`/users/${id}`, body);
//   return data;
// };
// =======
export const getPostUserApi = async () => {
  try {
    return await instance.get(`/ads/my/`);
  } catch (error) {
    console.log("error", error.message);
  }
};

// -----------POSTS-------------
export const getAllPostApi = async () => {
  try {
    return await instance.get("/ads/?status=published");
  } catch (error) {
    console.log(error);
  }
};

export const getPostIdApi = async (id) => {
  try {
    const response = await instance.get(`/ads/${id}/`);
    return response;
  } catch (error) {
    return error;
  }
};

export const getPostUserIdApi = async (id) => {
  try {
    return await instance.get(`/public/users/${id}/ads/`);
  } catch (error) {
    console.log("error", error.message);
  }
};

export const postPostApi = async (post) => {
  try {
    const data = await instance.post(`/ads/`, post);
    return data;
  } catch (error) {
    return error;
  }
};

export const patchPostApi = async (id, body) => {
  try {
    const data = await instance.put(`/ads/${id}/`, body);
    return data;
  } catch (error) {
    return error;
  }
};

export const deletePostApi = async (id) => {
  const { data } = await instance.delete(`/ads/${id}`);
  return data;
};

// -----------DRAFTS-------------

export const getDraftsApi = async () => {
  try {
    const { data } = await instance.get("/ads/my/");
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getDraftsPostId = async (id) => {
  try {
    const data = await instance.get(`/ads/${id}/?status=draft`);
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteDraftsPostId = async (id) => {
  try {
    const { data } = await instance.delete(`/Drafts/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// export const postDraftsPost = async (body) => {
//   try {
//     const { data } = await instance.post(`/Drafts`, body);
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getDraftsPost = async () => {
//   try {
//     const { data } = await instance.get(`/Drafts`);
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const patchDraftsPostId = async (id, body) => {
//   try {
//     const { data } = await instance.put(`/Drafts/${id}`, body);
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// --------Save post----------
export const getSavePostApi = async () => {
  const { data } = await instance.get(`/ads/saved/`);
  return data;
};

export const postSavePostApi = async (id, savePost) => {
  const { data } = await instance.post(`/ads/${id}/save/`, savePost);
  return data;
};

export const postUnsavePostApi = async (id) => {
  const { data } = await instance.post(`/ads/${id}/save/`);
  return data;
};

// --------Categories and SubCategories----------
export const getCategories = async () => {
  try {
    const { data } = await instance.get(`/categories/`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCategoriesId = async (id) => {
  try {
    const { data } = await instance.get(`/categories/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getSubCategories = async () => {
  try {
    const { data } = await instance.get(`/subcategories/`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getSubCategoriesId = async (id) => {
  try {
    const { data } = await instance.get(`/subcategories/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// export const patchPostCategory = async (postId, categoryId) => {
//   try {
//     const { data } = await instance.patch(`/ads/${postId}/categories/`, {
//       id: categoryId,
//     });
//     return data;
//   } catch (error) {
//     console.error("Помилка оновлення категорії поста:", error);
//   }
// };

// -----------Password-------

export const postForgotPassword = async (email) => {
  const { data } = await instance.post(
    `/Account/forgot-password?email=${email}`
  );
  return data;
};

export const postPasswordChange = async (body) => {
  const data = await instance.post(`/auth/change-password/`, body);
  return data;
};

export const postResetPassword = async (body) => {
  const data = await instance.post(`/Account/reset-password`, body);
  return data;
};

export const getResetPassword = async (email, token) => {
  const data = await instance.get(`/Account/reset-password?${email}&${token}`);
  return data;
};

// ---------EmailChange-------

export const postEmailChange = async (email) => {
  const data = await instance.post(`/auth/email/change/`, email);
  return data;
};
