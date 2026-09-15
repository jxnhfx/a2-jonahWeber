const http = require('http'),
      fs   = require('fs'),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // On Render, make sure `npm install` is your build command.
      mime = require('mime'),
      dir  = 'public/',
      port = 3000

let nextID = 4
const todos = []

const PRIORITY_DAYS = {
  high: 1,
  medium: 3,
  low: 7
}

const addTodo = function (incoming) {
  const task = String(incoming.task || '').trim(),
    priority = ['high', 'medium', 'low'].includes(incoming.priority) ? incoming.priority: 'medium',
      created = new Date().toISOString()
    const windowDays = PRIORITY_DAYS[priority]
    const deadline = new Date(Date.parse(created) + windowDays * 24 * 60 * 60 * 1000).toISOString()
    const todo = {id: nextID++, task, priority, created, deadline}
    todos.push(todo)
    return todo
}

const deleteTodo = function(id){
  const index = todos.findIndex(t => t.id === id)
  if(index === -1) return false
  todos.splice(index,1)
  return true
}

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }else if (request.method === 'DELETE'){
    handleDelete(request, response)
  } else{
    respond/writeHead(405)
    response.end('Method not Allowed')
  }
})

const handleGet = function( request, response ) {
  

  if(request.url === '/api/todos'){
    return sendJSON(response, 200, todos)
  }
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {

   if( request.url !== '/api/todos' ) {
    response.writeHead( 404 )
    return response.end( '404 Error: Not Found' )
  }

  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    let incoming
    try{
      incoming = JSON.parse(dataString)
    }catch(err){
      response.writeHead( 400, { 'Content-Type': 'application/json' })
      return response.end( JSON.stringify({ error: 'Invalid JSON' }) )
    }
    
    if( !incoming.task || !String( incoming.task ).trim() ) {
      response.writeHead( 400, { 'Content-Type': 'application/json' })
      return response.end( JSON.stringify({ error: 'task is required' }) )
    }

    addTodo(incoming)
    sendJSON(response, 200, todos)
  })
}

const handleDelete = function( request, response ) {
  // expects DELETE /api/todos/<id>
  const match = request.url.match( /^\/api\/todos\/(\d+)$/ )
 
  if( !match ) {
    response.writeHead( 404 )
    return response.end( '404 Error: Not Found' )
  }
 
  const id = parseInt( match[ 1 ], 10 )
  deleteTodo( id )
 
  sendJSON( response, 200, todos )
}
 
const sendJSON = function( response, statusCode, data ) {
  response.writeHead( statusCode, { 'Content-Type': 'application/json' })
  response.end( JSON.stringify( data ) )
}
 
const sendFile = function( response, filename ) {
  const type = mime.getType( filename )
 
  fs.readFile( filename, function( err, content ) {
 
    if( err === null ) {
 
      response.writeHeader( 200, { 'Content-Type': type })
      response.end( content )
 
    }else{
 
      // file not found, error code 404
      response.writeHeader( 404 )
      response.end( '404 Error: File Not Found' )
 
    }
  })
}
 
server.listen( process.env.PORT || port )
console.log( 'listening on port', process.env.PORT || port )