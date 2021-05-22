$(document).ready(function() {

    $(".vote input").keydown(e => {
        if (e.key === "Enter")
            $(".vote button").click();
    });
    $(".vote button").click(e => {
        window.location.href = window.location.origin + "/" + $(e.target).prev().val();
    });
});