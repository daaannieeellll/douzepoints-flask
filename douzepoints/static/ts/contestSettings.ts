$('form .add').click((event) => {
    event.preventDefault()
    $('<input/>', {type: 'text', name: 2}).insertBefore($(event.target)).focus();
});