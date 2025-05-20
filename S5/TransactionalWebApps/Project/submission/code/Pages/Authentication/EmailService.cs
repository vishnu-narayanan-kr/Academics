using MimeKit;
using MailKit.Net.Smtp;

namespace ASP.NETCoreWebApp.Pages.Authentication
{
    public class EmailService
    {
        private readonly string smtpServer = "sandbox.smtp.mailtrap.io"; // SMTP server, e.g., Mailtrap
        private readonly int smtpPort = 2525;                    // SMTP port for Mailtrap
        private readonly string smtpUser = "61e39726bfd5a6"; // Your Mailtrap username
        private readonly string smtpPass = "ae285f693ed25a"; // Your Mailtrap password

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Student Registration App", "no-reply@sra.com"));
            message.To.Add(new MailboxAddress("User", toEmail));
            message.Subject = subject;
            message.Body = new TextPart("plain") { Text = body };

            using (var client = new SmtpClient())
            {
                // For demo purposes, disable SSL certificate validation (not recommended for production)
                // client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                await client.ConnectAsync(smtpServer, smtpPort, false);
                await client.AuthenticateAsync(smtpUser, smtpPass);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
    }
}
