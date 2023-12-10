
window.onload = function(){
    var receivedTicketsData = JSON.parse(sessionStorage.getItem('ticketsData'));  
    for (let i = 0; i < receivedTicketsData.length; i++) {
       const ticketBox=document.getElementById(i+1);
      if(receivedTicketsData[i].seat_status==0){
        ticketBox.style.backgroundColor = 'green'; 
      }
      else{
        ticketBox.style.backgroundColor = 'red';
      }

          }
    }
 

    // send selected seats to node js server

    const selectedElements = new Set();
    var price=0;
   
    const ticketPricer=document.getElementById('ticketsPrice');



    // Function to toggle element selection
    function toggleElementSelection(element) {
      if (selectedElements.has(element.id)) {
        price=price-10;
        ticketPricer.textContent="Total Amount is : "+price;
        selectedElements.delete(element.id);
        element.classList.remove('selected');
        element.style.backgroundColor="green";
      } else {
        price=price+10;
        selectedElements.add(element.id);
        element.classList.add('selected');
        element.style.backgroundColor="grey";
        ticketPricer.textContent="Total Amount is : "+price;
      }
    }

    // Add event listener to elements for selection
    const elementElements = document.querySelectorAll('.grid-item-tickets');
    elementElements.forEach(element => {
      element.addEventListener('click', () => {
        if(element.style.backgroundColor=='red')
        {
            console.log("element is ignored");
            return;
        }
        toggleElementSelection(element);
      });
    });



    // Send selected element IDs to the server when the "Submit Selection" button is clicked
    document.getElementById('bookTicketButton').addEventListener('click', () => {
      const selectedElementIds = Array.from(selectedElements);
      sessionStorage.setItem('successTickets',selectedElementIds);
      console.log(selectedElementIds);
      if(selectedElementIds.length===0){
         alert("No tickets selected");
         return;
      }

    var receivedTicketsData = JSON.parse(sessionStorage.getItem('ticketsData'));  
     var id_Ticket=receivedTicketsData[1].movie_id-1;
     var location_Id=sessionStorage.getItem('locationId');
     sessionStorage.removeItem('locationId');
      const updateTicketIdElements = new Set();
      for (let i = 0; i < selectedElementIds.length; i++) {
        let num = parseInt(selectedElementIds[i]); 
        let location_IdNumber=parseInt(location_Id);
        let elementId = (location_IdNumber-1)*(4*30)+(30*(id_Ticket%4))+num;
        console.log(elementId);
        updateTicketIdElements.add(elementId);
      }


      const selectedupdateTicketIdElemets = Array.from(updateTicketIdElements);

          selectedElements.clear();
           updateTicketIdElements.clear();
          sessionStorage.removeItem('ticketsData');
          sessionStorage.setItem('finalTickets',JSON.stringify( { selectedupdateTicketIdElemets }));

          var len=selectedupdateTicketIdElemets.length;
          console.log(len);

      fetch('/create-checkout-session', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: len },
        // { id: 2, quantity: 1 },
      ],
    }),
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      // window.location = url
      if(url==='/success')
       {
        window.location.href='/success';
       }
       else{
        window.location.href='/cancel';
       }
    })
    .catch(e => {
      console.error(e.error)
    })
    });
