const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { userRouter, blogRouter, commentRouter } = require('./routes')
//const { generateFakeData } = require('./faker')
const { generateFakeData0 } = require('./faker2')
const MONGO_URI = 'mongodb+srv://system:manager@cluster0.j3pu5.mongodb.net/BlogService?retryWrites=true&w=majority'

const server = async() => {
    try{
        await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
        mongoose.set('debug', true)
        console.log('Mongodb connected')
        app.use(express.json())
       
        //generateFakeData(100,10,300)
        app.use('/user', userRouter)
        app.use('/blog', blogRouter)
        app.use('/blog/:blogId/comment', commentRouter)

        
        app.listen(3000, async () => {
            console.log("server listening on port 3000")
            //await generateFakeData0(3,10,50)
            //for (let i=0; i<20; i++)
            console.time("loading time: ")
            await generateFakeData0(10,2,10)
            console.timeEnd("loading time: ")


        })    
            
    } catch(err){
        console.log(err);
    }
}

server();