class Game {

    constructor() {
        this.autoplay = localStorage.getItem('autoplay') || true;
        if (this.autoplay == "false") {
            this.autoplay = false
        }

        this.currentRoom = "CarScene-1.1"
        var checkLocalStorage = localStorage.getItem('currentRoom')
        if (checkLocalStorage) {
            // this.currentRoom = checkLocalStorage
        }


        if (window.location.hash) {
            this.currentRoom = window.location.hash.split("#")[1]
        } else {
            // window.location="welcome.html";	
        }
        if (this.currentRoom == "Hallway") {
            this.isTutorial = true;
        } else {
            this.isTutorial = false;

        }




        this.loadRoom(this.currentRoom)
    }
    toggleAutoplay() {
        this.autoplay = !this.autoplay;
        localStorage.setItem("autoplay", this.autoplay)
    }
    loadRoom() {
        $.get(`JSON/${this.currentRoom}.json`, (result) => {
            $('#screen').css({
                opacity: 0
            });
            this.Scene = new Scene(this, result)
            
            $(document).attr("title", `Road Safety Game ${this.currentRoom.replace("%20"," ")}`);
        }).fail(function() {
            window.location = "./#Hallway";
            location.reload();
        });

        localStorage.setItem('currentRoom', this.currentRoom)
    }
}
