let nodemailer = require('nodemailer');
import { gmailUsername, gmailPassword, adminEmail } from './secrets.js';

export function sendAdminEmail(subject, bodyText, bodyHtml) {
  return new Promise((resolve, reject) => {
    try {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
          user: gmailUsername,
          pass: gmailPassword,
        }
      });

      var mailOptions = {
        from: gmailUsername,
        to: adminEmail,
        subject: subject,
        text: bodyText,
        html: bodyHtml,
      };

      smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}
