"use strict";
$('form .add').click((event) => {
    event.preventDefault();
    $('<div />', { class: 'contestant' }).append($('<input/>', { type: 'text', name: 2 })).insertBefore($(event.target)).focus();
});
//# sourceMappingURL=contestSettings.js.map