const express = require("express");
const googleAuth = express.Router();

googleAuth.get("/",(req,res)=>{
 res.send("Router google working");
});





export default googleAuth;