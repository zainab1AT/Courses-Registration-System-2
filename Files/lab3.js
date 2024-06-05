document.addEventListener('DOMContentLoaded', function() {
    displayTableContent(); // Call the function to display the table content when the page loads

    // Ensure that the event listener is only added once
    const addButton = document.getElementById("add-DB-button");
    if (!addButton.dataset.listenerAdded) {
        addButton.addEventListener("click", addtodatabase);
        addButton.dataset.listenerAdded = true;
    }
});

const displayTableContent = async () => {
    let divoftable = document.querySelector("#table");
    let table = divoftable.querySelector('table');

    // If a table does not exist, create a new one
    if (!table) {
        table = document.createElement('table');
        divoftable.appendChild(table);

        let tr = document.createElement('tr');
        let thcname = document.createElement('th');
        let thconfirmed = document.createElement('th');
        thcname.innerHTML = "Course Name";
        thconfirmed.innerHTML = "State";

        tr.appendChild(thcname);
        tr.appendChild(thconfirmed);
        table.appendChild(tr);
    }

    const res = await fetch("Fetch.php", {
        method: "GET"
    });

    const output = await res.json();

    // Clear the existing rows except for the header row
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    output.forEach(item => {
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2); // For buttons
        let cell4 = row.insertCell(3); // For buttons
        let cell5 = row.insertCell(4); // For buttons

        cell1.innerText = item.text;
        cell2.innerText = item.confirmed === '1' ? 'Confirmed' : 'Not Confirmed';

        if (item.confirmed === '0') {
            let editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.addEventListener('click', () => update(item.text));
            cell3.appendChild(editButton);

            let confirmButton = document.createElement('button');
            confirmButton.innerText = 'Confirm';
            confirmButton.addEventListener('click', () => confirm(item.text));
            cell4.appendChild(confirmButton);

            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => deleterow(item.text));
            cell5.appendChild(deleteButton);
        } else {
            cell3.innerText = ''; // Empty cell for confirmed courses
            cell4.innerText = ''; // Empty cell for confirmed courses
            cell5.innerText = ''; // Empty cell for confirmed courses
        }
    });
}

async function addNewCourse(cname) {
    // Add course to table
    const table = document.querySelector('#table table');
    const newRow = table.insertRow(-1);

    if (cname.trim() !== '') {
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);

        cell1.innerText = cname;
        cell2.innerText = 'Not Confirmed';

        // Edit button
        let editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', () => update(cname));
        cell3.appendChild(editButton);

        // Confirm button
        let confirmButton = document.createElement('button');
        confirmButton.innerText = 'Confirm';
        confirmButton.addEventListener('click', () => confirm(cname));
        cell4.appendChild(confirmButton);

        // Delete button
        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => deleterow(cname));
        cell5.appendChild(deleteButton);
    }
}

async function addtodatabase() {
    // Fetch the table content
    const tableRows = document.querySelectorAll('#table table tr');

    // Create an array to hold all course data
    const courses = [];

    // Iterate over each row in the table, starting from index 1 (skipping the header row)
    for (let i = 1; i < tableRows.length; i++) {
        const row = tableRows[i];
        const cells = row.querySelectorAll('td');
        let courseName = '';
        let isConfirmed = 0;

        if (cells[0]) {
            courseName = cells[0].innerText;
        }

        if (cells[1]) {
            isConfirmed = cells[1].innerText === 'Confirmed' ? 1 : 0;
        }

        courses.push({ cname: courseName, isConfirmed: isConfirmed });
    }

    // Send all course data to the server
    const response = await fetch('lab3.php', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courses)
    });

    // Handle the response
    const responseText = await response.text();
    console.log(responseText); // You can log the response for debugging purposes

    // Refresh the table content after adding to the database
    displayTableContent();
}

const deleterow = async (item) => {
    await fetch("deleteCourse.php", {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Refresh the table content after deleting a row
    displayTableContent();
}

const update = async (item) => {
    const newCourseNamee = window.prompt('Enter the new course name:');
    await fetch("updateCourse.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseName: item, newCourseName: newCourseNamee })
    });

    // Refresh the table content after updating a row
    displayTableContent();
}

const confirm = async (item) => {
    await fetch("confirmCourse.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
    });

    // Refresh the table content after confirming a row
    displayTableContent();
}
