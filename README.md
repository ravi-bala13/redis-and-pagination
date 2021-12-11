# redis-and-pagination
Create a Product controller and implement the crud functions on it get('/products')


Create a Product controller and implement the crud functions on it
get('/products')
post('/products')
get('/products/:id')
patch('/products/:id')
delete('/products/:id')- use Redis to serve values for the responses like we did in classBONUS :- try pagination for get('/products') also and the challenge that you will face is deleting all the keys so in this case you can use hmset instead of set and refer to package documentation on Redis Package Documentation
