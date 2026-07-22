let sound;
$(()=>{
    if(location.hash){
        closeSplash();
        closeIntro();
    }
    $("#roomSVG").css({display: "none"});

    $("#first_splash").on("click", closeSplash);

    $("#KristiIntro").on("click", closeIntro);
})

function closeSplash(){
	
    $("#first_splash").css({display: "none"});
     
$("#KristiIntro").append($('<video/>',{src:"TBC3.mp4", id:"vid", type: 'video/mp4',style:"left:0;top:0;width:100%;position:absolute;"}))
  
    $("#KristiIntro").show(1000);
  $('#vid').trigger('play').on('ended',function(){
  $('#vid').hide(500);
	sound = playSound("Welcome_Page.mp3", "bubbleSpeech", () => {$("#KristiIntro").trigger("click")});
    sound.playclip();
    }); 
    
}

function closeIntro(){
    console.log("intro click");
    $("#KristiIntro").css({display: "none"});
    var game=new Game();
    sound.stopclip();
}
