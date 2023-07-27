const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const clear = document.querySelector('.js-clear')

socket.on('active', (numberActive) => {
  active.innerText = `${numberActive} joined`
})

socket.on('buzzes', (buzzes) => {
  buzzList.innerHTML = buzzes
    .map(buzz => {
      const p = buzz.split('-')
      return { name: p[0], team: p[1] }
    })
    .map(user => `<li>${user.name} on Team ${user.team}</li>`)
    .join('')
  pauseSound();
})

clear.addEventListener('click', () => {
  socket.emit('clear')
})

let currentSound = null; // This will hold the currently playing sound
let lastSound = null; // This will hold the last played sound

let soundSets = {
  "Effets": {
    "Ascenceur": "elevator",
    "Générique": "theme",
    "Applause": "applause",
    "Question Suivante": "next",
    "Fail": "fail",
    "Dérapage": "drift",
    "Anges": "angels",
    "Punch": "punch",
    "Triste": "sad",
    "Suspense": "suspense",
  },
  "Médieval": {
    "1 - Rolling in the deep": "medieval/rolling_in_the_deep",
    "2 - Hey Brother": "medieval/hey_brother",
    "3 - The Nights": "medieval/the_nights",
    "4 - Wake Me Up": "medieval/wake_me_up",
    "5 - Gimme Gimme Gimme": "medieval/gimme_gimme_gimme",
    "6 - I Will Survive": "medieval/i_will_survive",
    "7 - Hallelujah": "medieval/hallelujah",
    "8 - Watermelon Sugar": "medieval/watermelon_sugar",
    "9 - He's a Pirate": "medieval/hes_a_pirate",
    "10 - Hey Ya!": "medieval/hey_ya",
    "11 - Believer": "medieval/believer",
    "12 - Three Little Birds": "medieval/three_little_birds",
    "13 - Axel F": "medieval/axel_f",
    "14 - California Love": "medieval/california_love",
    "15 - Don't Worry Be Happy": "medieval/dont_worry_be_happy",
    "16 - Dragostea Din Tei": "medieval/dragostea_din_tei",
    "17 - Blue (Da Ba Dee)": "medieval/blue",
    "18 - Sweet Dreams": "medieval/sweet_dreams",
    "19 - Gansta's Paradise": "medieval/gangsta_paradise",
    "20 - Imagine": "medieval/imagine",
    "21 - Love Me Again": "medieval/love_me_again",
    "22 - Macarena": "medieval/macarena",
    "23 - Happy": "medieval/happy",
    "24 - Libéré Délivré": "medieval/liberee_delivree",
    "25 - Lose Yourself": "medieval/lose_yourself",
    "26 - Poker Face": "medieval/poker_face",
    "27 - Rasputin": "medieval/rasputin",
    "28 - September": "medieval/september",
    "29 - Still Dre": "medieval/still_dre",
    "30 - Alors on Danse": "medieval/alors_on_danse",
    "31 - Papaoutai": "medieval/papaoutai",
    "32 - Take me to Chruch": "medieval/take_me_to_church",
    "33 - Boulevard of Broken Dreams": "medieval/boulevard_of_broken_dreams",
    "34 - Le Lion est Mort ce Soir": "medieval/le_lion_est_mort_ce_soir",
    "35 - The Rythm of the Night": "medieval/the_rythm_of_the_night",
    "36 - Thunderstruck": "medieval/thunderstruck",
    "37 - Wake me Up Before you Go-GO": "medieval/wake_me_up_before_you_gogo",
    "38 - Blinding Lights": "medieval/blinding_lights",
    "39 - Y.M.C.A.": "medieval/ymca",
    "40 - Never Gonna Give You Up": "medieval/never_gonna_give_you_up",


  },
  "80s": {
    "1 - Sweet but Psycho": "80s/sweet_but_psycho",
    "2 - J'irai où tu ira": "80s/jirai_ou_tu_ira",
    "3 - I Feel it Coming": "80s/i_feel_it_coming",
    "4 - Les Démons de Minuit": "80s/les_demons_de_minuit",
    "5 - We don't Talk Anymore": "80s/we_dont_talk_anymore",
    "6 - Beat It": "80s/beat_it",
    "7 - Africa": "80s/africa",
    "8 - Skyfall": "80s/skyfall",
    "9 - Allumer le feu": "80s/allumer_le_feu",
    "10 - Le Chanteur": "80s/le_chanteur",
    "11 - Je Danse le Mia": "80s/je_danse_le_mia",
    "12 - L'Aventurier": "80s/laventurier",
    "13 - Attention": "80s/attention",
    "14 - Quand la musique est bonne": "80s/quand_la_musique_est_bonne",
    "15 - Le Jerk": "80s/le_jerk",
    "16 - Circles": "80s/circles",
    "17 - Ella elle l'a": "80s/ella_elle_la",
    "18 - One Last Time": "80s/one_last_time",
    "19 - Trois Nuits par Semaine": "80s/trois_nuit_par_semaine",
    "20 - Don't start now": "80s/dont_start_now",
    "21 - Ca c'est vraiment toi": "80s/ca_cest_vraiment_toi",
    "22 - As It Was": "80s/as_it_was",
    "23 - On va s'aimer": "80s/on_va_saimer",
    "24 - Bohemian Rhapsody": "80s/bohemian_rapshody",
    "25 - Voyage Voyage": "80s/voyage_voyage",
    "26 - Toxic": "80s/toxic",
    "27 - Macumba": "80s/macumba",
    "28 - Levitating": "80s/levitating",
    "29 - Personal Jesus": "80s/personal_jesus",
    "30 - You spin me round": "80s/you_spin_me_round",
    "31 - I'm Still Standing": "80s/im_still_standing",
    "32 - Les Sunlights des Tropiques": "80s/les_sunlights_des_tropiques",
    "33 - Take on Me": "80s/take_on_me",
    "34 - Nuit de Folie": "80s/nuit_de_folie",
    "35 - Femme Libérée": "80s/femme_liberee",
    "36 - Perfect": "80s/perfect",
    "37 - Elle a les yeux revolvers": "80s/elle_a_les_yeux_revolver",
    "38 - Le bal masqué": "80s/le_bal_masque",
    "39 - La tribu de dana": "80s/la_tribu_de_dana",
    "40 - Flowers": "80s/flowers",

  },
  "Instrumental": {
    "1 - Bad Guy": "instrumental/bad_guy",
    "2 - Wati by Night": "instrumental/wati_by_night",
    "3 - Petrouchka": "instrumental/petrouchka",
    "4 - Decrescendo": "instrumental/decrescendo",
    "5 - Despacito": "instrumental/despacito",
    "6 - Shallow": "instrumental/shallow",
    "7 - A nos souvenirs": "instrumental/a_nos_souvenirs",
    "8 - Cote Ouest": "instrumental/cote_ouest",
    "9 - Diamonds": "instrumental/diamonds",
    "10 - Waka waka": "instrumental/waka_waka",
    "11 - Grand Bain": "instrumental/grand_bain",
    "12 - Chandelier": "instrumental/chandelier",
    "13 - Shape of You": "instrumental/shape_of_you",
    "14 - Santé": "instrumental/sante",
    "15 - Uptown Funk": "instrumental/uptown_funk",
    "16 - 1, 2, 3": "instrumental/123",
    "17 - Someone Like You": "instrumental/someone_like_you",
    "18 - Au DD": "instrumental/au_dd",
    "19 - Sapé comme jamais": "instrumental/sape_comme_jamais",
    "20 - Run boy run": "instrumental/run_boy_run",
    "21 - Suavemente": "instrumental/suavemente",
    "22 - Tout Oublier": "instrumental/tout_oublier",
    "23 - Outété": "instrumental/outete",
    "24 - Chaud": "instrumental/chaud",
    "25 - Save Your Taers": "instrumental/save_your_tears",
    "26 - Stressed Out": "instrumental/stressed_out",
    "27 - On s'attache": "instrumental/on_sattache",
    "28 - Macarena": "instrumental/macarena",
    "29 - Fever": "instrumental/fever",
    "30 - Dommage": "instrumental/dommage",
    "31 - Time Time": "instrumental/time_time",
    "32 - DjaDja": "instrumental/djadja",
    "33 - Gangnam Style": "instrumental/gangnam_style",
    "34 - Les Mains en l'air": "instrumental/les_mains_en_lair",
    "35 - Aux arbres citoyens": "instrumental/aux_arbres_citoyens",
    "36 - Sharks": "instrumental/sharks",
    "37 - Soso Maness": "instrumental/soso_maness",
    "38 - Roar": "instrumental/roar",
    "39 - La Kiffance": "instrumental/la_kiffance",
    "40 - Je veux": "instrumental/je_veux",
  },
  "Manche 4": {
    "Correct": "correct",
    "Faux": "false",
    "Fail": "fail",
    "Dérapage": "drift",
    "Anges": "angels",
  }

};

let navbar = document.querySelector(".navbar");
for (let setName in soundSets) {
  let link = document.createElement("a");
  link.className = "navBtn"
  link.textContent = setName;
  link.addEventListener("click", function () {
    createSoundSet(soundSets[setName], setName);
  });
  navbar.appendChild(link);
}

function createSoundSet(sounds, setName) {
  let container = document.querySelector(".container_sound");
  container.innerHTML = "";
  for (let name in sounds) {
    // Creating the new audio element
    let audio = new Audio(`/sound/${sounds[name]}.mp3`);

    // Creating the new div
    let div = document.createElement("div");
    div.appendChild(audio)
    div.className = "sound-box";
    div.id = sounds[name];
    div.addEventListener("click", function () {
      num = document.getElementById("num_played")
      num.innerHTML = this.getElementsByTagName("p")[0].innerHTML
      if (currentSound === audio) {
        pauseSound();
      } else {
        stopAllSounds();
        playSound(audio);
      }
    });

    // Creating the new img only if the name is Effets
    if (setName == "Effets") {
      let img = document.createElement("img");
      img.src = `image/${sounds[name]}.png`;
      img.alt = "";
      img.width = 50;
      div.appendChild(img);
    }

    // Creating the new paragraph
    let p = document.createElement("p");
    p.textContent = name.split(" - ")[0];

    // Appending the img and p to the div
    div.appendChild(p);

    // Appending the div to the container
    container.appendChild(div);
  }
}

function playSound(sound = lastSound) {
  if (sound) {
    currentSound = sound;
    lastSound = sound;
    currentSound.volume = 1;
    currentSound.play();
  }
}

function pauseSound() {
  if (currentSound) {
    currentSound.pause();
  }
}

function stopAllSounds() {
  let audios = document.querySelectorAll("audio");
  for (let audio of audios) {
    audio.pause();
    audio.currentTime = 0;
  }
  currentSound = null;
}

correct = document.getElementById("correct")
correct.addEventListener("click", function () {
  stopAllSounds();
  playSound(document.getElementById("correct_sound"));
}
);
false_sound = document.getElementById("false")
false_sound.addEventListener("click", function () {
  stopAllSounds();
  playSound(document.getElementById("false_sound"));
}
);

