const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Servir arquivos estáticos se necessário

// Função para carregar o HTML do template
function loadTemplate() {
  return fs.readFileSync(path.join(__dirname, "template.html"), "utf-8");
}

// Rota para gerar o PDF
app.post("/generate-pdf", async (req, res) => {
  const formData = req.body;

  try {
    // Carrega o HTML do arquivo e substitui os placeholders pelos dados do formulário
    let htmlContent = loadTemplate();
    Object.keys(formData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlContent = htmlContent.replace(regex, formData[key] || "");
    });

    // Inicia o Puppeteer
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Carrega o HTML gerado no Puppeteer
    await page.setContent(htmlContent, { waitUntil: "load" });

    // Caminho para salvar o PDF temporariamente
    const pdfPath = path.join(__dirname, "public", "formulario.pdf");

    // Gera o PDF
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

    await browser.close();

    // Envia o PDF para download
    res.download(pdfPath, "formulario.pdf", (err) => {
      if (err) console.error(err);
      fs.unlinkSync(pdfPath); // Remove o arquivo após o download
    });

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).send("Erro ao gerar PDF.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
