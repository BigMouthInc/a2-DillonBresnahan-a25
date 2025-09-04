// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector( "#yourname" ),
        json = { "yourname": input.value },
        body = JSON.stringify( json )

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  })

  const text = await response.text()

  console.log( "text:", text )

}

window.onload = function() {
    const button = document.querySelector("button");
  button.onclick = submit;
}

async function formTable() {
  const response = await fetch("/appData", {
    method: "GET"
  })
  
  const appdata = await response.json()

  let element = document.getElementById("tableInsert");

  var tableData = "<tr> <th>Model</th><th>Year</th><th>MPG</th> </tr>";

  tableData = tableData + "<tr>"

  for(let i = 0; i < appdata.length; i++){
    tableData = tableData + "<td>" + appdata[i].model + "</td>";
  }

  tableData = tableData + "</tr><tr>" 

  for(let i = 0; i < appdata.length; i++){
    tableData = tableData + "<td>" + appdata[i].year + "</td>";
  }

  tableData = tableData + "</tr><tr>" 

  for(let i = 0; i < appdata.length; i++){
    tableData = tableData + "<td>" + appdata[i].mpg + "</td>";
  }

  tableData = tableData + "</tr>"


  element.innerHTML = tableData;
  }

 