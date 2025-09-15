const songs = {
    english: [
        { title: "Unstoppable", artist: "Sia", url: "assets/songs/unstoppable-sia.mp3" },
        { title: "Havana (feat. Young Thug)", artist: "Camila Cabello", url: "assets/songs/havana-feat-young-thug-camila-cabello.mp3" },
        { title: "Faded", artist: "Alan Walker", url: "assets/songs/faded-alan-walker.mp3" },
        { title: "Birthday", artist: "Anne Marie", url: "assets/songs/birthday-anne-marie.mp3" },
        { title: "Shape Of You", artist: "Ed Sheeran", url: "assets/songs/shape-of-you-ed-sheeran.mp3" }
    ]
};

let currentSongIndex = 0;

function showCategory(category) {
    const playlist = document.getElementById("playlist");
    playlist.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i>Loading songs...</div>';

    setTimeout(() => {
        playlist.innerHTML = "";
        songs[category].forEach((song, index) => {
            const li = document.createElement("li");
            li.className = "song-item";
            li.innerHTML = `
                        <div class="song-info">
                            <div class="song-icon">
                                <i class="fas fa-music"></i>
                            </div>
                            <div class="song-details">
                                <h3>${song.title}</h3>
                                <p>${song.artist}</p>
                            </div>
                        </div>
                        <div class="song-duration">
                            <i class="fas fa-play" style="margin-right: 5px;"></i>
                            Play
                        </div>
                    `;
            li.onclick = () => playSong(index);
            playlist.appendChild(li);

            // Load duration (simplified for demo)
            setTimeout(() => {
                const durationSpan = li.querySelector(".song-duration");
                durationSpan.innerHTML = `<i class="fas fa-clock" style="margin-right: 5px;"></i>3:${20 + index}`;
            }, 500 + index * 100);
        });
    }, 300);
}

// When user clicks a song
function playSong(index) {
    currentSongIndex = index;
    const song = songs.english[index];
    const audioPlayer = document.getElementById("audioPlayer");
    const audioSource = document.getElementById("audioSource");

    // Update song info
    document.getElementById("songTitle").textContent = `${song.title} - ${song.artist}`;

    // Highlight current song
    document.querySelectorAll('.song-item').forEach((item, i) => {
        item.classList.toggle('playing', i === index);
    });

    // Load and play
    audioSource.src = song.url;
    audioPlayer.load();

    audioPlayer.play().then(() => {
        document.getElementById("playPauseButton").innerHTML = '<i class="fas fa-pause"></i>';
        openPlayer(); // <-- show sticky player and add padding
    }).catch(error => console.error('Error playing audio:', error));
}

function togglePlayPause() {
    const audioPlayer = document.getElementById("audioPlayer");
    const playPauseButton = document.getElementById("playPauseButton");

    if (audioPlayer.paused) {
        audioPlayer.play().then(() => {
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        });
    } else {
        audioPlayer.pause();
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.english.length) % songs.english.length;
    playSong(currentSongIndex);
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.english.length;
    playSong(currentSongIndex);
}

function updateProgressBar() {
    const audioPlayer = document.getElementById("audioPlayer");
    const progressBar = document.getElementById("progressBar");
    if (audioPlayer.duration) {
        progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    }
}

function seekAudio(event) {
    const audioPlayer = document.getElementById("audioPlayer");
    if (audioPlayer.duration) {
        audioPlayer.currentTime = (event.target.value / 100) * audioPlayer.duration;
    }
}

function setVolume(value) {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.volume = value;
    document.getElementById("volumeLabel").textContent = Math.round(value * 100) + "%";
}

function searchSongs() {
    const query = document.getElementById("searchBar").value.toLowerCase();
    const filteredSongs = songs.english.filter(song =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    );

    const playlist = document.getElementById("playlist");
    playlist.innerHTML = "";

    if (filteredSongs.length === 0) {
        playlist.innerHTML = '<div class="loading">No songs found matching your search.</div>';
        return;
    }

    filteredSongs.forEach((song, index) => {
        const originalIndex = songs.english.findIndex(s => s.title === song.title);
        const li = document.createElement("li");
        li.className = "song-item";
        li.innerHTML = `
                    <div class="song-info">
                        <div class="song-icon">
                            <i class="fas fa-music"></i>
                        </div>
                        <div class="song-details">
                            <h3>${song.title}</h3>
                            <p>${song.artist}</p>
                        </div>
                    </div>
                    <div class="song-duration">
                        <i class="fas fa-play-circle" style="margin-right: 5px;"></i>
                        Play
                    </div>
                `;
        li.onclick = () => playSong(originalIndex);
        playlist.appendChild(li);
    });
}

function closePlayer() {
    const audioPlayer = document.getElementById("audioPlayer");
    const controls = document.getElementById("audioControls");

    // Pause audio
    audioPlayer.pause();

    // Hide the player
    controls.classList.remove("show");
    controls.classList.add("hidden");

    // Remove bottom padding so footer moves to bottom
    document.body.style.paddingBottom = "0px";
}

function openPlayer() {
    const controls = document.getElementById("audioControls");

    // Show the player
    controls.classList.remove("hidden");
    controls.classList.add("show");

    // Add bottom padding so footer stays above player
    const playerHeight = controls.offsetHeight;
    document.body.style.paddingBottom = playerHeight + "px";
}

function togglePlayPause() {
    const audioPlayer = document.getElementById("audioPlayer");
    const controls = document.getElementById("audioControls");

    if (audioPlayer.paused) {
        audioPlayer.play();
        document.getElementById("playPauseButton").innerHTML = '<i class="fas fa-pause"></i>';
        controls.classList.remove("hidden");
    } else {
        audioPlayer.pause();
        document.getElementById("playPauseButton").innerHTML = '<i class="fas fa-play"></i>';

        // Auto-hide after 3 seconds of pause
        setTimeout(() => {
            if (audioPlayer.paused) {
                controls.classList.add("hidden");
            }
        }, 3000);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    showCategory('english');
});

// Keyboard shortcuts
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !event.target.matches('input')) {
        event.preventDefault();
        togglePlayPause();
    }
});