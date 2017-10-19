# js-keyboard
原生js实现的带输入框、光标、输入前数字验证（如只能输入一个小数点，小数位不超过两位）的H5假键盘

之所以要写一个假键盘是因为项目涉及金额输入的数字验证，具体功能如下：
1. 进入相关页面，输入框自动获取焦点
2. 键盘自动弹出
3. 弹出数字键盘
4. 数字输入前自动验证，只能输入一个小数点，小数位数不超过2位，超过就不能继续输入
5. 如果光标在第一位，此时键入的是'.',则自动放入'0'再插入'.'

这几个功能当然不是强制要求的，但是参考了微信提现页面的金额输入框之后，强迫症的我觉得既然人家能做到那么我们的产品也应该做到这样。

## 基于原生input 的解决方案思考？

* 功能1： input 设置属性 autofocus , 输入框就能自动聚焦。 **轻松搞定**
* 功能2： input 自动聚焦，发现键盘并不会自动弹出; 必须手动点击输入框键盘才会弹出; 于是在进入页面的时候用js触发click或者foucus，发现键盘也不会自动弹出，延时click、focus也没能弹出;那么只有最后一种方案——就是让NA端提供暴露弹出键盘的方法。 **纯前端无法搞定，需要NA端协助/或者找PM砍掉自动弹键盘的需求>.<**
* 功能3： 弹数字键盘的方法设置 type = "number" 或者type = "tel"; 前者在Andriod可以弹出数字键盘在ios端只能弹全键盘，后者在Android和ios弹出的都是数字键盘，但是！！坑爹的，弹出的数字键盘没有小数点！（我的华为荣耀9倒是很中肯的给我弹了个带小数点的数字键盘，不容易啊） **只能选择type = "number",勉强能接受ios弹全键盘**
* 功能4： 基于功能3 设置type = "number"，发小可以不停的输入小数点啊啊啊啊看着真的要疯了，第一次输入小数点也不能自动变成'0.';那么需要使用事件监听键入的字符是什么，并且在输入之前进行判断，然后再决定是否放入输入框。搜罗出一堆相关事件onkeydown/onkeyup/onchange/oninput/onpropertychange/textInput。</br>onkeyup是值输入之后才触发这里排除;</br>onchange是在内容改变（两次内容有可能相等）且失去焦点时触发,排除。</br>onpropertychange只有IE支持也排除。</br>最后只剩下onkeyup/oninput/textInput,测试发现onkeyup的event.key在手机端不支持，还有一个属性event.keyCode其在PC端的值是键入字符的ascii码。但在手机端输入任何数字或者小数点其值均为229（华为荣耀9测试），所以onkeyup也不能用。</br>oninput移动端不支持。</br>只有textInput在pc和移动端都支持其event.data可以获取到输入的值。但是其无法获取到input输入框所有已有字符，使用input的value只能获取数字，不能获取小数点，无法判断是否已经输入小数点。各种收资料发现input type = number的情况下确实只能获取到数值，也就是说如果输入'12.',通过value获取到是'12',获取不到小数点，因而无法判断是否输入小数点。</br>考虑通过自己存储通过textInput获取到的输入值，但是textInput在删除时不会触发，因而不能实时获取input输入框里面的所有准确字符；而且由于无法获取光标在input输入框的具体位置而无法确定删除的是哪个字符。 **这个无解**
* 功能5： 功能4解决了，功能5是小case。。。

## 基于原生input，以上功能基本很难实现，发现微信的就是假键盘，于是下定决心写了个假键盘
若是用假键盘加原生input输入框，由于光标位置不好获取，目前只有IE和火狐支持的document.selection，selectionStart可以获取
```
// 获取光标位置
function getCursortPosition (textDom) {
 var cursorPos = 0;
 if (document.selection) {
  // IE Support
  textDom.focus ();
  var selectRange = document.selection.createRange();
  selectRange.moveStart ('character', -textDom.value.length);
  cursorPos = selectRange.text.length;
 }else if (textDom.selectionStart || textDom.selectionStart == '0') {
  // Firefox support
  cursorPos = textDom.selectionStart;
 }
 return cursorPos;
}
```
于是实现假输入框、假光标、假keyboard的一套装备，这样就一切全在自己的掌控之中，上面的那些问题全部可以解决。
除了完成以上功能，为了跟接近真实输入框表现，同时实现了点击输入框获取焦点、光标闪动、弹出键盘；失去焦点光标消失，隐藏键盘。<br>

注：手上H5项目没有使用jquery,因此使用原生js实现，目前以及改造成VUE组件，在项目中使用，VUE组件后续会整理一下再发出来。
