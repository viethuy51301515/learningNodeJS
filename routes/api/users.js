const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require('../../models/User') 
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
router.post(
  "/",
  [
    body("email", "Email is required").isEmail().not().isEmpty(),
    body("password", "password have to be longer than 7").isLength(7),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    try {
      // see if user exists
        let user = await User.findOne({email});
        if(user){
            res.status(400).json({errors:[{msg:'User already existed'}]})
        }

      // get users gravatar
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

      // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();

        const payload  = {
          user:{
            id:user.id
          }
        }

        jwt.sign(
          payload,
          config.get('jwtToken'),
          {expiresIn:36000},
          (err,token) => {
            if(err) throw err;
            res.json({token})
          }
        )

      // return jsonwebtoken

      console.log(req.body);
    } catch (error) {
      console.log(error);
      res.status(500).send('server error')
    }
  }
);

module.exports = router;
