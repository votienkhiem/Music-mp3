const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const btnPlay = $('.btn-toggle-play');
const player = $('.player');



// biến lưu danh sách bài hát và hình ảnh
const app = {
    currentIndex: 0,
    isPlaying: false,

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
    render: function () {

        //  duyệt songs để lấy dữ liệu
        const htmls = this.songs.map(song => {
            return `<div class="song">
            <div class="thumb"></div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fa-solid fa-ellipsis"></i>
            </div>
          </div>`
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    handleEvents: function () {
        // scroll co dãn khung
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
        }
        // Khi audio pause
        audio.onpause = function () {
            app.isPlaying=false;
            player.classList.remove("playing");
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

        console.log(heading, cdThumb, audio)
    },
    start: function () {
        // Định nghĩa các thuộc tính
        this.defineProperties();
        // xử lí các sự kiện dom event
        this.handleEvents();

        // tải thông tin bài hát đầu tiên
        this.loadCurrentSong();

        // render lại playlist
        this.render();
    }
}
// goi ham
app.start();
