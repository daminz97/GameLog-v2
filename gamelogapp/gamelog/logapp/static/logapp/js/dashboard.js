// draw pie chart
function drawPie() {
    var plotCost = document.getElementById("pie-chart");
    var gamingCost = {
        "Xbox": 40,
        "Steam": 15,
        "Nintendo": 36,
        "PlayStation": 30
    };

    function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    var budgetLimit = 700;

    var PieChart = function(options) {
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;

        this.draw = function() {
            var total_value = 0;
            var color_index = 0;
            for (var categ in this.options.data) {
                var val = this.options.data[categ];
                total_value += val;
            }

            var start_angle = 0;
            for (categ in this.options.data) {
                val = this.options.data[categ];
                var slice_angle = 2 * Math.PI * val / total_value;

                drawPieSlice(
                    this.ctx,
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    Math.min(this.canvas.width / 2, this.canvas.height / 2),
                    start_angle,
                    start_angle + slice_angle,
                    this.colors[color_index % this.colors.length]
                );

                start_angle += slice_angle;
                color_index += 1;
            }

            if (this.options.legend) {
                color_index = 0;
                var legendHTML = "";
                for (categ in this.options.data) {
                    legendHTML += "<div><span style='display:inline-block;width:20px;background-color:" + this.colors[color_index++] + ";'>&nbsp;</span> " + categ + "</div>";
                }
                this.options.legend.innerHTML = legendHTML;
            }

            // add comments
            const plats = ["Nintendo", "Xbox", "Steam", "PlayStation"];
            for (var plat in plats) {
                var curSpent = this.options.data[plats[plat]];
                var percentage = Math.round(curSpent / total_value * 100);
                $("#cost-comment").append($("<p>").text("You have spent $" + curSpent + " on " + plats[plat] + " games, " + percentage + "% of your total expense."));
            }

            // calc budget
            if (total_value > budgetLimit) {
                $("#cost-comment").append($("<p>").text("Your current budget is $" + budgetLimit + ", you have spent over your budget!").css('color', "red"));
            } else {
                $("#cost-comment").append($("<p>").text("Your current budget is $" + budgetLimit + ", you have spent less than your budget!").css('color', "green"));
            }

            // change budget
            $("#cost-comment").append($("<p>").text("Change my budget to $").append($("<input>", { class: "budget-input", type: "text" })).append($("<button>", { class: "budget-btn" }).text("Confirm")));
        }
    }

    var myPieChart = new PieChart({
        canvas: plotCost,
        data: gamingCost,
        colors: ["#fde23e", "#f16e23", "#57d9ff", "#937e88"],
        legend: myLegend
    });
    myPieChart.draw();
}

drawPie();


// draw line chart
function drawGraph() {
    var myCanvas = document.getElementById("bar-chart");

    function drawLine(ctx, startX, startY, endX, endY, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
    }

    function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
        ctx.restore();
    }

    var myData = {
        "July": 10,
        "August": 30.5,
        "September": 24,
        "October": 29.4,
        "November": 18.7
    };

    var Barchart = function(options) {
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.colors = options.colors;

        this.draw = function() {
            var maxVal = 0;
            for (var categ in this.options.data) {
                maxVal = Math.max(maxVal, this.options.data[categ]);
            }
            var canvasActualHeight = this.canvas.height - this.options.padding * 2;
            var canvasActualWidth = this.canvas.width - this.options.padding * 2;

            var gridVal = 0;
            while (gridVal <= maxVal) {
                var gridY = canvasActualHeight * (1 - gridVal / maxVal) + this.options.padding;
                drawLine(
                    this.ctx,
                    0,
                    gridY,
                    this.canvas.width,
                    gridY,
                    this.options.gridColor
                );

                this.ctx.save();
                this.ctx.fillStyle = this.options.gridColor;
                this.ctx.font = "bold 10px Arial";
                this.ctx.fillText(gridVal, 10, gridY - 2);
                this.ctx.restore();

                gridVal += this.options.gridScale;
            }

            //drawing the bars
            var barIndex = 0;
            var numberOfBars = Object.keys(this.options.data).length;
            var barSize = (canvasActualWidth) / numberOfBars;

            for (categ in this.options.data) {
                var val = this.options.data[categ];
                var barHeight = Math.round(canvasActualHeight * val / maxVal);
                drawBar(
                    this.ctx,
                    this.options.padding + barIndex * barSize,
                    this.canvas.height - barHeight - this.options.padding,
                    barSize,
                    barHeight,
                    this.colors[barIndex % this.colors.length]
                );

                barIndex += 1;
            }

            //draw legend
            barIndex = 0;
            var legend = document.querySelector("legend[for='myCanvas']");
            var ul = document.createElement("ul");
            legend.append(ul);
            for (categ in this.options.data) {
                var li = document.createElement("li");
                li.style.listStyle = "none";
                li.style.borderLeft = "20px solid " + this.colors[barIndex % this.colors.length];
                li.style.padding = "5px";
                li.textContent = categ;
                ul.append(li);
                barIndex++;
            }

            // add comments
            var curMonthTime = this.options.data["September"];
            $("#time-comment").append($("<p>").text("You have played this game for " + curMonthTime + " hours this month."));
        }
    }

    var myBarchart = new Barchart({
        canvas: myCanvas,
        padding: 10,
        gridScale: 5,
        gridColor: "#eeeeee",
        data: myData,
        colors: ["#a55ca5", "#67b6c7", "#bccd7a", "#eb9743"]
    });
    myBarchart.draw();
}

drawGraph();

// link account hover
var prev;
$(".account-item").hover(
    function() {
        prev = $(this).text();
        $(this).text("Link");
    },
    function() {
        $(this).text(prev);
    }
);
$(".account-item").on("click", function() {
    $(this).text("Unlink");
});

// activities
for (let i = 0; i < 6; i++) {
    $("#activities-item").append($("<p>", { class: "act-date" }).text("08/10/2021"));
    $("#activities-item").append($("<i>", { class: "fa fa-user-circle" }));
    $("#activities-item").append($("<p>", { class: "act-info" }).text("Cuihua shuo ni wan de hen bang!"));
    $("#activities-item").append($("<br>"));
}