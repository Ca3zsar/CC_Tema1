const http = require("http");
const db_manager = require("./db_manager");

const host = 'localhost';
const port = 8000;

const requestListener = async function( request, response){
    var url = request.url;
    var method = request.method;
    response.setHeader("Content-Type", "application/json");
    if(url ==="/books"){
        switch(method){
            case "GET":
                var results = await db_manager.getAllBooks();
                response.statusCode = 200;
                response.write(JSON.stringify( results.rows));
                response.end();
                break;
            case "POST":
                let data = '';
                let info;
                request.on('data', chunk => {
                    data += chunk;
                })
                request.on('end', async () => {
                    try{
                        info = JSON.parse(data);
                        if("author" in info && "category" in info && "title" in info){
                            let db_answer =  await db_manager.addNewBook(info.title, info.author, info.category);
                            response.setHeader("Location", "/books/"+db_answer);
                            response.statusCode = 201;
                            response.write(JSON.stringify(info));
                            response.end();
    
                            
                        }else{
                            response.statusCode = 400;
                            response.write(JSON.stringify({'error' : 'One or more fields are missing!'}));
                            response.end();
                        }
                    }
                    catch(error){
                        response.statusCode = 400;
                        response.write(JSON.stringify({'error' : 'Message is not JSON!'}));
                        response.end();
                    }
                });
                break;
            case "PUT":
                response.statusCode = 405;
                response.write(JSON.stringify({"error" : "This method is not allowed on all the resources!"}));
                response.end();
                break;
            case "DELETE":
                response.statusCode = 405;
                response.write(JSON.stringify({"error" : "This method is not allowed on all the resources!"}));
                response.end();
                break;
            default :
                response.statusCode = 405;
                response.write(JSON.stringify({"error" : "This method is not allowed on all the resources!"}));
                response.end();
                break;
        };
    }
    else if(url.match(/\/books\/([0-9]+)/))
    {
        const id = url.split("/")[2];
        switch(method){
            case "GET":
                const result = await db_manager.getBookById(id);
                if(result.rows[0])
                {
                    response.statusCode = 200;
                    response.write(JSON.stringify(result.rows[0]));
                    response.end();
                }else{
                    response.statusCode = 404;
                    response.write(JSON.stringify({"error" : "Book not found!"}));
                    response.end();
                }
                console.log(result.rows[0]);
                break;
            case "POST":
                response.statusCode = 405;
                response.write(JSON.stringify({"error" : "This method is not allowed on all the resources!"}));
                response.end();
                break;
            case "PUT":
                let data = '';
                let info;
                request.on('data', chunk => {
                    data += chunk;
                })
                request.on('end', async () => {
                    try{
                    info = JSON.parse(data);
                    console.log(info);
                    if("author" in info && "category" in info && "title" in info){
                        let db_answer =  await db_manager.modifyBook(id, info.title, info.author, info.category);
                        if(db_answer.length > 0){
                            response.setHeader("Location", "/books/"+db_answer);
                        
                            response.statusCode = 200;
                            response.write(JSON.stringify(info));
                            response.end();
                        }else{
                            response.statusCode = 404;
                            response.write(JSON.stringify({"error" : "There is not book with this id!"}));
                            response.end();
                        }    
                    }else{
                        response.statusCode = 400;
                        response.write(JSON.stringify({'error' : 'One or more fields are missing!'}));
                        response.end();
                    }}
                    catch(error)
                    {
                        response.statusCode = 400;
                        response.write(JSON.stringify({'error' : 'Message is not JSON!'}));
                        response.end();
                    }
                });
                break;
            case "DELETE":
                let db_answer =  await db_manager.deleteBook(id);
                
                if(db_answer){
                    response.statusCode = 200;
                    response.write(JSON.stringify({"message":"The book has been deleted!"}));
                    response.end();
                }else{
                    response.statusCode = 404;
                    response.write(JSON.stringify({"error" : "There is not book with this id!"}));
                    response.end();
                }    
                break;
            default :
                response.statusCode = 405;
                response.write(JSON.stringify({"error" : "This method is not allowed!"}));
                response.end();
                break;
            }
    }

};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

// process.on('exit', async function(){
//     console.log("Hei");
//     await db_manager.closeClient();
// });