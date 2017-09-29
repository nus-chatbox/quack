## Setting up JWT authorization
------
```
let headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Authorization", `bearer ${jwtToken}`);
```

## Setting up Sockets
------
### Initial Setup
```
// Any other namespace that is reachable by your components works too
window.apiSocket = io.connect(window.apiUrl);

apiSocket.on('message', function(message) {
  // Do something
  // Example message output
  {
    "userId": 7,
    "attachmentType": "text",
    "text": "something else2",
    "roomId": 1,
    "id": 4
  }
});
```

## Users API
------
### Patching the user (and refreshing JWT)
```
// Requires JWT authentication
let body = {
  latitude: latitude,
  longitude: longitude
};

let fetchOptions = {
  method: "PATCH",
  headers: headers,
  body: body
};

fetch(`${apiUrl}/users`, fetchOptions).then((response) => {
  // Example response
  {
    "jwtToken": "..."
  }
});
```

## Rooms API
------
### Connecting to some rooms
```
apiSocket.emit('subscribe', [...roomIds]);
```

### Disconnecting from some rooms
```
apiSocket.emit('unsubscribe', [...roomIds]);
```

### Get existing rooms
```
// Requires JWT authentication
let fetchOptions = {
  method: "GET",
  headers: headers
};

fetch(`${apiUrl}/rooms`, fetchOptions).then((response) => {
  // Example response
  {  
  "rooms":[  
    {  
      "id":8,
      "ownerId":1,
      "title":"With Ryan",
      "photoUrl":null,
      "latitude":"1.281315",
      "longitude":"103.830404",
      "created_at":"2017-09-28T13:31:15.000Z",
      "updated_at":"2017-09-28T13:31:15.000Z",
      "distance":3.182811169246599,
      "messages":[  
        {  
          "id":124,
          "userId":1,
          "roomId":8,
          "attachmentUrl":null,
          "attachmentType":"text",
          "text":"Ahem",
          "created_at":"2017-09-28T17:58:20.000Z",
          "updated_at":"2017-09-28T17:58:20.000Z",
          "owner":{  
            "id":1,
            "displayName":"Curtis Tan",
            "latitude":"1.281287",
            "longitude":"103.830398"
          }
        }
      ]
    }
  }
});
```

### Create a new room
```
// Requires JWT authentication
let body = {
  title: "My first room"
};

let fetchOptions = {
  method: "POST",
  headers: headers,
  body: body
};

fetch(`${apiUrl}/rooms`, fetchOptions).then((response) => {
  // Example response
  {
    "status": "success",
    "room": {
        "ownerId": 7,
        "title": "My Second Room!",
        "latitude": 123.15,
        "longitude": 0,
        "id": 4
    }
  }
});
```

### Get information about a single room
```
// Public API
let fetchOptions = {
  method: "GET",
  headers: headers
};

fetch(`${apiUrl}/rooms/${roomId}`, fetchOptions).then((response) => {
  // Example response
  {
    "rooms": [
      {
        "id": 5,
        "ownerId": 7,
        "title": "My first room",
        "photoUrl": null,
        "latitude": "1.281250",
        "longitude": "103.830381",
        "created_at": "2017-09-27T12:15:59.000Z",
        "updated_at": "2017-09-27T12:15:59.000Z"
      }
  ]
}
});
```

## Messages API
------


### Get all messages from a room
```
// Requires JWT authentication
let fetchOptions = {
  method: "GET",
  headers: headers
};

fetch(`${apiUrl}/rooms/${roomId}/messages`, fetchOptions).then((response) => {
  // Example response
  {
    "messages": [
      {
        "id": 6,
        "userId": 7,
        "roomId": 5,
        "attachmentUrl": null,
        "attachmentType": "text",
        "text": "Test message",
        "created_at": "2017-09-27T12:53:00.000Z",
        "updated_at": "2017-09-27T12:53:00.000Z",
        "owner": {
          "id": 7,
          "displayName": "CT Niw",
          "latitude": "123.015000",
          "longitude": "0.003900"
        }
      },
      {
        "id": 7,
        "userId": 7,
        "roomId": 5,
        "attachmentUrl": null,
        "attachmentType": "text",
        "text": "Test message",
        "created_at": "2017-09-27T12:55:22.000Z",
        "updated_at": "2017-09-27T12:55:22.000Z",
        "owner": {
          "id": 7,
          "displayName": "CT Niw",
          "latitude": "123.015000",
          "longitude": "0.003900"
        }
      }
    ]
  }
});
```

### Create a new message for a room

```
// Requires JWT authentication
let body = {
  text: "something"
};

let fetchOptions = {
  method: "POST",
  headers: headers,
  body: body
};

fetch(`${apiUrl}/rooms/${roomId}/messages`, fetchOptions).then((response) => {
  // Example response
  {
    "status": "success",
    "message": {
      "userId": 7,
      "attachmentType": "text",
      "text": "something else2",
      "roomId": 1,
      "id": 5
    }
  }
});
```
