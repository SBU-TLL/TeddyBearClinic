


//function "skip()" can be entered in the 
//The final textbox will remain open and not proceed to next scene until closed.//

function skip()

{

for(i of game.Scene.targets)
{
$(i.targetSelector).trigger("click")
}


}
