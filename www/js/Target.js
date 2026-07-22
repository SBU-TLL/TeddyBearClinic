class Target {
    constructor(scene, targetInfo) {
        this.hasAnimated = false;
        this.scene = scene;
        this.isAnimating = false;
        this.currentFrame = 1;
        this.currentLoop = 1;
        this.targetInfo = targetInfo;
        this.targetInfo.isTrigger = this.targetInfo.isTrigger || false;
        this.loopAmount = this.targetInfo.loopAmount || 1;
        this.targetSelector = $(`#roomSVG  #${this.targetInfo.Name}`)
        this.targetSelector.addClass("target")
        this.targetSelector.on("click", (evt) => {
            this.itemClicked(evt)
        })
        if (this.targetInfo.autoFirst){
            setTimeout(() => {$(`#${this.targetInfo.Name}`).trigger("click")}, 1000)
        }
    }

    itemClicked(evt) {
        var soundclip = "MirrorDing.mp3";
        if (this.targetInfo.isTrigger) {
            $(".target").css({ pointerEvents: "none" });
        }else{ //For non-triggers (aka the Headlights)
            soundclip = "Honk.wav"
        }
        playSound(soundclip, "soundEffect").playclip()
        setTimeout(() => this.modalAndCubbyShow(evt), 500)

    }

    // initialize the timer variables and start the animation

    modalAndCubbyShow(evt) {

        if (this.targetInfo.isTrigger) {
            var cubbyCheck = evt.currentTarget.id.slice(0, 8)

            if (cubbyCheck === "cubbySVG") {

            } else {
                // this.scene.removeTarget()
                var cubbyTarget = `#cubbySVG_${this.targetInfo.Name}`
                $(cubbyTarget).show(2000)
                $(cubbyTarget).off().on("click", (evt) => this.itemClicked(evt));

                // $(`#${this.targetInfo.Name}`).hide("1000");
                this.scene.blur.removeHighlightCopy()
                if (this.scene.game.isTutorial && this.scene.triggersLeft) {

                    this.scene.setupTarget(this.scene.roomInfo.targets[this.scene.currentTargetId])
                }
            }
            //  isTrigger = true;
        } else {

        }

        var itemName = this.targetInfo.Name
        if (true || !$("#thoughtBubble").length) {


            if (!this.scene.triggersLeft) {
                this.scene.showHeader = true
            }
            if (this.targetInfo.isTrigger) {
                this.targetModalDialog = new ModalDialog(this.scene, this.targetInfo, 0)
            } else {

                var animate = new Animate(this.targetInfo.Name, this.targetInfo.frameRate)
                animate.animate().then(() => { })
            }

        }


        if (this.targetInfo.isTrigger) {
            this.targetSelector.off()
        }
    }



}



