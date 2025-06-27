const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
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
            name: "It's going down now",
            singer: "Lotus Juice",
            path: "./assets/music/its-going-down-now.mp3",
            image: "./assets/img/track-art/its-going-down-now.png",
        },
        {
            name: "King Of The World",
            singer: "Simon Panrucke",
            path: "./assets/music/king-of-the-world.mp3",
            image: "./assets/img/track-art/king-of-the-world.png",
        },
        {
            name: "It's kill or be killed",
            singer: "Yoshioka Taku Squad",
            path: "./assets/music/its-kill-or-be-killed.mp3",
            image: "./assets/img/track-art/its-kill-or-be-killed.jpg",
        },
        {
            name: "Tomorrow Is Mine",
            singer: "Elizabeth Larkin",
            path: "./assets/music/tomorrow-is-mine.mp3",
            image: "./assets/img/track-art/tomorrow-is-mine.jpg",
        },
        {
            name: "踊",
            singer: "Ado",
            path: "./assets/music/踊.mp3",
            image: "./assets/img/track-art/踊.jpg",
        },
        {
            name: "Save Me",
            singer: "DEAMN",
            path: "./assets/music/save-me.mp3",
            image: "./assets/img/track-art/save-me.jpg",
        },
        {   
            name: "Túy âm",
            singer: "Masew",
            path: "./assets/music/tuy-am.mp3",
            image: "./assets/img/track-art/tuy-am.jpg",
        },
        {
            name: "The Whims of Fate",
            singer: "Lyn Inaizumi",
            path: "./assets/music/the-whims-of-fate.mp3",
            image: "./assets/img/track-art/the-whims-of-fate.jpg",
        },
        {
            name: "Time To Make History",
            singer: "Shihoko Hirata",
            path: "./assets/music/time-to-make-history.mp3",
            image: "./assets/img/track-art/time-to-make-history.jpg",
        },
        {
            name: "Million Dollar Baby",
            singer: "Tommy Richman",
            path: "./assets/music/million-dollar-baby.mp3",
            image: "./assets/img/track-art/million-dollar-baby.jpg",
        },
        {
            name: "God of the Dead",
            singer: "Darren Korb",
            path: "./assets/music/god-of-the-dead.mp3",
            image: "./assets/img/track-art/god-of-the-dead.jpg",
        }
    ],

    render: function() {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        });
        $('.playlist').innerHTML = htmls.join('');
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
    },

    loadCurrentSong: function() {
        heading4.textContent = 'PLAYING ' + (this.currentIndex + 1) + ' OF ' + this.songs.length;
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        // Reset progress bar và time stamp ngay khi load bài hát mới
        // Không cần đợi metadata
        progress.value = 0;
        timeStamp.textContent = formatTime(0);
        
        audio.onloadedmetadata = function() {
            progress.min = 0;
            progress.max = audio.duration;
            progress.step = 0.000001;
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