function addCard() {
    var card = $("<div>", { class: "card" });
    var cardContent = $("<div>", { class: "card-content" });
    var row = $("<div>", { class: "row" });
    var cardImg = $("<i>", { class: "card-img fa fa-user-circle" });
    var cardInfo = $("<p>", { class: "card-info" }).text("Cuihua (Steam) han ni chi fan le!");
    var cardDate = $("<span>", { class: "card-date" }).text("08/19/2021");
    var btnGroup = $("<div>", { class: "card-btn-group" });
    var cardBtn = $("<a>", { class: "card-btn", href: "" }).text("Accept");

    return card.append(cardContent.append(row.append(cardImg, cardInfo), cardDate, btnGroup.append(cardBtn)));
}

for (let i = 0; i < 4; i++) {
    $("#card-group").append(addCard());
}