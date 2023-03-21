# Vending Machine

This project was bootstrapped with Typescript, Nodejs, Express, MongoDB and Mongoose by [Olanrewaju A. Olaboye](https://www.github.com/boyepanthera)

## Scripts

### `yarn install`

to install all the packages needed to run the project

### `yarn dev`

to run the development version of the project

### `yarn build`

to run build and create a compiled js version of the project inside the /build folder

## How to Collaborate

### First installation and Running of the project

1. Clone the project into your local machine using by running the command `git clone https://github.com/boyepanthera/vending-machine.git`
2. Change directory into the project folder `cd /vending-machine`
3. Install all dependency `yarn install`
4. Create your `.env` file at the root directory of the project
5. Add all needed environment variable into your `.env` file. For idea of what environment variable names to use the `.env.example` file shows you all the environment variable names you need to successfully run the project.
6. You should have the project running successfully on port 3005

## Understanding the Codebase

### models

1. The `user` model : `models/user.models.ts` defines the structure of data in user schema, the code used mongoose discriminator to abstract the Buyer and Seller roles from the base `user` model.

2. The `product model` : model `models/product.model.ts` is a model schema for products sold on the vending machine.

3. The `deposit model` : model `models/deposit.model.ts` is a model schema for deposits made by buyers into their vending account.
