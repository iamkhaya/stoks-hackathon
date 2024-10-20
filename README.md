# Velfund

Velfund is a platform designed to help communities save together, overcoming the limitations of geography, currency, and traditional banking. Based on the concept of stokvels—a collective savings practice where groups contribute to a shared fund—Velfund uses the Interledger API and OpenPayments standards to modernize this process.

Traditional stokvels foster community and financial security, but are often limited by geographic boundaries and different banking systems. Velfund solves these issues by enabling seamless transactions across currencies and banks, allowing members to save together, regardless of their location or banking preferences.

Developed as part of a hackathon, Velfund addresses challenges like cash flow management and community building, extending the traditional stokvel model to a global scale.

Website: https://velfund.framer.website/

## Problem Being Solved
In many communities, collective savings groups like stokvels are used to help manage cash flow and build financial support networks. However, these systems often face challenges related to:
- Currency constraints and differences
- Geographic limitations
- Reliance on traditional banking institutions

Velfund solves these problems by using the Interledger API, which enables payments and savings across different currencies and geographies, without the need for traditional banks.

## Features
- Cross-border, multi-currency savings platform
- Decentralized payments using the Interledger API
- Community-driven stokvel system
- OpenPayments API integration for streamlined transactions

## Tools and Technologies Used
- **TypeScript**: For type safety and better developer experience.
- **Interledger API**: To enable decentralized, cross-border payments.
- **TigerBeetle API**: For reliable transaction processing and ledgering.
- **React**: The client dashboard is built using React for a modern and responsive user interface.
  - Utilizes the [CoreUI Free React Admin Template](https://coreui.io/product/free-react-admin-template/) for the frontend.

## How to Run the Application

### Server
1. Navigate to the server folder and run the following commands:
   ```bash
   cd server
   npm install
   npm run start
   ```

### Client (Dashboard)
1. Navigate to the dashboard folder and run the following commands:
    ```bash
    cd dashboard
    npm install
    npm run start
    ```

### Testing the Application
1. Navigate to the login page at `http://localhost:8080/member-login` to access the application. Click login with dummy credentials and select any stokvel.
2. Click the "Initiate Payment" button to simulate a payment.




## Potential Improvements
* More features could be added to enhance the user experience and expand functionality.
* Full-fledged integration with the Interledger protocol to unlock more use cases and capabilities.
* Using webhooks to provide a smoother user experience by handling real-time transaction updates and notifications.




## Tigerbeetle experiment

We also attempted to use Tigerbeetle as a ledger for the application. However, due to time constraints and the complexity of integrating Tigerbeetle with the Interledger API, we were unable to complete this integration.

### Environment Setup

*Complete both the Tigerbeetle and Docker steps. The Tigerbeetle database is not configured with docker.*

## Tigerbeetle

**Download tigerbeetle**
```
mkdir data && cd data
curl -Lo tigerbeetle.zip https://mac.tigerbeetle.com && unzip tigerbeetle.zip && ./tigerbeetle version
```

**Set Up Data Files for TigerBeetle:**
Before running the services, you need to format the TigerBeetle data files for the replicas:

```
# Format the data file for replica 0
./tigerbeetle format --cluster=0 --replica=0 --replica-count=6 --development 0_0.tigerbeetle
./tigerbeetle format --cluster=0 --replica=1 --replica-count=6 --development 0_1.tigerbeetle
./tigerbeetle format --cluster=0 --replica=2 --replica-count=6 --development 0_2.tigerbeetle
./tigerbeetle format --cluster=0 --replica=3 --replica-count=6 --development 0_3.tigerbeetle
./tigerbeetle format --cluster=0 --replica=4 --replica-count=6 --development 0_4.tigerbeetle
./tigerbeetle format --cluster=0 --replica=5 --replica-count=6 --development 0_5.tigerbeetle
```

**Start TigerBeetle and the Application**

The following command with start a 6-node cluster on Tigerbeetle and use docker-compose to get the app up running with a PostgreSQL db.

```
./run.sh
```
# Testing the Application

	1.	Navigate to the login page at http://localhost:5001 to access the dashboard.
	2.	Use dummy credentials to log in and select a stokvel.
	3.	Click the “Initiate Payment” button to simulate a payment.

# Technical Architecture

## Transaction Flow

	•	User Payment: When a user makes a payment, it is processed through OpenPayments and logged in TigerBeetle for accounting purposes.
	•	Contributions Ledger: TigerBeetle manages the ledgering for each contribution, ensuring accurate tracking of funds in the stokvel.
	•	Real-time Updates: The user interface updates in real-time using webhooks and subscription models provided by OpenPayments, giving contributors full visibility into their savings.

# Contributions

We welcome open-source contributions to enhance Velfund! If you’re interested in contributing:

	1.	Fork the repository.
	2.	Create a new branch for your feature or bug fix.
	3.	Submit a pull request.

# Code of Conduct

Please adhere to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) when interacting with the project.
