
/* =================================
   WEDDING INVITATION JAVASCRIPT
================================= */

// 1. NAMA TAMU DARI LINK URL
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");

const guestName = document.getElementById("guestName");

if (guest && guestName) {
  guestName.textContent = guest.replace(/[<>]/g, "");
}


// 2. BUKA UNDANGAN DAN PUTAR MUSIK
const openButton = document.getElementById("openInvitation");
const cover = document.getElementById("cover");
const mainContent = document.getElementById("mainContent");
const musicButton = document.getElementById("musicButton");
const music = document.getElementById("weddingMusic");

if (openButton && cover && mainContent && musicButton && music) {
  openButton.addEventListener("click", async () => {
    cover.classList.add("hidden");
    mainContent.classList.remove("hidden");
    musicButton.classList.remove("hidden");

    window.scrollTo(0, 0);

    try {
      await music.play();
      musicButton.textContent = "♫";
    } catch (error) {
      musicButton.textContent = "▶";
      console.log("Musik belum dapat diputar:", error);
    }
  });

  // 3. KONTROL MUSIK
  musicButton.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicButton.textContent = "♫";
      } catch (error) {
        alert("Musik belum dapat diputar. Periksa file MP3.");
        console.log(error);
      }
    } else {
      music.pause();
      musicButton.textContent = "▶";
    }
  });
}


// 4. COUNTDOWN PERNIKAHAN
// 1 Januari 2027 pukul 08.00 WIB
const weddingDate = new Date(
  "2027-01-01T08:00:00+07:00"
).getTime();

function updateCountdown() {
  const now = Date.now();
  const difference = weddingDate - now;

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }

  if (difference <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";
    return;
  }

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


// 5. RSVP WHATSAPP
const whatsappNumber = "6289678748307";
const rsvpForm = document.getElementById("rsvpForm");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("rsvpName").value.trim();
    const attendance = document.getElementById("attendance").value;
    const count = document.getElementById("guestCount").value;

    if (!name || !attendance || !count) {
      alert("Mohon lengkapi formulir RSVP.");
      return;
    }

    if (Number(count) < 1 || Number(count) > 10) {
      alert("Jumlah tamu harus antara 1 sampai 10.");
      return;
    }

    const message =
`Assalamualaikum Warahmatullahi Wabarakatuh.

Konfirmasi Kehadiran Undangan Pernikahan

Muhammad Faqih & Fierly Sabila Yassaro

Nama Tamu: ${name}
Konfirmasi: ${attendance}
Jumlah Tamu: ${count}

Terima kasih atas undangannya.

Wassalamualaikum Warahmatullahi Wabarakatuh.`;

    const whatsappURL =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(message);

    // Membuka WhatsApp pada tab yang sama
    window.location.href = whatsappURL;
  });
}


// 6. BUKU TAMU / UCAPAN
// Ucapan tersimpan pada browser pengunjung masing-masing.
const wishForm = document.getElementById("wishForm");
const wishList = document.getElementById("wishList");

function getWishes() {
  try {
    return JSON.parse(
      localStorage.getItem("weddingWishes")
    ) || [];
  } catch {
    return [];
  }
}

function renderWishes() {
  if (!wishList) return;

  const wishes = getWishes();
  wishList.replaceChildren();

  wishes.slice().reverse().forEach((wish) => {
    const card = document.createElement("div");
    card.className = "wish-card";

    const heading = document.createElement("h4");
    heading.textContent = wish.name;

    const paragraph = document.createElement("p");
    paragraph.textContent = wish.message;

    card.append(heading, paragraph);
    wishList.appendChild(card);
  });
}

if (wishForm) {
  wishForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("wishName").value.trim();
    const message = document.getElementById("wishMessage").value.trim();

    if (!name || !message) {
      alert("Mohon lengkapi nama dan ucapan.");
      return;
    }

    const wishes = getWishes();

    wishes.push({
      name: name,
      message: message
    });

    try {
      localStorage.setItem(
        "weddingWishes",
        JSON.stringify(wishes)
      );

      wishForm.reset();
      renderWishes();

      alert("Ucapan berhasil disimpan pada browser ini.");
    } catch (error) {
      alert("Penyimpanan penuh atau tidak tersedia.");
    }
  });
}

renderWishes();


// 7. SALIN NOMOR REKENING
function copyAccount() {
  const accountElement = document.getElementById("accountNumber");

  if (!accountElement) return;

  const account = accountElement.textContent.trim();

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(account)
      .then(() => {
        alert("Nomor rekening berhasil disalin.");
      })
      .catch(() => {
        alert("Tidak dapat menyalin nomor rekening.");
      });
  } else {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = account;
    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    try {
      document.execCommand("copy");
      alert("Nomor rekening berhasil disalin.");
    } catch {
      alert("Silakan salin nomor rekening secara manual.");
    }

    temporaryInput.remove();
  }
}


// 8. GALERI LIGHTBOX
document.querySelectorAll(".gallery-grid img").forEach((img) => {
  img.addEventListener("click", () => {
    const overlay = document.createElement("div");

    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.92);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
      padding: 20px;
      cursor: pointer;
    `;

    const enlarged = document.createElement("img");
    enlarged.src = img.src;
    enlarged.alt = img.alt;

    enlarged.style.cssText = `
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
    `;

    overlay.appendChild(enlarged);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => {
      overlay.remove();
    });
  });
});

/* ANIMASI HERO */
const openButton = document.getElementById("openInvitation");

const heroRevealElements = document.querySelectorAll(
  ".hero .reveal-left, .hero .reveal-right"
);

if (openButton) {
  openButton.addEventListener("click", () => {
    heroRevealElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("show");
      }, 500 + index * 600);
    });
  });
}
