const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2")
const cd = $(".cd")
const cdThumb = $(".cd-thumb")
const audio = $("#audio")
const playBtn = $(".btn-toggle-play")
const player = $(".player")
const progress = $("#progress")
const nextBtn = $(".btn-next")
const prevBtn = $(".btn-prev")
const repeatBtn = $(".btn-repeat")
const randomBtn = $(".btn-random")

const playlist = $(".playlist");
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "like i need u",
            singer: "keshi",
            path: "./music/song1.mp3",
            image: "./pics/pic1.jpg"
        },
        {
            name: "it just is",
            singer: "eaJ x Seori (ft.keshi)",
            path: "./music/song2.mp3",
            image: "./pics/pic2.jpg"
        },
        {
            name: "2 soon",
            singer: "keshi",
            path: "./music/song3.mp3",
            image: "./pics/pic3.jpg"
        },
        {
            name: "omm",
            singer: "mj apanay",
            path: "./music/song4.mp3",
            image: "./pics/pic4.jpg"
        },
        {
            name: "headache",
            singer: "Millennio (ft.Sweet The Kid, Klight)",
            path: "./music/song5.mp3",
            image: "./pics/pic5.jpg"
        },
        {
            name: "Only U",
            singer: "Moon Sujin x Jiselle (ft.PENOMECO)",
            path: "./music/song6.mp3",
            image: "./pics/pic6.jpg"
        },
        {
            name: "Angel",
            singer: "DAVII ",
            path: "./music/song7.mp3",
            image: "./pics/pic7.jpg"
        },
        {
            name: "Where the Flowers Bloom",
            singer: "KASS (ft.punchnello)",
            path: "./music/song8.mp3",
            image: "./pics/pic8.jpg"
        },
        {
            name: "ALJI",
            singer: "Sam Rui (ft.MELOH)",
            path: "./music/song9.mp3",
            image: "./pics/pic9.jpg"
        },
        {
            name: "AGAIN",
            singer: "Def (ft.LEON)",
            path: "./music/song10.mp3",
            image: "./pics/pic10.jpg"
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
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
            `
        })

        playlist.innerHTML = htmls.join("")
    },
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },  
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        const cdThumbAnimate = cdThumb.animate([
            {
                transform: "rotate(360deg)"
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
            cd.style.opacity = newCdWidth / cdWidth
        }   

        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play()
        }
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progressPercent
            }
        }
        progress.onchange = function(e) {
            const seekTime = (audio.duration / 100) * e.target.value
            audio.currentTime = seekTime
        }
        repeatBtn.onclick = function() {
            
        }
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active", _this.isRandom)
        }
        audio.onended = function() {
            if (_this.isRepeat) {
                _this.loadCurrentSong()
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active", _this.isRepeat)
        }
        playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)")

            if (songNode || e.target.closest(".option")) {

                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                if (e.target.closest(".option")) {
                    
                }
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`
        audio.src = this.currentSong.path
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        })
    },
    
    start: function() {
        this.defineProperties()

        this.handleEvents()

        this.loadCurrentSong()

        this.render()
    }
}

app.start()
