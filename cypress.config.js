const { defineConfig } = require('cypress');
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');

module.exports = defineConfig({
   watchForFileChanges: false,
  e2e: {
   baseUrl: 'https://practicetestautomation.com/',
    setupNodeEvents(on, config) {
      on('task', {
        async getOtpFromGmail({ email, password, subject }) {
          console.log("executing")
          const imapConfig = {
            imap: {
              user: email,
              password: password,
              subject:subject,
              host: 'imap.gmail.com',
              port: 993,
              tls: true,
              tlsOptions: { rejectUnauthorized: false },
              authTimeout: 10000
            }
          };

          const connection = await imaps.connect(imapConfig);
          await connection.openBox('INBOX');

          const delay=1*3600*1000;
          const sinceTime = new Date(Date.now() -delay); // last 1 hour

          const searchCriteria = ['UNSEEN', ['SINCE', sinceTime.toISOString()]];
          const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };

          const messages = await connection.search(searchCriteria, fetchOptions);

          for (const msg of messages) {
            const part = await simpleParser(msg.parts[0].body);

            const from = part.from?.text || '';
            const subj = part.subject || '';
            const body = part.text || '';

            
          console.log("FROM:", from);
          console.log("SUBJECT:", subj);
          console.log("BODY:\n", body);

            if (
              from.includes('einvois') ||
              subj.toLowerCase().includes('one-time-password')
            ) {
              const match = body.match(/Your One-Time Password:\s*([A-Z]{10})/);
              if (match && match[1]) {
                
                return match[1]; // OTP
              }
            }
          }

          await connection.end();
          return null;
        }
      });

      return config;
    }
       
  }
});
