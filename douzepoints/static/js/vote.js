$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    // Connect to the socket server
    var socketio = io('http://' + document.domain + ':' + location.port + '/voting');
    socketio.emit('join_room', urlParams.get("cid"));
    
    // This code used for set order attribute for items
    var numberOfItems = $("#options").find('li').length;
    $.each($("#options").find('li'), function(index, item) {
        $(item).attr("order", index);
        var removeBotton = $('<div class="remove" style="display:none">&times</div>');
        removeBotton.click(function() {
            resetPosition($(this).parent());
        });
        $(item).append(removeBotton);
  
    });
  
    $(".points").droppable({
        accept: "li",
        classes: {
            "ui-droppable-hover": "ui-state-hover"
        },
        drop: function(event, ui) {
            // Check for existing another option
            if ($(this).find('li').length > 0)
                resetPosition($(this).find('li'));
  
            $(ui.draggable).find('div.remove').attr("style", "");
            $(this).append($(ui.draggable));
        }
    });
  
    $("li").draggable({
        helper: "clone",
        revert: "invalid"
    });
  
  
    // This function used for find old place of item
    function resetPosition($item) {
        var indexItem = $item.attr('order');
        var itemList = $("#options").find('li');
        $item.find('div.remove').hide();
  
        if (indexItem === "0")
            $("#options").prepend($item);
        else if (Number(indexItem) === (Number(numberOfItems) - 1))
            $("#options").append($item);
        else
            $(itemList[indexItem - 1]).after($item);
        }
  
        $("button").click(function() {
            vote = {};
            $.each($(".points"), function() {
            if ( $(this).find("li").html() != null) {
                vote[$(this).prev().prev().attr("id")] = $(this).find("li").contents().filter((i, el) => el.nodeType === 3).text();
            } else {
                // TODO: Check for points not assigned!!!
                // alert("No points assigned to: " + $(this).prev().prev().text());
            }
        });
        vname = $("#name").val();
        socketio.emit("vote", urlParams.get("cid"), vname, vote);
        location.reload();
    });
})
  
  
  