import nodemailer from "nodemailer";
import baseUrl from "@/lib/baseUrl";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // ej: "gmail"
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_PASS, // contraseña o app password
  },
});

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;">
    <div style="background-color: #000; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 10; font-size: 24px;">MarketIA Labs</h1>
    </div>
    <div style="padding: 20px;">
      <p style="font-size: 16px; color: #333;">
        Has solicitado restablecer tu contraseña. Por favor, haz clic en el botón de abajo para continuar:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: bold;">
          Restablecer contraseña
        </a>
      </div>
      <p style="font-size: 14px; color: #777;">
        Si no solicitaste este cambio, puedes ignorar este correo.
      </p>
    </div>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: `"MarketIA Labs" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Restablece tu contraseña",
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Error al enviar email:", error);
    return { error: "Error al enviar email" };
  }
};
