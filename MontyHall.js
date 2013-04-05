var windowSize = [$(window).width(), $(window).height()];
var buttonSpacing = 150;
var selectedDoor = -1;
var correctDoor = 0;
var numDoors = 3;
var numTimesSwitched = 0;
var numTimesSwitchedAndWon = 0;
var numTimesNoSwitch = 0;
var numTimesNoSwitchAndWon = 0;
var chartSwitch = null;
var chartNoSwitch = null;
var chartContextSwitch = null;
var chartContextNoSwitch = null;

function main()
{
  var labelContainer = $("<div class='Centered'></div>").appendTo($("body"));
  $("<div class='Centered ChartCanvasLabel'>Wins by switching</div>").appendTo(labelContainer);
  $("<div class='Centered ChartCanvasLabel'>Wins by without switching</div>").appendTo(labelContainer);
  var canvasContainer = $("<div class='Centered'></div>").appendTo($("body"));
  var canvasA = $("<canvas width='300px' height=200px' class='ChartCanvas Centered'></canvas>").appendTo(canvasContainer);
  var canvasB = $("<canvas width='300px' height=200px' class='ChartCanvas Centered'></canvas>").appendTo(canvasContainer);

  chartContextSwitch = canvasA.get(0).getContext("2d");
  chartContextNoSwitch = canvasB.get(0).getContext("2d");

  ShowMainMenu();
  Update();
}

function ShowMainMenu()
{
  var gameButton = $("<div class='Button MajorColor Offscreen'>Interactive</div>");
  var autoButton = $("<div class='Button MinorColor Offscreen'>Automatic</div>");

  gameButton.appendTo($("body"));
  autoButton.appendTo($("body"));

  AnimateFromTo(gameButton, [windowSize[0] / 2 - buttonSpacing, -100], [windowSize[0] / 2 - buttonSpacing, windowSize[1] / 2], 1000);
  AnimateFromTo(autoButton, [windowSize[0] / 2 + buttonSpacing, -100], [windowSize[0] / 2 + buttonSpacing, windowSize[1] / 2], 1000, 100);

  gameButton.bind("click", function()
  {
    AnimateFromTo(gameButton, [windowSize[0] / 2 - buttonSpacing, windowSize[1] / 2], [windowSize[0] / 2 - buttonSpacing, -100], 1000);
    AnimateFromTo(autoButton, [windowSize[0] / 2 + buttonSpacing, windowSize[1] / 2], [windowSize[0] / 2 + buttonSpacing, -100], 1000, 100);
    setTimeout(function()
    {
      gameButton.remove();
      autoButton.remove();
    }, 2000);
    ShowInteractiveMenu();
  });

  autoButton.bind("click", function()
  {
    AnimateFromTo(gameButton, [windowSize[0] / 2 - buttonSpacing, windowSize[1] / 2], [windowSize[0] / 2 - buttonSpacing, -100], 1000);
    AnimateFromTo(autoButton, [windowSize[0] / 2 + buttonSpacing, windowSize[1] / 2], [windowSize[0] / 2 + buttonSpacing, -100], 1000, 100);
    setTimeout(function()
    {
      gameButton.remove();
      autoButton.remove();
    }, 2000);
    ShowAutomaticMenu();
  });
}

function ShowInteractiveMenu()
{
  var gameContainer = $("<div id='GameContainer'></div>");
  gameContainer.appendTo($("body"));
  var doorContainer = $("<div id='DoorContainer' class='Centered Grid'></div");
  doorContainer.appendTo(gameContainer);

  var doors = [];
  for (var i = 0; i < numDoors; ++i)
  {
    doors.push($("<div class='Door'></div>"));
    doors[i].css("opacity", 0);
    doors[i].appendTo(doorContainer);
    doors[i].data("doorID", i);
    var x = i * 130;
    AnimateCSS(doors[i], "opacity", "", 0, 1, 750, i * 40);

    doors[i].bind("click", function()
    {
      SelectDoor($(this).data("doorID"));
      $(this).addClass("SelectedDoor");
      selectedDoor = $(this).data("doorID");
    });
  }

  selectedDoor = -1;
  correctDoor = Math.floor(Math.random() * doors.length);
  // $("<div class='Header Centered'>Which door is correct?</div>").appendTo($("#GameContainer"));
}

function SelectDoor(door)
{
  if (selectedDoor < 0)
  {
    // $("<div class='Header Centered'>I will now reveal " + (numDoors - 2) + " of the incorrect doors</div>").appendTo($("#GameContainer"));
    // $("<div class='Header Centered'>You may keep or adjust your answer now</div>").appendTo($("#GameContainer"));

    var otherDoor = Math.floor(Math.random() * numDoors);
    while (otherDoor == door || otherDoor == correctDoor)
    {
      ++otherDoor;
      if (otherDoor >= numDoors)
        otherDoor = 0;
    }

    if (door != correctDoor)
      otherDoor = correctDoor;

    $(".Door").each(function()
    {
      var id = $(this).data("doorID");
      if (id != door && id != otherDoor && id != correctDoor)
      {
        $(this).addClass("IncorrectDoor");
      }
    });
  }
  else
  {
    if (door != selectedDoor)
      ++numTimesSwitched;
    else
      ++numTimesNoSwitch;

    $($(".Door")[selectedDoor]).removeClass("SelectedDoor");

    if (door == correctDoor)
    {
      if (door != selectedDoor)
        ++numTimesSwitchedAndWon;
      else
        ++numTimesNoSwitchAndWon;
      // $("<div class='Header Centered'>You chose correctly!</div>").appendTo($("#GameContainer"));
    }
    else
    {
      // $("<div class='Header Centered'>You chose the wrong door</div>").appendTo($("#GameContainer"));
    }

    $("#DoorContainer").empty();
    UpdateCharts();
    ShowRestartMenu();
  }
}

function ShowRestartMenu()
{
  var restartButton = $("<div class='Button MajorColor Offscreen'>Again</div>");
  var backButton = $("<div class='Button MinorColor Offscreen'>Back</div>");

  restartButton.appendTo($("body"));
  backButton.appendTo($("body"));

  AnimateFromTo(restartButton, [windowSize[0] / 2 - buttonSpacing, -100], [windowSize[0] / 2 - buttonSpacing, windowSize[1] / 2], 1000);
  AnimateFromTo(backButton, [windowSize[0] / 2 + buttonSpacing, -100], [windowSize[0] / 2 + buttonSpacing, windowSize[1] / 2], 1000, 100);

  restartButton.bind("click", function()
  {
    $("#GameContainer").remove();
    AnimateFromTo(restartButton, [windowSize[0] / 2 - buttonSpacing, windowSize[1] / 2], [windowSize[0] / 2 - buttonSpacing, windowSize[1] + 100], 1000);
    AnimateFromTo(backButton, [windowSize[0] / 2 + buttonSpacing, windowSize[1] / 2], [windowSize[0] / 2 + buttonSpacing, windowSize[1] + 100], 1000, 100);
    setTimeout(function()
    {
      restartButton.remove();
      backButton.remove();
    }, 2000);
    ShowInteractiveMenu();
  });

  backButton.bind("click", function()
  {
    $("#GameContainer").remove();
    AnimateFromTo(restartButton, [windowSize[0] / 2 - buttonSpacing, windowSize[1] / 2], [windowSize[0] / 2 - buttonSpacing, windowSize[1] + 100], 1000);
    AnimateFromTo(backButton, [windowSize[0] / 2 + buttonSpacing, windowSize[1] / 2], [windowSize[0] / 2 + buttonSpacing, windowSize[1] + 100], 1000, 100);
    setTimeout(function()
    {
      restartButton.remove();
      backButton.remove();
    }, 2000);
    ShowMainMenu();
  });
}

function ShowAutomaticMenu()
{
}

function UpdateCharts()
{
  if (!chartSwitch)
    chartSwitch = new Chart(chartContextSwitch);
  if (!chartNoSwitch)
    chartNoSwitch = new Chart(chartContextNoSwitch);

  var wrong = numTimesSwitched - numTimesSwitchedAndWon;
  chartSwitch.Pie(
    [
      {value: wrong, color: "#a77"},
      {value: numTimesSwitchedAndWon, color: "#7a7"}
    ],
    chartSwitch.Pie.defaults);

  wrong = numTimesNoSwitch - numTimesNoSwitchAndWon;
  chartNoSwitch.Pie(
    [
      {value: wrong, color: "#a77"},
      {value: numTimesNoSwitchAndWon, color: "#7a7"}
    ],
    chartNoSwitch.Pie.defaults);
}

function AnimateFromTo(element, posA, posB, time, delay)
{
  return new TWEEN.Tween({x: posA[0], y: posA[1]})
    .to({x: posB[0], y: posB[1]}, time)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function()
    {
      element.css("left", this.x + "px");
      element.css("top", this.y + "px");
    })
    .delay(delay ? delay : 0)
    .start();
}

function AnimateCSS(element, css, cssEnd, begin, end, time, delay)
{
  return new TWEEN.Tween({value: begin})
    .to({value: end}, time)
    .easing(TWEEN.Easing.Elastic.InOut)
    .onUpdate(function()
    {
      element.css(css, this.value + cssEnd);
    })
    .delay(delay ? delay : 0)
    .start();
}

function Update()
{
  requestAnimFrame(Update);

  TWEEN.update();
}

function TestAPIs()
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
}