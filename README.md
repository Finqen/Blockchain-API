# Basic Blockchain API
### Javascript Backend for using the very basic functions of a Blockchain API
### Start the main script on the default address *localhost:8081* 
#### you can use:
 - *localhost:8081/mine* to mine a block
 - *localhost:8081/chain* to show the complete Blockchain as JSON
#### or you can send post requets via _Postman_ in JSON to:
 - *localhost:8081/transaction* to start a new transaction
 	```sh
	"sender": "nameSender",
	"recipient": "nameRecipient",
	"amount": 100
	```
 - *localhost:8081/balance* to show your wallet's balance
 	```sh
	"owner": "nameOwner"
	```


!(Preview Transaction)[bcpreview_3.jpg]



!(Preview Wallet)[bcpreview_2.jpg]



!(Preview Chain)[bcpreview_1.jpg]

