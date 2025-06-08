import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.net.URI;

import java.nio.file.Files;
import java.nio.file.Path;


public class Server 
{
    public static void main(String[] args) throws IOException 
    {
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        server.createContext("/", new Handler());

        server.setExecutor(null);
        server.start();

        System.out.println("serving on port 8000");
    }

    static class Handler implements HttpHandler {

        // byte[] getErrorPage(int code){
        //     return ("<").getBytes();
        // }

        @Override
        public void handle(HttpExchange exchange) throws IOException 
        {
            // logic
            // String response = "<input>";
            // Headers resHead=exchange.getResponseHeaders();
            // resHead.set("Content-Type", "text/html");

            // exchange.sendResponseHeaders(200, response.length());
            // OutputStream os = exchange.getResponseBody();
            // os.write(response.getBytes());
            // os.close();

            URI uri=exchange.getRequestURI();
            Headers resHead=exchange.getResponseHeaders();
            // Headers reqHead=exchange.getRequestHeaders();
            String get="./public"+uri.getRawPath();
            System.out.println("get is "+get);

            File file=new File(get);
            
            if(file.exists()){
                byte[] fbuff=Files.readAllBytes(file.toPath());
                String contentType = "application/octet-stream";
                String fileName = file.getName().toLowerCase();

                if(fileName.endsWith(".html")||fileName.endsWith(".htm")){
                    contentType = "text/html";
                } else if(fileName.endsWith(".css")){
                    contentType = "text/css";
                } else if(fileName.endsWith(".js")){
                    contentType = "application/javascript";
                } else if(fileName.endsWith(".png")){
                    contentType = "image/png";
                } else if(fileName.endsWith(".jpg")||fileName.endsWith(".jpeg")){
                    contentType = "image/jpeg";
                };

                resHead.set("Content-Type", contentType);
                exchange.sendResponseHeaders(200, fbuff.length);
                OutputStream os=exchange.getResponseBody();
                os.write(fbuff);
                os.close();
            } else {
                byte[] msg="404 not found".getBytes();
                System.err.println("file doesnt exist");
                exchange.getResponseHeaders().set("Content-Type", "text/plain");
                exchange.sendResponseHeaders(404, msg.length);
                OutputStream os=exchange.getResponseBody();
                os.write(msg);
                os.close();
            }

            // exchange.sendResponseHeaders(200, 5);
            // OutputStream os=exchange.getResponseBody();
            // os.write("hello".getBytes());
        }
    }
}