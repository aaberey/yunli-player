const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const inputDir = './images'; // Pasta onde estão os arquivos JPEG
const outputDir = './images'; // Pasta onde os PNG serão salvos

async function convertJpegToPng() {
  try {
    // Certifique-se de que o diretório de saída existe
    await fs.mkdir(outputDir, { recursive: true });

    // Lê todos os arquivos na pasta de entrada
    const files = await fs.readdir(inputDir);

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg)$/i, '.png'));

      // Verifica se o arquivo é um JPEG
      if (file.match(/\.(jpg|jpeg)$/i)) {
        try {
          // Converte o arquivo JPEG para PNG usando sharp
          await sharp(inputPath)
            .png({ quality: 100 }) // Qualidade máxima
            .toFile(outputPath);

          console.log(`Convertido: ${file} → ${path.basename(outputPath)}`);
        } catch (err) {
          console.error(`Erro ao converter ${file}:`, err.message);
        }
      }
    }

    console.log('Conversão concluída!');
  } catch (err) {
    console.error('Erro:', err.message);
  }
}

// Executa a função
convertJpegToPng();
