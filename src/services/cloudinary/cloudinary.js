import axios from "axios";
const cloud_name = process.env.REACT_APP_CLOUDINARY;

export const postImg = async (post) => {
  const data = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    post
  );

  return data;
};
