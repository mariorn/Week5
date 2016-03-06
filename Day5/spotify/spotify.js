
var apiUrl = "https://api.spotify.com/v1/search?q=";
//concatenar canción -> los espacios -> %20
//concatenar tipo de búsqueda -> &type=track
var apiUrlEnd = "&type=track";


function transform(title){
  return title.split(" ").join("%20");
}


function fetchSpotify(event){
  $('.js-modal-results').modal("hide");

  var filterSong = transform($('input').val());

  if(event){
    filterSong = event.currentTarget.className.split("js-search ")[1];
  }

  //Search song
  $.ajax({
    url: apiUrl + filterSong + apiUrlEnd,
    success: function (response){      

      if(response.tracks.items.length > 0){
        $('.title').text(response.tracks.items[0].name);
        $('.author').text(response.tracks.items[0].artists[0].name);
        $('progress').attr("value", 0);
        $('progress').attr("max", 100);
        $("audio").attr("src", response.tracks.items[0].preview_url);
      }

    //Search cover image
    $.get("https://api.spotify.com/v1/search?type=artist&query=" + 
      response.tracks.items[0].artists[0].name, function(responseCover){
        $('.js-cover-img').attr("src" , responseCover.artists.items[0].images[0].url)
        $('.modal-name').text(responseCover.artists.items[0].name);
        $('.modal-photo').attr("src", $('.js-cover-img').attr("src"));
        if(responseCover.artists.items[0].length > 0){
          $('.modal-genres').text( responseCover.artists.items[0].genres );
        }else{
          $('.modal-genres').text( "Not specified" );
        }
        $('.modal-followers').text( responseCover.artists.items[0].followers.total );
        $('.modal-popularity').text(responseCover.artists.items[0].popularity);
      });

    }
  });

}


function fetchSpotifyMoreResults(){

  $(".dl-horizontal-results").empty();
  var filterSong = transform($('input').val());

  //Search song
  $.ajax({
    url: apiUrl + filterSong + apiUrlEnd,
    success: function (response){      

      var allTracksResponse = response;


      if(response.tracks.items.length > 0){

        response.tracks.items.forEach(function showEvolution (track) {
          $(".dl-horizontal-results").append("<dt>Artist:</dt>");
          $(".dl-horizontal-results").append("<dd>"+ track.artists[0].name +"</dd>");
          $(".dl-horizontal-results").append("<dt>Track:</dt>");
          $(".dl-horizontal-results").append("<a class='js-search "+track.name+"'>"+ track.name +"</a>");
          $(".dl-horizontal-results").append("<dd> <img class='track"+track.id+" img-responsive modal-photo'/> </dd>");

          //Search cover image
          $.get("https://api.spotify.com/v1/search?type=artist&query=" + 
            track.artists[0].name, function(responseCover){
              console.log(responseCover);
              $(".track"+track.id).attr("src", responseCover.artists.items[0].images[0].url);
            });
        });
      }
    }//success
  });//ajax


  $('.js-modal').modal("hide");
  $('.js-modal-results').modal("show");

}


function printTime () {
  var current = $('.js-player').prop('currentTime');
  var total = $('.js-player').prop('duration');
  var widthOfProgressBar = Math.floor( (100 / total ) * current);
  $('progress').attr("value", widthOfProgressBar);
}


function pauseAudio(){
  $('.js-player').trigger('pause');
  $('.btn-play').removeClass("playing");
  $('.btn-play').addClass("disabled");
}

function playAudio(){
  $('.js-player').trigger('play');
  $('.btn-play').removeClass("disabled");
  $('.btn-play').addClass("playing");
}

function showModal(){
  $('.js-modal').modal("show");
}

function controlEnter(e){
  if(e.which == 13){
    e.preventDefault();
    fetchSpotify();
  }
}

function controlAudio(event){
  if($('.btn-play').hasClass("disabled")){
    playAudio();
  }else{
    pauseAudio();
  }
}

$(document).on('ready',function (){
  $('.js-modal').modal("hide");

  $('.js-search')[0].onclick = fetchSpotify
  $('.js-see-more')[0].onclick = fetchSpotifyMoreResults

  $('input').keyup(controlEnter);

  $('.btn-play').on("click", controlAudio);

  $('.js-player').on('timeupdate', printTime);
  $('.js-player').on('ended', pauseAudio);

  $('.author').on('click', showModal)
  $(".dl-horizontal-results").on('click', '.js-search', fetchSpotify);

});

