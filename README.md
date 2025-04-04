# Spread API

REST API for calculating and monitoring market spreads from [Buda.com](https://api.buda.com/#la-api-de-buda-com).

## Description

This API provides real-time spread calculations and alert monitoring for cryptocurrency markets. Key features:

- Get current spreads for all markets
- Query spreads for specific markets
- Set up and monitor spread alerts 

Explore API Documentation [here](https://app.swaggerhub.com/apis-docs/FelipeAmigo/spread-api/1.0.0).

## Getting Started

### Prerequisites

- Docker

## Docker execution

### Build the Docker image

```
docker build -t spread-api .
```

### Run the container
```
docker run -p 3000:3000 spread-api
```
The  API  will  be  available  at  http://localhost:3000.

## Testing

### Unit tests

```
npm run test
```

### Test coverage
```
npm run test:cov
```  

## Technologies

- NestJS: Backend framework
- TypeScript: JavaScript typed superset
- Jest: Testing framework
- Docker: Containerization
- class-validator: Data Validation
- @nestjs/axios: HTTP Client

## Technical Considerations

1. **In-memory storage**: No database persistence
2. **Real-time calculations**: Spreads are computed on-demand
3. **Single-instance alerts**: Alerts are active per running instance
4. **Restricted alerts**: Only one alert can be created for each market
