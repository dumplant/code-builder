export function getJson(jsonStr) {
  var stringStack = new stack();
  var indexList = [];
  var jsonList = [];
  for (var i = 0; i < jsonStr.length; i++) {
    if (jsonStr.charAt(i) == '{' || jsonStr.charAt(i) == '[') {
      stringStack.push(new JsonStack(i, jsonStr.charAt(i)));
    } else if (jsonStr.charAt(i) == '}' || jsonStr.charAt(i) == ']') {
      if (stringStack.dataStore.length != 0) {
        var js = stringStack.peek();
        if (jsonStr.charAt(i) == '}' && js.char == '{') {
          js = stringStack.pop();
        } else if (jsonStr.charAt(i) == ']' && js.char == '[') {
          js = stringStack.pop();
        }
        indexList.push(js.index);
        indexList.push(i);
      }
    }
    if (stringStack.dataStore.length == 0 && indexList.length > 0) {
      var tempStr = getJsonStr(indexList, jsonStr);
      if (!(tempStr == null || tempStr.length == 0)) {
        jsonList.push(tempStr);
      }
      indexList.splice(0, indexList.length);
    }
  }
  if (indexList != null && indexList.length > 0) {
    var tempStr1 = getJsonStr(indexList, jsonStr);
    if (!(tempStr1 == null || tempStr1.length == 0)) {
      jsonList.push(tempStr1);
    }
  }
  if (jsonList != null && jsonList.length > 0) {
    return jsonList[0];
  } else {
    return null;
  }
}
function getJsonStr(indexList, str) {
  var temp = '';
  for (var i = indexList.length - 1; i >= 0; i = i - 2) {
    try {
      temp = str.substring(indexList[i - 1], indexList[i] + 1);
      JSON.parse(temp);
      return temp;
    } catch (e) {
      continue;
    }
  }
  return null;
}
function JsonStack(index, char) {
  this.index = index;
  this.char = char;
}
function stack() {
  this.dataStore = []; //保存栈内元素，初始化为一个空数组
  this.top = 0; //栈顶位置，初始化为0
  this.push = push; //入栈
  this.pop = pop; //出栈
  this.peek = peek; //查看栈顶元素
  this.clear = clear; //清空栈
  this.length = length; //栈内存放元素的个数
}
function push(element) {
  this.dataStore[this.top++] = element;
}
function pop() {
  return this.dataStore[--this.top];
}
function peek() {
  return this.dataStore[this.top - 1];
}
function clear() {
  this.top = 0;
}
function length() {
  return this.top;
}
