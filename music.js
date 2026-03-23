document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');

    // Make sure the audio element actually exists on this page before running
    if (music && musicBtn) {
        // Set volume to 30% so it's nice background noise
        music.volume = 0.3; 

        musicBtn.addEventListener('click', function() {
            if (music.paused) {
                music.play();
                musicBtn.innerHTML = '<span id="music-icon">🔊</span>';
            } else {
                music.pause();
                musicBtn.innerHTML = '<span id="music-icon">🔇</span>';
            }
        });
    }
});