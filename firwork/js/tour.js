$(document).ready(function(){
    var spin = 0;
    $('.spin-button').click(function() {
        spin ++;
        var randDegree = Math.floor(Math.random() * 1800) +1;
        var totalDegree = spin * 1800 +randDegree;
        $('#wheel').css({'transform': 'rotate(' + totalDegree + 'deg)'});
    });
});