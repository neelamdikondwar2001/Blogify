
const { Router } = require('express');
const router = Router();
const User = require('../models/user');

router.get('/signin', (req, res) => {
  return res.render('signin');
});

router.get('/signup', (req, res) => {
  return res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const user = await User.create({
      fullName,
      email,
      password,
    });
    console.log('User created:', user);
    return res.redirect('/');
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).send('Internal Server Error');
  }
})


router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token= await User.matchPasswordAndGenerateToken(email, password);
  
    return res.cookie('token',token).redirect('/')
  } catch (error) {
    return res.render('signin',{
      error:"Incorrect Email Or Password"
    })
  }
});

router.get('/logout',async(req,res)=>{
res.clearCookie("token").redirect("/")
})




module.exports = router;
