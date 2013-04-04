function main()
{
  var test = $("<div>Easing.js test</div>");
  test.appendTo($("body"));
  test.css("position", "absolute");

  var tween = new TWEEN.Tween({x: 50, y: 0})
    .to({x: 400}, 2000)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function()
    {
      test.css("left", this.x + "px");
    })
    .start();


  var chartCanvas = $("<canvas width='400' height='400'></canvas>");
  var chartContext = chartCanvas.get(0).getContext("2d");
  chartCanvas.appendTo($("body"));

  var chart = new Chart(chartContext);
  chart.Pie([{value: 30, color: "#ffa"}, {value: 40, color: "#533"}, {value: 100, color: "#868"}], chart.Pie.defaults);

  Update();
}

function Update()
{
  requestAnimFrame(Update);

  TWEEN.update();
}