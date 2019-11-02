
var promptType = 0;
var movies;

var name = "user";

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
    addToChat("Sal: " + getStressMessages(parseInt($("#userInput").val())))
    var val = -$("#userInput").val()+6;
    $.ajax({ url: '/chatbot/get_movies',
          type: 'GET',
          data: {'stress': val},
          success:function(result){
            movies = result;
            var movieKeys = [];
            var idx = 1;
            $("#movieCards").remove();
            $("#chatArea").append('<div id="movieCards" style="display: inline-block"></div>');

            movieKeys = Object.keys(result);
            for (var x = 0; x < movieKeys.length; x++) {
                $.ajax({ url: 'https://api.themoviedb.org/3/movie/' + movieKeys[x] + '?api_key=1e94de5ed2dc8e3c7ef6674f1d7b6822',
                type: 'GET',
                success:function(r){
                    // addToChat("Sal: " + idx + " - " + result[r.id]);
                    idx++;
                    $("#movieCards").append('<a onclick="setInputText(`' + result[r.id] + '`)"><img class="m-3" style="max-width: 20%" src="https://image.tmdb.org/t/p/w500' + r.poster_path + '"></img></a>');
                    var genres = "";
                    for (var j = 0; j < r.genres.length; j++) {
                        if (j != r.genres.length-1) {
                            genres += r.genres[j].name + ", ";
                        } else {
                            genres += r.genres[j].name;
                        }
                    }
                    //addToChat(genres);
                     changePrompt(2);
                },
            error:function(exception){alert('Exception:'+exception);}
            });
            }
         }
    });
    break;
    case 2: // Follow up on question 1, ask opinion on movie

    $.ajax({url: '/chatbot/updateModel',
                type: 'POST',
                data: {id: Object.keys(movies)[Object.values(movies).indexOf($("#userInput").val().replace(/\w+[.!?]?$/, '').trim())], value: $("#userInput").val().split(" ")[$("#userInput").val().split(" ").length-1]},
                success:function(r){
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
        case 1:
            promptType = 1;
            addToChat("Sal: Enter your stress level (1-5): ")
        break;
        case 2:
            promptType = 2;
            addToChat("Sal: Rate a movie (format: title rating[1-5])");
        break;
    }
    }
}

function setInputText(i) {
    $("#userInput").val(i);
}

function getStressMessages(i) {
console.log(i);
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