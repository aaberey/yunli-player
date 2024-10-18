const fs = require('fs').promises; // Usando a versão de promessas do fs
const path = require('path');
const mm = require('music-metadata');

var musicDir = './music/Bonda3'; // Substitua pelo caminho correto
var coverImage = './images/Bonda3.png'; // Imagem da capa



async function getTrackNumber(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    return metadata.common.track?.no || null; // Retorna o número da faixa ou null se não estiver definido
  } catch (err) {
    console.error(`Erro ao ler metadados de ${path.basename(filePath)}:`, err);
    return null; // Retorna null em caso de erro
  }
}

async function generateMusicList() {
  try {
    console.log('Diretório de música:', musicDir); // Log do caminho

    const files = await fs.readdir(musicDir);
    console.log('Arquivos encontrados:', files); // Log dos arquivos encontrados

    const musicList = [];

    for (const file of files) {
      if (file.endsWith('.mp3')) {
        const filePath = path.join(musicDir, file);
        
        // Obtemos o número da faixa
        const numero = await getTrackNumber(filePath);

        musicList.push({
          nome: file.replace('.mp3', ''), // Nome da música sem a extensão
          numero: numero, // Número da faixa obtido
          src: filePath,
          cover: coverImage,
        });
      }
    }

    // Ordena a lista de músicas por número
    musicList.sort((a, b) => (a.numero || 0) - (b.numero || 0));

    console.log('Lista de músicas gerada:', musicList);
    await fs.writeFile('Bonda3.json', JSON.stringify(musicList, null, 2));
    console.log('Arquivo musicas.json gerado com sucesso!');

  } catch (err) {
    console.error('Erro:', err);
  }
}

// Executa a função
generateMusicList();
