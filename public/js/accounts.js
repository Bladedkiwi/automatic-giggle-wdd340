'use strict';


let accountList = document.querySelector('#account_type_base_options');
accountList.addEventListener('change', function () {
    let account_type = accountList.value;
    // console.log(`classification_id is: ${classification_id}`);
    let typeURL = `/acc/get-acc/${account_type}`;
    fetch(typeURL).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw Error("Network response was not OK");
    }).then(data => {
        console.log(data);
        buildAccountList(data);
    }).catch(error => {
        console.log(`There was a problem: ${error}`);
    })
})

let chosenAccountType = document.querySelector('#accountListDisplay');
chosenAccountType.addEventListener('change', function (event) {
    event.preventDefault();
    event = event.target;
    if (event.matches('select[data-id]')) {
        const account_id = event.dataset.id;
        const account_type = event.value;

        console.log(`CHOSEN VALUE AND ID: ${account_id}, ${account_type}`);

        //Post the Data
        let typeURL = `/acc/edit-type/${account_type}/${account_id}`;
        fetch(typeURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },}).then(response => {
            if (!response.ok) {
                throw Error("Network response was not OK")
            }
            return response.json()
        }).then(data => {
            if (data.success) {
                let statusMessage = document.querySelector(`#status-success-${account_id}`);
                    statusMessage.classList.remove('d-none');
                    statusMessage.classList.add('notice--success');
                    statusMessage.classList.add('d-block');
                    setTimeout(() => {
                        statusMessage.classList.add('d-none');
                        statusMessage.classList.remove('notice--success','d-block');
                    }, 4000)


            } else {
                let statusMessage = document.querySelector(`#status-success-${account_id}`);
                statusMessage.classList.remove('d-none');
                statusMessage.classList.add('notice--fail');
                statusMessage.classList.add('d-block');
                setTimeout(() => {
                    statusMessage.classList.add('d-none');
                    statusMessage.classList.remove('notice--fail', 'd-block');
                }, 4000)
            }

        }).catch(error => {
            console.log(`There was a problem: ${error}`);
        })
    }
})

function buildAccountList(data) {
    let accountDisplay = document.querySelector('#accountListDisplay');

    //Table Head
    let dataTable = `<thead class="car__review--title">`;
    if (Object.keys(data).length === 0) {
        dataTable += '<tr><th>No Accounts with this access.</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
        dataTable += `</thead>`;
    } else {
        dataTable += '<tr><th class="account__th--pad">Account Name</th><th>Email</th><td>&nbsp;</td></tr>';
        dataTable += `</thead>`;

        // Start Table Body
        dataTable += `<tbody class="">`;
        let accountTypes = ['client','employee','admin'];
        accountTypes = accountTypes.filter((value) => (value !== data[0].account_type));

        //Loop over the vehicle data
        data.forEach(account => {
            console.log(`${account.account_firstname} ${account.account_lastname}`);
            dataTable += `<tr><td>${account.account_firstname} ${account.account_lastname}</td>`;
            dataTable += `<td>${account.account_email}</td>`;
            dataTable += `<td><label for="account_type_${account.account_id}"></label>`;
            dataTable += `<i id="status-success-${account.account_id}" class="glyphicon glyphicon-ok d-none" style="color:white"></i><select data-id="${account.account_id}" name="account_type_${account.account_id}">`;
            dataTable += `<option value="${account.account_type}" selected>${account.account_type}</option>`;
            dataTable += `<option value="${accountTypes[0]}" >${accountTypes[0]}</option>`;
            dataTable += `<option value="${accountTypes[1]}" >${accountTypes[1]}</option>`;

            dataTable += `</select>`
        dataTable+=`</td>`
           dataTable += `</tr>`;
        })

        //End of Table body
        dataTable += `</tbody>`;
    }

    //Display Table
    accountDisplay.innerHTML = dataTable;


}