// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input = document.querySelector("#yourname").value,
        fields = input.split(" "),
        json = { model: fields[0], year: fields[1], mpg: fields[2] }
        body = JSON.stringify(json)


  const response = await fetch( "/submit", {
    method:"POST",
    body 
  })

  const text = await response.text()

//  console.log( "text:", text )

formTable();

}

const removeData = async function(event) {
  event.preventDefault();
 
  const input = document.querySelector("#delete").value,
        body = Number(input);

  const response = await fetch( "/remove", {
    method: "DELETE",
    body
  })

  formTable();
}


window.onload = function() {
  formTable()
    const submitButton = document.getElementById("submitButton");
  submitButton.onclick = submit;
    const deleteButton = document.getElementById("deleteButton");
  deleteButton.onclick = removeData;
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
    tableData = tableData + "<td>" + appdata[i].year + "</td>";
    tableData = tableData + "<td>" + appdata[i].mpg + "</td>";
    if (i === appdata.length -1){
      tableData = tableData + "</tr>"
    }
    else{
      tableData = tableData + "</tr><tr>"
    }
  }

  element.innerHTML = tableData;
  }

 