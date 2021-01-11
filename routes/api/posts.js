const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
router.post(
  "/",
  [auth, [body("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select("-password");
    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
    });

    const post = await newPost.save();
    res.json(post);
  }
);
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (error) {
    return res.status(500).send("server error");
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id).sort({ date: -1 });
    return res.json(posts);
  } catch (error) {
    return res.status(500).send("server error");
  }
});
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).sort({date:-1});
        if(post.user.id !== req.user.id){
            return res.status(401).json({msg:"User not authorized"});
        }

        await post.remove();

        res.json({msg:"Post removed"});
    } catch (error) {
        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg:"Post not found"});
        }
    }
});
router.put('/likes/:id',auth,async(req,res) => {
  try {
    const post = await Post.findById(req.params.id).sort({date:-1});

    if(post.likes.filter(item => item.user.toString() === req.user.id).length !== 0){
      return res.status(400).json({msg:"Post has not been liked yet"});
    }

    post.likes.unshift({user:req.user.id});
    await post.save();
    return res.json(post.likes);
  } catch (error) {
    
  }
})
module.exports = router;
