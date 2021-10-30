// platform game list
function star() {
    return $("<span>", { class: "fa fa-star" });
}

function checkStar() {
    return $("<span>", { class: "fa fa-star checked" });
}

function addGameItem() {
    var li = $("<li>", { class: "game-list-item" });
    var row = $("<div>", { class: "row" });
    var gameImg = $("<img>", { class: "game-img", src: "./image/steam.svg" });
    var gameItem = $("<a>", { class: "game-item", href: "" }).text("Destiny 2");
    var gameLink = $("<div>", { class: "game-link" }).append(gameItem);
    var gameRating = $("<div>", { class: "game-rating" });
    for (let i = 0; i < 3; i++) {
        gameRating.append(checkStar());
    }
    for (let i = 0; i < 2; i++) {
        gameRating.append(star());
    }
    var gameTag = $("<p>", { class: "game-tags" }).text("Action | Role-Playing");

    return li.append(row.append(gameImg, gameLink, gameRating, gameTag));
}

for (let i = 0; i < 10; i++) {
    $("#platform-game-list").append(addGameItem());
}