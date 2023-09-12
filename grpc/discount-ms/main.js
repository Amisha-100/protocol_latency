const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');


// for running via npm
// const DISCOUNT_PROTO_PATH = path.join(__dirname, './protos/discount.proto');
// const CART_PROTO_PATH = path.join(__dirname, '../cart-ms/protos/cart.proto');

// for running via docker
const DISCOUNT_PROTO_PATH = path.join(__dirname, '/protos/discount.proto');
const CART_PROTO_PATH = path.join(__dirname, '/protos/cart.proto');

const discountPackageDefinition = protoLoader.loadSync(DISCOUNT_PROTO_PATH);
const discountProto = grpc.loadPackageDefinition(discountPackageDefinition).discount_service;

const cartPackageDefinition = protoLoader.loadSync(CART_PROTO_PATH);
const cartProto = grpc.loadPackageDefinition(cartPackageDefinition).cart_service;

const server = new grpc.Server();

const cartServiceAddress = 'cart-ms:50051'; //'0.0.0.0:50051';

server.addService(discountProto.DiscountService.service, {
  Request: (_, callback) => {
    const cartClient = new cartProto.CartService(cartServiceAddress, grpc.credentials.createInsecure());

    const cartRequest = {};
    const startTime = process.hrtime();
    cartClient.getCart(cartRequest, (error, cartResponse) => {
      if (error) {
        console.error('Error calling getCart:', error);
        callback({
          code: grpc.status.INTERNAL,
          details: 'Internal Server Error',
        });
        return;
      }

      const endTime = process.hrtime(startTime);
      const latencyInMilliseconds = (endTime[0] * 1000 + endTime[1] / 1e6).toString(); 

      console.log('Received Cart Data:', cartResponse);
      console.log(`Latency between Discount and Cart services: ${latencyInMilliseconds} ms`);

      callback(null, latencyInMilliseconds);
    });
  },
});

const serverPort = 50052;
server.bindAsync(`0.0.0.0:${serverPort}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Discount gRPC server is running on port ${serverPort}`);
  server.start();
});
