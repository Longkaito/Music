const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextSong = $(".btn-next");
const prevSong = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Anh Sẽ Mạnh Mẽ Yêu Em",
      singer: "Mr.Siro",
      path: "./assets/song/song1.mp3",
      image: "./assets/image/1.jpeg",
    },
    {
      name: "Day Dứt Nỗi Đau",
      singer: "Mr.Siro",
      path: "./assets/song/song2.mp3",
      image: "./assets/image/2.jpeg",
    },
    {
      name: "Đừng Ai Nhắc Về Anh Ấy",
      singer: "Trà My Idol",
      path: "./assets/song/song3.mp3",
      image: "./assets/image/3.jpeg",
    },
    {
      name: "Lặng Lẽ Tổn Thương",
      singer: "Mr.Siro",
      path: "./assets/song/song4.mp3",
      image: "./assets/image/4.jpeg",
    },
    {
      name: "Sống Trong Nỗi Nhớ",
      singer: "Mr.Siro",
      path: "./assets/song/song5.mp3",
      image: "./assets/image/5.jpeg",
    },
    {
      name: "Thất Tình",
      singer: "Trịnh Đình Quang",
      path: "./assets/song/song6.mp3",
      image: "./assets/image/6.jpeg",
    },
    {
      name: "Thế Giới Ảo Tình Yêu Thật",
      singer: "Trịnh Đình Quang",
      path: "./assets/song/song7.mp3",
      image: "./assets/image/7.jpeg",
    },
    {
      name: "Tìm Được Nhau Khó Thế Nào",
      singer: "Mr.Siro",
      path: "./assets/song/song8.mp3",
      image: "./assets/image/8.jpeg",
    },
    {
      name: "Tình Yêu Chắp Vá",
      singer: "Mr.Siro",
      path: "./assets/song/song9.mp3",
      image: "./assets/image/9.jpeg",
    },
    {
      name: "Xin Em",
      singer: "Bùi Anh Tuấn",
      path: "./assets/song/song10.mp3",
      image: "./assets/image/10.jpeg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? "active" : ""}">
            <div
                class="thumb"
                style="
                background-image: url('${song.image}');
                "
            ></div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý Cd quay
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //quay trong 10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Xử lý khi scroll phóng to thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi nhấn play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được chạy
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    nextSong.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // khi prev song
    prevSong.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // xử lý nút random
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý khi bài hát kết thúc
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextSong.click();
      }
    };

    // Xử lý khi nhấn repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 200);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${app.currentSong.image}')`;
    audio.src = app.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
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
  start: function () {
    //   Định nghĩa các thuộc tính của Object
    this.defineProperties();

    // Lắng nghe / xử lý các xự kiện DOM
    this.handleEvents();

    // tải thông tin bài hát đầu tiên vào UI
    this.loadCurrentSong();

    // render Playlist
    this.render();
  },
};

app.start();
