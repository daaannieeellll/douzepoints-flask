interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
}

interface Element {
    msRequestFullscreen?: () => Promise<void>;
    mozRequestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
}

interface Vote {
    gif: string;
    name: string;
    votes: Score;
}

interface Score {
    [id: string]: number;
}

interface Coordinate {
    top: string;
    left: string;
}

declare var votes: Vote[];

class Leaderboard {
    topNine: TopNine;
    contestants: {[id: string]: Contestant};
    order: Contestant[];
    n: number;
    douze: string;

    constructor() {
        this.topNine = new TopNine();
        this.contestants = {};
        this.order = [];
        this.n = 0;
        this.douze = "";
    }

    animate(ms:number = 100) {
        var timeout = ms;
        var size = this.n;
      
      if (size > 13) {
        this.order[0].animate();
        setTimeout(() => this.order[1].animate(), timeout);
        for (var i = 2; i < size/2; i++)
          (idx => setTimeout(() => {
            this.order[idx].animate();
            if (idx + 11 < size)
              this.order[idx + 11].animate();
          }, idx*timeout))(i);
        setTimeout(() => this.order[size-2].animate(), (size-1)*timeout/2);
        setTimeout(() => this.order[size-1].animate(), size*timeout/2);
      }
      else
        this.order.forEach((contestant, i) => {
          setTimeout(() => {
            contestant.animate();            
          }, i*timeout);
        });
    }

    addContestant(contestant: Contestant) {
        this.contestants[contestant.id] = contestant;
        this.order.push(contestant);
        this.n++;
        if (this.n !== 1) this.topNine.addContestant();
    }

    addVote(vote: Vote | undefined) {
        if (typeof vote == 'undefined')
            return;

        $(".presenter #name").text(vote.name);
        $(".presenter img").attr("src", vote.gif);

        this.order.forEach(c => $(c.element).removeAttr("data-points"));

        for (const [id, points] of Object.entries(vote["votes"])) {
            if (points === 12) {
                this.douze = id;
            } else {
                this.topNine.addPoints(this.getName(id), points);
                this.contestants[id].addPoints(points);
            }
        }
    }

    douzePoints() {
        var id = this.douze;
        if (id) {
            this.contestants[id].addPoints(12);
            this.douze = "";
        }
    }

    reorder() {
        this.order.sort((a,b) => b.points - a.points);
        this.order.forEach((c, i) => {
            c.element.animate({
                top: positions[i]["top"],
                left: positions[i]["left"]
            }, 1000);
        });
    }

    
    getName(id: string) : string {
        return $(this.contestants[id].element).find(".name").text();
    }
}


class Contestant {
    element: JQuery;
    id: string;
    index: number;
    points: number;
    
    constructor(element: JQuery) {
        this.element = element;
        this.id = element.attr("id");
        this.index = 0;
        this.points = 0;
    }

    animate() {
        this.element.animate({
            width:"toggle",
            opacity: "toggle"
        }, 500, "swing");
    }

    addPoints(points: number) {
        this.points += points;
        this.updateDOM(points);
    }

    updateDOM(points: number) {
        this.element.attr("data-points", points);
        this.element.find(':last()').text(this.points);
    }
}

class TopNine {
    element: JQuery;
    scores: number[];

    constructor(n: number = 0) {
        this.element = $("#topNine .points");
        this.scores = [10,8,7,6,5,4,3,2,1];
    }

    addContestant() {
        var score = this.scores.shift();
        if (score)
            this.element.append(
                $("<div />", {
                    class: "contestant",
                    id: score,
                    "data-points": score
                }).append(
                    $("<p />", {
                        class: "name"
                    })
                ));
    }

    addPoints(name: string, points: number) {
        $(`#${points}`).find(".name").text(name);
    }
}

/*
tsParticles.load("tsparticles",
{
    "autoPlay": true,
    "background": {
      "color": {
        "value": "#c78fff"
      },
      "image": "",
      "position": "",
      "repeat": "",
      "size": "",
      "opacity": 0.64
    },
    "backgroundMask": {
      "composite": "destination-out",
      "cover": {
        "color": {
          "value": "#fff"
        },
        "opacity": 1
      },
      "enable": false
    },
    "fullScreen": {
      "enable": true,
      "zIndex": -1
    },
    "detectRetina": true,
    "fpsLimit": 60,
    "manualParticles": [],
    "motion": {
      "disable": false,
      "reduce": {
        "factor": 4,
        "value": true
      }
    },
    "particles": {
      "bounce": {
        "horizontal": {
          "random": {
            "enable": false,
            "minimumValue": 0.1
          },
          "value": 1
        },
        "vertical": {
          "random": {
            "enable": false,
            "minimumValue": 0.1
          },
          "value": 1
        }
      },
      "collisions": {
        "bounce": {
          "horizontal": {
            "random": {
              "enable": false,
              "minimumValue": 0.1
            },
            "value": 1
          },
          "vertical": {
            "random": {
              "enable": false,
              "minimumValue": 0.1
            },
            "value": 1
          }
        },
        "enable": false,
        "mode": "bounce",
        "overlap": {
          "enable": true,
          "retries": 0
        }
      },
      "color": {
        "value": "#ffffff",
        "animation": {
          "h": {
            "count": 0,
            "enable": true,
            "offset": 0,
            "speed": 50,
            "sync": false
          },
          "s": {
            "count": 0,
            "enable": false,
            "offset": 0,
            "speed": 1,
            "sync": true
          },
          "l": {
            "count": 0,
            "enable": false,
            "offset": 0,
            "speed": 1,
            "sync": true
          }
        }
      },
      "links": {
        "enable": false,
      },
      "move": {
        "angle": {
          "offset": 45,
          "value": 90
        },
        "attract": {
          "enable": false,
          "rotate": {
            "x": 3000,
            "y": 3000
          }
        },
        "decay": 0,
        "distance": 0,
        "direction": "none",
        "drift": 0,
        "enable": true,
        "gravity": {
          "acceleration": 9.81,
          "enable": false,
          "maxSpeed": 50
        },
        "path": {
          "clamp": false,
          "delay": {
            "random": {
              "enable": false,
              "minimumValue": 0
            },
            "value": 0
          },
          "enable": false
        },
        "outModes": {
          "default": "out",
          "bottom": "out",
          "left": "out",
          "right": "out",
          "top": "out"
        },
        "random": true,
        "size": false,
        "speed": 2,
        "straight": false,
        "trail": {
          "enable": false,
          "length": 10,
          "fillColor": {
            "value": "#000000"
          }
        },
        "vibrate": false,
        "warp": false
      },
      "number": {
        "density": {
          "enable": true,
          "area": 800,
          "factor": 1000
        },
        "limit": 0,
        "value": 100
      },
      "opacity": {
        "random": {
          "enable": true,
          "minimumValue": 0.3
        },
        "value": {
          "min": 0,
          "max": 0.3
        },
        "animation": {
          "count": 0,
          "enable": true,
          "speed": 0.1,
          "sync": false,
          "destroy": "none",
          "minimumValue": 0,
          "startValue": "random"
        }
      },
      "reduceDuplicates": false,
      "rotate": {
        "random": {
          "enable": false,
          "minimumValue": 0
        },
        "value": 0,
        "animation": {
          "enable": false,
          "speed": 0,
          "sync": false
        },
        "direction": "clockwise",
        "path": false
      },
      "shadow": {
        "blur": 0,
        "color": {
          "value": "#000000"
        },
        "enable": false,
        "offset": {
          "x": 0,
          "y": 0
        }
      },
      "shape": {
        "type": "circle"
      },
      "size": {
        "random": {
          "enable": true,
          "minimumValue": 1
        },
        "value": {
          "min": 1,
          "max": 11
        },
        "animation": {
          "count": 0,
          "enable": false,
          "speed": 3,
          "sync": false,
          "destroy": "none",
          "minimumValue": 1,
          "startValue": "random"
        }
      },
      "stroke": {
        "width": 0,
        "color": {
          "value": "",
          "animation": {
            "h": {
              "count": 0,
              "enable": false,
              "offset": 0,
              "speed": 0,
              "sync": false
            },
            "s": {
              "count": 0,
              "enable": false,
              "offset": 0,
              "speed": 1,
              "sync": true
            },
            "l": {
              "count": 0,
              "enable": false,
              "offset": 0,
              "speed": 1,
              "sync": true
            }
          }
        }
      },
      "twinkle": {
        "lines": {
          "enable": false,
          "frequency": 0.05,
          "opacity": 1
        },
        "particles": {
          "enable": false,
          "frequency": 0.05,
          "opacity": 1
        }
      }
    },
    "pauseOnBlur": true,
    "pauseOnOutsideViewport": true,
    "responsive": [],
    "themes": []
});
*/
var leaderboard = new Leaderboard();

var positions = getPositions();
function getPositions() {
    var positions: Coordinate[] = [];
    var cheight = 100 * $('.contestant').height() / $('.contestant').parent().height();
    var ctop = 0;
    var cleft = 50.5;

    $(".contestant").each((i, elem) => {
        if (i < 13) {
            $(elem).css({top: ctop+"%"});
            positions[i] = {top: ctop+"%", left: "0"}
        } else {
            if (i===13) {
                ctop = 0;
            }
            $(elem).css({top: ctop+"%", left: cleft+"%"});
            positions[i] = {top: ctop+"%", left: cleft+"%"}
        }
        ctop += cheight + 0.4;
        leaderboard.addContestant(new Contestant($(elem)));
    });
    return positions;
}

var action = topNine;
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        action();
        switch (action) {
            case topNine:
                action = reorder;
                break;
            case reorder:
                action = douzePoints;
                break;
            case douzePoints:
                action = topNine;
                break;
            default:
                break;
        }
    }
});


function topNine() {
    $("#leaderboard").fadeOut(500);
    setTimeout(() => {
        leaderboard.animate();
        leaderboard.addVote(votes.shift());
        $("#topNine").fadeIn(700);
    }, 500);
}

function reorder() {
    $("#topNine").fadeOut(500);
    $("#leaderboard").fadeIn(500);
    setTimeout(() => leaderboard.animate(100), 500);
    setTimeout(() => leaderboard.reorder(), 100*leaderboard.n + 750);
}

function douzePoints() {
    leaderboard.douzePoints()
    setTimeout(() => leaderboard.reorder(), 1000);
}

$("#fullscreen").click(function() {
    var element = $("html")[0];
    var isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || false;
    element.requestFullscreen = element.requestFullscreen || element.msRequestFullscreen || element.mozRequestFullscreen || element.webkitRequestFullscreen || function () { return false; }
    document.exitFullscreen = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || function() { return false; }
    isFullscreen ? document.exitFullscreen() : element.requestFullscreen();
});

$(document).ready(function() {
    $("#topNine").hide()
});