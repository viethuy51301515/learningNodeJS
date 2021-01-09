const express = require('express');
const router = express.Router();
const auth = require(('../../middleware/auth'));
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const {body,validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
router.get("/",auth,async   (req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json("server error");
    }

})

router.post(
    "/",
    [
      body("email", "Email is required").isEmail().not().isEmpty(),
      body("password", "password is required").not().isEmpty(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        // see if user exists
          let user = await User.findOne({email});
          if(!user){
            return  res.status(400).json({errors:[{msg:'Invalid Credentail'}]})
          }
  
          const isMatch = await bcrypt.compare(password,user.password);
          if( !isMatch){
            return res.status(400).json({errors:[{msg:"Invalid Credentail"}]})
          }
  
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