var promptType = 0;
var movies = {};
var movieKeys = [];

var allGenres = {};

var name = "user";

var stress;

var STRESS_1 = "These are some movies to make things more exciting.";
var STRESS_2 = "Here's some movies to liven up your day!";
var STRESS_3 = "Here are some perfect movies for you";
var STRESS_4 = "A little anxious? Here's some films to help you calm down. ";
var STRESS_5 = "It's okay to be stressed out. Here's some movies to help you relax.";

function addToChat(msg) {
    $("#chatArea").append("<p class='m-0 ml-2'>" + msg + "</p>");
    document.getElementById("chatArea").scrollTop = document.getElementById("chatArea").scrollHeight;
}

$(document).ready(function() {
    addToChat("Sal: Hi! I'm Sal. What's your name? ");

});

$("#chat").submit(function(e) {
    e.preventDefault();
    addToChat(name + ": " + $("#userInput").val());
    switch (promptType) {
        case 0: // Base Prompt
            name = $("#userInput").val().split(" ")[$("#userInput").val().split(" ").length - 1];
            addToChat("Sal: Nice to meet you, " + name + "!");
            changePrompt(1);
            break;
        case 1: // Stress Level Prompt
            var stress = $("#userInput").val();
            var val = -$("#userInput").val() + 6;
            $.ajax({
                url: '/chatbot/get_movies',
                type: 'GET',
                data: {
                    'stress': val
                },
                success: function(result) {
                    allGenres = {};
                    var gotten = 0;
                    movieKeys = Object.keys(result);
                    $("#movieCards").remove();
                    $("#chatArea").append('<div id="movieCards" style="display: inline-block"></div>');
                    for (var x = 0; x < movieKeys.length; x++) { // get information about movies pulled from stress list
                        $.ajax({
                            url: 'https://api.themoviedb.org/3/movie/' + movieKeys[x] + '?api_key=1e94de5ed2dc8e3c7ef6674f1d7b6822',
                            type: 'GET',
                            success: function(r) {
                                movies[r.id] = r;
                                gotten += 1;
                                for (var i = 0; i < r.genres.length; i++) { // loop through genre (id and name)
                                    if (allGenres[r.genres[i].name] == null) {
                                        allGenres[r.genres[i].name] = 1;
                                    } else {
                                        allGenres[r.genres[i].name] += 1;
                                    }
                                }
                                if (gotten == movieKeys.length) { // Ready to display popular genre results
                                    if (getHighest(allGenres) < movieKeys.length) {
                                        addToChat("Sal: Want to watch a " + getHighestIdx(allGenres) + " movie?");
                                        changePrompt(2);
                                    } else { // Don't prompt users if all things are the same
                                        $("#movieCards").append('<a onclick="setInputText(`' + result[r.id] + '`)"><img class="m-3" style="max-width: 20%" src="https://image.tmdb.org/t/p/w500' + r.poster_path + '"></img></a>');
                                        changePrompt(10);
                                    }
                                }

                            },
                            error: function(exception) {
                                alert('Exception:' + exception);
                            }
                        });
                    }
                }
            });
            break;
        case 2: // Asks if would like certain genre
            for (var i = 0; i < Object.keys(movies).length; i++) {
                var contains = false;
                for (var j = 0; j < Object.values(movies)[i].genres.length; j++) {
                    if (Object.values(movies)[i].genres[j].name == getHighestIdx(allGenres)) {
                        contains = true;
                    }
                }
                if (contains) {
                    if ($("#userInput").val().trim().toLowerCase() == "no" || $("#userInput").val().trim().toLowerCase() == "n") {
                        movieKeys.splice(movieKeys.indexOf(Object.values(movies)[i].id.toString()), 1);
                    }
                } else {
                    if ($("#userInput").val().trim().toLowerCase() == "yes" || $("#userInput").val().trim().toLowerCase() == "y") {
                        movieKeys.splice(movieKeys.indexOf(Object.values(movies)[i].id.toString()), 1);
                    }
                }
            }

            $("#movieCards").remove();
            $("#chatArea").append('<div id="movieCards" style="display: inline-block"></div>');

            for (var i in movieKeys) {
                $("#movieCards").append('<a onclick="setInputText(`' + movies[movieKeys[i]].title + '`)"><img class="m-3" style="max-width: 20%" src="https://image.tmdb.org/t/p/w500' + movies[movieKeys[i]].poster_path + '"></img></a>');
            }

            addToChat("Sal: " + getStressMessages(parseInt(stress)))

            changePrompt(10);
            break;
        case 10: // Rating
        $.ajax({
                url: '/chatbot/updateModel',
                type: 'POST',
                data: {
                    id: getIdFromName($("#userInput").val().replace(/\w+[.!?]?$/, '').trim()),
                    value: $("#userInput").val().split(" ")[$("#userInput").val().split(" ").length - 1]
                },
                success: function(r) {
                    addToChat("Sal: Rating Submitted");
                    changePrompt(1);
                }
            });
            break;
    }
    $("#userInput").val(" ");

});

function changePrompt(x) {
    if (promptType != x) {
        switch (x) {
            case 0: // Name Prompt
                break;
            case 1: // Stress
                promptType = 1;
                addToChat("Sal: Enter your stress level (1-5): ");
                break;
            case 2:
                promptType = 2;

                break;
            case 10: // Rate
                promptType = 10;
                addToChat("Sal: Rate a movie (format: title rating[1-5])");
                break;
        }
    }
}

function setInputText(i) {
    $("#userInput").val(i);
}

function getHighestIdx(a) {
    high = -1;
    idx = -1;
    for (var key in a) {
        if (a[key] > high) {
            idx = key;
            high = a[key];
        }
    }
    return idx;
}

function getHighest(a) {
    high = -1;
    for (var key in a) {
        if (a[key] > high) {
            high = a[key];
        }
    }
    return high;
}

function getStressMessages(i) {
    switch (i) {
        case 1:
            return STRESS_1;
            break;
        case 2:
            return STRESS_2;
        case 3:
            return STRESS_3;
            break;
        case 4:
            return STRESS_4;
            break;
        case 5:
            return STRESS_5;
            break;
        default:
            return "Here are some recommendations";
            break;
    }

}

function getIdFromName(name) {
for (var x = 0; x < Object.keys(movies).length; x++) {
    if (Object.values(movies)[x].title == name) {
        return Object.values(movies)[x].id;
    }
}
}