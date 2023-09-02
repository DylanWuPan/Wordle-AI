
$(document).ready(function(){
    let currentRow = 1;
    let currentTile = 1;
    let currentColor = "";
    let bestWord = "";
    let wordlist = [];
    let revealStatus = false;

    $(document).keydown(function(e) {
        if (e.keyCode == 46 || e.keyCode == 8) {
            $("#colorIndicator").hide();
            $("#colorIndicator").removeClass("green");
            $("#colorIndicator").removeClass("yellow");
            $("#colorIndicator").removeClass("gray");
            if(currentTile != 1){
                currentTile -= 1;
                currentID = "#" + "r" + currentRow.toString() + "t" + currentTile.toString();
                $(currentID).text("");
                $(currentID).addClass("default");
                $(currentID).removeClass("filled");

                if($(currentID).hasClass('green')){
                    $(currentID).removeClass("green");
                    $(currentID).removeClass("colored");
                }
                if($(currentID).hasClass('yellow')){
                    $(currentID).removeClass("yellow");
                    $(currentID).removeClass("colored");
                }
                if($(currentID).hasClass('gray')){
                    $(currentID).removeClass("gray");
                    $(currentID).removeClass("colored");
                }
            }
        }
        if(e.keyCode == 27){
            currentColor = ""
            if($("#colorIndicator").hasClass('green')){
                $("#colorIndicator").removeClass("green");
                $("#colorIndicator").hide();
            }
            if($("#colorIndicator").hasClass('yellow')){
                $("#colorIndicator").removeClass("yellow");
                $("#colorIndicator").hide();
            }
            if($("#colorIndicator").hasClass('gray')){
                $("#colorIndicator").removeClass("gray");
                $("#colorIndicator").hide();
            }
        }
        if(e.keyCode == 13){
            $("#colorIndicator").hide();
            $("#colorIndicator").removeClass("green");
            $("#colorIndicator").removeClass("yellow");
            $("#colorIndicator").removeClass("gray");
            let word = "";
            let state = "";
            for (let i = 1; i <= 5; i++){
                let currentID = "#" + "r" + currentRow.toString() + "t" + i.toString();

                if(!($(currentID).hasClass("filled") && $(currentID).hasClass("colored"))){
                    console.log("INVALID: " + currentID);
                    return;
                }
                
                else {
                    let letter = $(currentID).text();
                    word += letter;
                    
                    if($(currentID).hasClass("green")){
                        state += "2";
                    }
                    if($(currentID).hasClass("yellow")){
                        state += "1";
                    } 
                    if($(currentID).hasClass("gray")){
                        state += "0";
                    } 
                }
            }

            $.ajax({
                type: "POST",
                url: "submit",
                data: {"guessNum": currentRow, "word": word, "state": state, "wordlist": JSON.stringify(wordlist), "startWord": "false"},
                success: function(response) {
                    bestWord = response["word"];
                    wordlist = response["wordlist"];
                    //console.log("RESPONSE: " + bestWord + wordlist);
                    $("#revealButton").text("Reveal Best Word");
                    revealStatus = false;
                    displayWordlist(wordlist);
                    if(currentRow <= 6){
                        currentRow++;
                        currentTile = 1;
                    }
                }
            });
        }
      });

    $(document).keypress(function (event) {
        $("#colorIndicator").hide();
        $("#colorIndicator").removeClass("green");
        $("#colorIndicator").removeClass("yellow");
        $("#colorIndicator").removeClass("gray");
        currentID = "r" + currentRow.toString() + "t" + currentTile.toString();

        const key = (event.keyCode ? event.keyCode : event.which);
        let character = String.fromCharCode(key)
        const ascii = character.charCodeAt(0);
        if(!(currentID == "r6t6")){
            if(ascii >= 65 && ascii <= 90 | ascii >= 97 && ascii <= 122){
                $('#' + currentID).text(character);
                $('#' + currentID).addClass("filled");
                $('#' + currentID).removeClass("default");

                if (currentTile != 6){
                    currentTile+=1;
                }
            }
        }
    });

    $('#selectGreen').on('click', function() {
        if($("#colorIndicator").hasClass('green')){
            $("#colorIndicator").removeClass("green");
        }
        if($("#colorIndicator").hasClass('yellow')){
            $("#colorIndicator").removeClass("yellow");
        }
        if($("#colorIndicator").hasClass('gray')){
            $("#colorIndicator").removeClass("gray");
        }

        currentColor = "green";
        $("#colorIndicator").addClass(currentColor)
      });
    
    $('#selectYellow').on('click', function() {
        if($("#colorIndicator").hasClass('green')){
            $("#colorIndicator").removeClass("green");
        }
        if($("#colorIndicator").hasClass('yellow')){
            $("#colorIndicator").removeClass("yellow");
        }
        if($("#colorIndicator").hasClass('gray')){
            $("#colorIndicator").removeClass("gray");
        }

        currentColor = "yellow";
        $("#colorIndicator").addClass(currentColor)
    });

    $('#selectGray').on('click', function() {
        if($("#colorIndicator").hasClass('green')){
            $("#colorIndicator").removeClass("green");
        }
        if($("#colorIndicator").hasClass('yellow')){
            $("#colorIndicator").removeClass("yellow");
        }
        if($("#colorIndicator").hasClass('gray')){
            $("#colorIndicator").removeClass("gray");
        }

        currentColor = "gray";
        $("#colorIndicator").addClass(currentColor)
      });

    $('.letter').on('click', function() {
        let id = "#" + $(this).attr("id");
        if(!($(id).hasClass('submitted')) && $(id).hasClass('filled')){
            if($(id).hasClass('green')){
                $(id).removeClass("green");
                $(id).removeClass("colored");
            }
            if($(id).hasClass('yellow')){
                $(id).removeClass("yellow");
                $(id).removeClass("colored");
            }
            if($(id).hasClass('gray')){
                $(id).removeClass("gray");
                $(id).removeClass("colored");
            }
            $(id).addClass(currentColor);
            $(id).addClass("colored");
        }
    });

    $(document).on("mousemove", function (event) {
        let mouseX = event.pageX;
        let mouseY = event.pageY;
        if(currentColor != ""){
            $("#colorIndicator").show();
            $("#colorIndicator").css({
                "left": mouseX + 5,
                "top": mouseY - 5
            })
            $(".filled").css({
                "cursor": "pointer"
            })
        }
        else{
            $("#colorIndicator").hide();
            $(".filled").css({
                "cursor": "default"
            })
        }
    });

    $('#resetButton').on('click', function() {
        $("#colorIndicator").hide();
        $("#colorIndicator").removeClass("green");
        $("#colorIndicator").removeClass("yellow");
        $("#colorIndicator").removeClass("gray");
        $(".letter").removeClass("filled");
        $(".letter").removeClass("green");
        $(".letter").removeClass("yellow");
        $(".letter").removeClass("gray");
        $(".letter").removeClass("colored");
        $(".letter").addClass("default");
        $(".letter").text("");
        $("#revealButton").text("Reveal Best Word");
        $("#wordlistTitle").text("Remaining Words:");
        document.getElementById("wordlist").innerHTML = "";        
        revealStatus = false;

        currentColor = "";
        currentRow = 1;
        currentTile = 1;
        bestWord = "";
        wordlist = [];
    });

    $('#submitButton').on('click', function() {
        $("#colorIndicator").hide();
        $("#colorIndicator").removeClass("green");
        $("#colorIndicator").removeClass("yellow");
        $("#colorIndicator").removeClass("gray");
        let word = ""
        let state = ""
        for (let i = 1; i <= 5; i++){
            let currentID = "#" + "r" + currentRow.toString() + "t" + i.toString();

            if(!($(currentID).hasClass("filled") && $(currentID).hasClass("colored"))){
                console.log("INVALID: " + currentID);
                return;
            }
            
            else {
                let letter = $(currentID).text();
                word += letter;
                
                if($(currentID).hasClass("green")){
                    state += "2";
                }
                if($(currentID).hasClass("yellow")){
                    state += "1";
                } 
                if($(currentID).hasClass("gray")){
                    state += "0";
                } 
            }
        }

        $.ajax({
            type: "POST",
            url: "submit",
            data: {"guessNum": currentRow, "word": word, "state": state, "wordlist": JSON.stringify(wordlist), "startWord": "false"},
            success: function(response) {
                bestWord = response["word"];
                wordlist = response["wordlist"];
                //console.log("RESPONSE: " + bestWord + "\n" + wordlist);
                $("#revealButton").text("Reveal Best Word");
                revealStatus = false;
                $("#wordlist").text(wordlist);
                if(currentRow != 6){
                    currentRow++;
                    currentTile = 1;
                }
            }
        });
    });

    $("#revealButton").on("click", function(){
        if(revealStatus == false){
            if(currentRow != 1){
                $("#revealButton").text("Best Word: " + bestWord.toUpperCase());
                revealStatus = true;
            }
            else{
                $.ajax({
                    type: "POST",
                    url: "submit",
                    data: {"guessNum": currentRow, "wordlist": JSON.stringify(wordlist), "startWord": "true"},
                    success: function(response) {
                        bestWord = response["word"];
                        wordlist = response["wordlist"];
                        //console.log("RESPONSE: " + bestWord + "\n" + wordlist);
                        $("#revealButton").text("Best Word: " + bestWord.toUpperCase());
                        revealStatus = true;
                        displayWordlist(wordlist);
                    }
                });
            }
        }   
    });

    function displayWordlist(wordlist){
        length = wordlist.length
        let maxWords = 39;
        if(length < maxWords){
            maxWords = length;
        }
        result = "";
        for(let i = 0; i < maxWords; i++){
            word = wordlist[i];
            result += "<p>" + word + "</p>";
        }
        if(length > maxWords){
            result += "<p>...</p>";
        }
        document.getElementById("wordlist").innerHTML = result;
        $("#wordlistTitle").text("Remaining Words (" + length + "):");
    }

  });