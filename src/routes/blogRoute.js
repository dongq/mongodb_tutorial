const { Router } = require('express');
const blogRouter = Router();
const { Blog, User } = require('../models')
const mongoose = require('mongoose');
const { isValidObjectId} = require('mongoose')

blogRouter.post('/', async (req,res) => {
    try{
        const { title, content, islive, userId } = req.body;
        if(typeof title !== 'string') return res.status(400).send({err: "title is required"})
        if(typeof content !== 'string') return res.status(400).send({err: "content is required"})
        if(islive && typeof islive !== 'boolean') return res.status(400).send({err: "islive should be a boolean"})
        if(!isValidObjectId(userId)) return res.status(400).send({err: "userId is invalid"})
        let user = await User.findById(userId);
        if(!user) return res.status(400).send({err: "user doesn't exist"})

        let blog = new Blog({ ...req.body, user })
        await blog.save();
        return res.send({blog});
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message})
    }
});

blogRouter.get('/', async (req,res) => {
    try{
        let page = req.query;
        console.log(page);
        page = parseInt(page);
        const lists_per_page = 3;
        //const blogs = await Blog.find({}).limit(20).populate([{path: "user"}, {path: "comments", populate: {path: "user"}}]);
        const blogs = await Blog.find({}).sort().skip(page*lists_per_page).limit(lists_per_page);
        return res.send({blogs});
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message})
    }
});

blogRouter.get('/:blogId', async (req,res) => {
    try{
        const { blogId } = req.params;
        if(!isValidObjectId(blogId)) res.status(400).send({err: "blogId is invalid"})

        const blog = await Blog.findOne({_id: blogId});
        //const commentCount = await Blog.find({ blog: blogId}).countDocuments();
        
        return res.send({blog})
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message})
    }
});

blogRouter.put('/:blogId', async (req,res) => {
    try{
        const { blogId } = req.params;
        if(!isValidObjectId(blogId)) res.status(400).send({err: "blogId is invalid"})

        const { title, content } = req.body;
        if(typeof title !== 'string') res.status(400).send({err: "title is required"})
        if(typeof content !== 'string') res.status(400).send({err: "content is required"})
        
        const blog = await Blog.findOneAndUpdate({_id: blogId}, {title, content}, {new: true})
        return res.send({blog})
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message})
    }
});


// patch : 부분수정, put하고 비슷
blogRouter.patch('/:blogId/live', async (req,res) => {  
    try{
        const { blogId } = req.params;
        if(!isValidObjectId(blogId)) res.status(400).send({err: "blogId is invalid"})

        const { islive } = req.body;
        if(typeof islive !== 'boolean') res.status(400).send({err: "islive must be a boolean"})
        const blog = await Blog.findByIdAndUpdate(blogId, { islive }, {new:true});
        return res.send({blog})
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message})
    }
});


module.exports = {
    blogRouter
}