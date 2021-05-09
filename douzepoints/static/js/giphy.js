"use strict";
class GiphSelector {
    constructor(container = $("#giph-container")) {
        this.container = container;
        this.amount = 0;
        this.ajaxSettings = {
            url: "https://api.giphy.com/v1/gifs/trending",
            data: {
                api_key: "Z4CpReS0ImO0gKn7abRAQRsERnzxMFr4",
                limit: 25,
                offset: 0
            },
            success: (response) => this.placeGiph(response)
        };
        $("#outer-container").scroll(() => {
            var fullWidth = this.container[0].scrollWidth - this.container[0].clientWidth;
            var scrollPos = $("#outer-container").scrollLeft();
            if (scrollPos === fullWidth ||
                (scrollPos >= fullWidth - 90 && scrollPos <= fullWidth - 70))
                this.getGiphs();
        });
        $(".search input").keydown((event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                $(".search div").click();
            }
        });
        $(".search div").click(() => {
            this.resetContainer();
            this.setQuery($(".search input").val());
            this.getGiphs();
            $(".search input").prop("disabled", true);
            $(".search input").prop("disabled", false);
        });
        this.getGiphs();
    }
    placeGiph(response) {
        response.data.forEach((gif) => {
            var div = $("<div/>");
            div.append($("<img/>", {
                id: gif.id,
                src: gif.images.preview_gif.url,
                alt: gif.title,
                class: "gif"
            }));
            div.data('url', gif.images.original.webp);
            div.click((event) => { this.selectGiph($(event.target).parent()); });
            div.appendTo(this.container);
            this.amount++;
        });
    }
    selectGiph(div) {
        $("#selected").attr("id", "");
        div.attr("id", "selected");
        this.addToForm(div.data('url'));
    }
    addToForm(url) {
        $('#gif-input').val(url);
        $('.image-view img').attr('src', url);
    }
    getGiphs() {
        this.setOffset(this.amount);
        return $.ajax(this.ajaxSettings);
    }
    setQuery(query) {
        if (query === "") {
            delete this.ajaxSettings.data.q;
            this.ajaxSettings.url = "https://api.giphy.com/v1/gifs/trending";
        }
        else {
            this.ajaxSettings.data.q = query;
            this.ajaxSettings.url = "https://api.giphy.com/v1/gifs/search";
        }
    }
    setOffset(offset) {
        this.ajaxSettings.data.offset = offset;
    }
    resetContainer() {
        this.container.html("");
        this.setOffset(0);
        this.amount = 0;
    }
}
var giphselector = new GiphSelector();
//# sourceMappingURL=giphy.js.map