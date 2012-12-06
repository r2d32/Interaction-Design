$(".projectTab").click(function () {
    var name = $(this).text();
    var sites = ["URL1","URL2","..."];
    $(".select-result").text(name);
    $('#proExp')[0].src = sites[$(this).index()];  
})