let url = window.location.href;
alert("The URL of this page is: " + url);
let regexp = /expert\/(\d*)\?hospDeptId=([\w\-]*)\&hospitalId=(\d*)/;
matches = url.match(regexp);
if (matches.length >= 4) {
	let expertId = matches[1];
	let deptId = matches[2];
	let hospitalId = matches[3];
	chrome.storage.sync.set({expertId: expertId, deptId: deptId, hospitalId: hospitalId});
	alert("expertId: " + expertId + ",deptId: " + deptId + ",hospitalId: " + hospitalId);
} else {
	alert("Invalid Url!");
}
