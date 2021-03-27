const { Router } = require('express');

// blog와 부모자식 관계일 경우 mergeParams:true를 세팅해주자.
const commentRouter = Router({ mergeParams: true });  
const { Comment, Blog, User } = require('../models')
const mongoose = require('mongoose');
const { isValidObjectId, startSession } = require('mongoose')

/*
  /user  -- 독립적으로 호출
  /blog  -- 독립적으로 호출
  /comment  -- 특정블로그의 후기(하위개념)
   => /blog/:blogId/comment 로 하는게 바람직
*/


commentRouter.post('/', async (req,res) => {
    //const session = await startSession();
    let comment;

    try{
        //await session.withTransaction(async () => {
            const { blogId } = req.params;
            const { content, userId } = req.body

            if(!isValidObjectId(blogId)) res.status(400).send({err: "blogId is invalid"})
            if(!isValidObjectId(userId)) res.status(400).send({err: "userId is invalid"})
            if(typeof content !== 'string') res.status(400).send({err: "content is required"})

            const [blog, user]= await Promise.all([
                Blog.findById(blogId, {}, {}),
                User.findById(userId, {}, {})
            ])
            // const blog = await Blog.findByIdAndUpdate(blogId);
            // const user = await User.findByIdAndUpdate(userId);

            if(!blog || !user) return res.status(400).send({err: "blog or user does not exist"})

            if(!blog.islive) return res.status(400).send({err: "blog is not available"})
            comment = new Comment({ 
                content, 
                user, 
                userFullName: `${user.name.first} ${user.name.last}`, 
                blog: blogId
            })
            
            //await session.abortTransaction()  // 트랜잭션 취소

            //await comment.save();
            //await Blog.updateOne({ _id: blogId }, { $push: { comments: comment } });

            // await Promise.all([
            //     comment.save(),
            //     Blog.updateOne({ _id: blogId }, { $push: { comments: comment } })
            // ]);

            // blog.commentsCount++;
            // blog.comments.push(comment);
            // if(blog.commentsCount > 3) blog.comments.shift();

            // await Promise.all([
            //     comment.save({}),
            //     blog.save()
            //     //Blog.updateOne({_id: blogId}, {$inc: {commentsCount: 1}})
            // ]);

            await Promise.all([
                comment.save(),
                Blog.updateOne(
                    {_id: blogId}, 
                    {
                        $inc: {commentsCount: 1}, 
                        $push: {comments: {$each: [comment], $slice: -3 }}
                    }
                )

            ])
        //});
        return res.send({comment});
        
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message})
    } 
     finally {
         //await session.endSession();
     }
});

commentRouter.get('/', async (req,res) => {
    try{
        let { page=0 } = req.query;
        page = parseInt(page);
        console.log(page)

        const { blogId } = req.params;
        if(!isValidObjectId(blogId)) res.status(400).send({err: "blogId is invalid"})

        const comments = await Comment.find({ blog: blogId }).sort({createdAt: -1}).skip(page*3).limit(3);
        return res.send({comments});
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message})
    }
});

commentRouter.patch('/:commentId', async (req,res) => {
    const {commentId} = req.params;
    const {content} = req.body;

    if(typeof content !== 'string') return res.status(400).send({err: "content is required"});

    const [ comment ] = await Promise.all([
        Comment.findOneAndUpdate({ _id: commentId}, { content }, {new: true}),
        Blog.updateOne({ 'comments._id': commentId }, { "comments.$.content": content })
    ])
    return res.send({comment})
});


commentRouter.delete("/:commentId", async (req, res) => {
    const {commentId} = req.params;
    const comment = await Comment.findOneAndDelete({_id: commentId});

    await Blog.updateOne({ "comments._id": commentId}, {$pull: { comments: { _id: commentId }}})    
    // array에서 두개이상을 and 조건으로 연결시에는 $elemMatch 연산자를 쓰자.
//    await Blog.updateOne({ "comments._id": commentId}, {$pull: { comments: { $elemMatch: {_id: commentId, state: "deleted"} }}})    

    return res.send({comment});
})




module.exports = {
    commentRouter
}