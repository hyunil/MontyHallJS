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
  $("<div class='Centered ChartCanvasLabel'>Wins by not switching</div>").appendTo(labelContainer);
  var canvasContainer = $("<div class='Centered'></div>").appendTo($("body"));
  var canvasA = $("<canvas width='300px' height=200px' class='ChartCanvas Centered'></canvas>").appendTo(canvasContainer);
  var canvasB = $("<canvas width='300px' height=200px' class='ChartCanvas Centered'></canvas>").appendTo(canvasContainer);
  $("<div id='DoorContainer' class='Centered Grid'></div").appendTo($("body"));
  $("<div class='Centered ButtonContainer' id='ButtonContainer1'></div>").appendTo($("body"));
  $("<div class='Centered ButtonContainer' id='ButtonContainer2'></div>").appendTo($("body"));
  $("<div class='Centered ButtonContainer' id='ButtonContainer3'></div>").appendTo($("body"));

  chartContextSwitch = canvasA.get(0).getContext("2d");
  chartContextNoSwitch = canvasB.get(0).getContext("2d");

  ShowMainMenu();
  Update();
}

function ShowMainMenu()
{
  var gameButton = $("<div class='Button MajorColor Offscreen'>Interactive</div>");
  var autoButton = $("<div class='Button MinorColor Offscreen'>Automatic</div>");
  var inputDoors = $("<div class='Offscreen'><span>Doors</span><input></input></div>");

  gameButton.appendTo($("#ButtonContainer1"));
  autoButton.appendTo($("#ButtonContainer2"));
  inputDoors.appendTo($("#ButtonContainer3"));

  AnimateFromTo(gameButton, [-500, 0], [$("#ButtonContainer1").width() / 2, 0], 1000);
  AnimateFromTo(autoButton, [1500, 0], [$("#ButtonContainer2").width() / 2, 0], 1000, 100);
  AnimateFromTo(inputDoors, [-500, 0], [$("#ButtonContainer3").width() / 2, 0], 1000, 100);

  inputDoors.children($("input")).val(numDoors);
  inputDoors.children($("input")).bind("change", function()
  {
    numDoors = parseInt($(this).val());
    if (numDoors < 3)
      numDoors = 3;
  });

  gameButton.bind("click", function()
  {
    gameButton.remove();
    autoButton.remove();
    inputDoors.remove();
    ShowInteractiveMenu();
  });

  autoButton.bind("click", function()
  {
    gameButton.remove();
    autoButton.remove();
    inputDoors.remove();
    ShowAutomaticMenu();
  });
}

function ShowInteractiveMenu()
{
  var doorContainer = $("#DoorContainer");
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
}

function SelectDoor(door)
{
  if (selectedDoor < 0)
  {
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

    result = $("<div class='Header MajorColorForeground Offscreen'>Change answer?</div>");
    result.appendTo($("body"));
    AnimateFromTo(result, [windowSize[0] / 2, -100], [windowSize[0] / 2, 400], 1000);
    setTimeout(function()
    {
      result.fadeOut({complete: function() {$(this).remove()}});
    }, 1500);
  }
  else
  {
    if (door != selectedDoor)
      ++numTimesSwitched;
    else
      ++numTimesNoSwitch;

    $($(".Door")[selectedDoor]).removeClass("SelectedDoor");

    var result;
    if (door == correctDoor)
    {
      if (door != selectedDoor)
        ++numTimesSwitchedAndWon;
      else
        ++numTimesNoSwitchAndWon;

      result = $("<div class='Header Green Offscreen'>Correct</div>");
      result.appendTo($("body"));
      AnimateFromTo(result, [windowSize[0] / 2, -100], [windowSize[0] / 2, 200], 1000);
    }
    else
    {
      result = $("<div class='Header Red Offscreen'>Incorrect</div>");
      result.appendTo($("body"));
      AnimateFromTo(result, [windowSize[0] / 2, -100], [windowSize[0] / 2, 200], 1000);
    }

    setTimeout(function()
    {
      $("#DoorContainer").empty();
      UpdateCharts();
      ShowRestartMenu();
      result.remove();
    }, 1500);
  }
}

function ShowRestartMenu()
{
  var restartButton = $("<div class='Button MajorColor Offscreen'>Again</div>");
  var backButton = $("<div class='Button MinorColor Offscreen'>Back</div>");

  restartButton.appendTo($("#ButtonContainer1"));
  backButton.appendTo($("#ButtonContainer2"));

  AnimateFromTo(restartButton, [-500, 0], [$("#ButtonContainer1").width() / 2, 0], 1000);
  AnimateFromTo(backButton, [1500, 0], [$("#ButtonContainer2").width() / 2, 0], 1000, 100);

  restartButton.bind("click", function()
  {
    restartButton.remove();
    backButton.remove();
    ShowInteractiveMenu();
  });

  backButton.bind("click", function()
  {
    restartButton.remove();
    backButton.remove();
    ShowMainMenu();
  });
}

function ShowAutomaticMenu()
{
  for (var i = 0; i < 1000; ++i)
  {
    var correct = Math.floor(Math.random() * numDoors);
    var choice = Math.floor(Math.random() * numDoors);
    var otherDoor = Math.floor(Math.random() * numDoors);
    var switched = false;
    while (otherDoor == choice || otherDoor == correct)
    {
      ++otherDoor;
      if (otherDoor >= numDoors)
        otherDoor = 0;
    }
    if (choice != correct)
      otherDoor = correct;

    var finalChoice = Math.round(Math.random());
    if (finalChoice == 0)
    {
      choice = otherDoor;
      switched = true;
      ++numTimesSwitched;
    }
    else
      ++numTimesNoSwitch;

    if (choice == correct)
    {
      if (switched)
        ++numTimesSwitchedAndWon;
      else
        ++numTimesNoSwitchAndWon;
    }
  }

  result = $("<div class='Header MajorColorForeground Offscreen'>Running 1000 times</div>");
  result.appendTo($("body"));
  AnimateFromTo(result, [windowSize[0] / 2, -100], [windowSize[0] / 2, 285], 1000);

  setTimeout(function()
  {
    UpdateCharts();
    ShowMainMenu();
    AnimateFromTo(result, [windowSize[0] / 2, 285], [windowSize[0] / 2, -100], 1000);
    setTimeout(function()
    {
      result.remove();
    }, 1000);
  }, 2000);
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
      element.css("left", this.x - element.outerWidth() / 2 + "px");
      element.css("top", this.y - element.outerHeight() / 2 + "px");
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
