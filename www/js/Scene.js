class Scene {
    constructor(game, roomInfo) {

        this.game = game;
        this.showHeader = true;
        this.roomInfo = roomInfo;
        this.roomName = this.game.currentRoom;
        this.totalTriggers = roomInfo.targets.reduce((total, target) => {

            if (target.isTrigger) {
                return total + 1
            } else return total
        }, 0)

        this.triggersLeft = this.totalTriggers;
        this.targets = []
        if (this.game.isTutorial) {
            this.showHeader = false;
            this.currentTargetId = 0;
        }

        $("#roomSVG").remove()

        if (this.roomName == "Ending"){
            var img = $("<img/>", {
                id: "ending_intro",
                src: "img/Congrats.svg"
            })
            img.css({width: "100%", display: "block"})
            $("#screen").append(img)
            $("#screen").css({
                opacity: 1
            });

            var intro_sound = playSound("bubbleSpeech/Ending_Intro_0.mp3", "bubbleSpeech", () => {$("#ending_intro").trigger("click")});
            setTimeout(() => intro_sound.playclip(), 1000)
            

            $("#ending_intro").on("click", () => {
                console.log('closing ending_intro')
                intro_sound.stopclip();
                $("#screen").css({opacity: "0"})

                this.setupRoom(this.roomInfo)
            });
        }else{
            this.setupRoom(this.roomInfo)
        }
    }

    setupRoom() {
        location.hash = `#${this.roomName}`;
        $("#screen").children().not("#KristiIntro").not("#first_splash").remove();

        this.loadRoomImage(this.roomInfo).then(
            () => {
                this.blur = new Blur();
                this.blur.injectFilter();
                this.makeTreasureChest();
                this.makeCubbyBox();
                this.makeTriggerCounter();
                this.makeHint();
                this.makeHelp().then(() => this.makeRoomTypeException());
                resizeWindow();
                if (this.roomInfo.backgroundAnimations.length != 0) {
                    for (var i of this.roomInfo.backgroundAnimations) {
                        
                        var animate = new Animate(i.animationName, i.frameRate, i.loopAmount)
                        animate.animate().then(() => {})
                    }
                }
                $('#screen').fadeTo(1000, 1);
            }

        );
    }

    makeRoomTypeException(){
        

        this.setupTargets()
    }


    // img src = "img/resources/soundon_white.svg"
    loadRoomImage(roomData) {
        var deferred = jQuery.Deferred();
        var roomDiv = $("<div/>", {
            id: "roomSVG"
        })
        var speakerDiv = $("<div/>", {
            id: "speakerIcon",

        }).on("click", () => { this.toggleSpokenAudio() })

        $("#screen").append(roomDiv)
        $("#roomSVG").load(`img/rooms/${roomData.roomImage}`, () => {
            $("#roomSVG").append(speakerDiv)
            this.setSpeakerIcon();
            deferred.resolve("hurray")
        })

        return deferred.promise();
    }
    toggleSpokenAudio() {

        this.game.toggleAutoplay();
        this.setSpeakerIcon();
        this.playNarration();
    }
    setSpeakerIcon() {
        if (this.game.autoplay) {
            $("#speakerIcon").removeClass("audioOff")
        } else {
            $("#speakerIcon").addClass("audioOff")
        }
    }
    animateBackground() {

    }

    playNarration() {

        if (this.Narration) {


            if (this.game.autoplay) {

                this.Narration.playclip()
            } else {

                this.Narration.pauseclip()
            }
        }
    }
    setupTargets() {

        for (var target of this.roomInfo.targets) {
            this.setupTarget(target)

        }

    }
    setupTarget(target, isPost = true) {
        console.log("setupTarget", target)
        this.targets.push(new Target(this, target, true));
        if (this.game.isTutorial) {
            this.blur.highlightComponent(`#${target.Name}`);
        }
    }

    removeTarget() {
        //
        this.targets.splice(this.currentTargetId, 1)
        this.currentTargetId++
            this.triggersLeft--;

        this.makeTriggerCounter()
        if (!this.triggersLeft) {
            this.game.currentRoom
        }
    }


    showItem(item) {

    }

    makeTreasureChest() {
        var treasureChest = $("<div/>", {
            id: "treasureChest"
        })
        $('#roomSVG').append(treasureChest)
    }

    makeCubbyBox() {


        $(this.roomInfo.targets).each(function(index, value) {

            if ("isTrigger" in value) {

                var cubbyBox = $("<div/>", {
                    class: "cubbyBox"
                })
                cubbyBox.attr("id", "cubby_" + value.Name)
                cubbyBox.attr("class", "cubbyCopy")
                var template = $(cubbyTemplate)
                var oriObject = $(`#roomSVG #${value.Name}`).clone()
                template.append(oriObject)
                cubbyBox.append(template)
                oriObject.attr("transform", value.thumbScale)

                cubbyBox.find("g").each(function(item, val) {
                    var olID = $(val).attr("id");
                    $(val).attr("id", "cubbySVG_" + olID)
                })

                $("#treasureChest").append(cubbyBox)

                $(oriObject).hide();

            }
        })

    }






    getItem(itemName) {

        return this.roomInfo.targets.find((item) => item.Name == itemName)

    }


    // function countTriggers(item){
    //
    // }

    makeTriggerCounter() {

        var triggersLeftDiv = $("<div/>", {
            id: "triggersLeft",
            text: "Items to Find: " + this.triggersLeft
        })
        $('#triggersLeft').remove()
        $("#roomSVG").append(triggersLeftDiv)
            // $("#triggersLeft").css("background-color", "green");

    }

    makeHelp() {

        var dfd = $.Deferred();
        $.get("help.html", (helpHTML) => {

            var helpButton = $("<div/>", {
                id: "helpButton",
                html: "?"
            }).on("mouseover mouseout", () => $('#help').toggle())


            var help = $("<div/>", {
                id: "help",
                html: helpHTML
            }).hide()
            $("#roomSVG").append(helpButton, help)

            // $("#help").hide();
            dfd.resolve("Help HTML loaded")

        })
        return dfd.promise();

    }
    makeHint() {

        var hintDiv = $("<div/>", {
            id: "cubbyHint"
        })


        $("#roomSVG").append(hintDiv)

        $('.cubbyCopy').on("mouseenter", (evt) => {
            // var item = this.roomInfo.targets[lookup[evt.currentTarget.id.split("_")[1]]];
            var itemName = evt.currentTarget.id.split("_")[1];
            var itemInfo = this.getItem(itemName);
            var left = `${($(evt.currentTarget).position().left + screen.width)-screen.width}px`

            $('#cubbyHint').css({
                    left: left
                })
                .html(itemInfo.hint)
            $('#cubbyHint').show()

        });
        $('.cubbyCopy').on("mouseleave", function(evt) {
            $('#cubbyHint').hide()
        })
    }




}