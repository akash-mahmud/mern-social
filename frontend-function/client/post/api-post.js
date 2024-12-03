import axiosRequest from "../utils/axiosRequest";

const create = async (params, credentials, post) => {
  try {
    let response = await axiosRequest.post(
      "/posts/new/" + params.userId,
      { ...post },
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

const listByUser = async (params, credentials) => {
  try {
    let response = await axiosRequest.get("/posts/by/" + params.userId, {
      headers: {
        Authorization: "Bearer " + credentials.t,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const listNewsFeed = async (params, credentials, signal) => {
  try {
    let response = await axiosRequest.get("/posts/feed/" + params.userId, {
      // signal: signal,
      headers: {
        Authorization: "Bearer " + credentials.t,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const remove = async (params, credentials) => {
  try {
    let response = await axiosRequest.delete("/posts/" + params.postId, {
      headers: {
        Authorization: "Bearer " + credentials.t,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const like = async (params, credentials, postId) => {
  try {
    let response = await axiosRequest.put(
      "/posts/like/",
      {
        userId: params.userId,
        postId: postId,
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

const unlike = async (params, credentials, postId) => {
  try {
    let response = await axiosRequest.put(
      "/posts/unlike/",
      {
        userId: params.userId,
        postId: postId,
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

const comment = async (params, credentials, postId, comment) => {
  try {
    let response = await axiosRequest.put(
      "/posts/comment/",
      {
        userId: params.userId,
        postId: postId,
        comment: comment,
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

const uncomment = async (params, credentials, postId, comment) => {
  try {
    let response = await axiosRequest.put(
      "/posts/uncomment/",
      {
        userId: params.userId,
        postId: postId,
        comment: comment,
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

export {
  listNewsFeed,
  listByUser,
  create,
  remove,
  like,
  unlike,
  comment,
  uncomment,
};
