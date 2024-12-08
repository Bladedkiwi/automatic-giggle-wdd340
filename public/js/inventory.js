'use strict';

//Get List of Items in the Inventory based off of Classifications
let classificationList = document.querySelector('#classification_id');
classificationList.addEventListener('change', function () {
    let classification_id = classificationList.value;
    console.log(`classification_id is: ${classification_id}`);
    let classIdURL = "/inv/get-inv/" + classification_id;
    fetch(classIdURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw Error("Network response was not OK");
    }).then(data => {
        console.log(data);
        buildInventoryList(data);
    }).catch(error => {
        console.log(`There was a problem: ${error}`);
    })
})

function buildInventoryList(data) {
    let inventoryDisplay = document.querySelector('#inventoryDisplay');

    //Table Head
    let dataTable = `<thead class="car__review--title">`;
    if (Object.keys(data).length === 0) {
        dataTable += '<tr><th>No Current Inventory</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
        dataTable += `</thead>`;
    } else {
        dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
        dataTable += `</thead>`;

        // Start Table Body
        dataTable += `<tbody class="car__review--list">`;

        //Loop over the vehicle data
        data.forEach(vehicle => {
            console.log(vehicle.inv_id + ", " + vehicle.inv_model);
            dataTable += `<tr><td>${vehicle.inv_make} ${vehicle.inv_model}</td>`;
            dataTable += `<td><a href='/inv/edit/${vehicle.inv_id}' title='Click to update'>Modify</a></td>`;
            dataTable += `<td><a href='/inv/delete/${vehicle.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
        })

        //End of Table body
        dataTable += `</tbody>`;
    }

    //Display Table
    inventoryDisplay.innerHTML = dataTable;
}