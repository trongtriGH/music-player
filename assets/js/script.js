const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const background = $('.background');
const player = $('.player');
const dashboard = $('.dashboard');
const cd = $('.cd');
const heading4 = $('header h4');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const timeStamp = $('.timestamp');
const songDuration = $('.duration');
const playlist = $('.playlist');
const volumeBtn = $('.btn-volume');
const volumeControl = $('#volume');
const toggleThemeBtn = $('.toggle-theme');
const dashboardOption = $('.dashboard-option');
const optionModal = $('.option-modal');
const optionItems = $$('.option-list li');
const searchInput = $('.search input');
const favoriteOption = $('.option-list .favorites');
const uploadOption = $('.option-list .add-song');

// Xử lý hiển thị thời gian
const formatTime = function (time) {
    const timeInSeconds = Math.floor(time);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isSeeking: false,

    songs: [
        {
            name: "The Whims of Fate",
            singer: "Lyn Inaizumi",
            path: "./assets/music/the-whims-of-fate.mp3",
            image: "./assets/img/track-art/the-whims-of-fate.jpg",
            isFavorite: false,
        },
        {
            name: "It's going down now",
            singer: "Lotus Juice",
            path: "./assets/music/its-going-down-now.mp3",
            image: "./assets/img/track-art/its-going-down-now.png",
            isFavorite: false,
        },
        {
            name: "It's kill or be killed",
            singer: "Yoshioka Taku Squad",
            path: "./assets/music/its-kill-or-be-killed.mp3",
            image: "./assets/img/track-art/its-kill-or-be-killed.jpg",
            isFavorite: false,
        },
        {
            name: "Tomorrow Is Mine",
            singer: "Elizabeth Larkin",
            path: "./assets/music/tomorrow-is-mine.mp3",
            image: "./assets/img/track-art/tomorrow-is-mine.jpg",
            isFavorite: false,
        },
        {
            name: "踊",
            singer: "Ado",
            path: "./assets/music/踊.mp3",
            image: "./assets/img/track-art/踊.jpg",
            isFavorite: false,
        },
        {
            name: "Save Me",
            singer: "DEAMN",
            path: "./assets/music/save-me.mp3",
            image: "./assets/img/track-art/save-me.jpg",
            isFavorite: false,
        },
        {   
            name: "Túy âm",
            singer: "Masew",
            path: "./assets/music/tuy-am.mp3",
            image: "./assets/img/track-art/tuy-am.jpg",
            isFavorite: false,
        },
        {
            name: "Time To Make History",
            singer: "Shihoko Hirata",
            path: "./assets/music/time-to-make-history.mp3",
            image: "./assets/img/track-art/time-to-make-history.jpg",
            isFavorite: false,
        },
        {
            name: "Million Dollar Baby",
            singer: "Tommy Richman",
            path: "./assets/music/million-dollar-baby.mp3",
            image: "./assets/img/track-art/million-dollar-baby.jpg",
            isFavorite: false,
        },
        {
            name: "God of the Dead",
            singer: "Darren Korb",
            path: "./assets/music/god-of-the-dead.mp3",
            image: "./assets/img/track-art/god-of-the-dead.jpg",
            isFavorite: false,
        },
        {
            name: "King Of The World",
            singer: "Simon Panrucke",
            path: "./assets/music/king-of-the-world.mp3",
            image: "./assets/img/track-art/king-of-the-world.png",
            isFavorite: false,
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="number">${index + 1}</div>            
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-heart favorite-icon ${song.isFavorite ? 'active' : ''}"></i><i class="fas fa-trash delete-icon"></i>
                </div>
            </div>
            `
        });

        playlist.innerHTML = htmls.join('');
        // Kiểm tra theme
        if (player.classList.contains('dark-mode')) {
            toggleThemeBtn.innerHTML = '<i class="fas fa-sun" style = "color: gold;"></i> Light mode';
        } else {
            toggleThemeBtn.innerHTML = '<i class="fas fa-moon" style="color: #000;"></i> Dark mode';
        }
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý quay CD
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
            
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi bài hát bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration && !_this.isSeeking) { // Đang không tua bài hát mới cập nhật progress
                progress.value = audio.currentTime;

                // Ngăn lố giây cuối
                let displayTime = Math.min(audio.currentTime, audio.duration)
                timeStamp.textContent = formatTime(Math.floor(audio.currentTime));
            }
        }

        // Xử lý khi tua bài hát
        /// Desktop
        progress.onmousedown = function() {
            _this.isSeeking = true;
        }

        progress.oninput = function(e) {
            const seekTime = parseFloat(e.target.value);
            timeStamp.textContent = formatTime(Math.floor(seekTime));
        }

        progress.onmouseup = function(e) {
            audio.currentTime = parseFloat(e.target.value);
            _this.isSeeking = false;
        }

        /// Mobile
        progress.ontouchstart = function () {
            _this.isSeeking = true;
        }

        progress.ontouchmove = function (e) {
            const seekTime = parseFloat(e.target.value);
            timeStamp.textContent = formatTime(Math.floor(seekTime));
        }

        progress.ontouchend = function (e) {
            audio.currentTime = parseFloat(e.target.value);
            _this.isSeeking = false;
        }

        // Khi next bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
        }

        // Khi prev bài hát
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
        }

        // Khi random bài hát
        randomBtn.onclick = function() {
            // Nếu đang bật repeat thì tắt repeat
            if (_this.isRepeat) {
                _this.isRepeat = false;
                repeatBtn.classList.remove('active');
            }
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Khi repeat bài hát
        repeatBtn.onclick = function () {
            // Nếu đang bật random thì tắt random
            if (_this.isRandom) {
                _this.isRandom = false;
                randomBtn.classList.remove('active');
            }
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Khi nhấn vao nút volume
        volumeBtn.onclick = function() {
            volumeBtn.classList.toggle('active');
        }

        volumeControl.onclick = function (e) {  
            e.stopPropagation();
        }

        const savedVolume = localStorage.getItem('volume');
        if (savedVolume !== null) {
            audio.volume = parseFloat(savedVolume);
            volumeControl.value = savedVolume * 100;
        } else {
            audio.volume = 1;
            volumeControl.value = 100;
        }

        // Khi thay đổi volume
        volumeControl.oninput = function(e) {
            const volume = parseFloat(e.target.value) / 100;
            audio.volume = volume;
            localStorage.setItem('volume', volume);
        }

        // Khi kết thúc bài hát
        audio.onended = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else if (_this.isRepeat) {
                audio.play();
            } else {
                _this.nextSong();
            }
            audio.play();
        }

        playlist.onclick = function (e) {
            const favoriteNode = e.target.closest('.option .favorite-icon');
            const deleteNode = e.target.closest('.option .delete-icon');
            const songNode = e.target.closest('.song');

            // Click nút yêu thích
            if (favoriteNode && songNode) {
                e.stopPropagation();
                const songIndex = Number(songNode.dataset.index);
                const song = _this.songs[songIndex];

                song.isFavorite = !song.isFavorite;
                favoriteNode.classList.toggle('active', song.isFavorite);
                return; // Dừng không cho chạy tiếp
            }

            // Click nút xóa
            if (deleteNode && songNode) {
                e.stopPropagation();
                const confirmDelete = confirm('Bạn có chắc muốn xóa bài hát này không?');
                if (!confirmDelete) return;
                const songIndex = Number(songNode.dataset.index);
                const isCurrentSong = songIndex === _this.currentIndex;
                
                _this.songs.splice(songIndex, 1);

                // Nếu xóa bài trước bài đang phát, dịch chỉ số
                if (songIndex < _this.currentIndex) {
                    _this.currentIndex -= 1;
                }

                if (favoriteOption.classList.contains('active')) {
                    _this.render();
                    _this.songs.forEach((song, index) => {
                        const songElement = $('.playlist .song[data-index="' + index + '"]');
                        if (song.isFavorite) {
                            songElement.style.display = '';
                        } else {
                            songElement.style.display = 'none';
                        }
                    });
                } else {
                    _this.render();
                }

                // Nếu xóa bài đang phát
                if (isCurrentSong) {
                    if (_this.songs.length > 0) {
                        if (_this.currentIndex >= _this.songs.length) {
                            _this.currentIndex = _this.songs.length - 1;
                        }
                        _this.loadCurrentSong();
                        audio.play();
                    } else {                   
                        audio.pause();
                        audio.src = "";
                    }
                }

                if (_this.songs.length === 0) {
                    heading.textContent = 'No songs available';
                    heading4.textContent = 'PLAYING 0 OF 0';
                    cdThumb.style.backgroundImage = '';
                    background.style.backgroundImage = '';
                    player.classList.remove('playing');
                    timeStamp.textContent = '00:00';
                    songDuration.textContent = '00:00';
                    progress.value = 0;
                    
                    repeatBtn.classList.remove('active');
                    randomBtn.classList.remove('active');

                    playBtn.style.pointerEvents = 'none';
                    prevBtn.style.pointerEvents = 'none';
                    nextBtn.style.pointerEvents = 'none';

                    return;
                }

                heading4.textContent = 'PLAYING ' + (_this.currentIndex + 1) + ' OF ' + _this.songs.length;

                return;
            }

            // Click vào bài hát (tránh click bài đang active)
            if (songNode && !songNode.classList.contains('active')) {
                const songIndex = Number(songNode.dataset.index);
                _this.currentIndex = songIndex;
                _this.loadCurrentSong();
                audio.play();
            }
        };

        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'true') {
            dashboard.style.transition = 'none';
            player.classList.add('dark-mode');
        }

        // Toggle light mode / dark mode
        toggleThemeBtn.onclick = function(e) {
            e.stopPropagation();
            if (player.classList.contains('dark-mode')) {
                this.innerHTML = '<i class="fas fa-moon" style="color: #000;"></i> Dark mode';
                _this.toggleTheme();
            } else {
                this.innerHTML = '<i class="fas fa-sun" style="color: gold;"></i> Light mode';
                _this.toggleTheme();
            }
            const isDark = player.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark ? 'true' : 'false');
        }

        // Toggle dashboard option  
        dashboardOption.onclick = function(e) {
            e.stopPropagation();
            optionModal.classList.toggle('active');
        }

        optionModal.onclick = function (e) {
            e.stopPropagation();
        }

        document.onclick = function () {
            optionModal.classList.remove('active');
        }

        // Tìm kiếm bài hát (theo tên hoặc ca sĩ hoặc số thứ tự)
        searchInput.oninput = function () {
            favoriteOption.classList.remove('active'); // Tắt chế độ yêu thích khi tìm kiếm
            const keyword = this.value.trim().toLowerCase();
            const songElements = $$('.playlist .song');

            songElements.forEach(song => {
                const title = song.querySelector('.title').textContent.toLowerCase();
                const singer = song.querySelector('.author').textContent.toLowerCase();
                const number = song.querySelector('.number').textContent;

                if (number === keyword || title.includes(keyword) || singer.includes(keyword)) {
                    song.style.display = '';
                } else {
                    song.style.display = 'none';
                }
            });
        };
    
        const handleFavoriteMode = function() {
            if (!favoriteOption.classList.contains('active')) {
                favoriteOption.classList.add('active');
                _this.songs.forEach((song, index) => {
                    const songElement = $('.playlist .song[data-index="' + index + '"]');
                    if (song.isFavorite) {
                        songElement.style.display = '';
                    } else {
                        songElement.style.display = 'none';
                    }
                });
            } else {
                favoriteOption.classList.remove('active');
                _this.songs.forEach((song, index) => {
                    const songElement = $('.playlist .song[data-index="' + index + '"]');
                    songElement.style.display = '';
                });
            }
        }

        // Hiện danh sách yêu thích
        favoriteOption.onclick = function(e) {
            e.stopPropagation();
            handleFavoriteMode();
        }

        // Thêm bài hát mới
        uploadOption.onclick = function(e) {
            e.stopPropagation();
        }
    },

    loadCurrentSong: function() {
        heading4.textContent = 'PLAYING ' + (this.currentIndex + 1) + ' OF ' + this.songs.length;
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        // Cập nhật background
        background.style.backgroundImage = `url('${this.currentSong.image}')`;

        // Xuất hiện active cho bài hát đang phát
        $$('.playlist .song').forEach(song => {
            song.classList.remove('active');
        });
        const activeSong = $('.playlist .song[data-index="' + this.currentIndex + '"]');
        if (activeSong) {
            activeSong.classList.add('active');
        }

        // Kéo bài hát active lên top
        setTimeout(() => {
            if (this.currentIndex <= 2) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }
            else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }, 300);           

        // Reset progress bar và time stamp ngay khi load bài hát mới
        // Không cần đợi metadata
        progress.value = 0;
        timeStamp.textContent = formatTime(0);
        
        audio.onloadedmetadata = function() {
            progress.min = 0;
            progress.max = audio.duration;
            progress.step = 0.01;
            progress.value = 0;

            songDuration.textContent = formatTime(audio.duration);
        }
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    // Light mode / Dark mode
    toggleTheme: function() {
        player.classList.toggle('dark-mode');
    },

    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / Xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();
    }
}

app.start();