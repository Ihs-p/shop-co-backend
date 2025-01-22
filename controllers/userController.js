const User  = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { oauth2client } = require('../utils/googleconfig');




const signUp = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hasedPassword = await bcrypt.hash(req.body.password,10)
    req.body.password = hasedPassword

    const newuser = await User.create(req.body);

    const token = jwt.sign({id:newuser._id},'secretkey',{expiresIn:'5h',algorithm: 'HS256' })   
     const user = {name:newuser.name,email:newuser.email}
    return res.status(201).json({message:"signup successfull",token,user});
  } catch (error) {
    console.log(error);
    
    return res
      .status(500)
      .json({ message: "someting went wrong"});
  }
};


const login = async (req, res) => { 
    try {
        const {email,password} = req.body

        const existingUser = await User.findOne({email})
        
        if(!existingUser) return res.status(400).json({message:"email not found"})
        
        const isMatch = await bcrypt.compare(password,existingUser.password)
        if(!isMatch) return res.status(400).json({message:"password is incorrect"})


            const token = jwt.sign({id:existingUser._id},'secretkey',{expiresIn:'5h', algorithm: 'HS256' }) 
            const user = {name:existingUser.name,email:existingUser.email}
            res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=18000`); // Max-Age = 5 hours in seconds

            return res.status(200).json({message:"login successfull",token,user})

        }
        catch(error){
            console.log(error)
            return res.status(500).json({message:"somthing went wrong"})

        }

    }



    const googleLogin = async (req, res) => {
      try {
        const { code } = req.query;
        
        const googleRes = await oauth2client.getToken(code)
        oauth2client.setCredentials(googleRes.tokens)
        
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)


        const {name,email} = userRes.data
        let user = await User.findOne({ email });

         if(!user){
           // Generate a random password for new users
          const randomPassword = generateRandomPassword();
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

           user = await User.create({
            name,
            email,
            password: hashedPassword

          });

         }

    
        const token = jwt.sign({id:user._id},'secretkey',{expiresIn:'5h',algorithm: 'HS256' })   
        user = {name:user.name,email:user.email}
        return res.status(200).json({message:" successfull",token,user});
      } catch (error) {
        console.log(error);
        
        return res
          .status(500)
          .json({ message: "someting went wrong"});
      }
    };




    // Helper function to generate a random password
function generateRandomPassword(length = 12) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  return Array.from({ length })
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join("");
}


    

module.exports = { signUp,login,googleLogin };
