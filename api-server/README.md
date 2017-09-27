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
### Connecting to a room
```
apiSocket.emit('room', roomIdString);
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
    "rooms": [
      {
        "id": 1,
        "ownerId": 7,
        "title": "first room",
        "photoUrl": null,
        "latitude": "123.145000",
        "longitude": "0.000000",
        "created_at": "2017-09-17T17:45:39.000Z",
        "updated_at": "2017-09-17T17:45:39.000Z",
        "distance": 0.5559746297027797
      }
    ]
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

### Get currently subscribed rooms
```
// Requires JWT authentication
let fetchOptions = {
  method: "GET",
  headers: headers
};

fetch(`${apiUrl}/subscriptions`, fetchOptions).then((response) => {
  // Example response
  {
    "rooms": [
      {
        "id": 1,
        "ownerId": 7,
        "title": "first room",
        "photoUrl": null,
        "latitude": "123.145000",
        "longitude": "0.000000",
        "created_at": "2017-09-17T17:45:39.000Z",
        "updated_at": "2017-09-17T17:45:39.000Z",
        "distance": 0.5559746297027797
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
        "id": 1,
        "userId": 7,
        "roomId": 1,
        "attachmentUrl": null,
        "attachmentType": "text",
        "text": "something else",
        "created_at": "2017-09-23T12:03:35.000Z",
        "updated_at": "2017-09-23T12:03:35.000Z"
      },
      {
        "id": 2,
        "userId": 7,
        "roomId": 1,
        "attachmentUrl": null,
        "attachmentType": "text",
        "text": "something else2",
        "created_at": "2017-09-23T12:03:54.000Z",
        "updated_at": "2017-09-23T12:03:54.000Z"
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
