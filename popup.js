// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
var expertId;
var deptId;
var hospitalId;

function getDataRow(name, data){
  var row = document.createElement('tr');

  var nameCell = document.createElement('td');
  nameCell.innerHTML = name;
  row.appendChild(nameCell);

  var dataCell = document.createElement('td');
  dataCell.innerHTML = data;
  row.appendChild(dataCell);
  return row;
}

function addMetadata(tbody) {
  var newTbody = document.createElement('tbody');
  chrome.storage.sync.get('expertId', function(data) {
    newTbody.appendChild(getDataRow('expertId', data.expertId));
    expertId = data.expertId;
  });
  chrome.storage.sync.get('deptId', function(data) {
    newTbody.appendChild(getDataRow('deptId', data.deptId));
    deptId = data.deptId;
  });
  chrome.storage.sync.get('hospitalId', function(data) {
    newTbody.appendChild(getDataRow('hospitalId', data.hospitalId));
    hospitalId = data.hospitalId;
  });
  tbody.parentNode.replaceChild(newTbody, tbody);
}

function getUrl() {
  let url = "https://www.guahao.com/expert/new/shiftcase/?expertId=" + expertId + "&hospDeptId=" + deptId + "&hospId=" + hospitalId + "&_=" + (new Date).getTime();
  alert(url);
}

function main() {
  let changeColor = document.getElementById('changeColor');
  let urlButton = document.getElementById('getUrl');
  let debugTable = document.getElementById('debugTable');
  chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
  });

  changeColor.onclick = function(element) {
    addMetadata(debugTable);
  };

  urlButton.onclick = function(element) {
    getUrl();
  }
}

main();
