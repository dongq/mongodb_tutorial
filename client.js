console.log("client code running");
const axios = require('axios');

const URI = "http://localhost:3000"
const test = async () => {
    console.time("loading time: ")
    let { data: {blogs}} = await axios.get(`${URI}/blog`);

    //console.log(blogs[0], {depth:5});


    // 아래 작업은 back-end에서 처리할 예정
    //const response = await axios.get("http://localhost:3000/blog")
    
    // blogs = await Promise.all(
    //     blogs.map(async blog => {
    //         // const res1 = await axios.get(`${URI}/user/${blog.user}`)
    //         // const res2 = await axios.get(`${URI}/blog/${blog._id}/comment`)

    //         const [res1,res2] = await Promise.all([
    //             axios.get(`${URI}/user/${blog.user}`),
    //             axios.get(`${URI}/blog/${blog._id}/comment`)
    //         ]);

    //         blog.user = res1.data.user;
    //         blog.comments = await Promise.all(
    //             res2.data.comments.map(async (comment) => {
    //                 const { data: {user}} = await axios.get(`${URI}/user/${comment.user}`);
    //                 comment.user = user;
    //                 return comment;
    //             })
    //         );
    //         return blog
    // }))
    //console.log(blogs[0])
    //console.dir(blogs[0], {depth:10})    
    console.timeEnd("loading time: ")

}

//test();

const testGroup = async () => {
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();  
}

//testGroup();