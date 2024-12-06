const { serverlessBehaviour } = require("../../config/utils");
const { getErrorMessage } = require("../helpers/dbErrorHandler");
const Post = require("../models/post.model");
const fs = require("fs");

const create = async (req, res, next) => {
  await serverlessBehaviour()

  let post = new Post({ ...req.body });
  post.postedBy = req.profile;
  // if (files.photo) {
  //   post.photo.data = fs.readFileSync(files.photo.path);
  //   post.photo.contentType = files.photo.type;
  // }
  try {
    let result = await post.save();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const postByID = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.postId)
      .populate("postedBy", "_id name")
      .exec();
    if (!post)
      return res.status(400).json({
        error: "Post not found",
      });
    req.post = post;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user post",
    });
  }
};

const listByUser = async (req, res) => {
  try {
    let posts = await Post.find({ postedBy: req.profile._id })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const listNewsFeed = async (req, res) => {
  await serverlessBehaviour()
  let following = req.profile.following;
  following.push(req.profile._id);
  try {
    let posts = await Post.find({ postedBy: { $in: req.profile.following } })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .sort("-created")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  let post = req.post;
  try {
    let deletedPost = await post.remove();
    res.json(deletedPost);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

const like = async (req, res) => {
  try {
    await serverlessBehaviour()

    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const unlike = async (req, res) => {
  try {
    await serverlessBehaviour()

    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.body.userId } },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const comment = async (req, res) => {
  await serverlessBehaviour()

  let comment = req.body.comment;
  comment.postedBy = req.body.userId;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const uncomment = async (req, res) => {
  await serverlessBehaviour()

  let comment = req.body.comment;
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: comment._id } } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

const isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

module.exports = {
  listByUser,
  listNewsFeed,
  create,
  postByID,
  remove,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  isPoster,
};
