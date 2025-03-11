
const wss = require("../server");


const clients = new Set();
const userclients=new Set();
const postclients=new Set();

wss.on('connection', (ws) => {
    console.log('Client connected');
    console.log('connection from')
    console.log(clients,userclients);
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'SET_LOCATION') {
                // Store user's location
                clients.add( { ws,latitude: data.latitude, longitude: data.longitude });
                console.log(userclients,clients);
            }
            else if (data.type === 'SET_USERID') {
                // Store user's location
                userclients.add( { ws,uid: data.uid});
                console.log('after setting userin websocket')
                console.log(userclients,clients);
            }
            else if (data.type == 'SET_POSTID'){
                postclients.add({ws,pid:data.pid});
                console.log('after setting post websocket')
                console.log(postclients);
            }
            else if (data.type === 'DIS_LOC') {
                console.log('user disconencted');
                // Store user's location
                clients.forEach((client)=>{
                    if (client['ws']==ws) {
                        clients.delete(client);
                    }
                })
            }
            else if (data.type === 'DIS_USER') {
                console.log('user disconected');
                // Store user's location
                userclients.forEach((client)=>{
                    if (client['ws']==ws && client['uid']==data.uid) {
                        userclients.delete(client);
                    }
                })
                userclients.forEach((u)=>console.log(u.uid));
            }
            else if (data.type === 'DIS_POSTID') {
                console.log('user disconected');
                // Store user's location
                postclients.forEach((client)=>{
                    if (client['ws']==ws && client['pid']==data.pid) {
                        postclients.delete(client);
                    }
                })
            }

            
        } catch (error) {
            console.error('Invalid message received:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
      
        //clients.delete(ws);
        console.log(userclients);
        console.log(clients);

    });
});

// Function to check if a user is within 5 km
const isWithin1km = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <1;
};

// Function to broadcast updates only to users within 5 km
const broadcastUpdates = (data) => {
    
    console.log('i am inside all');
   console.log(clients);
    clients.forEach((client) => {
       // console.log(clientLocation
        console.log(data);
        if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify(data));
        }
    });
};

const broadcastuserupdate = (data,uid) => {
    
    //console.log(data,uid)
    userclients.forEach((client) => {
        console.log(client.uid)
        console.log(uid);
        if (client.ws.readyState === WebSocket.OPEN) {
            
            if(client.uid==uid)
            {
                
                console.log('i am from inside user update')
                console.log(data);
                client.ws.send(JSON.stringify(data));
            }  
        }
    });
};


const broadcastpostupdate = (data,pid) => {
    
    //console.log(data,uid)
    postclients.forEach((client) => {
        
        if (client.ws.readyState === WebSocket.OPEN) {
            
            if(client.pid==pid)
            {
                
                console.log('i am from inside Post updatesss')
                console.log(data);
                client.ws.send(JSON.stringify(data));
            }  
        }
    });
};



const broadcastUpdate = (data, latitude, longitude) => {
    //console.log(data);
    console.log('hello i am back',data,latitude)
    console.log(clients);
    clients.forEach((client) => {
       // console.log(clientLocation)
        console.log(client.latitude);
        if (client.ws.readyState === WebSocket.OPEN) {
            if (isWithin1km(latitude, longitude, client.latitude, client.longitude)) {
                console.log('hee')
               client.ws.send(JSON.stringify(data));
            }
        }
    });
};


module.exports={
    broadcastUpdate,
    broadcastUpdates,
    broadcastuserupdate,
    broadcastpostupdate
}