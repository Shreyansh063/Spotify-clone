
async function getsongs() {
    let a = await fetch("Spotify-clone/songs.json");
    let songs = await a.json();  
    return songs;
}

const audio = new Audio()

function secondsToMinutesSeconds(seconds){
    if (isNaN(seconds)||seconds<0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds/60);
    const remainingminutes = Math.floor(seconds%60);

    formattedMinutes = String(minutes).padStart(2,'0');
    formattedSeconds = String(remainingminutes).padStart(2,'0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const Playmusic=(track)=>{
    audio.src = `/Spotify-clone/Spotify-songs/${track}`;
    audio.play();    
}


async function main(){
    // Get the list of all the songs 
    let songs = await getsongs();

    let songUl = document.querySelector(".songlist ul");
    for (const song of songs) {
        
        songUl.innerHTML += `<li>
                <img src="music.svg" alt="music" />
                <div class="info">
                  <div>${decodeURI(song)}</div>
                  <div>Song artist</div>
                </div>
                  <div class="playnow">
                    <span>Play Now</span>
                    <img src="playlb.svg" alt="playlb">
                    </div>
                    </li>`; 
                }
                
    let songinfo = document.querySelector(".songinfo")
    let songtime = document.querySelector(".songtime")
    songtime.innerHTML+= "00:00 / 00:00"

    let play = document.querySelector(".playpause");
    
    //Attach an eventListener to each song
    let track1=null;
    let img1;
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",()=>{
            let track2 = e.querySelector(".info").firstElementChild.innerHTML.trim();
            let img2 = e.querySelector(".playnow img")
            if (audio.paused && track1===null) {
                Playmusic(track2);
                songinfo.innerHTML= track2;
                img2.src = "pauselb.svg"
                play.children[0].src = "pause.svg"
            }
            else if (audio.paused && track2===track1) {
                audio.play();
                songinfo.innerHTML= track2;
                img2.src = "pauselb.svg"
                play.children[0].src = "pause.svg"
            }
            else if (audio.paused && track2!=track1) {
                Playmusic(track2);
                songinfo.innerHTML= track2;
                img2.src = "pauselb.svg"
                play.children[0].src = "pause.svg"
            }
            else if (!audio.paused && track2===track1){
                audio.pause();
                img2.src = "playlb.svg";
                play.children[0].src = "play.svg"
            }
            else if (!audio.paused && track2!=track1) {
                Playmusic(track2);
                songinfo.style.animation = "none";     // temporarily remove
                void songinfo.offsetWidth;             // force reflow
                songinfo.innerHTML= track2;
                songinfo.style.animation = "";         // restore (uses CSS rule)
                img2.src = "pauselb.svg";
                img1.src = "playlb.svg";
                play.children[0].src = "pause.svg"
            }       
            track1=track2;
            document.querySelector(".nowplaying").innerText = `Now playing: ${songs.findIndex(song => decodeURI(song) === track1) + 1} of ${songs.length}`;
            img1 = img2;
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    
    
    play.addEventListener("click", () => {
        let img = play.children[0];
        // let url = img.src; I shouldn't use url here because if the img of playbar is changed by clicking on any song of playlist then the original img.src will also change and it will different from the img.src of url. So i should avoid to use it here.
        if (audio.paused) {
            if (track1 === null) {
                track1 = document.querySelector(".songlist ul li .info").firstElementChild.innerHTML;
                Playmusic(track1);
                document.querySelector(".nowplaying").innerText = `Now playing: ${songs.findIndex(song => decodeURI(song) === track1) + 1} of ${songs.length}`;
                songinfo.innerHTML=track1;
                img1 = document.querySelector(".songlist ul li .playnow img");
                img1.src = "pauselb.svg"
                img.src = "pause.svg"                
            } else {
            img.src="pause.svg";
            img1.src = "pauselb.svg";
            audio.play();
            document.querySelector(".nowplaying").innerText = `Now playing: ${songs.findIndex(song => decodeURI(song) === track1) + 1} of ${songs.length}`;
            }
        } else {
            img.src = "play.svg";
            img1.src = "playlb.svg";
            audio.pause();
        }
    });
    
    audio.addEventListener("ended", () => {
    if (img1) {
    img1.src = "playlb.svg";
    play.children[0].src = "play.svg"}
    track1 = null;
});

    let seekbar = document.querySelector(".seekbar")
    let progressbar = seekbar.querySelector(".progressbar")
    let circle = document.querySelector(".circle")
    
    // Listen for timeupdate event
    audio.addEventListener("timeupdate",()=>{
        // console.log(audio.currentTime,audio.duration);
       let percent = (audio.currentTime/audio.duration)*100;
       document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(audio.currentTime)}/${secondsToMinutesSeconds(audio.duration)}`
       circle.style.left = `${percent}%`;
       progressbar.style.width = `${percent}%`
    })
    
    let next = document.querySelector(".next");
    next.addEventListener('click',()=>{
        if (track1===null) {
            return;
        }
    
        let curretindex = songs.findIndex(song=>decodeURI(song)===track1);
        let nextindex = (curretindex + 1)%songs.length;
        track1 = decodeURI(songs[nextindex]);
    
        Playmusic(track1);
        document.querySelector(".nowplaying").innerText = `Now playing: ${songs.findIndex(song => decodeURI(song) === track1) + 1} of ${songs.length}`;
        songinfo.innerHTML = track1;
        play.children[0].src = "pause.svg";
    
        if(img1)img1.src = "playlb.svg"; //reset previous
        let lis = document.querySelectorAll(".songlist ul li");
        img1 = lis[nextindex].querySelector(".playnow img");
        img1.src = "pauselb.svg";
    });
    
    let prev = document.querySelector(".prev");
    
    prev.addEventListener("click",()=>{
        if(track1===null)return;
    
        let currentindex = songs.findIndex(song=>decodeURI(song)===track1);
        let previndex = (currentindex - 1 + songs.length)%songs.length;
        track1 = decodeURI(songs[previndex]);
    
        Playmusic(track1);
        document.querySelector(".nowplaying").innerText = `Now playing: ${songs.findIndex(song => decodeURI(song) === track1) + 1} of ${songs.length}`;
        songinfo.innerHTML = track1;
        play.children[0].src = "pause.svg";
        
        if(img1)img1.src = "playlb.svg"
        let lis = document.querySelectorAll(".songlist ul li");
        img1 = lis[previndex].querySelector(".playnow img");
        img1.src = "pauselb.svg";
    });

    seekbar.addEventListener("click",(e)=>{
        let rect = seekbar.getBoundingClientRect();
        let clickX = e.clientX - rect.left; // distance from left
        let percent = (clickX/rect.width);
        let newtime = percent*audio.duration;

        audio.currentTime = newtime;

        circle.style.left = `${percent*100}%`;
        progressbar.style.width = `${percent*100}%`;
    })

    let isDragging = false;

    circle.addEventListener("mousedown",(e)=>{
        isDragging= true;
        e.preventDefault();
    })

    document.addEventListener("mousemove",(e)=>{
        if (!isDragging) {
            return;
        }

        const rect = seekbar.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        offsetX = Math.max(0,Math.min(offsetX,rect.width));

        let percent = offsetX/rect.width;
        progressbar.style.width =  `${percent*100}%`
        circle.style.left =  `${percent*100}%`
    })

    document.addEventListener("mouseup",(e)=>{
        if (!isDragging) {
            return;
        }
        isDragging = false;

        const rect = seekbar.getBoundingClientRect();
        let offsetX =  e.clientX - rect.left;
        offsetX = Math.max(0,Math.min(offsetX,rect.width));

        let percent = offsetX/rect.width;
        audio.currentTime = percent*audio.duration;
    })

    const volumeSlider = document.getElementById("volume");

    volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
    });

    // ...existing code...

document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.left');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
});

// ...existing code...    

    // var audio = new Audio(songs[0]);

    // audio.addEventListener("loadeddata",()=>{
    //     console.log(audio.duration,audio.currentSrc,audio.currentTime   );
    //     // Now the duration variable now holds the duration (in seconds) of the audio clip
    //     }
    // )
}

main();









