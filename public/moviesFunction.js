window.onload = function(){
    const moviesGrid= document.getElementsByClassName('grid-item-movies');

    const receivedMoviesData = JSON.parse(sessionStorage.getItem('moviesData'));  
    const data = JSON.stringify(receivedMoviesData); 
    console.log(data);

    for (let i = 0; i < moviesGrid.length; i++) {
        moviesGrid[i].style.backgroundColor = 'lightblue'; // Change background color
        moviesGrid[i].textContent= receivedMoviesData[i].movie_name;
        moviesGrid[i].style.fontFamily="Arial, sans-serif";
        moviesGrid[i].style.fontSize="20px";
      }

      sessionStorage.removeItem('moviesData');  
}


const movieButtons = document.querySelectorAll('.grid-container-movies');
const movieButton= movieButtons[0];
movieButton.addEventListener('click', handleMovieButtonClick);


function handleMovieButtonClick(event) {

     // (locid-1)*4 + id
     var location_Id=sessionStorage.getItem('locationId');
     var location_IdNumber=parseInt(location_Id);
    var elementId = event.target.id; 
    var elementId_number=parseInt(elementId);
    var finalElementId=(location_IdNumber-1)*4 + elementId_number;
    sendMovieIDtoServer(finalElementId);

    sessionStorage.setItem('successMovie',event.target.textContent);
  }

  function sendMovieIDtoServer(id) {
    fetch('/handleMovieClick', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ elementId: id }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        sessionStorage.setItem('ticketsData', JSON.stringify(data));
        window.location.href = '/tickets';
      })
    .catch(error => {
      console.error('Error:', error);
    });
}