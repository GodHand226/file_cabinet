# File Cabinet
Transferring files and texts with encryption

## Tech Stacks
<ul>
<li>NodeJS</li>
<li>ExpressJS</li>
<li>MongoDB</li>
<li>Ejs</li>
</ul>

## How to install on server

1. run `npm install`
2. Edit `.env` file to change the port and Database URL.
    ```javascript
        PORT = 3000
		DB_URL = mongodb://localhost:27017/FileCabinet

    ```
3. run `nodemon .\index.js`.

## Configure Encryption Key
You can change the Encryption Key from `constant.js` file \
1. Password encryption configuration
    ```JAVASCRIPT
    const secret_key = "d1a3b9fe4c3f9aa4b0fb5be8e08809b2";//password encrypt key
    ```
2. File encryption configuration
    ```JAVASCRIPT
	const secret = {// file encrypt key
		  iv: Buffer.from("8e800da9971a12010e738df5fdfe0bb7", "hex"),
		  key: Buffer.from("dfebb958a1687ed42bf67166200e6bac5f8b050fc2f6552d0737cefe483d3f1c","hex"),
	};
    ```