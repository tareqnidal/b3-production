// eslint-disable-next-line import/no-absolute-path
import '/socket.io/socket.io.js'
import main from './main.mjs'

// Define the server URL
const SERVERURL = 'http://localhost:3000'

// Immediately invoke createHome from main
main.createHome(true)

// Socket object to manage socket operations
const Socket = {
  socket: null,

  // Initialize the socket connection
  init: async function () {
    if (this.socket === null) {
      try {
        // eslint-disable-next-line no-undef
        this.socket = io(SERVERURL)
        this.setupEventListeners()
      } catch (error) {
        console.error('Error on connecting to server', error)
      }
    }
    return this.socket
  },

  // Set up event listeners for socket events
  setupEventListeners: function () {
    this.socket.on('connect', () => {
      console.log('Connected to server with id: ' + this.socket.id)
      sessionStorage.setItem('socketId', this.socket.id)
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    this.socket.on('message', this.handleMessage)
  },

  // Handle incoming messages
  handleMessage: function (message) {
    const flashMessage = document.getElementById('flashMessage')
    let messageText = ''

    switch (message.object_kind) {
      case 'issue':
        messageText = `There is a new updates in ${message.project.name} project. at the issue: ${message.object_attributes.title}`
        break
      case 'push':
        messageText = `There is a new project with name ${message.project.name} created`
        break
      case 'note':
        messageText = `There is a new comment in ${message.project.name} project. at the issue: ${message.issue.title}`
        break
      default:
        messageText = 'Unknown message type'
    }

    flashMessage.innerHTML = messageText
    flashMessage.style.display = 'flex'
    setTimeout(() => {
      flashMessage.style.display = 'none'
    }, 12000)
  }
}

// Initialize socket and export it
const socket = await Socket.init()
export default socket
