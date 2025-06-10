using MimeKit;
using MailKit.Net.Smtp;

namespace UserService.Services
{
    public class EmailService
    {
        public static void SendEmail(string toEmail, string subject, string body)
        {
            var message = new MimeMessage();

            // Adresse de l'expéditeur
            message.From.Add(new MailboxAddress("RateMyCourse", "labjakhsafae160@gmail.com"));

            // Adresse du destinataire avec nom générique
            message.To.Add(new MailboxAddress("Utilisateur", toEmail));
            message.Subject = subject;

            // Construction du message avec corps HTML et texte brut
            var builder = new BodyBuilder
            {
                TextBody = body,
                HtmlBody = $"<p>{body}</p><p><em>--<br>L'équipe RateMyCourse</em></p>"
            };

            message.Body = builder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                // Connexion au serveur SMTP Gmail
                client.Connect("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);

                // Authentification avec un mot de passe d'application (jamais le vrai mot de passe)
                client.Authenticate("labjakhsafae160@gmail.com", "pxwo egjt mqye xesx");

                // Envoi de l'e-mail
                client.Send(message);

                // Déconnexion propre
                client.Disconnect(true);
            }
        }
    }
}
