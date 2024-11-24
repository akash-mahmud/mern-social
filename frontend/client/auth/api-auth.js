import axios from "axios";
import axiosRequest from "../utils/axiosRequest";

const signin = async (user) => {
  try {
    let response = await axiosRequest.post("/auth/signin", user);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const signout = async () => {
  try {
    let response = await axiosRequest.get("/auth/signout/");
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export { signin, signout };
