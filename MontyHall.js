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
  chartCanvas.appendTo($("body");

  Update();
}

function Update()
{
  requestAnimFrame(Update);

  TWEEN.update();
}