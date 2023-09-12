const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

const PROTO_PATH = path.join(__dirname, './protos/cart.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const cartProto = grpc.loadPackageDefinition(packageDefinition).cart_service;

const dataFilePath = path.join(__dirname, 'data', 'data_10kb.json');

const server = new grpc.Server();

function getCart(call, callback) {
  const startTime = process.hrtime();
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return callback({
        code: grpc.status.INTERNAL,
        details: 'Internal Server Error',
      });
    }

    console.log("LOOK111", data);
    const jsonData = JSON.parse(data);
    const endTime = process.hrtime(startTime);

    // Convert the elapsed time to milliseconds
    const elapsedTimeMs = (endTime[0] * 1e9 + endTime[1]) / 1e6;
    callback(null, jsonData);
  });
}


const serverPort = 50051;
server.addService(cartProto.CartService.service, { getCart });
server.bindAsync(`0.0.0.0:${serverPort}`, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});

console.log(`gRPC server is running on ${serverPort}`);
