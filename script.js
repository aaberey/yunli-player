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


const pauseicon = '<svg class="bttncontrols" viewBox="0 -45 320 512" width="15"><path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/></svg>'
const playicon = '<svg class="bttncontrols" viewBox="0 0 384 512" width="15"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>'
const shuffleicon = '<svg class="shufflebttn" viewBox="0 0 512 512" width="15"><path d="M403.8 34.4c12-5 25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-32-32 0c-10.1 0-19.6 4.7-25.6 12.8L284 229.3 244 176l31.2-41.6C293.3 110.2 321.8 96 352 96l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6zM164 282.7L204 336l-31.2 41.6C154.7 401.8 126.2 416 96 416l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c10.1 0 19.6-4.7 25.6-12.8L164 282.7zm274.6 188c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-32-32 0c-30.2 0-58.7-14.2-76.8-38.4L121.6 172.8c-6-8.1-15.5-12.8-25.6-12.8l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c30.2 0 58.7 14.2 76.8 38.4L326.4 339.2c6 8.1 15.5 12.8 25.6 12.8l32 0 0-32c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l64 64c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-64 64z"/></svg>'
const avançaricon = '<svg class="bttncontrols" viewBox="0 0 512 512" width="15"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3l0 41.7 0 41.7L52.5 440.6zM256 352l0-96 0-128 0-32c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29l0-64z"/></svg>'
const voltaricon = '<svg class="bttncontrolsinvertidahorizontalmente" viewBox="0 0 512 512" width="15"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416L0 96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3l0 41.7 0 41.7L52.5 440.6zM256 352l0-96 0-128 0-32c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29l0-64z"/></svg>'

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
    shuffleBtn.style.filter = "invert(56%) sepia(58%) saturate(1240%) hue-rotate(94deg) brightness(94%) contrast(102%)";
  } else {
    shuffleBtn.style.filter = "invert(21%) sepia(63%) saturate(6678%) hue-rotate(330deg) brightness(78%) contrast(114%)";  // Altera a cor para branco quando desativado
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
      playBtn.innerHTML = pauseicon;  // Alterar o emoji para "pause"
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
  if (shouldplay) { audioPlayer.play(); playBtn.innerHTML = pauseicon; }
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
  playBtn.innerHTML = pauseicon; // Muda o botão para "pause"
  
});

// Função para tocar ou pausar
playBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playBtn.innerHTML = pauseicon;
    isPlaying = true;
  } else {
    audioPlayer.pause();
    playBtn.innerHTML = playicon;
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
  playBtn.innerHTML = pauseicon; // Muda o botão para "pause"
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
  playBtn.innerHTML = pauseicon; // Muda o botão para "pause"
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
