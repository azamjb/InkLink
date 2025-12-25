
document.addEventListener('DOMContentLoaded', function () { // on initial load...

    let username = localStorage.getItem('username'); // if user is logged in
    if (username) {
        fetch(`/retrievefiles?username=${username}`) // retrieve list of files for user

            .then(response => response.json())
            .then(files => {

                let fileList = document.querySelector('.file-list');
                files.forEach(file => {
                    let fileElement = document.createElement('div'); // creates file div
                    fileElement.textContent = file.filename;
                    fileElement.addEventListener('click', () => loadFileContent(file.filename)); // for each file, retrieve the content for that file
                    fileList.appendChild(fileElement); // add to list of divs
                });
            });
    }

    document.getElementById('deleteNoteButton').addEventListener('click', deleteFileContent);
    document.getElementById('saveNoteButton').addEventListener('click', saveFileContent);
    document.querySelector('.add-file-btn').addEventListener('click', addNewFile);
});


function loadFileContent(filename) { // function to retrieve file content given a filename
    fetch(`/retrievefilecontent?filename=${filename}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                
                document.getElementById('noteInput').value = data[0].file_content;
            } else {
                // Handle case where no content is returned
                document.getElementById('noteInput').value = "No content available.";
            }
            document.getElementById('currentFileName').value = filename;
        })
        .catch(error => {
            console.error('Error loading file content:', error);
        });
}


function saveFileContent() { // function for saving file content to a file

    let filename = document.getElementById('currentFileName').value;
    let fileContent = document.getElementById('noteInput').value;
    let username = localStorage.getItem('username');
    

    fetch('/alterfile', { // altering file in db to add content
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, filename, file_content: fileContent })
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            
            return response.text().then(text => { throw new Error(text) });
        }
    })
    .catch(error => {
        console.error('Error saving file:', error);
    });
}


function addNewFile() { // function for adding new file - for specific user

    let newFilename = prompt("Enter new file name:"); // prompt for filename

    if (newFilename) {

        let username = localStorage.getItem('username');
        let fileContent = "";

        let fileList = document.querySelector('.file-list');
        let fileElement = document.createElement('div');
        fileElement.textContent = newFilename;
        fileElement.addEventListener('click', () => loadFileContent(newFilename));
        fileList.appendChild(fileElement);

        fetch('/addfile', { // making api call, initially file content is blank
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, filename: newFilename, file_content: fileContent })
        });
    }
}


function deleteFileContent() { // function to delete a file

    let filename = document.getElementById('currentFileName').value;
    let username = localStorage.getItem('username');

    if (filename && confirm("Are you sure you want to delete this file?")) {

        fetch('/deletefile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, filename })
        })
        .then(response => {
            if(response.ok) {
                alert("File deleted successfully.");
                removeFileFromList(filename); // remove filename
                document.getElementById('noteInput').value = ''; // Clear the textarea
                document.getElementById('currentFileName').value = ''; // Clear the current filename
            } else {
                alert("Error deleting file.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function removeFileFromList(filename) { // function to remove a filename from a displayed list of files

    let fileList = document.querySelector('.file-list');
    let files = fileList.querySelectorAll('div');
    files.forEach(file => {
        if(file.textContent === filename) {
            fileList.removeChild(file);
        }
    });
}