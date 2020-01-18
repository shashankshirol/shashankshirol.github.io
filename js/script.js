//Hello darkness my old friend.
//Don't worry, there was stuff here before. I just found a better way to implement it. (28/12/18 9:21 PM)

//Tadaaaaaaa, There's new code here now; (29/12/18 10:23 AM)
function startAnimation(id){
    document.getElementById(id).style.webkitAnimationPlayState = "running";
    document.getElementById(id).style.animationPlayState = "running";
}

function changePhoto(){
    $('#profile').hide();
    var photo_num = document.getElementById('profile').getAttribute('src').charAt(7);
    document.getElementById('profile').setAttribute("src", "images/"+(parseInt(photo_num) + 1)%3+".jpg");
    $('#profile').fadeIn(1500);
}