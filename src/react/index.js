import $ from "jquery";
import createReactUnit from "./unit.js";
import createElement from "./element.js"
import Component from "./component"

const React = {
  render,
  nextRootIndex: 0,
  createElement,
  Component
}

// 给每个元素添加一个属性，为了方便获取这个元素
function render(element, container) {
  // 写一个工厂函数 来创建对应的 React 元素（如文本节点，标签节点）
  // 通过这个工厂函数来创建
  const createReactUnitInstance = createReactUnit(element);
  // 返回当前元素对应的 html 脚本(标签)
  const markUp = createReactUnitInstance.getMarkUp(React.nextRootIndex);

  // 将渲染的 标签内容 挂载 到 container 容器中
  $(container).html(markUp);

  // 触发 挂载完的方法
  $(document).trigger("mounted"); // 所有组件都好了
}

export default React;