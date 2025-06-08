import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
// import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

// import java.io.File;
// import java.io.FileNotFoundException;
// import java.util.Scanner;
import java.net.URI;

import java.nio.file.*;
// import java.util.stream.Collector;
import java.util.stream.Collectors;
// import java.nio.file.Path;
// import java.util.stream.Stream;
import java.util.*;


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

        void error(HttpExchange exchange, int code, byte[] buff)throws IOException{
            System.err.println("file doesnt exist");
            exchange.getResponseHeaders().set("Content-Type", "text/plain");
            exchange.sendResponseHeaders(code, buff.length);
            OutputStream os=exchange.getResponseBody();
            os.write(buff);
            os.close();
        }

        void handleDir(HttpExchange exchange,Path path)throws IOException{
            System.out.println("<Handler>.handleDir was called");
            List<Path> paths = Files.walk(path).filter(Files::isRegularFile).collect(Collectors.toList());
            Path picked=null;
            System.out.println(paths);
            String lookfor=(path.toString()+"/index.html").replaceAll("\\\\", "/");
            System.out.println("looking for "+lookfor);
            for(Path sub : paths){
                String str=sub.toString().replaceAll("\\\\", "/");
                System.out.println(str);
                if(str.endsWith("index.html"))picked=sub;
            };
            if(picked==null){
                System.out.println("file for handling wasnt picked");
                error(exchange, 409, "null".getBytes());
            }else{
                System.out.println("picked file for handling is "+picked.toString());
                handleFile(exchange, picked);
            };

        }

        void handleFile(HttpExchange exchange,Path path)throws IOException{
            System.out.println("<Handler>.handleFile was called");
            byte[] fbuff=Files.readAllBytes(path);
            String contentType = "application/octet-stream";
            String spath = path.toString();
            // String fileName = file.getName().toLowerCase();

            // System.out.println(path.toString());

            if(spath.endsWith(".html")||spath.endsWith(".htm")){
                contentType = "text/html";
            } else if(spath.endsWith(".css")){
                contentType = "text/css";
            } else if(spath.endsWith(".js")){
                contentType = "application/javascript";
            } else if(spath.endsWith(".png")){
                contentType = "image/png";
            } else if(spath.endsWith(".jpg")||spath.endsWith(".jpeg")){
                contentType = "image/jpeg";
            };

            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, fbuff.length);
            OutputStream os=exchange.getResponseBody();
            os.write(fbuff);
            os.close();
        }

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
            // Headers resHead=exchange.getResponseHeaders();
            // Headers reqHead=exchange.getRequestHeaders();
            String get="./public"+uri.getRawPath();
            Path path=Paths.get(get);
            System.out.println("get is "+get);

            // File file=new File(get);
            
            if(Files.exists(path)){
                if(Files.isDirectory(path)){
                    handleDir(exchange, path);
                } else if(Files.isRegularFile(path)){
                    handleFile(exchange, path);
                }
            } else {
                byte[] msg="404 not found".getBytes();
                error(exchange, 404, msg);
            }

            
            // exchange.sendResponseHeaders(200, 5);
            // OutputStream os=exchange.getResponseBody();
            // os.write("hello".getBytes());
        }

        
    }
}