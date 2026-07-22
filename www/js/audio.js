var audiotypes = {
    "mp3": "audio/mpeg",
    "mp4": "audio/mp4",
    "ogg": "audio/ogg",
    "wav": "audio/wav"
}



function playSound(sound, type, callback = () => { }) {
    let cb = callback;
    let audio_element = $(`#${type}`)[0];
    let source_element = $(`#${type} source`)[0];

    if (audio_element.canPlayType) {
        source_element.setAttribute('src', "audio/" + sound)
        
        audio_element.addEventListener('ended', (event) => {
            cb()
        });




        audio_element.load()
        audio_element.playclip = function () {
            audio_element.pause()
            audio_element.currentTime = 0
            audio_element.play()
        }
        audio_element.pauseclip = function () {
            audio_element.pause()
        }
        audio_element.stopclip = function () {
            cb = () => { };


            audio_element.pause();
            audio_element.currentTime = 0;
        }
        return audio_element
    }
}