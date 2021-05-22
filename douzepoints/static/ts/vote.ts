$(".contestant").click((event) => {
    $("#giphy-selector").addClass("hidden");
});
  
$(".image-view").click(() => {
  $("#giphy-selector").slideToggle(150);
});

$('select').change((event) => {
  var selected = $(event.target).val();
  $('select').each((i, e) => {
      if (selected === $(e).val() && event.target !== e) {
          $(e).val("");
          return false;
      }
  });
});

$('#name').keydown((event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    return false;
  }
});

function validateVote() {
  var valid = true;
  if (!$("#name").val() || !$("#gif-input").val())
    valid = false;

  $('.contestant select').each((i,e) => {
    if (!$(e).val())
      return valid = false;
  });
  return valid ? true : false;
}