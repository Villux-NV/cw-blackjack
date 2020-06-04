//Deck array.
let cardDeck = ["SA", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "SJ", "SQ", "SK",
    "DA", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "DJ", "DQ", "DK",
    "CA", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "CJ", "CQ", "CK",
    "HA", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "HJ", "HQ", "HK"
];

//Player setup and dealer setup. 
let player = {
    cards: [],
    score: 0,
    ace: 0
}

let dealer = {
    cards: [],
    first: 0,
    score: 0,
    ace: 0
}

//Fisher-Yates Shuffle so I can pop() when dealing.
function shuffle(deck) {
    let m = deck.length,
        t, i;

    //While for remaining elements to shuffle
    while (m) {
        //Pick remaining elements..
        i = Math.floor(Math.random() * m--);

        //swapping with current element
        t = deck[m];
        deck[m] = deck[i];
        deck[i] = t;
    }

    return deck;
}

//Functions for dealing cards.
function dealPlayerCard() {
    for (let i = 0; i < 2; i++) {
        let card = cardDeck.pop();
        player.cards.push(card);
    }
    playerValue();
}

function dealDealerCard() {
    for (let i = 0; i < 2; i++) {
        let card = cardDeck.pop();
        dealer.cards.push(card);
    }
    dealerValue();
}

//Functions to update scores. Ace logic. 
function playerValue() {
    player.score = 0;
    player.ace = 0
    for (let i = 0; i < player.cards.length; i++) {
        if (player.cards[i][1] === "J" || player.cards[i][1] === "Q" || player.cards[i][1] === "K" || parseInt(player.cards[i][1]) === 1) {
            player.score += 10;
        } else if (player.cards[i][1] === "A") {
            player.score += 11;
            player.ace++;
        } else {
            player.score += parseInt(player.cards[i][1]);
        }
        if (player.score > 21 && player.ace > 0) {
            player.score -= 10;
            player.ace--;
        }
    }
}

function dealerValue() {
    dealer.score = 0;
    dealer.ace = 0;
    for (let i = 0; i < dealer.cards.length; i++) {
        if (dealer.cards[i][1] === "J" || dealer.cards[i][1] === "Q" || dealer.cards[i][1] === "K" || parseInt(dealer.cards[i][1]) === 1) {
            dealer.score += 10;
        } else if (dealer.cards[i][1] === "A") {
            dealer.score += 11;
            dealer.ace++;
        } else {
            dealer.score += parseInt(dealer.cards[i][1]);
        }
        if (dealer.score > 21 && dealer.ace > 0) {
            dealer.score -= 10;
            dealer.ace--;
        }
    }
    if (dealer.cards[0][1] === "J" || dealer.cards[0][1] === "Q" || dealer.cards[0][1] === "K" || parseInt(dealer.cards[0][1]) === 1) {
        dealer.first += 10;
    } else if (dealer.cards[0][1] === "A") {
        dealer.first += 11;
    } else {
        dealer.first += parseInt(dealer.cards[0][1]);
    }
}

//Disable 'Hit Me' and 'Stand' Buttons
$(document).ready(function() {
    $("#hit-button").attr('disabled', 'disabled');
    $("#stand-button").attr('disabled', 'disabled');
});

//Starts game from deal button. Deals two to player and dealer. Only shows first card and score of dealer.
function startGame() {
    shuffle(cardDeck);
    dealPlayerCard();
    dealDealerCard();
    $(".playerScoreOut").text(player.score);
    $(".dealerScoreOut").text(dealer.first);
}

//New Game button. Just a refresh since no data needs to be saved.
$("#newGame").on("click", function() {
    location.reload();
});

//Deals dealer until end game.
function standButton() {
    $("#card2").html(dealer.cards[1]);
    $("#card2").addClass("cardClass");
    for (let i = dealer.score; i < 22; i++) {
        if (dealer.score < 17) {
            let card = cardDeck.pop();
            dealer.cards.push(card);
            dealerValue();
            $("#card3").html(dealer.cards[2]);
            if (dealer.cards.length === 3) {
                $("#card3").addClass("cardClass");
            }
            $("#card4").html(dealer.cards[3]);
            if (dealer.cards.length === 4) {
                $("#card4").addClass("cardClass");
            }
            $("#card5").html(dealer.cards[4]);
            if (dealer.cards.length === 5) {
                $("#card5").addClass("cardClass");
            }
        }
    }
    if (dealer.score >= 17 && dealer.score < 21 && dealer.score > player.score) {
        console.log("Dealer Wins - stand btn");
        return $(".gameOutcome").append("<strong>Dealer Wins</strong>");
    } else if (dealer.score >= 17 && dealer.score < player.score) {
        console.log("Dealer Loses to player under 21 -- stand btn");
        return $(".gameOutcome").append("<strong>Player Wins</strong>");
    } else if (dealer.score > 21) {
        console.log("Dealer Loses - stand btn");
        return $(".gameOutcome").append("<strong>Dealer Bust</strong>");
    } else if (dealer.score === player.score) {
        console.log("Push - Tie");
        return $(".gameOutcome").append("<strong>Push - Tie</strong>");
    }
}

//Deal cards. Calls startGame. Shows cards/scores. Checks if natural on start. 
$("#deal-button").on("click", function() {
    event.preventDefault();
    startGame();
    $("#hit-button").removeAttr('disabled');
    $("#stand-button").removeAttr('disabled');
    $("#card6").html(player.cards[0]);
    $("#card6").addClass("cardClass");
    $("#card7").html(player.cards[1]);
    $("#card7").addClass("cardClass");
    $("#card1").html(dealer.cards[0]);
    $("#card1").addClass("cardClass");
    $("#deal-button").attr('disabled', 'disabled');
    if (player.score === 21) {
        $("#hit-button").attr('disabled', 'disabled');
        $("#stand-button").attr('disabled', 'disabled');
        $("#card2").html(dealer.cards[1]);
        $("#card2").addClass("cardClass");
        dealerValue();
        $(".dealerScoreOut").text(dealer.score);
        if (dealer.score === player.score) {
            console.log("Holy $h!. That's rare.");
            return $(".gameOutcome").append("<strong>Rare Push - Tie</strong>");
        }
        return $(".gameOutcome").append("<strong>Player Wins</strong>");
    }
});

//Deals one card to player. Updates deck and score.  
$("#hit-button").on("click", function() {
    event.preventDefault();
    let card = cardDeck.pop();
    player.cards.push(card);
    playerValue();
    $("#card8").html(player.cards[2]);
    $("#card8").addClass("cardClass");
    $("#card9").html(player.cards[3]);
    if (player.cards.length === 4) {
        $("#card9").addClass("cardClass");
    }
    $("#card10").html(player.cards[4]);
    if (player.cards.length === 5) {
        $("#card10").addClass("cardClass");
    }
    hitEnd();

});

//Calls stand function, disables buttons as game should end.
$("#stand-button").on("click", function(event) {
    event.preventDefault();
    standButton();
    $("#hit-button").attr('disabled', 'disabled');
    $("#stand-button").attr('disabled', 'disabled');
    end();
});

//Checks players Win/Loss during hits. 
function hitEnd() {
    $(".playerScoreOut").text(player.score);
    $(".dealerScoreOut").text(dealer.first);
    if (player.score === 21) {
        console.log("Player Wins at 21 - hit");
        $("#hit-button").attr('disabled', 'disabled');
        $("#card2").html(dealer.cards[1]);
        $("#card2").addClass("cardClass");
        dealerValue();
        $(".dealerScoreOut").text(dealer.score);
        return $(".gameOutcome").append("<strong>Player Wins</strong>");;
    } else if (player.score > 21) {
        console.log("Player Loses - Over 21 - hit");
        $("#hit-button").attr('disabled', 'disabled');
        $("#stand-button").attr('disabled', 'disabled');
        return $(".gameOutcome").append("<strong>Player Bust</strong>");
    }
}

//Catch message for last outcome. 
function end() {
    $(".playerScoreOut").text(player.score);
    $(".dealerScoreOut").text(dealer.score);
    if (dealer.score === 21) {
        console.log("Dealer Wins - end");
        return $(".gameOutcome").append("<strong>Dealer Wins</strong>");
    }
}