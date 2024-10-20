# stoks-hackathon
Interledger Hackathon 


# Environment Setup

*Complete both the Tigerbeetle and Docker steps. The Tigerbeetle database is not configured with docker.*

## Tigerbeetle

**Download tigerbeetle**
```
cd data
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
