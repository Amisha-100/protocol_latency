package main
import (
    "context"
    "fmt"
    "net"
    "time"

    "google.golang.org/grpc"
    "google.golang.org/grpc/reflection"
		"google.golang.org/grpc/status"
		"google.golang.org/grpc/codes"

    pb "grpc-go/discount-ms/protos"
    cart "grpc-go/cart-ms/protos"
)

const (
    discountServiceAddress = "0.0.0.0:50051"
    serverPort             = ":50052"
)

type discountServer struct{
    pb.DiscountServiceServer
}

func (s *discountServer) Request(ctx context.Context, req *pb.Empty) (*pb.Response, error) {
    // Create a gRPC client for the CartService
    conn, err := grpc.Dial(discountServiceAddress, grpc.WithInsecure())
    if err != nil {
        fmt.Printf("Failed to connect to CartService: %v\n", err)
		return nil, status.Error(codes.Internal, "Internal Server Error")
    }
    defer conn.Close()

    cartClient := cart.NewCartServiceClient(conn)

    // Call the GetCart method
    cartRequest := &cart.Empty{}
    startTime := time.Now()
    cartResponse, err := cartClient.GetCart(ctx, cartRequest)
    if err != nil {
        fmt.Printf("Error calling GetCart: %v\n", err)
        return nil, grpc.Errorf(codes.Internal, "Internal Server Error")
    }

    endTime := time.Since(startTime)
    latencyInMilliseconds := fmt.Sprintf("%.2f ms", float64(endTime.Nanoseconds())/1e6)

    fmt.Println("Received Cart Data:", cartResponse)
    fmt.Printf("Latency between Discount and Cart services: %s\n", latencyInMilliseconds)

    return &pb.Response{TimeTaken: latencyInMilliseconds}, nil
}

func main() {
    lis, err := net.Listen("tcp", serverPort)
    if err != nil {
        fmt.Printf("Failed to listen: %v\n", err)
        return
    }
    opts := []grpc.ServerOption{}
    s := grpc.NewServer(opts...)

    pb.RegisterDiscountServiceServer(s, &discountServer{})
    reflection.Register(s)

    fmt.Printf("Discount gRPC server is running on %s\n", serverPort)

    if err := s.Serve(lis); err != nil {
        fmt.Printf("Failed to serve: %v\n", err)
        return
    }
}
