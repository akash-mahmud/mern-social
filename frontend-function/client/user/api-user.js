import axiosRequest from "../utils/axiosRequest";

const create = async (user) => {
  try {
    let response = await axiosRequest.post(
      "/api/users/",
      { ...user },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const list = async (signal) => {
  try {
    let response = await axiosRequest.get("/api/users/", {
      signal: signal,
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, credentials, signal) => {
  try {
    let response = await axiosRequest("/api/users/" + params.userId, {
      headers: {
        Authorization: "Bearer " + credentials.t,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const update = async (params, credentials, user) => {
  try {
    let response = await axiosRequest.put(
      "/api/users/" + params.userId,
      {
        ...user,
      },
      {
        headers: {
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const remove = async (params, credentials) => {
  try {
    let response = await axiosRequest.delete("/api/users/" + params.userId, {
      headers: {
        Authorization: "Bearer " + credentials.t,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const follow = async (params, credentials, followId) => {
  try {
    let response = await axiosRequest.put(
      "/api/users/follow/",
      {
        userId: params.userId,
        followId: followId,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const unfollow = async (params, credentials, unfollowId) => {
  try {
    let response = await axiosRequest.put(
      "/api/users/unfollow/",
      {
        userId: params.userId,
        unfollowId: unfollowId,
      },
      {
        headers: {
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const findPeople = async (params, credentials, signal) => {
  try {
    let response = await axiosRequest.get(
      "/api/users/findpeople/" + params.userId,
      {
        signal: signal,
        headers: {
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export { create, list, read, update, remove, follow, unfollow, findPeople };
