const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn'); // Botão de shuffle
const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.getElementById('progress-bar-container');
const volumeBar = document.getElementById('volume-bar');
const volumeBarContainer = document.getElementById('volume-bar-container');
const coverImage = document.getElementById('cover-image');
const playlistElement = document.getElementById('playlist');
const pageInfo = document.getElementById('page-info');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

let currentTrackIndex = 0;
let currentPage = 0;
const tracksPerPage = 7; // 7 músicas por página
let tracks = [];
let isShuffle = false; // Estado do shuffle
let isPlaying = false; // Estado de reprodução
let previousTrackIndex = null; // Índice da música anterior

document.addEventListener('DOMContentLoaded', () => {
  loadTracks(); // Carrega as músicas ao iniciar
});


// Função para carregar músicas do JSON
async function loadTracks(albb) {
  try {
    const response = await fetch(albb);
    tracks = await response.json();
    displayTracks();
    loadTrack(currentTrackIndex,true); // Carrega a primeira música ao iniciar
  } catch (error) {
    console.error('Erro ao carregar as músicas:', error);
  }
}


// Função para embaralhar as músicas
function shuffleTracks() {
  for (let i = tracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]]; // Troca as músicas
  }
}

// Adiciona evento ao botão de shuffle
shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle; // Alterna o estado do shuffle

  // Altera a cor e o ícone do botão para indicar o estado do shuffle
  if (isShuffle) {
    shuffleBtn.style.color = '#ff1414';  // Altera a cor para vermelho quando ativado
    shuffleBtn.textContent = '🔀';  // Ícone de shuffle ativo
  } else {
    shuffleBtn.style.color = '#ffffff';  // Altera a cor para branco quando desativado
    shuffleBtn.textContent = '➡️';  // Ícone de shuffle desativado
  }
});


// Função para exibir músicas na playlist
function displayTracks() {
  playlistElement.innerHTML = ''; // Limpa a lista de reprodução
  const startIndex = currentPage * tracksPerPage;
  const endIndex = startIndex + tracksPerPage;
  const tracksToDisplay = tracks.slice(startIndex, endIndex);

  tracksToDisplay.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = track.nome || "Nome desconhecido"; // Atribui o nome ou "Nome desconhecido" se não houver
    li.setAttribute('data-src', track.src);
    li.setAttribute('data-cover', track.cover);

    // Adiciona a classe 'active' ao item da lista atualmente selecionado
    if (currentTrackIndex === startIndex + index) {
      li.classList.add('active');
    }

    playlistElement.appendChild(li);
    
    // Evento para tocar a música quando clicar na lista
    li.addEventListener('click', () => {
      currentTrackIndex = startIndex + index; // Atualiza o índice da música atual
      loadTrack(currentTrackIndex);
      audioPlayer.play();
      playBtn.textContent = '⏸️';  // Alterar o emoji para "pause"
    });
  });

  // Atualiza informações de paginação
  pageInfo.textContent = `Página ${currentPage + 1} de ${Math.ceil(tracks.length / tracksPerPage)}`;
  prevPageBtn.disabled = currentPage === 0; // Desabilitar botão se estiver na primeira página
  nextPageBtn.disabled = endIndex >= tracks.length; // Desabilitar botão se estiver na última página
}

// Função para mudar de página
prevPageBtn.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    displayTracks();
  }
});

nextPageBtn.addEventListener('click', () => {
  if ((currentPage + 1) * tracksPerPage < tracks.length) {
    currentPage++;
    displayTracks();
  }
});

// Função para carregar uma música
function loadTrack(index, shouldplay) {
  const selectedTrack = tracks[index];
  const trackSrc = selectedTrack.src;
  const coverSrc = selectedTrack.cover;

  // Carregar música e imagem de capa
  audioPlayer.src = trackSrc;
  coverImage.src = coverSrc;
  if (shouldplay) { audioPlayer.play(); playBtn.textContent = '⏸️'; }
  currentPage = 0;
  

  // Remove a classe 'active' de todos os itens
  const playlistItems = document.querySelectorAll('#playlist li');
  playlistItems.forEach(item => item.classList.remove('active'));

  // Adiciona a classe 'active' no item atual
  playlistItems[index % tracksPerPage].classList.add('active'); // index % tracksPerPage para obter o índice correto na página atual
}

// Evento de fim da música
audioPlayer.addEventListener('ended', () => {
  if (isShuffle) {
    currentTrackIndex = Math.floor(Math.random() * tracks.length); // Seleciona uma música aleatória
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length; // Avança para a próxima música
  }
  loadTrack(currentTrackIndex); // Carrega a nova música
  audioPlayer.play(); // Inicia a reprodução da nova música
  playBtn.textContent = '⏸️'; // Muda o botão para "pause"
  
});

// Função para tocar ou pausar
playBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playBtn.textContent = '⏸️';  // Alterar o emoji para "pause"
    isPlaying = true;
  } else {
    audioPlayer.pause();
    playBtn.textContent = '▶️';  // Alterar o emoji para "play"
    isPlaying = false;
  }
});

// Função para ir para a próxima música
nextBtn.addEventListener('click', () => {
  if (isShuffle) {
    let newTrackIndex;
    do {
      newTrackIndex = Math.floor(Math.random() * tracks.length);
    } while (newTrackIndex === previousTrackIndex);
    currentTrackIndex = newTrackIndex;
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length; // Avança para a próxima música
  }

  previousTrackIndex = currentTrackIndex; // Atualiza o índice da música anterior
  goToTrackPage(currentTrackIndex); // Vai para a página da música atual
  loadTrack(currentTrackIndex);
  audioPlayer.play(); // Inicia a reprodução da nova música
  playBtn.textContent = '⏸️'; // Muda o botão para "pause"
});

// Função para ir para a música anterior
prevBtn.addEventListener('click', () => {
  if (isShuffle) {
    let newTrackIndex;
    do {
      newTrackIndex = Math.floor(Math.random() * tracks.length);
    } while (newTrackIndex === previousTrackIndex);
    currentTrackIndex = newTrackIndex;
  } else {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length; // Volta para a música anterior
  }

  previousTrackIndex = currentTrackIndex; // Atualiza o índice da música anterior
  goToTrackPage(currentTrackIndex); // Vai para a página da música atual
  loadTrack(currentTrackIndex);
  audioPlayer.play(); // Inicia a reprodução da nova música
  playBtn.textContent = '⏸️'; // Muda o botão para "pause"
});


// Atualizar a barra de progresso
audioPlayer.addEventListener('timeupdate', () => {
  const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${progressPercentage}%`;
});

// Permitir clicar na barra de progresso para mudar a música
progressBarContainer.addEventListener('click', (event) => {
  const rect = progressBarContainer.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickPercent = clickX / progressBarContainer.clientWidth;
  audioPlayer.currentTime = clickPercent * audioPlayer.duration;
});

// Configurar o volume
volumeBarContainer.addEventListener('click', (event) => {
  const rect = volumeBarContainer.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickPercent = clickX / volumeBarContainer.clientWidth;
  audioPlayer.volume = clickPercent; // Ajustar o volume
  volumeBar.style.width = `${clickPercent * 100}%`; // Atualiza a barra de volume
});

// Carregar músicas ao iniciar
loadTracks();



// Função para calcular a página da música atual
function calculatePageForTrack(index) {
  return Math.floor(index / tracksPerPage); // Calcula em qual página a música está
}

// Atualiza a página para a música atual
function goToTrackPage(index) {
  currentPage = calculatePageForTrack(index); // Atualiza a página
  displayTracks(); // Exibe as músicas da nova página
}
