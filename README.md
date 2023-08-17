# Protocol Latency

- This is an experiment to demonstrate sending latency between two microservices.


#### Repo Structure
- `grpc`
  - `cart-ms`
    - `data`: contains data for the experiment.
      - `data_1mb.json`: json data of size around 1mb.
      - `data_10kb.json`: json data of size around 10kb.
      - `data_256kb.json`: json data of size around 256kb.
    - `protos`: for addition of proto files.
      - `cart.proto`: proto file for cart service.
    - `Dockerfile`: base image.
    - `main.js`: grpc logic of cart service to read and return the data from the file.
    - `package-lock.json`: contains a snapshot of exact dependencies.
    - `package.json`: contains package information and dependencies for the project (can be customized).
  - `discount-ms`
    - `protos`: for addition of proto files.
      - `discount.proto`: proto file for discount service.
    - `Dockerfile`: base image.
    - `main.js`: grpc logic of discount service to get data from cart service.
    - `package-lock.json`: contains a snapshot of exact dependencies.
    - `package.json`: contains package information and dependencies for the project (can be customized).
  - `.gitignore`: specifies files/folders to be ignored by the git version control system.
  - `docker-compose.yml`: configuration file for building/running the project locally.
  - `package-lock.json`: contains a snapshot of exact dependencies.
  - `package.json`: contains package information and dependencies for the project (can be customized).
- `http`
  - `cart_service`
    - `data`: contains data for the experiment.
      - `data_1mb.json`: json data of size around 1mb.
      - `data_10kb.json`: json data of size around 10kb.
      - `data_256kb.json`: json data of size around 256kb.
    - `Dockerfile`: base image.
    - `index.js`: http logic of cart service to read and return the data from the file.
    - `package-lock.json`: contains a snapshot of exact dependencies.
    - `package.json`: contains package information and dependencies for the project (can be customized).
  - `discount_service`
    - `Dockerfile`: base image.
    - `index.js`: http logic of discount service to get data from cart service.
    - `package-lock.json`: contains a snapshot of exact dependencies.
    - `package.json`: contains package information and dependencies for the project (can be customized).
  - `.gitignore`: specifies files/folders to be ignored by the git version control system.
  - `docker-compose.yml`: configuration file for building/running the project locally.
  - `package-lock.json`: contains a snapshot of exact dependencies.
  - `package.json`: contains package information and dependencies for the project (can be customized).
- `README.md`: You are reading it!


#### Steps to run
1. Clone the repository in your local folder.
2. Without Docker: To run grpc/http, go to the respective folder and run `npm start`.
3. With Docker: WIP
4. Check the terminal for the latency number.
5. For grpc, use postman too to run the endpoints. Hittig port `0.0.0.0:50052` will give the latency data.
