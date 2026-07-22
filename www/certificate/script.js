var svgImage = "Certificate.svg"
var firstFocus1 = true;
var firstFocus2 = true;
var myCanvas;
var ctxt;
var fontSize = [];
var cutOff = [null, 24, 8]
var shrinkRate = [, .4, .45]
var linetext=[];
$(function() {

    myCanvas = document.getElementById("canvas");
    ctxt = myCanvas.getContext("2d");









        $("#badgeHolder").load(svgImage, function() {
            fontSize[1] = parseInt($('#line1').css("font-size"))
            fontSize[2] = parseInt($('#line2').css("font-size"))
            setLineText(1)
            setLineText(2)
            hideAllButtons()
            showButton(4)
            $('#line1Input').on("click",function() {
            
                if (firstFocus1) {
                    $('#line1Input').val("");
                    firstFocus1 = false;
                }
            });
    
            $('#line2Input').on("click",function() {
                if (firstFocus2) {
                    $('#line2Input').val("");
                    firstFocus2 = false;
                }
            });
    
            $('#line1Input,#line2Input').on("keyup", function(evt) {

                    var whichLine = evt.currentTarget.id.split("line")[1].split("Input")[0];
                    var lineVal = $('#' + evt.currentTarget.id).val()
                    var lineEl = $('#line' + whichLine)
                    lineEl.text(lineVal)
                    if (lineVal.length > cutOff[whichLine]) {
                        var newFontSize = fontSize[whichLine] - Math.abs(cutOff[whichLine] - lineVal.length) * shrinkRate[whichLine]
                        lineEl.css({ "font-size": newFontSize + "px" })
                    }
                    // updateDownloadURL()

                })




            $("#makerHolder").on("mouseup", function() {
                
                saveToServer();
                toggleWaiting()

                updateDownloadURL()

                window.location.assign("../credits.html")

                // $("#createLabel").addClass("createPressed")
            });
            function saveToServer(){
                let name = $("#line1Input").val()
                let institution = $("#line2Input").val()
                $.get( "SaveData.php", { name, institution } );
            }



        });



 

        $("#pressButtons g").on("click", handleButtonPress)





    function handleButtonPress(evt) {

        var buttonPress = $(evt.target).closest("g").attr("id").split("-")[1]

        hideAllButtons()
        showButton(buttonPress)

    }








});


function hideAllButtons() {

    [1, 2, 3].forEach(function(i) {

        $("#button" + i + "press").css({
            "display": "none"
        })


    })



}




function setLineText(i) {


    var firstline = document.getElementById('line' + i).innerHTML
    
    $('#line' + i + 'Input').val(firstline)



}


function pickCoin(coinId) {
    var coins = ["gold", "silver", "bronze"]


    $('#Coins > g').attr("style", "display:none")

    $('#' + coins[coinId - 1]).attr("style", "display:inline")






}



function toggleWaiting() {


    // document.getElementById("createLabel").classList.toggle("createLoading");

    // document.getElementById("createBG").classList.toggle("createPressed");
    // document.getElementById("createBGLeft").classList.toggle("createPressedEnd");
    // document.getElementById("createBGRight").classList.toggle("createPressedEnd");
    // document.getElementById("createBGLeftIn").classList.toggle("createPressedIn");
    // document.getElementById("createBGRightIn").classList.toggle("createPressedIn");

}

function showButton(i) {
    var style = "";
    if (i == 4) {

        style = "transform:translate(255px,365px) scale(1.4)";


    }


    $('#logo').attr("style", style);

    $("#button" + i + "press").css({
        "display": "block"
    })
    pickCoin(i)
}




function download() {


    image = document.getElementById("canvas").toDataURL("image/png;base64") //.replace(/^data:image\/(png|jpg);base64,/, "")
    var lnk = document.createElement('a')
    lnk.download = `${$('#line1').text()}_${$('#line2').text()}`;
    lnk.href = image;
    if (document.createEvent) {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false,
            false, 0, null);

        lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
        lnk.fireEvent("onclick");
    }

    //image = document.getElementById("canvas").toDataURL("image/png")
    /*    
    $.post("credly.php", {
                image: image,
                firstline: $('#line1').text(),
                secondline: $('#line2').text()
            },
            function(data) {
                  
               // $('#linkHolder').html("<a href='https://credly.com/recipients/" + JSON.parse(data).data + "'>click</a>");
                //$('#linkHolder').html(data);
            $('#congrats').on("click" , 
                             function(){
                
                window.open("https://credly.com/recipients/" + JSON.parse(data).data,'_blank'); 
                
                
                
            })
            
            
            toggleWaiting()
             $('#finished').attr("style", "display:inline")
            }
        
        );
    */
}

function updateDownloadURL() {
   
    $('foreignObject').remove()
    var img = new Image;
    // img.src = url;
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent($('#badgeHolder').html());
    let width= $('canvas').attr("width")
    let height= $('canvas').attr("height")
    img.addEventListener('load', function() {

        ctxt.drawImage(this, 0, 0, width, height);
        image = document.getElementById("canvas").toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        download();
    });

}
