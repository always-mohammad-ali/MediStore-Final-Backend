

import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin(){
    try{
        console.log("**********Admin seeding starting........");
        //always make sure that you put those value of adminData inside .env and then use it here for security purpose
         const adminData = {
            name: "SuperAdmin",
            email: "superAdmin@admin.com",
            password: "admin1234",
            role: UserRole.ADMIN
            
         }

         console.log("*********checking any such email exist or not........");


        //check user exist in db or not
         const existingUser = await prisma.user.findUnique({
            where:{
                email: adminData.email
            }
         })

         if(existingUser){
            throw new Error("Email already exists in Database")
         }

         console.log("*****creating admin starting.........");
        
         const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email", {
            method: "POST",
            headers:{
                "Content-type": "application/json",
                "Origin": "http://localhost:4000"
            },
            body: JSON.stringify(adminData)
         })

        console.log("admin creation done, but verification still doesn't done");

         if(signUpAdmin.ok){
           
            await prisma.user.update({
                where:{
                    email:"admin@admin.com"
                },
                data:{
                    emailVerified: true
                }
            })
         }

         console.log("*****admin verification updated done.........");

         
    }catch(error){
        console.error(error);
    }
}

seedAdmin();