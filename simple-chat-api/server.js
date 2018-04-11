// Include Express module
const express = require('express')

// Create an instance of Express
const app = express()

// Handle JSON requests
app.use(express.json())

// Serve static files from public folder
app.use(express.static('public'))

const Sequelize = require('sequelize') // $ npm install sequelize
const sequelize = new Sequelize('sqlite:./data/database.sqlite', {
  logging: console.log
})

const ChatMessages =
sequelize.define('chatmessages', {
  id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
  author: Sequelize.STRING,
  message: Sequelize.TEXT
})

sequelize.sync()

// Simple in-memory storage
// Note: Will be lost when script is terminated
let messages = []

// GET /api/messages endpoint
// Returns all messages
app.get('/api/messages', (req, res) => {
    // Return a JSON response to the GET request
    var messagesResult;
    ChatMessages.findAll().then(messagesResult => {
      console.log(messagesResult);
      res.json(messagesResult);
  // projects will be an array of all Project instances
})

})

// GET /api/messages/:id endpoint
// Returns a specific message
app.get('/api/messages/:id', (req, res) => {
    // Find first message that matches the ID from the route
    // Documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    //let message = messages.find(m => m.id == req.params.id)
    var message;
    ChatMessages.findById(req.params.id).then(message => {
      // If a message is found, display it
      // Otherwise return a 404 with a not found message
      if (message) {
          res.json(message)
      } else {
          res.status(404).json({
              message: 'Message not found!'
          })
      }
    })

})

// POST /api/messages endpoint
// Creates a new message
app.post('/api/messages', (req, res) => {
    // Simple validation for text property
    if (!req.body.text) {
        // "return" ends the script here
        // with the JSON response
        return res.json({
            message: 'Missing text data'
        })
    }

    ChatMessages.sync().then(() => {
      // Table created
      return ChatMessages.create({
        author: req.body.author,
        message: req.body.text
      });
    });

    // Return a status 201 (created) response
    res.status(201).json({
        status: 'OK'
    })
})

// PUT /api/messages/:id endpoint
// Updates a message
app.put('/api/messages/:id', (req, res) => {
    console.log("Was called");


    const newData = {
      message: req.body.text
    };

    ChatMessages.update(newData, {where: { id: req.params.id } })
    .then(updatedMessage => {
      console.log(updatedMessage)
    })
})

// DELETE /api/messages/:id
// Deletes a message from the array
app.delete('/api/messages/:id', (req, res) => {
    // Keep all messages except the one specified
    // in the route parameter
    messages = messages.filter(m => m != req.params.id)

    ChatMessages.destroy({
  where: {
    id: req.params.id
  }
});

    res.json({
        message: 'OK'
    })
})

// Start the server on port 3000
// Access API through: http://localhost:3000 or http://127.0.0.1:3000
app.listen(3000, () => {
    console.log('Server is running')
})
