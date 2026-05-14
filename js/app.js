// AUTH FLOW (safe version)
const user = localStorage.getItem("user")
const isLoggedIn = sessionStorage.getItem("isLoggedIn")

if (!sessionStorage.getItem("seenLoader")) {
  sessionStorage.setItem("seenLoader", "true")
  window.location.href = "loader.html"
} else if (!user) {
  window.location.href = "signup.html"
} else if (!isLoggedIn) {
  window.location.href = "login.html"
}

// 🔥 Detect fresh site open (new tab / reload)
if (!sessionStorage.getItem("appLoaded")) {
  sessionStorage.setItem("appLoaded", "true")

  // CLEAR OLD SONG ONLY ON FRESH OPEN
  localStorage.removeItem("currentSong")
  localStorage.removeItem("currentTime")
  localStorage.removeItem("isPlaying")
}
// 🔥 WAIT FOR DOM
document.addEventListener("DOMContentLoaded", () => {

  // SONG DATA
  const songs = [
  {
    title: "Deva Shree Ganesha",
    artist: "Ajay-Atul",
    image: "assets/agneepath.webp",
    audio: "songs/devashreeganesha.mp3"
  },
  {
    title: "O Sayonara",
    artist: "Sooraj Santosh",
    image: "assets/one.webp",
    audio: "songs/sayonara.mp3"
  },
  {
    title: "Mere Samnewali Khidki Mein",
    artist: "Kishore Kumar",
    image: "assets/padosan.webp",
    audio: "songs/meresamnewalikhidkimein.mp3"
  },
  {
    title: "Kal Ho Na Ho",
    artist: "Sonu Nigam",
    image: "assets/khnh.webp",
    audio: "songs/khnh.mp3"
  },
  {
    title: "Dil Chahta Hai",
    artist: "Shankar Mahadevan",
    image: "assets/dch.webp",
    audio: "songs/dch.mp3"
  },
  {
    title: "Malare",
    artist: "Vijay Yesudas",
    image: "assets/premam.webp",
    audio: "songs/malare.mp3"
  },
  {
    title: "Balam Pichkari",
    artist: "Vishal Dadlani",
    image: "assets/yjhd.webp",
    audio: "songs/balampichkari.mp3"
  },
  {
    title: "Rooba Rooba",
    artist: "Shahil Hada",
    image: "assets/orange.webp",
    audio: "songs/roobarooba.mp3"
  },
  {
    title: "Jeena Jeena",
    artist: "Atif Aslam",
    image: "assets/badlapur.webp",
    audio: "songs/jeenajeena.mp3"
  },
  {
    title: "Iktara",
    artist: "Amit Trivedi",
    image: "assets/wakeupsid.webp",
    audio: "songs/iktara.mp3"
  },
  {
    title: "Wake Up Sid",
    artist: "Shankar Mahadevan",
    image: "assets/wakeupsid.webp",
    audio: "songs/wakeupsid.mp3"
  },
  {
    title: "Maahi Ve",
    artist: "Shankar Ehsaan Loy",
    image: "assets/khnh.webp",
    audio: "songs/maahive.mp3"
  }
]

  let currentSong = null
  let library = JSON.parse(localStorage.getItem("library")) || []
  let isPlaying = false

  let audio = document.getElementById("audio")

  // ✅ FIXED CREATE CARD (ONLY CHANGE)
  function createCard(song) {
    const template = document.getElementById("songCardTemplate")

    if (!template) {
      console.error("Template not found ❌")
      return null
    }

    const clone = document.importNode(template.content, true)

    const card = clone.querySelector(".song-card")
    const img = clone.querySelector(".song-image")
    const title = clone.querySelector(".song-title")
    const artist = clone.querySelector(".song-artist")

    if (!card) {
      console.error("Card not found in template ❌")
      return null
    }

    img.src = song.image
    title.textContent = song.title
    artist.textContent = song.artist

    card.onclick = () => playSong(song)

    return card   // 🔥 CRITICAL: return real element, not fragment
  }

  // LOAD SONGS
  const container = document.getElementById("songs")

  function loadSongs() {
  if (!container) {
    console.error("Songs container not found ❌")
    return
  }

  // 🔥 Clear old songs
  container.innerHTML = ""

  if (!songs || songs.length === 0) {
    console.warn("No songs available ⚠️")
    return
  }

  songs.forEach(song => {
    const card = createCard(song)

    if (!card) {
      console.error("Card creation failed ❌", song)
      return
    }

    container.appendChild(card)
  })

  // 🔥 OPTIONAL: highlight current song
  const saved = localStorage.getItem("currentSong")
  if (saved) {
    const current = JSON.parse(saved)

    document.querySelectorAll(".song-card").forEach(card => {
      const title = card.querySelector(".song-title")?.innerText

      if (title === current.title) {
        card.classList.add("active-song")
      }
    })
  }
  attachProgress()   // 🔥 REQUIRED
  console.log("Songs loaded ✅")
}

  // PLAY SONG
  function playSong(song) {
  currentSong = song   // 🔥 THIS FIXES ADD BUTTON

  localStorage.setItem("currentSong", JSON.stringify(song))

  audio.pause()
  audio.src = song.audio
  const btn = document.getElementById("addBtn")
  if (btn) {
    btn.innerText = "+"
    btn.classList.remove("added")
  }
  // UI
  document.getElementById("title").innerText = song.title
  document.getElementById("artist").innerText = song.artist
  document.getElementById("cover").src = song.image

  const savedTime = parseFloat(localStorage.getItem("currentTime")) || 0
  audio.currentTime = savedTime

  audio.play().catch(() => {})
  localStorage.setItem("isPlaying", "true")

  // BUTTON SYNC
  audio.onplay = () => document.getElementById("playBtn").innerText = "⏸"
  audio.onpause = () => document.getElementById("playBtn").innerText = "▶"

  // PROGRESS
  audio.ontimeupdate = () => {
    if (!audio.duration) return

    const percent = (audio.currentTime / audio.duration) * 100
    document.getElementById("progress").value = percent

    localStorage.setItem("currentTime", audio.currentTime)
    localStorage.setItem("isPlaying", !audio.paused)
  }
}

  // CONTROLS (GLOBAL)
  window.togglePlay = function () {
  if (!audio) return

  const btn = document.getElementById("playBtn")

  if (audio.paused) {
    audio.play()
    btn.innerText = "⏸"   // 🔥 change icon
    localStorage.setItem("isPlaying", "true")
  } else {
    audio.pause()
    btn.innerText = "▶"   // 🔥 change icon
    localStorage.setItem("isPlaying", "false")
  }
}

  window.rewind = function () {
    if (audio) audio.currentTime -= 10
  }

  window.forward = function () {
    if (audio) audio.currentTime += 10
  }

  // LIBRARY
window.addToLibrary = function () {

  if (!currentSong) return

  const btn = document.getElementById("addBtn")

  // 🔥 CHECK IF ALREADY EXISTS
  const exists = library.find(s => s.title === currentSong.title)

  if (!exists) {
    library.push(currentSong)

    // 🔥 SAVE TO LOCALSTORAGE (CRITICAL FIX)
    localStorage.setItem("library", JSON.stringify(library))

    renderLibrary()
  }

  // 🔥 ALWAYS UPDATE BUTTON
  if (btn) {
    btn.innerText = "✓"
    btn.classList.add("added")
  }
}

  function renderLibrary() {
    const lib = document.getElementById("library")
    const empty = document.getElementById("libraryEmpty")

    lib.innerHTML = ""

    if (library.length === 0) {
      empty.style.display = "flex"
    } else {
      empty.style.display = "none"
    }

    document.getElementById("libCount").innerText =
      library.length + (library.length === 1 ? " track" : " tracks")

    library.forEach(song => {
      const card = createCard(song)
      if (card) lib.appendChild(card)
    })
  }

  // NAVIGATION
  window.navigate = function (page) {
    document.getElementById("homePage").style.display =
      page === "Home" ? "block" : "none"

    document.getElementById("libraryPage").style.display =
      page === "Library" ? "block" : "none"

    document.getElementById("homeBtn").classList.toggle("active", page === "Home")
    document.getElementById("libBtn").classList.toggle("active", page === "Library")
  }

  // VOLUME
  const volume = document.getElementById("volume")
  if (volume) {
    volume.oninput = (e) => {
      audio.volume = e.target.value
    }
  }

  // PROGRESS BAR
  const progress = document.getElementById("progress")

// 🔥 RESTORE SONG ON PAGE LOAD
// 🔥 RESET ON FRESH LOAD
  // INIT
  loadSongs()
  renderLibrary()   // 🔥 FIX

  const savedSong = localStorage.getItem("currentSong")

if (savedSong) {
  const song = JSON.parse(savedSong)

  audio.src = song.audio

  document.getElementById("title").innerText = song.title
  document.getElementById("artist").innerText = song.artist
  document.getElementById("cover").src = song.image
  currentSong = song   // 🔥 IMPORTANT

const addBtn = document.getElementById("addBtn")

if (addBtn) {
  const exists = library.find(s => s.title === song.title)

  if (exists) {
    addBtn.innerText = "✓"
    addBtn.classList.add("added")
  } else {
    addBtn.innerText = "+"
    addBtn.classList.remove("added")
  }
}
  const savedTime = parseFloat(localStorage.getItem("currentTime")) || 0
  const shouldPlay = localStorage.getItem("isPlaying") === "true"

  audio.currentTime = savedTime

  const btn = document.getElementById("playBtn")

  if (shouldPlay) {
    audio.play()
    if (btn) btn.innerText = "⏸"   // 🔥 FIX
  } else {
    audio.pause()
    if (btn) btn.innerText = "▶"   // 🔥 FIX
  }
}

})
function openPlayerPage() {
  const song = localStorage.getItem("currentSong")

  if (!song) {
    alert("Play a song first 🎵")
    return
  }

  window.location.href = "player.html"
}
function attachProgress() {
  const progress = document.getElementById("progress")
  if (!progress || !audio) return

  // UPDATE BAR
  audio.ontimeupdate = () => {
    if (!audio.duration) return
    localStorage.setItem("currentTime", audio.currentTime)
    localStorage.setItem("isPlaying", !audio.paused)
    const percent = (audio.currentTime / audio.duration) * 100
    progress.value = percent

    localStorage.setItem("currentTime", audio.currentTime)
  }

  // DRAG SEEK
  progress.addEventListener("input", (e) => {
    if (!audio.duration) return

    const seekTime = (e.target.value / 100) * audio.duration
    audio.currentTime = seekTime
  })
}
setInterval(() => {
  if (!audio) return

  localStorage.setItem("currentTime", audio.currentTime)
  localStorage.setItem("isPlaying", !audio.paused)
}, 300)