// Fetch data from the server and populate the dropdown
window.onload = function() {
    fetch('/data') // Fetch data from Node.js server
      .then(response => response.json())
      .then(data => {
        const dropdownContent = document.getElementById('dropdownContent');
        let num=1;
        data.forEach(item => {
          const link = document.createElement('p');
        //   link.href = '#';
          link.id=num;
          link.textContent = item.location_name;
          dropdownContent.appendChild(link);
          num++;
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  };


  // Send Location id to server.
const locationButtons = document.querySelectorAll('.dropdown-content');
const locationButton= locationButtons[0];
locationButton.addEventListener('click', handleLocationClick);


function handleLocationClick(event) {
    const elementId = event.target.id; 
    sessionStorage.setItem('locationId', elementId);
    sessionStorage.setItem('successLocation',event.target.textContent);

    sendLocationIDtoServer(elementId);
  }

  function sendLocationIDtoServer(id) {
    fetch('/handleLocationClick', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ elementId: id }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        sessionStorage.setItem('moviesData', JSON.stringify(data));
        window.location.href = '/movies';
      })
    .catch(error => {
      console.error('Error:', error);
    });
}




  