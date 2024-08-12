const express = require ('express');
const app = express();
const path= require ('path')
const userRoute= require ('./routes/user')
const cookieParser = require ('cookie-parser')
const mongoose = require ('mongoose');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const PORT= 8000;
const blogRoute= require ('./routes/blog')
const Blog = require ('./models/blog')


// mongoose.connect('mongodb://127.0.0.1:27017/blog').then((e)=>console.log("Mongodb connected"))
mongoose.connect('mongodb://127.0.0.1:27017/blog')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));


//views
app.set("view engine",'ejs');
app.set('views',path.resolve('./views'))


//middleware
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))


//routes
app.use('/user',userRoute)
app.use('/blog',blogRoute)


app.get("/",async(req,res)=>{
    const allBlogs= await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs: allBlogs,
    })
})




app.listen(PORT,()=>{
    console.log(`Server started at PORT ${ PORT}`)
})
