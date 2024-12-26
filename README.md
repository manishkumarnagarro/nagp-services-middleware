## Pre-requisistes:

Docker: Please make sure there is docker installed on you machine. This code uses docker to start a RabbitMQ and MySQL and the creates the microservices also as docker containers.

## Running the app

To start the application follow the below steps/commands.

```bash
# development
$ docker compose up -d
```

The above command will start belwo docker containers:

- `rabbitmq`
- `db`
- `accounts`
- `documents`
- `notifications` => Notifications Service 1
- `notifier` => Notifications Service 2

### account

The accounts microservice will be available on port `4000` and exposes below endpoints

- `POST`: `/` For account creation with below payload

```
{
    "firstName": "Manish",
    "lastName": "Kumar",
    "idenificationNumber": "9878986655675", // must be unique
    "dateOfBirth": "12-12-2024",
    "type": "S",
    "email": "jhdjhga@sjhfgfd.com",
    "currency": "INR",
    "mobileNumber": "7658675435",
    "branchCode": "ABC23"
}
```

- `GET` : `/:accNum/statement` : Request account statement
- `GET` : `/:accNum` : Get account details
- `gRPC` : `GetAccountStatement` - `AccountsService` : Fetch account statement using gRPC exposed on port: `4001`

### documents

The documents service will be availabel on port `5000` and exposed below endpoints

- `GET` : `/statement/:accNum` : To download the generated PDF statement- this for testing purpose to check the generated PDF

### notifications : Notifications Service 1

This microservice does not expose any endpoints, it listens to the PDF generated event by PDF Generation Service via RabbitMQ

### notifications : Notifications Service 2

This microservice does not expose any endpoints, it listens to the

- PDF generated event by PDF Generation Service via RabbitMQ
- account created event from Accounts service, when account is created.
