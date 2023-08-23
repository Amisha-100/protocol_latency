const express = require('express');
const http = require('http');
const app = express();

app.get('/add_discount', (req, res) => {
    try {
        const startTime = process.hrtime();

        // To run via npm
        // const cartRequest = http.get('http://localhost:3000/get_cart', cartResponse => {

        // To run via docker
        const cartRequest = http.get('http://cart:3000/get_cart', cartResponse => {
            let data = '';
            cartResponse.on('data', chunk => {
                data += chunk;
            });

            cartResponse.on('end', () => {
                console.log('Received Cart Data:', data);

                const endTime = process.hrtime(startTime);
                const timeTakenInSeconds = endTime[0] + endTime[1] / 1e9;

                console.log(`Time taken: ${timeTakenInSeconds.toFixed(6)} seconds`);
                res.send(timeTakenInSeconds.toFixed(6));
            });
        });

        cartRequest.on('error', error => {
            console.error('Error:', error.message);
            res.status(500).send('Error');
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error');
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Discount is listening on port ${PORT}`);

    const numRequests = 100;
    let totalResponseTime = 0;
    let completedRequests = 0;

    for (let i = 0; i < numRequests; i++) {
        // To run via npm 
        // const request = http.get('http://localhost:3001/add_discount', response => {
        
        // To run via docker
        const request = http.get('http://discount:3001/add_discount', response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                const timeTakenInSeconds = parseFloat(data);
                totalResponseTime += timeTakenInSeconds;
                completedRequests++;

                if (completedRequests === numRequests) {
                    const averageTime = totalResponseTime / numRequests;
                    console.log(`Average Time taken for ${numRequests} requests: ${averageTime.toFixed(6)} seconds`);
                }
            });
        });

        request.on('error', error => {
            console.error('Request Error:', error.message);
        });
    }
});
