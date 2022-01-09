var socket = io();

const messageInputField = document.querySelector('#messageInputField');
const messageForm = document.querySelector('#messageForm');
const getLocation = document.querySelector('#get-location');
const sendMessageBtn = document.querySelector('#sendMessageBtn');
const messages = document.querySelector('#messages');
const locationUrl = document.querySelector('#url')
const sideBar = document.querySelector('#sidebar');

//  templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const userLocation = document.querySelector('#userLocation-template').innerHTML;
const usersList = document.querySelector('#usersList-template').innerHTML;

// query string 

   const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})


const autoscroll = ()=>{
     // New message element
     const newMessage = messages.lastElementChild

     // Height of the new message
     const newMessageStyles = getComputedStyle(newMessage)
     const newMessageMargin = parseInt(newMessageStyles.marginBottom)
     const newMessageHeight = newMessage.offsetHeight + newMessageMargin
 
     // Visible height
     const visibleHeight = messages.offsetHeight
 
     // Height of messages container
     const containerHeight = messages.scrollHeight
 
     // How far have I scrolled?
     const scrollOffset = messages.scrollTop + visibleHeight

     console.log('message margin',newMessageMargin)
     console.log('newmessage height',newMessageHeight)
     console.log('visible Height', visibleHeight)
     console.log('scrollOffset', scrollOffset)
     console.log('containerHeight', scrollOffset )

    const containMessage = containerHeight - newMessageHeight;

    console.log('containMessage', containMessage)
     if (containMessage <= scrollOffset) {

        messages.scrollTop = messages.scrollHeight

     }
     
}




messageForm.addEventListener('submit', (e)=>{
        e.preventDefault()
        sendMessageBtn.setAttribute('disabled', 'disabled')
        socket.emit('sentMessage', messageInputField.value, (error)=>{
            messageInputField.value = '';
            sendMessageBtn.removeAttribute('disabled')
            messageInputField.focus()

            if(error){
    
                return console.log( error)
            }
            console.log('message Delivered ')
    
        })

        
    })

    // room 
    socket.emit('joinRoom', {username, room}, (error)=>{
       if(error){
        alert(error)
        location.href = '/'   
       }
        
    } )

    socket.on('roomData', ({room, users})=>{
        console.log(users)
        const html = Mustache.render(usersList, {
            room,
            users
        })
        document.querySelector('#sidebar').innerHTML = html
    })

    socket.on('message',(message)=>{
        const html = Mustache.render(messageTemplate,{
            username: message.username,
            message: message.text,
            createdAt:moment(message.createdAT).format('h:mm a')
        });
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
        console.log(message)
    })




//  get location

getLocation.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return console.log('cannot get location')
    }
    getLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        const coordinates  = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('userLocation', coordinates, ()=>{
            getLocation.removeAttribute('disabled')
            console.log('location shared')
        })
    })
})

socket.on('sendUserLocation',(userLocationUrl)=>{
    console.log(userLocationUrl)
    const html = Mustache.render(userLocation,{
        url: userLocationUrl.currentLocation,
        createdAt: moment(userLocationUrl.createdAT).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
