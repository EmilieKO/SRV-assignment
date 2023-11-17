# SRV-assignment

Configure Environment: Ensure .env file is correctly set up with necessary environment variables, including CYCLIC_DB for database access.
Start the Server: Run npm start to start the ExpressJS server.

# Using Postman

All requests must be authenticated using Basic Authentication with the Admin credentials:

Username: admin
Password: P4ssword

## API Endpoints

 Add a Participant
  Endpoint: POST /participants/add
  Body: JSON object containing participant details.
  Example Body:
{
  "email": "johndoe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990/01/01",
  "active": 1,
  "work": {
    "companyName": "ABC Corp",
    "salary": 50000,
    "currency": "USD"
  },
  "home": {
    "country": "USA",
    "city": "New York"
  }
}

Test the rest of the endpoints using the added participants.

## Links
The application is hosted on Cyclic.sh and can be accessed at the following URL: https://fine-gold-shrimp-wig.cyclic.app/
ENV file: CYCLIC_DB=fine-gold-shrimp-wigCyclicDB
