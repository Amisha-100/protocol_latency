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
  console.log("Done!")
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
    callback(null, jsonData);
  });
}


server.addService(cartProto.CartService.service, { getCart });
const bindAddress = '0.0.0.0:50051'
server.bindAsync(bindAddress, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});

console.log(`gRPC server is running on ${bindAddress}`);
