const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const btnPlay = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress')
const nextBtnSong = $('.btn-next');
const prevBtnSong = $('.btn-prev');
const randomBtn = $('.btn-shuffle');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

// biến lưu local storage
const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";

// biến lưu danh sách bài hát và hình ảnh
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [

        {
            name: 'Making My Way',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/SON\ TUNG\ MTP\ \ MAKING\ MY\ WAY\ \ OFFICIAL\ VISUALIZER.mp3',
            image: './assets/img/mtp.jpg',

        },
        {
            name: 'Cupid',
            singer: 'Noname',
            path: './assets/music/FIFTY\ FIFTY\ \ Cupid\ Twin\ Version\ Sped\ Up.mp3',
            image: './assets/img/dragon.jpg',

        },
        {
            name: '2002',
            singer: 'Anne Marie',
            path: './assets/music/AnneMarie\ \ 2002.mp3',
            image: './assets/img/anne-marie.jfif',

        },
        {
            name: 'Lửng Lơ',
            singer: 'Masew',
            path: './assets/music/Lửng\ Lơ\ \ MASEW\ x\ BRAY\ ft\ RedT\ x\ Ý\ Tiên\ \ MV\ OFFICIAL.mp3',
            image: './assets/img/masew.jpeg',

        },
        {
            name: 'Sold Out',
            singer: 'Hawk Nelson',
            path: './assets/music/Hawk\ Nelson\ \ Sold\ Out\ Official\ Lyric\ Video.mp3',
            image: './assets/img/Hawk-Nelson.jpg',

        },
        {
            name: 'Waiting For love',
            singer: 'Avicii',
            path: './assets/music/Avicii\ \ Waiting\ For\ Love.mp3',
            image: './assets/img/kl.jpg',

        },
        {
            name: 'Maps',
            singer: 'Maroon 5',
            path: './assets/music/Maroon\ 5\ \ Maps.mp3',
            image: './assets/img/maroon 5.jpg',

        },
        {
            name: 'La La La',
            singer: 'Naughty Boy',
            path: './assets/music/Naughty\ Boy\ \ La\ la\ la\ ft\ Sam\ Smith.mp3',
            image: './assets/img/khunglong.jpg',

        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(app, this.config))
    },
    render: function () {

        //  duyệt songs để lấy dữ liệu
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ""}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')"></div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fa-solid fa-ellipsis"></i>
            </div>
          </div>`
        })
        playlist.innerHTML = htmls.join('')
    },
    handleEvents: function () {
        // CD quay
        const cdthumbAnimate = cdThumb.animate([{

            transform: "rotate(360deg)",
        }], {
            duration: 10000,
            iterations: Infinity,
        })
        cdthumbAnimate.pause();

        // scroll co dãn khung
        const _this = this;
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdwidth = cdWidth - scrollTop;
            cd.style.width = newCdwidth > 0 ? newCdwidth + 'px' : 0;
            // độ mờ
            cd.style.opacity = newCdwidth / cdWidth;
        }
        // xử lí play
        btnPlay.onclick = function () {

            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        // Khi audio play
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add('playing');
            cdthumbAnimate.play();

        }
        // Khi audio pause
        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove("playing");
            cdthumbAnimate.pause();
        }
        // tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const currentProgress = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = currentProgress
            }
        }
        // xử lý tua bài hát
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            // console.log(seekTime)
            audio.currentTime = seekTime;
        }
        // next bai hat
        nextBtnSong.onclick = function () {
            // app là biến trỏ thẳng tới chỗ lưu bài hát
            // k dùng this.nextsong() vì nó sẽ hiểu this là thằng song

            if (app.isRandom) {
                app.playRandomSong();
            }
            else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();

        }
        // prev bai hat
        prevBtnSong.onclick = function () {
            if (app.isRandom) {
                app.playRandomSong();
            }
            else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        // random
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom;
            
            // app.setConfig("isRandom", app.isRandom);

            randomBtn.classList.toggle('active', app.isRandom);


        }
        // xử lí sau khi hết bài hát
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play();
            }
            else {
                nextBtnSong.click();
            }
        }
        // xử lí repeat
        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat;
            // app.setConfig = ("isRepeat", app.isRepeat);
            repeatBtn.classList.toggle('active', app.isRepeat);
        }
        // xử lí nâng cao nhấn vào playlist phát nhạc, lắng nghe click vào playlist
        playlist.onclick = function (e) {
            const songIndex = e.target.closest('.song:not(.active)');

            if (songIndex || e.target.closest('.option')) {
                // xử lý khi click vào song
                if (songIndex) {
                    app.currentIndex = Number(songIndex.dataset.index)
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
                // xử lí khi click vào option
                if (e.target.closest('.option')) {
                    console.log(23123131)
                }

            }

        }

    },
    // next song
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        console.log(this.currentIndex, this.songs.length - 1)
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();

    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'nearest',
                }
            )
        }, 200);
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex) {
            this.currentIndex = newIndex;
            this.loadCurrentSong();
        }
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    start: function () {
        // gán lại nút repeat và shuffle
        // this.loadConfig();
        // Định nghĩa các thuộc tính
        this.defineProperties();
        // xử lí các sự kiện dom event
        this.handleEvents();

        // tải thông tin bài hát đầu tiên
        this.loadCurrentSong();

        // render lại playlist
        this.render();
        // hiển thị lại
        // randomBtn.classList.toggle('active', app.isRandom)
        // repeatBtn.classList.toggle('active', app.isRepeat)


    }
}
// goi ham
app.start();
