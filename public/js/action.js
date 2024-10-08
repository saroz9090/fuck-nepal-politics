var typingTimer;                
var doneTypingInterval = 200;

$("#search-input").keyup(function(){
  clearTimeout(typingTimer);
  if ($('#search-input').val()) {
      typingTimer = setTimeout(searchContent, doneTypingInterval);
  }
});

function checkIfEmpty() {
  var searchTerm = document.getElementById("search-input").value;
    if(searchTerm.length > 0 && searchTerm != " ") {}
    else {
      //Display default
      $("#search-option").addClass("hidden");
      $("#default-option").removeClass("hidden");
      $("#cancel-search").addClass("hidden");
    }
}

jQuery.get('politicians.txt', function (data) {

  var lines = data.split("\n");
  var currentSection = "general";

  $.each(lines, function (n, elem) {
    
    var elementText;
    var elementDetail;

    console.log("Search: " + elem);
    
    if(elem.includes("(")) {
      elementText = elem.substring(0, elem.indexOf( '(')).replace("[citation needed]", "");;
      var detailNonCapitalized = elem.substring( elem.indexOf( '(' ) + 1, elem.indexOf( ')' ))
      elementDetail = "Crime: " + detailNonCapitalized.charAt(0).toUpperCase() + detailNonCapitalized.slice(1) + ".";
    }
    else {
      elementText = elem.replace("[citation needed]", "");
      elementDetail = "Crime:.";
    }

    if(elementText == "Bribery") {
      currentSection = "bribery";
      
    }
   
    else if(elementText == "Rights") {
      currentSection = "rights";
    }
    else if(elementText == "Fraud")
    {
      currentSection = "fraud";
    }
    else if(elementText == "Embezzlement") {
      currentSection = "embezzlement";
    }
    else if(elementText == "Power") {
      currentSection = "power";
    }
    

    if(!containsSkipWord(elementText)) {

      var boycottItemHTML="";
      boycottItemHTML += "<span class = \"col-span-12 mt-4 md:col-span-6 xl:col-span-4 px-2\"><span class = \"inline-block mr-2 relative -top-1 h-2 w-2 rounded-full bg-gray-900\"><\/span>";
      boycottItemHTML += "                        <span onclick=\"viewNotes(\'"+ elementText.replace("'","") + '+' + elementDetail+"'\)\" class = \"search-object cursor-pointer hover:underline\">"+elementText+"<\/span>";
      boycottItemHTML += "                    <\/span>";

      console.log(currentSection);
      document.getElementById(currentSection + "-spawn").innerHTML += boycottItemHTML;
   
    }    
    
    console.log("norm: " + elementText);
    console.log("detail: " + elementDetail);

  });
 
});

function cancelSearch() {
  document.getElementById("search-input").value = "";
  
  $("#search-option").addClass("hidden");
  $("#default-option").removeClass("hidden");
  $("#cancel-search").addClass("hidden");
}

function clearSearchResults() {
  document.getElementById("search-results-spawn").innerHTML = "";
}

function searchContent() {
    clearSearchResults();
    var searchSuccess = false;
    var searchTerm = document.getElementById("search-input").value;
    console.log(searchTerm);
    if(searchTerm.length > 0 && searchTerm != " ") {
      //Display search results
      $("#search-option").removeClass("hidden");
      $("#default-option").addClass("hidden");
      $("#cancel-search").removeClass("hidden");

      jQuery.get('politicians.txt', function (data) {

        var lines = data.split("\n");
        var currentSection = "general";
      
        $.each(lines, function (n, elem) {

          var elementText;
          var elementDetail;
      
          console.log("Search: " + elem);
          
          if(elem.includes("(")) {
            elementText = elem.substring(0, elem.indexOf( '(')).replace("[citation needed]", "");;
            var detailNonCapitalized = elem.substring( elem.indexOf( '(' ) + 1, elem.indexOf( ')' ))
            elementDetail = "Crime: " + detailNonCapitalized.charAt(0).toUpperCase() + detailNonCapitalized.slice(1) + ".";
          }
          else {
            elementText = elem.replace("[citation needed]", "");
            elementDetail = "Crime: ";
          }

         if(!containsSkipWord(elem)) {
          //Proceed with search if it isn't a word to skip
          if(elem.toLowerCase().includes(searchTerm.toLowerCase())) {
            //Populate this result
            console.log(elem);
            var boycottItemHTML="";
            boycottItemHTML += "<span class = \"col-span-12 mt-4 font-semibold text-xl md:col-span-6 xl:col-span-4 px-2\"><span class = \"inline-block mr-2 relative -top-1 h-2 w-2 rounded-full bg-gray-900\"><\/span>";
            boycottItemHTML += "                        <span onclick=\"viewNotes(\'"+ elementText.replace("'","") + '+' + elementDetail+"'\)\" class = \"search-object cursor-pointer hover:underline\">"+elementText+"<\/span>";
            boycottItemHTML += "                    <\/span>";

            document.getElementById("search-results-spawn").innerHTML += boycottItemHTML;
            searchSuccess = true;
          }
         }
        });

        if(!searchSuccess) {
          document.getElementById("search-results-spawn").innerHTML = "<div class = 'mt-8 text-2xl col-span-12'>No results found. Try modifying your search and checking again!</div>";
        }
       
      });
    }
    else {
      //Display default
      $("#search-option").addClass("hidden");
      $("#default-option").removeClass("hidden");
      $("#cancel-search").addClass("hidden");
    }
}



function containsSkipWord(word) {
  if(word == "Bribery" || word == "Rights" || word == "Fraud" || word == "Power" || word == "Embezzlement")  {
    return true;
  }
  else 
  {
    return false;
  }
}

$(function(){
  $(window).scroll(function() {
      var scroll = $(window).scrollTop(); // how many pixels you've scrolled
      if(scroll > 10) {
        $("#top-nav").addClass("border-gray-400");
      }
      else {
        $("#top-nav").removeClass("border-gray-400");
      }
  });
});

function closeModal() {
  $("#brand-detail-modal").removeClass("z-50");
  $("#brand-detail-modal").addClass("z-0 hidden");
  $("#modal-panel").removeClass("ease-in duration-200 opacity-100");
  $("#modal-backdrop").removeClass("ease-out duration-300 opacity-100");

  $("#modal-panel").addClass("ease-in opacity-0");
  $("#modal-backdrop").addClass("ease-out opacity-0");
}

function viewNotes(notes) {
  notes = notes.split("+");
  var noteName = notes[0];
  var noteDetails = notes[1];

  $("#brand-detail-modal").removeClass("hidden");
  $("#brand-detail-modal").addClass("z-50");
  $("#modal-panel").addClass("ease-in duration-200 opacity-100");
  $("#modal-backdrop").addClass("ease-out duration-300 opacity-100");

  document.getElementById("brand-name").innerText = noteName;
  document.getElementById("brand-details").innerText = noteDetails;
}

function setSearchInput(input) {
  document.getElementById("search-input").value = input;
}

function toggleSection(section) {
  if($("#" + section + "-section").hasClass("hidden") == false) {
    $("#" + section + "-section").addClass("hidden");
    $("#" + section + "-caret").removeClass("rotate-180");
  } else {
    $("#" + section + "-section").removeClass("hidden");
    $("#" + section + "-caret").addClass("rotate-180");
  }
}