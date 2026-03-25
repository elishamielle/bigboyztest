document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');

    // cehcks if the audio  exists on page before running
    if (music && musicBtn) {
        music.volume = 0.3; 

        musicBtn.addEventListener('click', function() {
            if (music.paused) {
                music.play();
                musicBtn.innerHTML = '<span id="music-icon">🔊</span> PAUSE MUSIC';
            } else {
                music.pause();
                musicBtn.innerHTML = '<span id="music-icon">🔇</span> PLAY MUSIC';
            }
        });
    }
});