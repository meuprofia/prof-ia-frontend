import express from "express";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Enable CORS for cross-origin frontend requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Helper to send recovery email via Resend, SMTP (Nodemailer), or log in server terminal
async function sendRecoveryEmail(toEmail: string, resetUrl: string) {
  console.log(`\n============================================================`);
  console.log(`[SOLICITAÇÃO DE REDEFINIÇÃO DE SENHA RECEBIDA]`);
  console.log(`E-mail do Destinatário: ${toEmail}`);
  console.log(`Link de Redefinição Direta: ${resetUrl}`);
  console.log(`============================================================\n`);

  // Option 1: Resend API (if RESEND_API_KEY is configured)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log(`[DISPARO DE E-MAIL]: Tentando enviar via Resend API...`);
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Meu Prof IA <onboarding@resend.dev>",
          to: [toEmail],
          subject: "🔒 Redefinição de Senha - Meu Prof IA",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
              <h2 style="color: #1D3C8F; margin-bottom: 16px;">Recuperação de Senha - Meu Prof IA</h2>
              <p style="color: #334155; font-size: 14px;">Olá!</p>
              <p style="color: #334155; font-size: 14px;">Recebemos uma solicitação para redefinir a senha associada à sua conta no <strong>Meu Prof IA</strong>.</p>
              <p style="color: #334155; font-size: 14px;">Clique no botão abaixo para cadastrar uma nova senha (o link é válido por 1 hora):</p>
              <div style="margin: 28px 0; text-align: center;">
                <a href="${resetUrl}" style="background-color: #3A7BFF; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">Redefinir Minha Senha</a>
              </div>
              <p style="font-size: 12px; color: #64748b; margin-top: 24px;">Se você não solicitou a alteração, ignore este e-mail com segurança.</p>
            </div>
          `,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`[DISPARO RESEND SUCESSO]: E-mail enviado com sucesso para ${toEmail}. ID:`, data.id);
        return;
      } else {
        console.error(`[ERRO RESEND API]: Falha na resposta da Resend API:`, data);
      }
    } catch (resendErr: any) {
      console.error(`[EXCEÇÃO RESEND API]:`, resendErr.message || resendErr);
    }
  }

  // Option 2: SMTP / Nodemailer (if SMTP_HOST, SMTP_USER, SMTP_PASS are configured)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      console.log(`[DISPARO DE E-MAIL]: Tentando enviar via SMTP (${process.env.SMTP_HOST})...`);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Meu Prof IA" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: "🔒 Redefinição de Senha - Meu Prof IA",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <h2 style="color: #1D3C8F; margin-bottom: 16px;">Recuperação de Senha - Meu Prof IA</h2>
            <p style="color: #334155; font-size: 14px;">Olá!</p>
            <p style="color: #334155; font-size: 14px;">Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Meu Prof IA</strong>.</p>
            <p style="color: #334155; font-size: 14px;">Clique no botão abaixo para redefinir sua senha (link válido por 1 hora):</p>
            <div style="margin: 28px 0; text-align: center;">
              <a href="${resetUrl}" style="background-color: #3A7BFF; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">Redefinir Minha Senha</a>
            </div>
            <p style="font-size: 12px; color: #64748b; margin-top: 24px;">Se você não solicitou a alteração de senha, desconsidere esta mensagem.</p>
          </div>
        `,
      });

      console.log(`[DISPARO SMTP SUCESSO]: E-mail enviado com sucesso para ${toEmail}. Message ID:`, info.messageId);
      return;
    } catch (smtpErr: any) {
      console.error(`[ERRO SMTP SERVIDOR]: Falha ao enviar e-mail via SMTP:`, smtpErr.message || smtpErr);
    }
  }

  // Option 3: Fallback warning if no service credentials configured
  console.warn(
    `\n[ATENÇÃO - PROVEDOR DE E-MAIL NÃO CONFIGURADO]:\n` +
    `Nenhuma chave RESEND_API_KEY ou credencial SMTP (SMTP_HOST / SMTP_PASS) foi detectada nas variáveis de ambiente (.env).\n` +
    `Para testar o link de redefinição imediatamente, utilize o link do console impresso acima.`
  );
}

// In-memory store for reset tokens and user credentials
interface ResetTokenData {
  email: string;
  expiresAt: number;
}

const resetTokensStore: Record<string, ResetTokenData> = {};

// Interface for registered users database
export interface UserRecord {
  id: string;
  email: string;
  nome: string;
  plano: "Free" | "Premium";
  dataCadastro: string;
  status: "Ativo" | "Pendente" | "Inativo";
  ultimoAcesso: string;
  origem: string;
  passwordHash?: string;
}

// Real registered user database (starts with Gestor account)
const userDatabase: Record<string, UserRecord> = {
  "meuprofia@gmail.com": {
    id: "usr_gestor",
    email: "meuprofia@gmail.com",
    nome: "Gestor Administrador",
    plano: "Premium",
    dataCadastro: "2026-01-01",
    status: "Ativo",
    ultimoAcesso: "Hoje, agora",
    origem: "Painel Gestor",
  },
};

// Initialize Gemini Client
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "dummy-key-for-dev",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// AUTH API: Forgot Password
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "E-mail inválido ou não informado." });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email exists in database (or create record if new)
    if (!userDatabase[cleanEmail]) {
      const formattedName = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      userDatabase[cleanEmail] = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        nome: formattedName || "Novo Estudante",
        plano: "Free",
        dataCadastro: new Date().toISOString().split("T")[0],
        status: "Ativo",
        ultimoAcesso: "Hoje, agora",
        origem: "Recuperação de Senha",
      };
    }

    // Generate secure 1-hour token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 3600000; // 1 hour validity

    resetTokensStore[token] = {
      email: cleanEmail,
      expiresAt,
    };

    // Construct reset link URL
    const forwardedHost = req.get("x-forwarded-host");
    const forwardedProto = req.get("x-forwarded-proto");
    const host = forwardedHost || req.get("host") || "";
    const protocol = forwardedProto || (req.protocol === "https" || host.includes("run.app") ? "https" : "http");
    
    // If host is available, construct full URL, otherwise relative path
    const resetUrl = host ? `${protocol}://${host}/reset-password?token=${token}` : `/reset-password?token=${token}`;

    console.log(`[PASSWORD RESET LINK GENERATED FOR ${cleanEmail}]: ${resetUrl}`);

    // Send email asynchronously if SMTP is configured
    await sendRecoveryEmail(cleanEmail, resetUrl);

    // Return generic success message without leaking tokens or reset URLs in response
    res.json({
      success: true,
      message: "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha em instantes.",
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Erro interno ao processar a solicitação de redefinição." });
  }
});

// AUTH API: Verify Token
app.get("/api/auth/verify-token", (req, res) => {
  try {
    const token = req.query.token as string;
    if (!token || !resetTokensStore[token]) {
      return res.status(400).json({ valid: false, error: "Token de redefinição inválido ou não encontrado." });
    }

    const tokenData = resetTokensStore[token];
    if (Date.now() > tokenData.expiresAt) {
      delete resetTokensStore[token];
      return res.status(400).json({ valid: false, error: "O link de redefinição expirou (validade de 1 hora)." });
    }

    res.json({ valid: true, email: tokenData.email });
  } catch (error: any) {
    res.status(500).json({ valid: false, error: "Erro ao verificar token." });
  }
});

// AUTH API: Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !resetTokensStore[token]) {
      return res.status(400).json({ error: "Token de redefinição inválido ou inexistente." });
    }

    const tokenData = resetTokensStore[token];

    if (Date.now() > tokenData.expiresAt) {
      delete resetTokensStore[token];
      return res.status(400).json({ error: "O link de redefinição expirou. Solicite um novo e-mail de recuperação." });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: "A nova senha deve possuir no mínimo 8 caracteres." });
    }

    // Encrypt new password using bcrypt
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Save hash in database
    if (userDatabase[tokenData.email]) {
      userDatabase[tokenData.email].passwordHash = passwordHash;
    } else {
      userDatabase[tokenData.email] = {
        id: `usr_${Date.now()}`,
        email: tokenData.email,
        nome: tokenData.email.split("@")[0],
        plano: "Free",
        dataCadastro: new Date().toISOString().split("T")[0],
        status: "Ativo",
        ultimoAcesso: "Hoje, agora",
        origem: "Recuperação de Senha",
        passwordHash,
      };
    }

    // Invalidate used token
    delete resetTokensStore[token];

    res.json({
      success: true,
      message: "Senha alterada com sucesso! Faça login com sua nova senha.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Erro ao redefinir a senha." });
  }
});

// GESTOR API: Get all registered users (Free & Premium)
app.get("/api/gestor/users", (req, res) => {
  try {
    const users = Object.values(userDatabase);
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error: any) {
    console.error("Error fetching gestor users:", error);
    res.status(500).json({ error: "Erro ao buscar lista de usuários cadastrados." });
  }
});

// GESTOR API: Update user plan (Free <-> Premium)
app.post("/api/gestor/users/update-plan", (req, res) => {
  try {
    const { email, plano } = req.body;
    if (!email || !plano || (plano !== "Free" && plano !== "Premium")) {
      return res.status(400).json({ error: "Dados inválidos para alteração de plano." });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!userDatabase[cleanEmail]) {
      return res.status(404).json({ error: "Usuário não encontrado na base de dados." });
    }

    userDatabase[cleanEmail].plano = plano;
    console.log(`[GESTOR PLAN UPDATE]: ${cleanEmail} alterado para Plano ${plano}`);

    res.json({
      success: true,
      message: `Plano do usuário ${cleanEmail} alterado para ${plano} com sucesso!`,
      user: userDatabase[cleanEmail],
    });
  } catch (error: any) {
    console.error("Error updating user plan:", error);
    res.status(500).json({ error: "Erro ao atualizar plano do usuário." });
  }
});

// GESTOR API: Add user manually
app.post("/api/gestor/users/add", (req, res) => {
  try {
    const { email, nome, plano, origem } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail inválido." });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (userDatabase[cleanEmail]) {
      return res.status(400).json({ error: "Este e-mail já está cadastrado no sistema." });
    }

    const formattedName = (nome && nome.trim()) || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const newUser: UserRecord = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      nome: formattedName,
      plano: plano === "Premium" ? "Premium" : "Free",
      dataCadastro: new Date().toISOString().split("T")[0],
      status: "Ativo",
      ultimoAcesso: "Recém Cadastrado",
      origem: origem || "Painel do Gestor",
    };

    userDatabase[cleanEmail] = newUser;
    console.log(`[GESTOR USER ADDED]: ${cleanEmail} adicionado com plano ${newUser.plano}`);

    res.json({
      success: true,
      message: `Usuário ${cleanEmail} cadastrado com sucesso!`,
      user: newUser,
    });
  } catch (error: any) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  }
});

// GESTOR API: Delete user
app.delete("/api/gestor/users/delete", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "E-mail não informado." });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === "meuprofia@gmail.com") {
      return res.status(400).json({ error: "Não é permitido excluir o e-mail do Gestor Principal." });
    }

    if (!userDatabase[cleanEmail]) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    delete userDatabase[cleanEmail];
    console.log(`[GESTOR USER DELETED]: ${cleanEmail} removido do banco.`);

    res.json({
      success: true,
      message: `Usuário ${cleanEmail} excluído com sucesso.`,
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Erro ao excluir usuário." });
  }
});

// AUTH API: Register user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail inválido." });
    }
    const cleanEmail = email.toLowerCase().trim();
    const formattedName = (nome && nome.trim()) || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    if (userDatabase[cleanEmail]) {
      return res.status(400).json({ error: "Este e-mail já possui cadastro. Faça login para acessar sua conta." });
    }

    let passwordHash: string | undefined = undefined;
    if (senha) {
      passwordHash = await bcrypt.hash(senha, 10);
    }

    const isGestor = cleanEmail === "meuprofia@gmail.com";
    const newUser: UserRecord = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      nome: formattedName,
      plano: isGestor ? "Premium" : "Free",
      dataCadastro: new Date().toISOString().split("T")[0],
      status: "Ativo",
      ultimoAcesso: "Hoje, agora",
      origem: "Cadastro no App",
      passwordHash,
    };

    userDatabase[cleanEmail] = newUser;
    console.log(`[AUTH REGISTER]: Novo usuário cadastrado: ${cleanEmail}`);

    res.json({
      success: true,
      message: "Cadastro realizado com sucesso!",
      user: {
        id: newUser.id,
        email: newUser.email,
        nome: newUser.nome,
        plano: newUser.plano,
      },
    });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Erro interno ao cadastrar nova conta." });
  }
});

// AUTH API: Login user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "E-mail inválido." });
    }
    const cleanEmail = email.toLowerCase().trim();

    let user = userDatabase[cleanEmail];
    if (!user) {
      const formattedName = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      user = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        nome: formattedName,
        plano: cleanEmail === "meuprofia@gmail.com" ? "Premium" : "Free",
        dataCadastro: new Date().toISOString().split("T")[0],
        status: "Ativo",
        ultimoAcesso: "Hoje, agora",
        origem: "Login Direto",
      };
      userDatabase[cleanEmail] = user;
    } else {
      user.ultimoAcesso = "Hoje, agora";
      if (senha && user.passwordHash) {
        const isValid = await bcrypt.compare(senha, user.passwordHash);
        if (!isValid) {
          return res.status(401).json({ error: "Senha incorreta. Verifique os dados ou redefina sua senha." });
        }
      }
    }

    res.json({
      success: true,
      message: "Login efetuado com sucesso!",
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        plano: user.plano,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Erro ao autenticar usuário." });
  }
});

// Interface for Student Feedback Records
export interface FeedbackRecord {
  id: string;
  usuario_email: string;
  usuario_nome?: string;
  mensagem: string;
  data_envio: string;
  status: "Não lido" | "Lido";
  anonimo?: boolean;
}

// In-memory feedback database store (starts empty, populated by real user feedback)
const feedbackDatabase: FeedbackRecord[] = [];

// PUBLIC / ALUNO API: Submit Feedback / Sugestão
app.post("/api/feedbacks", (req, res) => {
  try {
    const { email, nome, mensagem } = req.body;

    if (!mensagem || typeof mensagem !== "string" || mensagem.trim().length < 3) {
      return res.status(400).json({ error: "Por favor, escreva sua mensagem ou opinião antes de enviar." });
    }

    const cleanEmail = email && typeof email === "string" && email.trim() ? email.trim() : "aluno@estudante.com";
    const cleanNome = nome && typeof nome === "string" && nome.trim() ? nome.trim() : cleanEmail.split("@")[0];

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;

    const newFeedback: FeedbackRecord = {
      id: `fb_${Date.now()}`,
      usuario_email: cleanEmail,
      usuario_nome: cleanNome,
      mensagem: mensagem.trim(),
      data_envio: formattedDate,
      status: "Não lido",
      anonimo: false,
    };

    feedbackDatabase.unshift(newFeedback);
    console.log(`[FEEDBACK RECEBIDO] De: ${cleanNome} (${cleanEmail}) | Mensagem: ${mensagem.substring(0, 50)}...`);

    res.json({
      success: true,
      message: "Sua opinião foi enviada com sucesso ao nosso time! Obrigado por colaborar.",
      feedback: newFeedback,
    });
  } catch (error: any) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Erro ao registrar sua opinião. Tente novamente." });
  }
});

// GESTOR API: Get all feedbacks
app.get("/api/gestor/feedbacks", (req, res) => {
  try {
    const unreadCount = feedbackDatabase.filter((f) => f.status === "Não lido").length;
    res.json({
      success: true,
      count: feedbackDatabase.length,
      unreadCount,
      feedbacks: feedbackDatabase,
    });
  } catch (error: any) {
    console.error("Error fetching gestor feedbacks:", error);
    res.status(500).json({ error: "Erro ao buscar opiniões dos alunos." });
  }
});

// GESTOR API: Update feedback status
app.post("/api/gestor/feedbacks/status", (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status || !["Não lido", "Lido"].includes(status)) {
      return res.status(400).json({ error: "Status de feedback inválido." });
    }

    const item = feedbackDatabase.find((f) => f.id === id);
    if (!item) {
      return res.status(404).json({ error: "Feedback não encontrado." });
    }

    item.status = status;
    console.log(`[GESTOR FEEDBACK STATUS UPDATED]: Feedback ${id} alterado para ${status}`);

    const unreadCount = feedbackDatabase.filter((f) => f.status === "Não lido").length;

    res.json({
      success: true,
      message: `Status do feedback atualizado para '${status}'.`,
      feedback: item,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error updating feedback status:", error);
    res.status(500).json({ error: "Erro ao atualizar status do feedback." });
  }
});

// GESTOR API: Delete feedback
app.delete("/api/gestor/feedbacks/delete", (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "ID do feedback não informado." });
    }

    const index = feedbackDatabase.findIndex((f) => f.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Feedback não encontrado." });
    }

    feedbackDatabase.splice(index, 1);
    console.log(`[GESTOR FEEDBACK DELETED]: ${id} removido.`);

    const unreadCount = feedbackDatabase.filter((f) => f.status === "Não lido").length;

    res.json({
      success: true,
      message: "Opinião excluída com sucesso.",
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ error: "Erro ao excluir feedback." });
  }
});

// API Endpoint: AI Chat Tutor
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history, profile } = req.body;
    const ai = getGenAI();

    const userEmail = (profile?.email || "").toLowerCase().trim();

    const studentUsers = Object.values(userDatabase).filter(u => u.email.toLowerCase().trim() !== "meuprofia@gmail.com");
    const totalCount = studentUsers.length;
    const freeCount = studentUsers.filter(u => u.plano === "Free").length;
    const premiumCount = studentUsers.filter(u => u.plano === "Premium").length;
    const onlineStudents = studentUsers.filter(u => u.ultimoAcesso.includes("agora") || u.ultimoAcesso.includes("minuto")).length;
    const mrrValue = (premiumCount * 29.90).toFixed(2);

    const systemInstruction = `Você é o Painel Executivo e Assistente de Gestão do Web App. Sua função e o nível de acesso variam estritamente de acordo com o e-mail do usuário autenticado no sistema.

E-MAIL DO GESTOR AUTORIZADO: meuprofia@gmail.com
E-MAIL DO USUÁRIO CONECTADO ATUALMENTE: ${userEmail || "não_informado"}

---

[REGRA 1: USUÁRIO COMUM (Qualquer e-mail diferente de meuprofia@gmail.com)]
1. Atue apenas como o assistente padrão do aplicativo e tutor educacional Prof IA, ajudando com dúvidas gerais e uso da plataforma.
2. NUNCA revele, confirme ou mencione a existência de métricas internas, estatísticas, painel de controle, planos assinados, consumo da API ou usuários online.
3. Se o usuário perguntar sobre dados do aplicativo, métricas ou infraestrutura, responda educadamente que você não tem acesso a essas informações.

---

[REGRA 2: MODO GESTOR EXCLUSIVO PARA: meuprofia@gmail.com]
1. Reconheça e confirme que o usuário atual é o DONO/GESTOR do aplicativo.
2. Libere o acesso total ao "Painel Executivo e Métricas do App".
3. Sempre que o gestor solicitar informações sobre o status, relatórios, métricas ou desempenho do aplicativo, exiba um resumo limpo e bem formatado em Markdown com as métricas reais atuais do sistema (O gestor não é contabilizado nas métricas de alunos):

   📊 PAINEL DE GESTÃO DO APLICATIVO

   🟢 ATIVIDADE EM TEMPO REAL
   • Estudantes Conectados Agora: ${onlineStudents}
   
   👥 BASE DE ESTUDANTES E PLANOS (DADOS REAIS DA BASE DE ALUNOS)
   • Total de Contas de Alunos Cadastradas: ${totalCount}
   • Alunos no Plano Free: ${freeCount}
   • Alunos no Plano Premium (Pagos): ${premiumCount}

   💰 RECEITA E OPERAÇÃO REAIS
   • Receita Recorrente Mensal (MRR): R$ ${mrrValue}/mês (${premiumCount} alunos Premium x R$ 29,90)

4. Ofereça insights e respostas focadas em gestão de negócios, aquisição de clientes, custos operacionais e desempenho do sistema sempre que solicitado pelo gestor.

---
Dados do perfil do usuário:
- Nome: ${profile?.nome || "Estudante"}
- Nível de escolaridade: ${profile?.escolaridade || "Estudante"}`;

    const chatHistory = (history || []).map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        ...chatHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || "Desculpe, não consegui processar sua mensagem no momento." });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Erro ao comunicar com a IA." });
  }
});

// API Endpoint: Generate Quiz
app.post("/api/gemini/quiz", async (req, res) => {
  try {
    const { assunto, materia, nivel } = req.body;
    const ai = getGenAI();

    const prompt = `Gere exatamente 10 questões de múltipla escolha sobre o assunto "${assunto}" para a matéria de "${materia || "Geral"}" no nível "${nivel || "Geral"}".
Cada questão deve ter 4 alternativas (A, B, C, D), a indicação da alternativa correta (0 para A, 1 para B, 2 para C, 3 para D) e uma explicação pedagógica clara sobre o porquê da resposta.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pergunta: { type: Type.STRING, description: "O enunciado da questão" },
              opcoes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array com exatamente 4 opções de resposta",
              },
              corretaIndex: { type: Type.INTEGER, description: "Índice de 0 a 3 da alternativa correta" },
              explicacao: { type: Type.STRING, description: "Explicação detalhada e pedagógica do gabarito" },
            },
            required: ["pergunta", "opcoes", "corretaIndex", "explicacao"],
          },
        },
      },
    });

    const quizData = JSON.parse(response.text || "[]");
    res.json({ questions: quizData });
  } catch (error: any) {
    console.error("Quiz error:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar quiz." });
  }
});

// API Endpoint: Generate Flashcards
app.post("/api/gemini/flashcards", async (req, res) => {
  try {
    const { assunto, materia } = req.body;
    const ai = getGenAI();

    const prompt = `Gere exatamente 10 flashcards pedagógicos sobre "${assunto}" na matéria "${materia || "Geral"}".
Cada flashcard deve conter um conceito/pergunta na frente (frente) e uma explicação sintética e direta no verso (verso), com uma dica útil para memorização.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              frente: { type: Type.STRING, description: "Frente do cartão (pergunta ou conceito)" },
              verso: { type: Type.STRING, description: "Verso do cartão (resposta ou explicação)" },
              dica: { type: Type.STRING, description: "Dica macete para memorização" },
            },
            required: ["frente", "verso"],
          },
        },
      },
    });

    const flashcards = JSON.parse(response.text || "[]");
    res.json({ flashcards });
  } catch (error: any) {
    console.error("Flashcards error:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar flashcards." });
  }
});

// API Endpoint: Generate Simulado
app.post("/api/gemini/simulado", async (req, res) => {
  try {
    const { tipo, quantidade, materias, nivel } = req.body; // tipo: ENEM, OAB, Concurso, etc. quantidade: 10, 20, 30
    const ai = getGenAI();

    const count = parseInt(quantidade) || 10;
    const prompt = `Gere um simulado oficial no estilo "${tipo || "ENEM / Concurso"}" focado em "${materias || "Matérias Gerais"}" para nível "${nivel || "Geral"}".
O simulado deve conter exatamente ${count} questões no formato padrão de prova, com enunciado, 4 ou 5 alternativas, indicação da alternativa correta e resolução fundamentada.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              materia: { type: Type.STRING, description: "Disciplina da questão" },
              enunciado: { type: Type.STRING, description: "Texto da questão / enunciado" },
              opcoes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Lista de alternativas A, B, C, D (e E se aplicável)",
              },
              corretaIndex: { type: Type.INTEGER, description: "Índice (0-based) da opção correta" },
              resolucao: { type: Type.STRING, description: "Resolução e fundamentação detalhada" },
            },
            required: ["materia", "enunciado", "opcoes", "corretaIndex", "resolucao"],
          },
        },
      },
    });

    const simulado = JSON.parse(response.text || "[]");
    res.json({ questions: simulado });
  } catch (error: any) {
    console.error("Simulado error:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar simulado." });
  }
});

// API Endpoint: Material Inteligente (Resumos, Mapas Mentais, Reescritas)
app.post("/api/gemini/material", async (req, res) => {
  try {
    const { texto, acao, imagemBase64 } = req.body; // acao: 'resumo', 'mapa', 'reescrita'
    const ai = getGenAI();

    let parts: any[] = [];
    if (imagemBase64) {
      const mime = imagemBase64.startsWith("data:") ? imagemBase64.split(";")[0].replace("data:", "") : "image/jpeg";
      const dataClean = imagemBase64.includes("base64,") ? imagemBase64.split("base64,")[1] : imagemBase64;
      parts.push({
        inlineData: {
          mimeType: mime,
          data: dataClean,
        },
      });
    }

    let instructionText = "";
    if (acao === "mapa") {
      instructionText = `Analise o seguinte material de estudo e crie um Mapa Mental Estruturado em tópicos e subtópicos lógicos, destacando conceitos-chave, conexões e palavras de ordem.`;
    } else if (acao === "reescrita") {
      instructionText = `Reescreva o material a seguir de forma extremamente didática, simplificada, clara e enriquecida com analogias para facilitar a fixação do aluno.`;
    } else {
      instructionText = `Elabore um resumo inteligente e completo do material fornecido, destacando os pontos mais cobrados em provas, definições fundamentais e dicas práticas de estudo.`;
    }

    if (texto) {
      instructionText += `\n\nTexto do material:\n${texto}`;
    }

    parts.push({ text: instructionText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        temperature: 0.5,
      },
    });

    res.json({ resultado: response.text || "Não foi possível analisar o material." });
  } catch (error: any) {
    console.error("Material error:", error);
    res.status(500).json({ error: error.message || "Erro ao processar material." });
  }
});

// API Endpoint: Redação com Prof IA (Avaliação nos moldes do ENEM 0 - 1000)
app.post("/api/gemini/redacao", async (req, res) => {
  try {
    const { textoRedacao, tema, imagemBase64 } = req.body;
    const ai = getGenAI();

    let parts: any[] = [];
    if (imagemBase64) {
      const mime = imagemBase64.startsWith("data:") ? imagemBase64.split(";")[0].replace("data:", "") : "image/jpeg";
      const dataClean = imagemBase64.includes("base64,") ? imagemBase64.split("base64,")[1] : imagemBase64;
      parts.push({
        inlineData: {
          mimeType: mime,
          data: dataClean,
        },
      });
    }

    const promptText = `Atue como um corretor especialista do ENEM e bancas de concurso.
Avalie rigorosamente a redação a seguir sobre o tema: "${tema || "Tema Livre/Geral"}".
Se houver uma imagem anexa, transcreva e analise o texto da imagem.
${textoRedacao ? `\nTexto da redação:\n${textoRedacao}` : ""}

Avalie de 0 a 200 pontos em cada uma das 5 Competências do ENEM:
- Competência 1: Domínio da norma culta da língua escrita.
- Competência 2: Compreensão da proposta e aplicação de áreas do conhecimento.
- Competência 3: Seleção, relação, organização e interpretação de informações/argumentos.
- Competência 4: Demonstração de conhecimento dos mecanismos linguísticos (coesão).
- Competência 5: Elaboração de proposta de intervenção para o problema abordado.

Calcule a nota total (soma das 5 competências de 0 a 1000). Forneça um parecer geral com pontos fortes e sugestões específicas de reescrita e melhoria.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            notaFinal: { type: Type.INTEGER, description: "Nota total da redação de 0 a 1000" },
            competencias: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  nota: { type: Type.INTEGER, description: "De 0 a 200" },
                  feedback: { type: Type.STRING },
                },
                required: ["nome", "nota", "feedback"],
              },
            },
            parecerGeral: { type: Type.STRING },
            pontosFortes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            pontosMelhoria: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sugestaoReescrita: { type: Type.STRING },
          },
          required: ["notaFinal", "competencias", "parecerGeral", "pontosFortes", "pontosMelhoria"],
        },
      },
    });

    const avaliacao = JSON.parse(response.text || "{}");
    res.json({ avaliacao });
  } catch (error: any) {
    console.error("Redacao error:", error);
    res.status(500).json({ error: error.message || "Erro ao corrigir redação." });
  }
});

// API Endpoint: Study Plan Generation
app.post("/api/gemini/study-plan", async (req, res) => {
  try {
    const { profile } = req.body;
    const ai = getGenAI();

    const prompt = `Com base na anamnese educacional do aluno:
- Nível: ${profile?.escolaridade || "Geral"}
- Objetivos: ${profile?.objetivos?.join(", ") || "Melhorar estudos"}
- Matérias para reforço: ${profile?.materiasOut || "Matemática, Português"}
- Horário de pico: ${profile?.horarioRendimento || "Qualquer"}
- Situação atual: ${profile?.situacaoEducacional || "Estudante"}
- Dificuldades: ${profile?.dificuldades?.join(", ") || "Foco"}

Crie um cronograma semanal estratégico de estudos de Segunda a Domingo.
Para cada dia da semana, sugira de 2 a 3 missões com matérias, horários recomendados, tópicos prioritários e tipo de estudo (teoria, exercício ou revisão).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dia: { type: Type.STRING, description: "Dia da semana (Ex: Segunda-feira)" },
              missoes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    materia: { type: Type.STRING },
                    topico: { type: Type.STRING },
                    duracao: { type: Type.STRING, description: "Ex: 45 min" },
                    tipo: { type: Type.STRING, description: "Teoria, Exercícios ou Revisão" },
                    concluida: { type: Type.BOOLEAN },
                  },
                  required: ["id", "materia", "topico", "duracao", "tipo"],
                },
              },
            },
            required: ["dia", "missoes"],
          },
        },
      },
    });

    const cronograma = JSON.parse(response.text || "[]");
    res.json({ cronograma });
  } catch (error: any) {
    console.error("Study plan error:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar plano de estudos." });
  }
});

// API Endpoint: Raio X Semanal/Mensal
app.post("/api/gemini/raio-x", async (req, res) => {
  try {
    const { profile, stats } = req.body;
    const ai = getGenAI();

    const prompt = `Gere um relatório analítico "Raio X do Estudante" para o Prof IA.
Dados do Aluno:
- Nome/Nível: ${profile?.nome || "Estudante"} (${profile?.escolaridade || "Geral"})
- Tarefas concluídas esta semana: ${stats?.tarefasConcluidas || 12}
- Quizzes realizados: ${stats?.quizzesFeitos || 5}
- Taxa de acerto estimada: ${stats?.taxaAcerto || "82"}%
- Streak: ${stats?.streak || 4} dias seguidos

Forneça um diagnóstico inteligente com análise de desempenho por área, nível de consistência, alerta de atenção pedagógica e 3 ações práticas de ajuste de rota.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosticoGeral: { type: Type.STRING },
            nivelConsistencia: { type: Type.STRING, description: "Ex: Excelente (88%)" },
            pontosFortesArea: { type: Type.ARRAY, items: { type: Type.STRING } },
            atencaoNecessaria: { type: Type.ARRAY, items: { type: Type.STRING } },
            recomendacoesProximaSemana: { type: Type.ARRAY, items: { type: Type.STRING } },
            mensagemMotivacional: { type: Type.STRING },
          },
          required: ["diagnosticoGeral", "nivelConsistencia", "pontosFortesArea", "atencaoNecessaria", "recomendacoesProximaSemana", "mensagemMotivacional"],
        },
      },
    });

    const raioX = JSON.parse(response.text || "{}");
    res.json({ raioX });
  } catch (error: any) {
    console.error("Raio X error:", error);
    res.status(500).json({ error: error.message || "Erro ao gerar Raio X." });
  }
});

// API Endpoint: Text Editor AI Refine
app.post("/api/gemini/editor-refine", async (req, res) => {
  try {
    const { texto, instrucao } = req.body;
    const ai = getGenAI();

    const prompt = `Atue como um revisor ortográfico e assistente de redação acadêmica.
Aprimore o texto a seguir conforme a instrução: "${instrucao || "Melhorar clareza e gramática"}".
Mantenha a formatação limpa e responda APENAS com o texto melhorado.

Texto original:
${texto}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ textoAprimorado: response.text || texto });
  } catch (error: any) {
    console.error("Editor refine error:", error);
    res.status(500).json({ error: error.message || "Erro ao aprimorar texto." });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Prof IA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
