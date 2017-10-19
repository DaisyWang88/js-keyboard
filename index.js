
var inputArea = document.getElementsByClassName('input-area')[0];

// var rightSpace = document.getElementById('right-space');
// rightSpace.addEventListener('click', moveCursor);

// let deleteEle = document.getElementById('cross');//绑定删除事件
// deleteEle.addEventListener('click', deleteElement);

var isShowCursor = true;
var cursor = document.getElementsByClassName('cursor')[0]; //获取光标

var inputContainer = document.getElementsByClassName('input-container')[0]; //获取输入框


intervalId = setInterval(function() {

	isShowCursor = !isShowCursor;
	if (isShowCursor) {
		cursor.className = 'cursor'
	} else {
		cursor.className = 'cursor hidden';
	}
}, 1000);


//获取焦点,光标闪烁
// inputContainer.addEventListener('focus' , function () {
// 	setCursorFlash();
// })

inputContainer.focus();


var pElements = document.getElementsByClassName('num-item');
var elements = Array.prototype.slice.call(pElements);
var value = '';
elements.forEach(function(val, index, arr) {
	val.addEventListener('click', function(event) {


		setCursorFlash();
		value = event.currentTarget.innerText;//获取输入的值

		var inputStr = getInputStr(); //获取输入框元素
		var isBefore = isBeforeCursor();//Boolean值

		if ((isBefore == 0 || inputStr.search(/\.\d{2}/) == -1) && (value !== '.' || inputStr.search(/\./) == -1)) {
			// var span = document.createElement("span"); //创建包含值的元素
			// span.className = 'val';
			// span.innerText = value;

			// var space = document.createElement("span");
			// space.className = 'space';
			// space.addEventListener('click', moveCursor);

			// var cursor = document.getElementsByClassName('cursor')[0];

			// inputArea.insertBefore(space, cursor);//插入空列
			// inputArea.insertBefore(span, cursor);//插入值
			var cursor = document.getElementsByClassName('cursor')[0];

      if (value == '.' && (!cursor.previousSibling || cursor.previousSibling.nodeName == '#text')) {
        insert(0);
      }
			insert(value);
		}

	});
});
//移动光标位置
function moveCursor(event) {
	var cursor = document.getElementsByClassName('cursor')[0];

	if(event.currentTarget.className == 'right-space'){
		if(!cursor.nextSibling || cursor.nextSibling.nodeName == '#text'){
			return;
		} else {
			var ele = cursor.nextSibling;
			inputArea.insertBefore(inputArea.lastElementChild, ele);
			inputArea.appendChild(cursor);
		}

	}else {
		var tempEle = event.currentTarget.nextSibling;
		// var nodeName = event.currentTarget.nextSibling.nodeName;
		// var cursor = document.getElementsByClassName('cursor')[0];

		if(!tempEle || tempEle.nodeName == '#text') {
			var temp = event.currentTarget.previousSibling;
			var ele = inputArea.replaceChild( event.currentTarget, cursor);//把光标替换成当前元素
			inputArea.appendChild(ele);

		} else {
			var temp = event.currentTarget.nextSibling;
			var ele = inputArea.replaceChild( event.currentTarget, cursor);//把光标替换成当前元素
			inputArea.insertBefore(ele, temp);
		}
	}

}


//插入元素
function insert(value) {
	var span = document.createElement("span"); //创建包含值的元素
	span.className = 'val';
	span.innerText = value;

	var space = document.createElement("span");
	space.className = 'space';
	space.addEventListener('click', moveCursor);

	var cursor = document.getElementsByClassName('cursor')[0];

	inputArea.insertBefore(space, cursor);//插入空列
	inputArea.insertBefore(span, cursor);//插入值
}
//删除元素
function deleteElement() {
	setCursorFlash();
	var cursor = document.getElementsByClassName('cursor')[0];
	// inputArea.removeChild(cursor.previousSibling );
	// inputArea.removeChild(cursor.previousSibling );
	var n = 2; //两个删除动作
 	while(cursor.previousSibling && n > 0) {
    inputArea.removeChild(cursor.previousSibling );
    n--;
 	}
	if(getInputStr().search(/^\.\d*/) > -1) {
		insert(0);
	}
}
//获取输入框的元素
function getInputStr() {
	var valueEle = document.getElementsByClassName('val');
	var elements = Array.prototype.slice.call(valueEle);
	if (elements.length > 0) {
		var inputStr = '';
		elements.forEach(function (item, index) {
			inputStr += item.innerText;
		});
		return inputStr;
	} else {
		return '';
	}
}

//获取光标在小数点之前还是之后
//1 表示 小数点在光标之前
// 0 表示 小数点在光标之后或者没有小数点
function isBeforeCursor() {

	var cursor = document.getElementsByClassName('cursor')[0];
	var curTarget1 = cursor;

	while(curTarget1.previousSibling) {
		var ele = curTarget1.previousSibling;
		if (ele.innerText === '.') {
			return 1;
		}
		curTarget1 = ele;
	}
	var curTarget2 = cursor;
	while(curTarget2.nextSibling) {
		var ele = curTarget2.nextSibling;
		if (ele.innerText === '.') {
			return 0;
		}
		curTarget2 = ele;
	}

	return 0;
}

//设置光标定时任务
function setCursorFlash() {
	var cursor = document.getElementsByClassName('cursor')[0];
	var inputContainer = document.getElementsByClassName('input-container')[0];
	cursor.className = "cursor";
	var isShowCursor = true;
	inputContainer.focus();
	showKeyBoard();
	if (intervalId) {
		clearInterval(intervalId);
	}
	intervalId = setInterval(function() {
		isShowCursor = !isShowCursor;
		if (isShowCursor) {
			cursor.className = 'cursor';
		} else {
			cursor.className = 'cursor hidden';
		}
	}, 1000);
}


//输入框失去焦点时光标隐藏
function clearCursorFlash(event) {
	stopBubble(event);
	hideKeyBoard();
	var cursor = document.getElementsByClassName('cursor')[0]; //获取光标
	clearInterval(intervalId);
	cursor.className = 'cursor hidden';
}
function stopBubble(e) {
  if (e && e.stopPropagation) {
  	e.stopPropagation();
  } else {
  	window.event.cancelBubble = true;
  }
}
//隐藏keyboard
function hideKeyBoard() {
	var keyBoard = document.getElementsByClassName('key-container')[0];
	keyBoard.className = 'key-container hidden';
}
//弹出keyboard
function showKeyBoard() {
	var keyBoard = document.getElementsByClassName('key-container')[0];
	keyBoard.className = 'key-container';
}