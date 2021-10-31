// draw pie chart
function drawPie() {
    var plotCost = document.getElementById("gaming-budget-plot");
    var gamingCost = {
        "Animal Crossing": 40,
        "Destiny 2": 15,
        "NBA 2K21": 36,
        "Hades": 30
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
            var curSpent = this.options.data["Destiny 2"];
            var percentage = Math.round(curSpent / total_value * 100);
            $("#cost-comment").append($("<p>").text("You have spent $" + curSpent + " on this game, " + percentage + "% of your total expense."));
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
    var myCanvas = document.getElementById("gaming-time-plot");

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


$(document).ready(function() {
    // get retail price
    $.ajax({
        type: 'GET',
        url: 'steam_price',
        success: async function(data) {
            var game_plat = JSON.parse(document.getElementById('game_plat').textContent);
            var game_image = JSON.parse(document.getElementById('game_image').textContent);
            if (game_plat === 'Steam') {
                const app_list = data['applist']['apps'];
                var game_name = JSON.parse(document.getElementById('game_detail').textContent);
                var price = 0;
                var steam_id= 0;
                var image;
                for (let i in app_list) {
                    if (app_list[i]['name'] === game_name) {
                        steam_id = app_list[i]['appid'];
                        break;
                    }
                };
                await $.getJSON('https://store.steampowered.com/api/appdetails?appids='+steam_id+'&cc=us&l=en', function(info) {
                    price = info[steam_id]['data']['price_overview']['final_formatted'];
                    image = info[steam_id]['data']['header_image'];
                });
                let game_url = 'https://store.steampowered.com/app/'+steam_id;
                $('#game_retail_list').append(
                    $('<tr>').append(
                        $('<td>', {class: 'store-name'}).append(
                            $('<a>', {href: game_url, target: '_blank'}).append('Steam')
                        ),
                        $('<td>', {class: 'price'}).append(price),
                    )
                );
                $('#game-img').attr('src', image);
            } else {
                console.log('success')
                $('#game-img').attr('src', game_image);
            }
        },
        error: function(e) {
            console.log(e.message);
        }
    });
})