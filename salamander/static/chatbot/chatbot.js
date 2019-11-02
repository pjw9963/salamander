function addToChat(msg) {
    $("#chatArea").append("<p class='m-0 ml-2'>" + msg + "</p>");
}

$(document).ready(function() {
    addToChat("SERVER: Enter your stress level (1-5): ")
});

var promptType = 1;
var movies;

$("#chat").submit(function(e) {
    e.preventDefault();
    addToChat("ME: " + $("#userInput").val());
    switch (promptType) {
    case 0: // Base Prompt

    break;
    case 1: // Stress Level Prompt
    $.ajax({ url: '/chatbot/get_movies',
          type: 'GET',
          data: {'stress': $("#userInput").val()},
          success:function(result){
            movies = result;
            var movieKeys = [];
            var idx = 1;
            $("#movieCards").remove();
            addToChat("SERVER: Here are some suggestions")
            $("#chatArea").append('<div id="movieCards" style="display: inline-block"></div>');

            movieKeys = Object.keys(result);
            for (var x = 0; x < movieKeys.length; x++) {
                $.ajax({ url: 'https://api.themoviedb.org/3/movie/' + movieKeys[x] + '?api_key=1e94de5ed2dc8e3c7ef6674f1d7b6822',
                type: 'GET',
                success:function(r){
                    // addToChat("SERVER: " + idx + " - " + result[r.id]);
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
                },
            error:function(exception){alert('Exception:'+exception);}
            });
            }
         }
    });
    promptType = 2;
    break;
    case 2: // Follow up on question 1, ask opinion on movie

    break;
    }
    $("#userInput").val(" ");

});

function setInputText(i) {
    $("#userInput").val(i);
}