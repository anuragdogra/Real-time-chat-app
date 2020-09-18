const express=require("express");
const app= express();

const http=require("http").createServer(app);



const PORT= process.env.PORT || 1150;

app.use(express.static(__dirname+'/public'));


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})
http.listen(PORT,()=>{
    console.log(`server started on ${PORT}`);
})
//socket function
const io= require("socket.io")(http);
let name={};
let userso={};
io.on('connection',(socket)=>{
    console.log('connected');
    socket.on('user join',user =>{
      name[socket.id]=user;
      socket.broadcast.emit('user joined',user);
    })
    socket.on('send_msg',(msg)=>{
       // name[socket.id]=msg.user
       userso[msg.user]=socket.id
        
        if(msg.message.startsWith('@'))
        {
            let revceiver=msg.message.split(' ')[0].substr(1);
            let recsocket=userso[revceiver]
            console.log(recsocket)
            io.to(recsocket).emit('recv_msg',msg)
        }
        else
        {
         socket.broadcast.emit('recv_msg',msg)
         //console.log(name)
        }
    })
    socket.on('disconnect',(msg)=>
    {
        
         console.log("diconnected");
         
         socket.broadcast.emit('left',(name[socket.id]));
        delete name[socket.id];
    })

})
