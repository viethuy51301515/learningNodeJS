const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  text:{
    type:String,
    required:true
  },
  name:{
      type:String
  },
  avatar:{
      type:String
  },
  likes:[
      {
          users:{
              type:Schema.Types.ObjectId,
              ref:"user"
          }
      }
  ],
  comments:[
      {
          user:{
              type:Schema.Types.ObjectId,
              ref:"user"
          },
          text:{
              type:String
          },
          name:{
              type:String
          },
          avatar:{
              type:String
          },
          date:{
              type:Date,
              default:Date.now
          }
      }
  ],
  date:{
      type:Date,
      default:Date.now
  }
});
module.exports = Post = mongoose.model('Post',ProfileSchema);