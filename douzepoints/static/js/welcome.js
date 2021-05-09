"use strict";
$(document).ready(function () {
    $("#vote button").click(e => {
        window.location.href = window.location.origin + "/" + $(e.target).prev().val();
    });
});
//# sourceMappingURL=welcome.js.map