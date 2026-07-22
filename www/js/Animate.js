class Animate {
    constructor(animationName, frameRate, loopAmount = 1) {
        
        this.animationName = animationName
        this.frameRate = frameRate
        this.currentFrame = 1
        this.currentLoop = 1
        this.loopAmount = loopAmount
        this.timeout = 0
        
    }
    animate(isInternal = false) {


        var framesSelector = $(`[id=${this.animationName}]>[id^="${this.animationName}-"]`)
        framesSelector.hide();


        if (framesSelector.length == 0) {
            this.animateDeferred = $.Deferred();
            this.animateDeferred.resolve("vfdg");
            return this.animateDeferred.promise();
        }


        framesSelector.hide();

        var currentLayer = $(`#${this.animationName}-${this.currentFrame}`)

        $(`#${this.animationName}-${this.currentFrame}`).show();


        if (currentLayer.length >= 1) {

            this.currentFrame++
                this.timeout = setTimeout(() => this.animate(true), 2000 / this.frameRate)
                
        } else {
            if (this.currentLoop >= this.loopAmount) {

                $(`#${this.animationName}-${this.currentFrame - 1}`).show();
                // var framesSelector = $(`[id^="${this.targetInfo.Name}"]`)

                this.animateDeferred.resolve("vfdg");
                clearTimeout(this.timeout);

                //framesSelector.show(())

            } else {

                this.currentFrame = 1;
                this.currentLoop++;
                this.animate(true);

            }
        }



        //setTimeout(()=>animateDeferred.resolve("vfdg"),4000)
        if (!isInternal) {

            this.animateDeferred = $.Deferred();
            return this.animateDeferred.promise();

        }


    }
}