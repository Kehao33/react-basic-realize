import $ from "jquery";
import { createUnit } from "./unit";
import { createElement } from "./element";
import { Component } from "./component";

const React = {
  render,
  rootId: 0,
  Component,
  createElement,
}

/**
 * element 此元素可能是文本节点，原生 DOM 节点（div），或者自定义组件 Counter（类组件等）
 */
function render(element, container) {
  // container.innerHTML = `<span data-reactid="${React.rootId}">${element}<span/>`;
  const unit = createUnit(element); // 根据传递的 element 来获取一个 react 单元

  const markUp = unit.getMarkUp(React.rootId); // 每一个单元的 getMarkUp 方法返回 要渲染的对应标签

  // 将 element 挂载到 container 上
  $(container).html(markUp);
  // element 挂载到 container 上 后才触发 componentDidMount
  $(document).trigger("mounted");
}


export default React