const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {body,validationResult} = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');
router.get('/',[ auth ,[
    body("text", "text is required").not().isEmpty()
  ]],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors:errors.array()});
    }

    const user = await User.findById(req.user.id).select("-password");
    const newPost =new Post( {
        user:req.user.id,
        text:req.body.text,
        name:user.name,
        avatar:user.avatar
    })

    const post = await newPost.save();
    res.json(post);
})

module.exports = router;