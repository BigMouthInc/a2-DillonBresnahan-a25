const http = require( "http" ),
      fs   = require( "fs" ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000

const appdata = [
  { "Name": "Dillon", "Age": 20, "#OfPets": 1},
  { "Name": "Christina", "Age": 45, "#OfPets": 29 },
  { "Name": "Trip", "Age": 5, "#OfPets": 32} 
]
for (let i = 0; i < appdata.length; i++){
  appdata[i]["Age/PetRatio"] = appdata[i]["Age"] / appdata[i]["#OfPets"];
}

const server = http.createServer( function( request,response ) {
  if( request.method === "GET" ) {
    if (request.url === "/appData"){
    response.writeHead(200, { "Content-Type": "application/json" })
    response.end(JSON.stringify(appdata))
  }
    else
      handleGet( request, response )    
    }
  else if( request.method === "POST" ){
    handlePost( request, response ) 
  }

  else if (request.method === "DELETE"){
    handleDelete(request, response)
  }
  
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === "/" ) {
    sendFile( response, "public/index.html" )
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  if (request.url === "/submit"){
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    
    appdata.push(JSON.parse(dataString));
    appdata[appdata.length - 1]["Age/PetRatio"] = Number(appdata[appdata.length - 1]["Age"]) / Number(appdata[appdata.length - 1]["#OfPets"]);

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end("test")
  })
}
else if (request.url === "/update") {
  let updateData = "";
  request.on("data", function(data){
    updateData += data;
  })
  request.on("end", function(){
  const { index, field, value } = JSON.parse(updateData);
   if (index > appdata.length || index <= 0) {
    response.writeHead(200, "OK", {"Content-Type": "data/updateFail"});
    response.end("test");
  }
  if (field === "Age" || field === "#OfPets") {
    appdata[index - 1][field] = Number(value);
    appdata[index - 1]["Age/PetRatio"] = Number(appdata[index - 1]["Age"]) / Number(appdata[index - 1]["#OfPets"]);
  } else {
    appdata[index - 1][field] = value;
  }
  response.writeHead(200, "OK", {"Content-Type": "data/update"});
  response.end("test");
  })
}
}


const handleDelete = function (request, response) {

  let elementToRemove = 0;
  request.on( "data", function( data ) {
      elementToRemove = data - 1;
  })
  
  request.on( "end", function() {
  if (elementToRemove > appdata.length - 1 || elementToRemove <= 0){
    response.writeHead( 200, "OK", {"Remove": "Failed" })
    response.end("test")
  }
  else {
    appdata.splice(elementToRemove, 1);

    response.writeHead( 200, "OK", {"Remove": "Successful" })
    response.end("test")

  }
})

}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

server.listen( process.env.PORT || port )
