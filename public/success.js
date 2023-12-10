
var loc;
var mov;
var tick;

window.onload = function() {
    
   // Send selectedElementIds to the server using AJAX 
     var selectedupdateTicketIdElements=JSON.parse(sessionStorage.getItem('finalTickets'));
     
     console.log(selectedupdateTicketIdElements);
      fetch('/submitTicketElements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedupdateTicketIdElements }),
      })
      .then(response => {
        if (response.ok) {
          console.log('Seats Element IDs submitted successfully.');
        } else {
          console.error('Failed to submit seats element IDs.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

      
    //   const selectedIdsArray = selectedupdateTicketIdElements.selectedupdateTicketIdElemets;
      
      const container = document.querySelector('.grid-container');
    var locationP1= document.createElement('p');
    var movieP1=document.createElement('p');
    var seatsP1=document.createElement('p');
    loc=sessionStorage.getItem('successLocation');
    locationP1.textContent = 'your Location is : '+ loc;
    mov=sessionStorage.getItem('successMovie');
     tick=sessionStorage.getItem('successTickets');
    movieP1.textContent = 'your Movie is : '+ mov;
    seatsP1.textContent = 'your seats are : '+ tick;
    container.appendChild(locationP1);
    container.appendChild(movieP1);
    container.appendChild(seatsP1);
    var myButton = document.createElement("button");
              myButton.id = "downloadPdf";
              myButton.innerHTML = "Download Ticket Details";

      container.append(myButton);
      myButton.addEventListener('click', generatePDf);
      sessionStorage.removeItem('finalTickets');
      sessionStorage.removeItem('successMovie');
      sessionStorage.removeItem('successLocation');
      sessionStorage.removeItem('successTickets');

  };



  function generatePDf(){

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFillColor(200, 220, 255); // RGB values for a light blue color
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F'); // 'F' stands for 'fill'
    //doc.text("Hello world!", 100, 100);

    var locText="Your Location is :"+loc;
    var movText="Your Movie is : "+mov;
    var tickText="Your Seat numbers  are : "+tick;
    doc.setFont("helvetica", "bold");

      doc.text("Your Purchase Details",90,30);
      doc.setFont("helvetica", "normal");
    doc.text(locText, 40, 50);
    doc.text(movText, 40, 70);
     doc.text(tickText, 40, 90);
    doc.save("ticket.pdf");			 
    }
  