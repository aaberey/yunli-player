const fs = require('fs').promises;
const path = require('path');
const NodeID3 = require('node-id3');

// Variáveis para facilitar a troca
const projectName = 'Bittersweet'; // Nome do projeto (base para pasta, imagem e JSON)
const baseDir = './'; // Diretório base

// Caminhos baseados no nome do projeto
const musicDir = path.join(baseDir, 'music', projectName); // Pasta de músicas
const coverImage = path.join(baseDir, 'images', `${projectName}.png`); // Imagem da capa
const jsonFile = path.join(baseDir, `${projectName}.json`); // Arquivo JSON

async function getTrackNumber(filePath) {
  try {
    const tags = NodeID3.read(filePath); // Lê os metadados do arquivo
    return tags.trackNumber || null; // Retorna o número da faixa ou null
  } catch (err) {
    console.error(`Erro ao ler metadados de ${path.basename(filePath)}:`, err.message);
    return null; // Retorna null em caso de erro
  }
}

async function generateMusicList() {
  try {
    console.log('Diretório de música:', musicDir);

    const files = await fs.readdir(musicDir);
    console.log('Arquivos encontrados:', files);

    const musicList = [];

    for (const file of files) {
      if (file.endsWith('.mp3')) {
        const filePath = path.join(musicDir, file);

        // Obtemos o número da faixa
        const numero = await getTrackNumber(filePath);

        musicList.push({
          nome: file.replace('.mp3', ''), // Nome da música sem a extensão
          numero: numero, // Número da faixa obtido
          src: filePath.replace(/\\/g, '/'), // Ajusta o caminho para evitar problemas no JSON
          cover: coverImage.replace(/\\/g, '/'), // Caminho da capa no formato correto
        });
      }
    }

    // Ordena a lista de músicas por número
    musicList.sort((a, b) => (a.numero || 0) - (b.numero || 0));

    console.log('Lista de músicas gerada:', musicList);
    await fs.writeFile(jsonFile, JSON.stringify(musicList, null, 2));
    console.log(`Arquivo JSON '${jsonFile}' gerado com sucesso!`);
  } catch (err) {
    console.error('Erro:', err.message);
  }
}

// Executa a função
generateMusicList();
