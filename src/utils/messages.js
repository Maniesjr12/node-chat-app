
const generateMessage = (text, username)=>{
    return {
        
        text,
        username,
        createdAT: new Date().getTime()
    }
}


const getLocation = (username,currentLocation)=>{
    return {
        username,
        currentLocation,
        createdAT: new Date().getTime()
    }
}


module.exports = {
    
    generateMessage,
    getLocation
    
} 