# Swenson
This is a simple application to manage a list of products.

## Infrastructure

The application consist of Backend HTTP REST API built with Node.js, Express and MongoDB.

## How to run

to start the database use docker compose:

`docker-compose up --build`

to start the backend use yarn:

`yarn start`

once the app is running you can send http request to:

`http://localhost:3100/`

## Endpoints

### `POST /products` to create products for testing

the following are request parameters, note that parameters are not required:
```
sku: product sku name
productType: the product type
productDescription: a full describtion for the product
waterLine: weather product have water line or not
coffeeFlavor: the coffee flavor if the product is pod
packSize: the packet size
productCategory: weather the product is Coffee Machine or coffee pod
model: the model of the coffee machine
```

the following is request example of a coffee machine product
```
{
    "sku": "CM003",
    "productType": "COFFEE_MACHINE_SMALL",
    "productDescription": "small machine, deluxe model, water line compatiblev",
    "waterLine": true,
    "productCategory": "Coffee Machine",
    "model": "deluxe model"
}
```

the following is request example of a pod product
```
{
    "sku": "CP033",
    "productType": "COFFEE_POD_SMALL",
    "productDescription": "small coffee pod, 3 dozen, mocha",
    "coffeeFlavor": "COFFEE_FLAVOR_MOCHA",
    "packSize": 36,
    "productCategory": "Coffee Pod"
}
``` 

The application is general application so inputs can be of any kind (there is no validation for input data types)

### `GET /products` to query products

you can use the following query parameters to filter
```
page: page number to return. default is 1
limit: number of products per a page. default is 20
sku: product sku name
productType: the product type
waterLine: weather product have water line or not
coffeeFlavor: the coffee flavor if the product is pod
packSize: the packet size
productCategory: weather the product is Coffee Machine or Coffee Pod
```

response should be a list of all products matches query criteria

the following is request example
```
localhost:3100/products?productType=COFFEE_MACHINE_SMALL
```
the following is response example
```
[
    {
        "_id": "60bc80c158255a4cc76c34bd",
        "sku": "CM003",
        "productType": "COFFEE_MACHINE_SMALL",
        "productDescription": "small machine, deluxe model, water line compatiblev",
        "waterLine": true,
        "productCategory": "Coffee Machine",
        "model": "deluxe model"
    }
]
```

## Testing

you can run unit testing using yarn as following

```
yarn test
```
