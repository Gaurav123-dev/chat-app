const http=require('http');
const express =require('express');
const fs=require('fs');
const cors= require('cors');
const port= process.env.PORT || 8080;
const app= express();
app.use(express.json({limit:'10mb'}));
const server=http.createServer(function(req,res){
 fs.readFile('index.html',function(error,data){
    if(error){
        res.writeHead(404);
        res.write('ERROR:File not found!');
    }
    else{
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(data);
    }
    res.end();
 })
})

server.listen(port,function(error){
if(error){
    console.log('Somthing went wrong! ', error);
}else{
    console.log('Listening to port:'+port);
}
});

const {Server}= require('socket.io');
const io=new Server(server,{
    cors:{
    origin:"https://chat-app-gaurav.onrender.com",
    methods:["GET","POST"],
    },
});

io.on("connection",(socket)=>{
console.log("user with id: ",socket.id," is connected!");
socket.on("joinroom",(arg1)=>{
const obj= JSON.parse(arg1);
const pack=arg1;
socket.join(obj.room);
socket.to(obj.room).emit("someone",pack);
});
socket.on("sendmessage",(arg1,arg2,callback)=>{
    const obj1= JSON.parse(arg1);
    const obj2= JSON.parse(arg2);
    const pack1=arg1;
    const pack2=arg2;
   if(Object.keys(obj1).length !== 0){
    socket.to(obj1.room).emit("gotmsg",pack1,pack2);
   }else{
    callback({
        status:"Please enter name and room first"
    });
   }
});
socket.on("left",(arg1)=>{
    const obj1= JSON.parse(arg1);
    socket.to(obj1.room).emit("gone",arg1);
});
socket.on("disconnect",(reason)=>{
    console.log("user with id: ",socket.id," is disconnected!");
});
});
