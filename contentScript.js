var expertId;
var deptId;
var hospitalId;

var countDownProcess;
var remainingTime;

var countDownCellRef;
var dateInputRef;
var timeInputRef;

var killSwitch = true;

function getMetadata() {
	let url = window.location.href;
	let regexp = /expert\/(.*)\?hospDeptId=([\w\-]*)\&hospitalId=(\d*)/;
	matches = url.match(regexp);
	if (matches != null && matches.length >= 4) {
		expertId = matches[1];
		deptId = matches[2];
		hospitalId = matches[3];
		chrome.storage.sync.set({expertId: expertId, deptId: deptId, hospitalId: hospitalId});
	} else {
		alert(url + " is Invalid Url!");
	}
}

function getQueryUrl() {
  let url = "https://www.guahao.com/expert/new/shiftcase/?expertId=" + expertId + "&hospDeptId=" + deptId + "&hospId=" + hospitalId + "&_=" + (new Date).getTime();
	return url;
}

function getCurrentSchedule() {
	if (killSwitch) {
		return;
	}
	$.get("/expert/new/shiftcase",
		{expertId:expertId, hospDeptId:deptId, hospId:hospitalId, _:(new Date).getTime()},
		function (data, textStatus, jqXHR) {
			console.log(data);
			if (data.code == "0") {
				let schedule = data.data.shiftSchedule;
				console.log("We have ", schedule.length, " schedules:");
				for (i = 0; i < schedule.length; i++) {
					date = schedule[i].date;
					url = schedule[i].url;
					apm = schedule[i].apm; // 1 am 2 pm
					console.log(date, " ", url, " ", apm == 1 ? "AM" : "PM");
				}
			}
		});
}


function startButtonFunc(element) {
	let timeText = dateInputRef.value + " " + timeInputRef.value;
	let timeDiff = Date.parse(timeText) - (new Date).getTime();
	if (timeDiff > 0) {
		remainingTime = timeDiff;
		countDownProcess = setInterval(function() {
			if (remainingTime >= 50) {
				remainingTime = remainingTime - 50;
				countDownCellRef.innerHTML = remainingTime.toString() + " ms"
			} else {
				countDownCellRef.innerHTML = "已到时间";
				clearInterval(countDownProcess);
			}
		}, 50);
		// Use 50 ms as step size
	} else {
		countDownCellRef.innerHTML = "无效时间 " + timeDiff.toString();
	}
}

function stopButtonFunc(element) {
	clearInterval(countDownProcess);
	countDownCellRef.innerHTML = "已停止";
}

function display() {
	var div = document.getElementById("g-breadcrumb");
	div.innerHTML = "";
	var table = document.createElement('table');
	// LINE 1
	var row = document.createElement('tr');
	// LINE 1-1
	var linkNameCell = document.createElement('td');
	linkNameCell.innerHTML = "测试链接:";
	row.appendChild(linkNameCell);
	// LINE 1-2
	var linkCell = document.createElement('td');
	var a = document.createElement('a');
	var link = document.createTextNode("测试链接");
	a.appendChild(link);
	a.title = "Test Link";
	a.href = getQueryUrl();
	linkCell.appendChild(a);
	row.appendChild(linkCell);

	// LINE 2
	var row2 = document.createElement('tr');
	// LINE 2-1
	var dateNameCell = document.createElement('td');
	dateNameCell.innerHTML = "日期选择:";
	row2.appendChild(dateNameCell);
	// LINE 2-2
	var dateCell = document.createElement('td');
	var dateInput = document.createElement('input');
	dateInput.type = "date";
	dateInput.id = "redbull-date";
	dateInputRef = dateInput;
	dateCell.appendChild(dateInput);
	row2.appendChild(dateCell);

	// LINE 3
	var row3 = document.createElement('tr');
	// LINE 3-1
	var timeNameCell = document.createElement('td');
	timeNameCell.innerHTML = "触发时间:";
	row3.appendChild(timeNameCell);
	// LINE 3-2
	var timeCell = document.createElement('td');
	var timeInput = document.createElement('input');
	timeInput.type = "time";
	timeInput.id = "redbull-time";
	timeInputRef = timeInput;
	timeCell.appendChild(timeInput);
	row3.appendChild(timeCell);

	// LINE 4
	var row4 = document.createElement('tr');
	// LINE 4-1
	var startButtonCell = document.createElement('td');
	var startButton = document.createElement('button');
	startButton.innerHTML = "开始监测";
	startButton.id = "redbull-start-button";
	startButton.onclick = startButtonFunc;
	startButtonCell.appendChild(startButton);
	row4.appendChild(startButtonCell);
	// LINE 4-2
	var stopButtonCell = document.createElement('td');
	var stopButton = document.createElement('button');
	stopButton.innerHTML = "结束监测";
	stopButton.id = "redbull-stop-button";
	stopButton.onclick = stopButtonFunc;
	stopButtonCell.appendChild(stopButton);
	row4.appendChild(stopButtonCell);

	// LINE 5
	var row5 = document.createElement('tr');
	// LINE 5-1
	var countDownNameCell = document.createElement('td');
	countDownNameCell.innerHTML = "倒计时：";
	row5.append(countDownNameCell);
	// LINE 5-2
	var countDownCell = document.createElement('td');
	countDownCell.id = "redbull-countdown";
	countDownCell.innerHTML = "未开始";
	countDownCellRef = countDownCell;
	row5.append(countDownCell);

	table.appendChild(row);
	table.appendChild(row2);
	table.appendChild(row3);
	table.appendChild(row5);
	table.appendChild(row4);
	div.appendChild(table);
}

getMetadata();
display();
getCurrentSchedule();
