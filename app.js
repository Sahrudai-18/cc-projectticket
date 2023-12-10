
const express = require('express');
const mysql = require('mysql2');
const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.json());

// Create a MySQL connection
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Viratvikky@82',
//     database: 'movieticketbooking'
// });

const connection = mysql.createConnection({
  host: 'movieticketbooking.cwpwexasijnt.us-east-2.rds.amazonaws.com' ,
  user:  'root',
  password: 'Viratvikky82' ,
  database: 'MovieTicketBooking',
  port: '3306'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.use(express.static('public'));
// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


// Fetch Location Data from MySQL and display it in HTML page

app.get('/data', (req, res) => {
    connection.query('SELECT * FROM Locations', (error, results) => {
        if (error) {
            console.error('Error retreiving data from Location table from MySQL:', error);
            return;
        }
        // Send the data as JSON to the client
        res.json(results);
    });
});


app.post('/handleLocationClick', (req, res) => {
    const elementId = req.body.elementId;
    console.log(`Received location element ID '${elementId}' from client.`);
    // Perform actions based on the received element ID

    const query = "SELECT * FROM Movies where location_id = ?";
    connection.query(query, elementId, (error, results) => {
        if (error) {
          console.error('Error retreiving data from Movies table from MySQL:', error);
          return;
        }
    
        console.log('Fetched movie data:', results);
        res.json(results);
      });
  
  });

  app.post('/handleMovieClick', (req, res) => {
    const elementId = req.body.elementId;
    console.log(`Received movie element ID '${elementId}' from client.`);
    // Perform actions based on the received element ID

    const query = "SELECT * FROM Tickets where movie_id = ?";
    connection.query(query, elementId, (error, results) => {
        if (error) {
          console.error('Error retreiving data from tickets table from MySQL:', error);
          return;
        }
    
        console.log('Fetched tickets data:', results);
        res.json(results);
      });
  
  });


  app.get('/movies', (req, res) => {
    res.sendFile(__dirname + '/public/movies.html');
});


app.get('/tickets', (req, res) => {
    res.sendFile(__dirname + '/public/tickets.html');
});


app.get('/success', (req, res) => {
  res.sendFile(__dirname + '/public/success.html');
});

app.get('/cancel', (req, res) => {
  res.sendFile(__dirname + '/public/cancel.html');
});

// Handle the element IDs submission
app.post('/submitTicketElements', (req, res) => {
    const selectedElementIds = req.body.selectedupdateTicketIdElements;
  
    // Process the selected element IDs (e.g., perform actions based on the selected elements)
    // Here, we'll just log the selected element IDs for demonstration
    console.log('Selected element IDs:', selectedElementIds);

    const selectedIdsArray = selectedElementIds.selectedupdateTicketIdElemets;

    selectedIdsArray.forEach(element => {
        const updateQuery = 'UPDATE Tickets SET seat_status = 1 WHERE ticket_id = ?';
        const value = element;
        console.log(updateQuery);
        connection.query(updateQuery,value, (error, results) => {
            if (error) {
                console.error('Error updating tickets table in MySQL:', error);
                return;
            }
            // Send the data as JSON to the client
            // res.json(results);
        });
      });
  
    // Respond to the client
    res.sendStatus(200);
  });

const stripe = require("stripe")('sk_test_51OInsZECWph91qjhjVXG8PDVR61KMV9FszCdB0vEto9oH0NRESYI4a0de0gjtLkra2QJ4eGDvUwraBAsGvc2aNdI00f9wrl0XP')

const storeItems = new Map([
  [1, { priceInCents: 1000, name: "Ticekts Total Price" }],
])

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }
      }),
       success_url: `/success`,
       cancel_url: `/cancel`,
      //  baseURL: process.env.BASE_URL, // Use environment variable for base URL
      //  successURL: `${process.env.BASE_URL}/success.html`,
      //  cancelURL: `${baseURL}/cancel.html`,

      
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

const appPort=process.env.PORT || 3000;
app.listen(appPort, () => {
    console.log('Server is running ');
});
