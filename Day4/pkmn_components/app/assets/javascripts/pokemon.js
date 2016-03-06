// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

PokemonApp.Pokemon = function (pokemonUri){
  this.id = PokemonApp.Pokemon.idFromUri(pokemonUri);
};

PokemonApp.Pokemon.idFromUri = function (pokemonUri){
  var uriSegments = pokemonUri.split("/");
  var secondLast = uriSegments.length - 2;
  return uriSegments[secondLast];
};

PokemonApp.Pokemon.prototype.show = function (){
      $(".dl-horizontal").append("<dt>Height</dt>");
      $(".dl-horizontal").append("<dd class='js-pkmn-heigth'>"+ this.info.height +"</dd>");
      $(".dl-horizontal").append("<dt>Weigth</dt>");
      $(".dl-horizontal").append("<dd class='js-pkmn-weigth'>"+ this.info.weight +"</dd>");
      $(".dl-horizontal").append("<dt>Hit Points</dt>");
      $(".dl-horizontal").append("<dd class='js-pkmn-hp'>"+ this.info.hp +"</dd>");
      $(".dl-horizontal").append("<dt>Attack</dt>");
      $(".dl-horizontal").append("<dd class='js-pkmn-attack'>"+ this.info.attack +"</dd>");
      $(".dl-horizontal").append("<dt>Defense</dt>");
      $(".dl-horizontal").append("<dd class='js-pkmn-defense'>"+ this.info.defense +"</dd>");
      $(".dl-horizontal").append("<dt>Special Attack</dt>");
      $(".dl-horizontal").append("<dd class='js-pkmn-special-attack'>"+ this.info.sp_atk +"</dd>");
      $(".dl-horizontal").append("<dt>Special Defense</dt>");
      $(".dl-horizontal").append("<dd class='js-pkmn-special-defense'>"+ this.info.sp_def +"</dd>");
      $(".dl-horizontal").append("<dt>Speed</dt>");
      $(".dl-horizontal").append("<dd class='js-pkmn-speed'>"+ this.info.speed +"</dd>");
      $(".dl-horizontal").append("<dt>Type</dt>");
      $(".dl-horizontal").append("<dd class='js-pkmn-type'>"+ this.info.types[0].name +"</dd>");

};


PokemonApp.Pokemon.prototype.render = function (){
  var self = this;

  $.ajax({
    url: "/api/pokemon/" + this.id,
    success: function (response){
      self.info = response;
      if(self.info.evolutions.length > 0){
        self.pokemonEv = new PokemonApp.PokemonEvolutions(self.info.evolutions[0].resource_uri,self.info);
        $(".modal-footer").append("<button type='button' class='btn btn-default js-pkmn-evolutions'>Evolutions</button>");
      }

      $(".js-pkmn-name").text(self.info.name);
      $(".js-pkmn-number").text(self.info.pkdx_id);

      $.ajax({
        url: self.info.sprites[0].resource_uri,
        success: function (response){
          self.img = response;
          $(".js-pkmn-img").attr('src', 'http://pokeapi.co' + self.img.image);
        }
      });

      self.show();

      $(".js-pokemon-modal").modal("show");
    }
  });
};


PokemonApp.PokemonEvolutions = function(pokemonUri, info){
  this.id = PokemonApp.Pokemon.idFromUri(pokemonUri);
  this.info = info;
};

PokemonApp.PokemonEvolutions.prototype.render = function (){

  var self = this;
      self.show();

  if (this.info.evolutions){

    this.info.evolutions.forEach(function showEvolution (evol) {

      $.ajax({
        url: evol.resource_uri,
        success: function (response){
          self.info = response;
          var pokemonEv = new PokemonApp.PokemonEvolutions(evol.resource_uri, self.info);
          pokemonEv.render();
        }
      });

    });
  }
};



PokemonApp.PokemonEvolutions.prototype.show = function (){

  $(".dl-horizontal").append("<dd> <img src='http://pokeapi.co/media/img/"+ this.info.pkdx_id + ".png' class='js-evol-"+this.info.pkdx_id+"'/></dd>");
  $(".dl-horizontal").append("<dt>Name</dt>");
  $(".dl-horizontal").append("<dd class='js-evol-name'>"+ this.info.name +"</dd>");
  $(".dl-horizontal").append("<dt>Height</dt>");
  $(".dl-horizontal").append("<dd class='js-pkmn-heigth'>"+ this.info.height +"</dd>");
  $(".dl-horizontal").append("<dt>Weigth</dt>");
  $(".dl-horizontal").append("<dd class='js-pkmn-weigth'>"+ this.info.weight +"</dd>");
  $(".dl-horizontal").append("<dt>Hit Points</dt>");
  $(".dl-horizontal").append("<dd class='js-pkmn-hp'>"+ this.info.hp +"</dd>");
  $(".dl-horizontal").append("<dt>Attack</dt>");
  $(".dl-horizontal").append("<dd class='js-pkmn-attack'>"+ this.info.attack +"</dd>");
  $(".dl-horizontal").append("<dt>Defense</dt>");
  $(".dl-horizontal").append("<dd class='js-pkmn-defense'>"+ this.info.defense +"</dd>");
  $(".dl-horizontal").append("<dt>Special Attack</dt>");
  $(".dl-horizontal").append("<dd class='js-pkmn-special-attack'>"+ this.info.sp_atk+"</dd>");
  $(".dl-horizontal").append("<dt>Special Defense</dt>");
  $(".dl-horizontal").append("<dd class='js-pkmn-special-defense'>"+this.info.sp_def+"</dd>");
  $(".dl-horizontal").append("<dt>Speed</dt>");
  $(".dl-horizontal").append("<dd class='js-pkmn-speed'>"+ this.info.speed +"</dd>");
  $(".dl-horizontal").append("<dt>Type</dt>");
  $(".dl-horizontal").append("<dd class='js-pkmn-type'>"+ this.info.types[0].name +"</dd>");

};





$(document).on("ready", function(){
var pokemon;

  $(".js-show-pokemon").on("click", function(event){
    $(".dl-horizontal").empty();
    $(".modal-footer").empty();
    var $button = $(event.currentTarget);
    var pokemonUri = $button.data("pokemon-uri");

    pokemon = new PokemonApp.Pokemon(pokemonUri);

    $(".item-evolution").remove();

    pokemon.render();

  });

  $(".js-pokemon-modal").on("click",".js-pkmn-evolutions", function(event){
    $(".dl-horizontal").empty();
    $(".modal-footer").empty();
    pokemon.pokemonEv.render();
    $(".modal-footer").append("<buttontype='button' class='btn btn-default js-pkmn-back'>Back</button>");
  });

  $(".js-pokemon-modal").on("click",".js-pkmn-back", function(event){
    $(".dl-horizontal").empty();
    $(".modal-footer").empty();
    $(".item-evolution").remove();
    pokemon.render();
  });


});