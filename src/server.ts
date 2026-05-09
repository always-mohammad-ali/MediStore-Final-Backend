import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 3000;

async function main(){
    try{
        await prisma.$connect();
        console.log("database connected successfully");
        
        app.listen(PORT, ()=>{
            console.log("Server is running");
        })
        
    }catch(error){
     console.error("an error occured", error);
     await prisma.$disconnect();
     process.exit(1)
    }
}

main();