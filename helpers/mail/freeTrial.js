const nodemailer = require('nodemailer')


async function receiveFreeTrialRequest(restaurant) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
          user: 'etnikz2002@gmail.com',
          pass: 'vysmnurlcmrzcwad',
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      const emailSubject = 'Free trial request';
      const emailRecipient = 'insyllium@gmail.com';
      const emailSender = 'etnikz2002@gmail.com';
      
      const emailBody = `
        <html>
          <body>
            <p>Dear InSyllium Team,</p>
            <p>${restaurant.name} has submitted a request for a free trial of the InSyLink POS app.</p>
            <p>Here are some details:</p>
            <ul>
              <li>Restaurant Name: ${restaurant.name}</li>
              <li>Contact Email: ${restaurant.email}</li>
              <li>Their free trial expires on : ${restaurant.trialDate}</li>
            </ul>
            <p>Please follow up with them at your earliest convenience to discuss the trial.</p>
          </body>
        </html>
      `;
  
      const info = await transporter.sendMail({
        from: emailSender,
        to: emailRecipient,
        subject: emailSubject,
        html: emailBody,
      });
  
      console.log(`Email sent successfully. Message ID: ${info.messageId}`);
  
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  
  async function sendCredentialsToFreeTrialAccount(receiverEmail, receiverName, restaurant_acc, manager_acc, waiter_acc) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
          user: 'etnikz2002@gmail.com',
          pass: 'vysmnurlcmrzcwad',
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      const emailSubject = 'Free trial account credentials';
      const emailSender = 'etnikz2002@gmail.com';
      
      const emailBody = `
        <html>
          <head>
            <title>Free Trial Credentials</title>
          </head>
          <body>
            <p>Dear ${receiverName},</p>
            <p>Here are your free trial credentials for operating our point of sale (POS) system:</p>
            <ul>
              <li><strong>These are your restaurants credentials to login into the InsyLink POS app.</strong></li>
              <li><strong>Email:</strong> ${restaurant_acc.email}</li>
              <li><strong>Password:</strong> ${restaurant_acc.password}</li>
            </ul>

            <ul>
              <li><strong>These are your managers credentials to login into the admin dashboard.</strong></li>
              <li><strong>Email:</strong> ${manager_acc.email}</li>
              <li><strong>Password:</strong> ${manager_acc.password}</li>
            </ul>

            <ul>
              <li><strong>These are your waiter credentials to login into the InsyLink POS app.</strong></li>
              <li><strong>PIN:</strong> ${waiter_acc.pin}</li>
            </ul>
            <p>Please make sure to keep these credentials secure and follow up at your earliest convenience to discuss the trial further.</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact us at insyllium@gmail.com</p>
            <p>Best regards,</p>
            <p>InsyLink Team</p>
          </body>
        </html>
      `;
  
      const info = await transporter.sendMail({
        from: emailSender,
        to: receiverEmail,
        subject: emailSubject,
        html: emailBody,
      });
  
      console.log(`Email sent successfully. Message ID: ${info.messageId}`);
  
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  module.exports = { receiveFreeTrialRequest, sendCredentialsToFreeTrialAccount };