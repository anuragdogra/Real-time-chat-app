const socket =io(location.href)

var tone=new Audio('tri-tone.mp3')

  
$(function(){
    let logbtn=$("#lgbtn")
    let login_sec=$(".login_sec")
    let chat_section=$(".chat_section")
    let login_box=$("#logbox")
    let text_area=$("#textarea")
    let sendbtn=$("#sendbtn");
   let user=''
   let text=text_area.val()

   
   logbtn.click(function(){

    user=login_box.val()
    if(user == "")
    {
        alert("Please enter your name");
    }
    else{
    chat_section.show()
    text_area.show()
    sendbtn.show()
    login_sec.hide()
    socket.emit('user join',user);
    socket.on('user joined',user =>{
        let maindiv=document.createElement('div');
        maindiv.classList.add('recieved','left_chat');
        maindiv.innerHTML=`
       <h4>${user} </h4>
       <p>---joined the chat</p>`
       document.querySelector('.chat_section').appendChild(maindiv)

    })}

})

   sendbtn.click(function(){
       send_message(text_area.val())

    socket.emit('send_msg',{
        user:user,
        message:text_area.val()
    })
    text_area.val('');
    
})
    
    function send_message(message)
    {
        let msg={
            user:user,
            message:message
        
        }

        outputMessage(msg,'sending');
        
       
        
    }
    
    function outputMessage(msg,type){
       let maindiv=document.createElement('div')
       let classtype=type
       maindiv.classList.add(classtype,'message')
       maindiv.innerHTML=`
       <h4>${msg.user} </h4>
       <p>${msg.message}</p>`
       document.querySelector('.chat_section').appendChild(maindiv)
       if(classtype === 'recieved')
       {
           tone.play();
       }
       
    }
    socket.on('left',(user)=>{
        
        let maindiv=document.createElement('div')
       
       maindiv.classList.add('recieved','left_chat')
       maindiv.innerHTML=`
       <h4>${user} </h4>
       <p>---left the chat</p>`
       document.querySelector('.chat_section').appendChild(maindiv)
        
    })
    

    socket.on('recv_msg',(msg)=>{
         outputMessage(msg,'recieved')
    })
    
})