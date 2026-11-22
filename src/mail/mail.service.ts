import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const MAILTRAP_SANDBOX_URL = "https://sandbox.api.mailtrap.io/api/send";

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendMail({ to, subject, html, text }: SendMailOptions) {
    const inboxId = this.config.get<string>("MAILTRAP_INBOX_ID");

    try {
      const response = await fetch(`${MAILTRAP_SANDBOX_URL}/${inboxId}`, {
        method: "POST",
        headers: {
          "Api-Token": this.config.get<string>("MAILTRAP_API_TOKEN") ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: {
            email: this.config.get<string>("MAIL_FROM"),
            name: "Clínica VetCare",
          },
          to: [{ email: to }],
          subject,
          html,
          text,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Mailtrap ${response.status}: ${await response.text()}`,
        );
      }

      this.logger.log(`E-mail enviado para ${to}`);
    } catch (error) {
      this.logger.error(`Falha ao enviar e-mail para ${to}`, error);
      throw error;
    }
  }

  async sendConfirmationEmail(to: string, token: string) {
    const link = `https://vetcare-aal.vercel.app/convite/${token}`;

    await this.sendMail({
      to,
      subject: "Confirme seu e-mail",
      html: `
          <h2>Bem-vindo!</h2>
          <p>Clique no botão abaixo para confirmar sua conta:</p>
          <p>
            <a href="${link}"
               style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px">
              Confirmar e-mail
            </a>
          </p>
          <p>Ou copie este link: <br>${link}</p>
          <p>Se você não criou esta conta, ignore este e-mail.</p>
        `,
      text: `Confirme sua conta acessando: ${link}`,
    });
  }
}
