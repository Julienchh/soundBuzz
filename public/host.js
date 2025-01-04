const socket = io();
const active = document.querySelector('.js-active');
const buzzList = document.querySelector('.js-buzzes');
const clear = document.querySelector('.js-clear');
const selectTeam = document.querySelector('#team-select');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentSoundBuffer = null;
let currentSoundSource = null;
let nextSoundSource = null;
let teamPointsDiv = document.getElementById("teamPoints");
let currentGainNode = audioContext.createGain();
let nextGainNode = audioContext.createGain();
currentGainNode.connect(audioContext.destination);
nextGainNode.connect(audioContext.destination);

/* socket.on('active', (numberActive) => {
  active.innerText = `${numberActive} joined`
}) */

socket.on('buzzes', (buzzes) => {
  console.log(buzzes);
  buzzList.innerHTML = buzzes
    .map(buzz => {
      const p = buzz.split('-');
      return { team: p[0], buzzerText: p[1] }; // Include the buzzer text content
    })
    .map(user => `<li>${user.team} - ${user.buzzerText}</li>`) // Display the buzzer text content
    .join('');
    // for each buzz in the buzzes list, Compute the percentage of different buzzerText per team and display it in the teamPointsDiv
    teamPoints = {};
    buzzes.forEach(buzz => {
      const [team, buzzerText] = buzz.split('-');
      if (!teamPoints[team]) {
        teamPoints[team] = {};
      }
      if (!teamPoints[team][buzzerText]) {
        teamPoints[team][buzzerText] = 0;
      }
      teamPoints[team][buzzerText]++;
    });
    teamPointsDiv.innerHTML = '';
    for (const team in teamPoints) {
      const teamDiv = document.createElement('div');
      teamDiv.innerHTML = `<h2>${team}</h2>`;
      const total = Object.values(teamPoints[team]).reduce((acc, curr) => acc + curr);
      const numBuzz = document.createElement('div');
      numBuzz.innerHTML = `<p>${total}</p>`;
      teamDiv.appendChild(numBuzz);
      for (const buzzerText in teamPoints[team]) {
        // Number of buzzes for the team to make a percentage of each buzzerText for the team
        const percentage = (teamPoints[team][buzzerText] / total) * 100;
        const buzzerTextDiv = document.createElement('div');
        buzzerTextDiv.innerHTML = `<p>${buzzerText}: ${percentage.toFixed(2)}%</p>`;
        teamDiv.appendChild(buzzerTextDiv);
    }
    teamPointsDiv.appendChild(teamDiv);
  }
});

socket.on('pause', () => {
  pauseSound();
});

socket.on('stop', () => {
  stopAllSounds();
});

// on join add user team to the tab if not already there
socket.on('join', (user) => {
  /*const tab = document.getElementById("scoreboard");
  // check if team is already in the tab
  if (document.getElementById(user.team) == null) {
    // add team to the tab
    const tr = document.createElement("tr");
    tr.setAttribute("id", user.team);
    tr.innerHTML = `<td>${user.team}</td><td id="${user.team}-score">0</td>`;
    tab.appendChild(tr);

    // add team to the radio button
    const radio = document.getElementById("double-team");
    const input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.className = "btn-check";
    input.setAttribute("name", "btnradio");
    input.setAttribute("id", user.team);
    input.setAttribute("autocomplete", "off");
    input.value = user.team;
    radio.appendChild(input);
    const label = document.createElement("label");
    label.className = "btn btn-outline-primary";
    label.setAttribute("for", user.team);
    label.textContent = user.team;
    radio.appendChild(label);

    // add team to the select
    const option = document.createElement("option");
    option.value = user.team;
    option.textContent = user.team;
    selectTeam.appendChild(option);
  }*/
});

clear.addEventListener('click', () => {
  socket.emit('clear');
});

socket.emit('clear');

let soundSets = {
  "Effets": {
    "Ascenceur": "elevator",
    "Générique ueeo": "ueeo",
    "Générique npltdp": "npltdp",
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
  "Ici et Maintenant": {
    "1 - ": "ici/star_walking",
    "2 - ": "ici/des_miliers_de_je_taime",
    "3 - ": "ici/houdini",
    "4 - ": "ici/depasse",
    "5 - ": "ici/training_season",
    "6 - ": "ici/evidemment",
    "7 - ": "ici/spider",
    "8 - ": "ici/le_feu",
    "9 - ": "ici/dance_the_night",
    "10 - ": "ici/tout_va_bien",
    "11 - ": "ici/wayeh",
    "12 - ": "ici/loco",
    "13 - ": "ici/mami_wata",
    "14 - ": "ici/espresso",
    "15 - ": "ici/coup_de_vieux",
    "16 - ": "ici/nightcall",
    "17 - ": "ici/parapluie",
    "18 - ": "ici/un_jour_je_marierai_un_ange",
    "19 - ": "ici/unholy",
    "20 - ": "ici/substitution",
    "21 - ": "ici/love_me",
    "22 - ": "ici/cite_de_france",
    "23 - ": "ici/haut_niveau",
    "24 - ": "ici/tout_essayer",
    "25 - ": "ici/jme_sens_bien",
    "26 - ": "ici/a_peu_pres",
    "27 - ": "ici/eurostar",
    "28 - ": "ici/autobahn",
    "29 - ": "ici/la_faille",
    "30 - ": "ici/flowers",
    "31 - ": "ici/supermodel",
    "32 - ": "ici/hype",
    "33 - ": "ici/casanova",
    "34 - ": "ici/lif",
    "35 - ": "ici/lenfer",
    "36 - ": "ici/fade_up",
    "37 - ": "ici/bam_bam",
    "38 - ": "ici/ma_jolie",
    "39 - ": "ici/lose_control",
    "40 - ": "ici/imagine",
  },
  "Bonus": {
    "Pookie - ": "bonus/pookie",
    "La java de Broadway - ": "bonus/la_java_de_broadway",
    "Hey Jude - ": "bonus/hey_jude",
    "Jme voyais déjà - ": "bonus/jme_voyais_deja",
    "Tous les cris les SOS - ": "bonus/tous_les_cris_les_sos",
    "Angela - ": "bonus/angela",
    "Etoile - ": "bonus/etoile",
    "Theremine - ": "bonus/theremine",
  },
  "Chiffons": {
    "Openning loop": "chiffons/openning_loop",
    "Openning": "chiffons/openning",
    "Explain loop": "chiffons/explain_game",
    "Explain End": "chiffons/end_explain",
    "Let's play": "chiffons/play",
    "Think Easy": "chiffons/think_easy",
    "Think Hard": "chiffons/think_hard",
    "Last Word": "chiffons/last_word",
    "One Winner": "chiffons/one_winner",
    "Two Winners": "chiffons/two_winner",
    "Looser": "chiffons/lost",
    "Phone Call": "chiffons/phone_call",
    "Phone Question": "chiffons/phone_question",
    "50 50": "chiffons/50_50",
    "Bank": "chiffons/bank",
  }
};

let navbar = document.querySelector("#navbar");
for (let setName in soundSets) {
  let link = document.createElement("a");
  link.className = "btn btn-outline-secondary m-2 btn-center h4";
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
    div.appendChild(audio);
    div.className = "sound-box btn btn-outline-primary";
    div.id = sounds[name];
    console.log(setName)
    div.addEventListener("click", function () {
      if (setName != "Effets" && setName != "Chiffons" && setName != "Bonus") {
        socket.emit('clear');
      }
      num = document.getElementById("num_played");
      num.innerHTML = this.getElementsByTagName("p")[0].innerHTML;
      if (currentSoundSource === audio) {
        pauseSound();
      } else if(setName != "Chiffons"){
        stopAllSounds();
        playSoundWithCrossfade(`/sound/${sounds[name]}.mp3`);
        playSound();
      } else {
        playSoundWithCrossfade(`/sound/${sounds[name]}.mp3`);
        playSound();
      }
    });

    // Creating the new paragraph
    let p = document.createElement("p");
    p.className = "h3";
    p.textContent = name.split(" - ")[0];

    // Creating the new img only if the name is Effets
    if (setName == "Effets") {
      let img = document.createElement("img");
      img.src = `image/${sounds[name]}.png`;
      img.alt = "";
      img.width = 20;
      p.className = "";
      div.appendChild(img);
    }

    // Appending the img and p to the div
    div.appendChild(p);

    // Appending the div to the container
    container.appendChild(div);
  }
}

function loadSound(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      currentSoundBuffer = audioBuffer;
    });
}

function playSoundWithCrossfade(url) {
  loadSound(url).then(() => {
    if (currentSoundBuffer) {
      nextSoundSource = audioContext.createBufferSource();
      nextSoundSource.buffer = currentSoundBuffer;
      nextSoundSource.connect(nextGainNode);
      nextSoundSource.start(0);

      // Fade-out current sound
      if (currentSoundSource) {
        currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, audioContext.currentTime);
        currentGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5); // 0.5 seconds fade-out
        currentSoundSource.stop(audioContext.currentTime + 0.5);
      }

      // Fade-in next sound
      nextGainNode.gain.setValueAtTime(0, audioContext.currentTime);
      nextGainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.5); // 0.5 seconds fade-in

      // Update current sound source and gain node
      currentSoundSource = nextSoundSource;
      currentGainNode = nextGainNode;
      nextSoundSource = null;
      nextGainNode = audioContext.createGain();
      nextGainNode.connect(audioContext.destination);
    }
  });
}

function pauseSound() {
  if (audioContext.state === 'running') {
    audioContext.suspend();
  }
}

function playSound() {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

function stopAllSounds() {
  if (currentSoundSource) {
    currentSoundSource.stop();
  }
  if (nextSoundSource) {
    nextSoundSource.stop();
  }
  currentSoundSource = null;
  nextSoundSource = null;
}

function addPoints() {
  // Get selected element of the select with id team-select
  let team = selectTeam.value;
  let points = parseInt(document.querySelector("#points").value);

  //if team is the one selected in the radio button
  if (document.getElementById(team).checked && points > 0) {
    points = points * 2;
  }
  // Get point number to add to the team from the input with id points
  // Get the first element in the buzz list
  // add points to the buzz-score element
  let score = document.querySelector("#" + team + "-score");
  score.innerHTML = parseInt(score.innerHTML) + points;
  sortTable();
}

// Keep table order by column score
function sortTable() {
  let table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("scoreboard");
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = parseInt(rows[i].getElementsByTagName("td")[1].innerHTML);
      y = parseInt(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
      if (x < y) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

correct = document.getElementById("correct");
correct.addEventListener("click", function () {
  stopAllSounds();
  playSoundWithCrossfade('/sound/correct.mp3');
  playSound();
});

false_sound = document.getElementById("false");
false_sound.addEventListener("click", function () {
  stopAllSounds();
  playSoundWithCrossfade('/sound/false.mp3');
  playSound();
});
