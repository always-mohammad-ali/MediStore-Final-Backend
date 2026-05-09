import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";


// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins:[process.env.APP_URL!],
    user:{
        additionalFields:{
            role:{
                type: "string",
                defaultValue: "CUSTOMER",
                required: true
            },
            status:{
                type: "string",
                defaultValue: "ACTIVE",
                required: true
            }
            
        }
    },

    emailAndPassword: { 
        enabled: true, 
        autoSignIn: false,
        requireEmailVerification: true
    },
    
    emailVerification: {
        sendOnSignUp : true,
        autoSignInAfterVerification: true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
        try{
          const verification_link = `${process.env.APP_URL}/verify-email?token=${token}`
        console.log({user, url, token});
     const info = await transporter.sendMail({
       from: 'Dolan tump', // sender address
       to: user.email, // list of recipients
       subject: "Verify Your Email", // subject line
       html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f7fb;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f4f7fb; padding: 40px 20px"
  >
    <tr>
      <td align="center">
        
        <!-- Main Container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                background-color: #2563eb;
                padding: 40px 20px;
              "
            >
              <h1
                style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 28px;
                  font-weight: 700;
                "
              >
                Verify Your Email
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 35px">
              <p
                style="
                  margin: 0 0 16px;
                  font-size: 16px;
                  line-height: 1.7;
                "
              >
                Hello,
              </p>

              <p
                style="
                  margin: 0 0 24px;
                  font-size: 16px;
                  line-height: 1.7;
                  color: #4b5563;
                "
              >
                Thank you for creating your account. Please confirm your email
                address to activate your account and continue securely.
              </p>

              <!-- Button -->
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
              >
                <tr>
                  <td align="center">
                    <a
                      href="${verification_link}"
                      target="_blank"
                      style="
                        display: inline-block;
                        padding: 14px 32px;
                        background-color: #2563eb;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                      "
                    >
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Alternative Link -->
              <p
                style="
                  margin: 32px 0 12px;
                  font-size: 14px;
                  color: #6b7280;
                  line-height: 1.6;
                "
              >
                If the button above does not work, copy and paste the following
                link into your browser:
              </p>

              <p
                style="
                  margin: 0;
                  word-break: break-word;
                  font-size: 14px;
                  color: #2563eb;
                "
              >
                {${url}}
              </p>

              <!-- Expiry -->
              <p
                style="
                  margin: 32px 0 0;
                  font-size: 14px;
                  color: #9ca3af;
                  line-height: 1.6;
                "
              >
                This verification link will expire in 15 minutes.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                padding: 24px;
                background-color: #f9fafb;
                border-top: 1px solid #e5e7eb;
              "
            >
              <p
                style="
                  margin: 0;
                  font-size: 13px;
                  color: #9ca3af;
                  line-height: 1.6;
                "
              >
                If you did not create this account, you can safely ignore this
                email.
              </p>

              <p
                style="
                  margin: 12px 0 0;
                  font-size: 13px;
                  color: #9ca3af;
                "
              >
                © 2026 MediStore. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`, // HTML body
     });

     console.log("Message sent: %s", info.messageId);
        }catch(err){
            console.error(err)
            throw err;
        }
    },
    
  },
  socialProviders: {
        google: { 
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },


});