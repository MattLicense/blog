(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=0;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-42757042-3', 'mattlicense.co.uk');
ga('send','pageview');

$(document).ready(function(){
    $('a[href^="http"]').each(function(){
        $(this).attr('target','_blank');
    });

    $('a[class^="addthis"]').click(function(){
        ga('send', 'event', 'Social', 'Share', $(this).data("social"));
    });
});