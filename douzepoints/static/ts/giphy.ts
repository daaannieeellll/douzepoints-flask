interface GIPHY {
    data: GIPH[];
    pagination: {
      total_count: number;
      count: number;
      offset: number;
    };
    meta: {
      status: number;
      msg: string;
      response_id: string;
    };
}
  
interface GIPH {
    type: string;
    id: string;
    url: string;
    slug: string;
    bitly_gif_url: string;
    bitly_url: string;
    embed_url: string;
    username: string;
    source: string;
    title: string;
    rating: string;
    content_url: string;
    source_tld: string;
    source_post_url: string;
    is_sticker: number;
    import_datetime: string;
    trending_datetime: string;
    images: {
      "480w_still": {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      downsized: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      downsized_large: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      downsized_medium: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      downsized_small: {
        height: string;
        width: string;
        mp4_size: string;
        mp4: string;
      };
      downsized_still: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      fixed_height: {
        height: string;
        width: string;
        size: string;
        url: string;
        mp4_size: string;
        mp4: string;
        webp_size: string;
        webp: string;
      };
      fixed_height_downsampled: {
        height: string;
        width: string;
        size: string;
        url: string;
        webp_size: string;
        webp: string;
      };
      fixed_height_small: {
        height: string;
        width: string;
        size: string;
        url: string;
        mp4_size: string;
        mp4: string;
        webp_size: string;
        webp: string;
      };
      fixed_height_small_still: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      fixed_height_still: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      fixed_width: {
        height: string;
        width: string;
        size: string;
        url: string;
        mp4_size: string;
        mp4: string;
        webp_size: string;
        webp: string;
      };
      fixed_width_downsampled: {
        height: string;
        width: string;
        size: string;
        url: string;
        webp_size: string;
        webp: string;
      };
      fixed_width_small: {
        height: string;
        width: string;
        size: string;
        url: string;
        mp4_size: string;
        mp4: string;
        webp_size: string;
        webp: string;
      };
      fixed_width_small_still: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      fixed_width_still: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      looping: {
        mp4_size: string;
        mp4: string;
      };
      original: {
        height: string;
        width: string;
        size: string;
        url: string;
        mp4_size: string;
        mp4: string;
        webp_size: string;
        webp: string;
        frames: string;
        hash: string;
      };
      original_still: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      original_mp4: {
        height: string;
        width: string;
        mp4_size: string;
        mp4: string;
      };
      preview: {
        height: string;
        width: string;
        mp4_size: string;
        mp4: string;
      };
      preview_gif: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
      preview_webp: {
        height: string;
        width: string;
        size: string;
        url: string;
      };
    };
    user: {
      avatar_url: string;
      banner_image: string;
      banner_url: string;
      profile_url: string;
      username: string;
      display_name: string;
      description: string;
      instagram_url: string;
      website_url: string;
      is_verified: boolean;
    };
    analytics_response_payload: string;
    analytics: {
      onload: {
        url: string;
      };
      onclick: {
        url: string;
      };
      onsent: {
        url: string;
      };
    };
}
  
class GiphSelector {
    constructor(container: JQuery = $("#giph-container")) {
        this.container = container;
        this.amount = 0;
        this.ajaxSettings = {
            url: "https://api.giphy.com/v1/gifs/trending",
            data: {
            api_key: "Z4CpReS0ImO0gKn7abRAQRsERnzxMFr4",
            limit: 25,
            offset: 0
            },
            success: (response: GIPHY) => this.placeGiph(response)
        };

        $("#outer-container").scroll(() => {
            var fullWidth =
            this.container[0].scrollWidth - this.container[0].clientWidth;
            var scrollPos = $("#outer-container").scrollLeft();
            if (
            scrollPos === fullWidth ||
            (scrollPos >= fullWidth - 90 && scrollPos <= fullWidth - 70)
            )
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
            
            /* unfocus input */
            $(".search input").prop("disabled", true);
            $(".search input").prop("disabled", false);
        });

        this.getGiphs();
    }

    placeGiph(response: GIPHY): void {
    response.data.forEach((gif) => {
        var div = $("<div/>");
        div.append(
            $("<img/>", {
                id: gif.id,
                src: gif.images.preview_gif.url,
                alt: gif.title,
                class: "gif"
            })
        );
        div.data('url',gif.images.original.webp);
        div.click((event) => {this.selectGiph($(event.target).parent())});
        div.appendTo(this.container);
        this.amount++;
    });
    }

    selectGiph(div: JQuery): void {
        $("#selected").attr("id", "");
        div.attr("id", "selected");
        this.addToForm(div.data('url'));
    }
    addToForm(url: string): void {
        $('#gif-input').val(url);
        $('.image-view img').attr('src', url);
    }
    getGiphs(): JQueryXHR {
        this.setOffset(this.amount);
        return $.ajax(this.ajaxSettings);
    }
    setQuery(query: string): void {
        if (query === "") {
            delete this.ajaxSettings.data.q;
            this.ajaxSettings.url = "https://api.giphy.com/v1/gifs/trending";
        } else {
            this.ajaxSettings.data.q = query;
            this.ajaxSettings.url = "https://api.giphy.com/v1/gifs/search";
        }
    }
    setOffset(offset: number): void {
    this.ajaxSettings.data.offset = offset;
    }
    resetContainer(): void {
    this.container.html("");
    this.setOffset(0);
    this.amount = 0;
    }
    container: JQuery;
    ajaxSettings: JQueryAjaxSettings;
    amount: number;
}

var giphselector = new GiphSelector();
