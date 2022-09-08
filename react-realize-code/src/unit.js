import { Element } from "./element";
import $ from "jquery";

class Unit {
  constructor(element) {
    // _ 私有属性标识（自定义）
    this._currentElement = element;
  }

  getMarkUp() {
    throw Error("此方法需要子类重写");
  }
}

// 文本单元 类
class TextUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid;

    return `<span data-reactid="${reactid}">${this._currentElement}</span>`
  }

  // update 更新文本元素
  update(nextElement) {
    if (this._currentElement !== nextElement) {
      this._currentElement = nextElement;
      $(`[data-reactid]="${this._reactid}"`).html(nextElement);
    }
  }
}

// 原生 dom 严肃
/**
 * 虚拟 dom 就是 使用 js 对象来描述 dom， dom-diff 就是比较 js 描述 dom 的 对象
{
  type: "button",
  props: {
    id: "sayHello",
    onClick: sayHello,
    style: {color: "red", backgroundColor:"green"},
    children: ["say", {
      type: "b",
      props: {
        children: "hello"
      }
    }]
  }
}
描述如下
<button id="sayHello" onClick={sayHello} style={{ color: "red", backgroundColor: "green" }}>
  say <b>hello</b>
</button>
 */
class NativeUnit extends Unit {
  getMarkUp(reactid) {
    this._reactid = reactid;
    const { type, props } = this._currentElement;
    let tagStart = `<${type} data-reactid="${reactid
      }"`;
    let childString = "";
    let tagEnd = `</${type}>`;

    for (const propName in props) {
      if (/^on[A-Z]/.test(propName)) {
        // 绑定事件
        const eventType = propName.slice(2).toLowerCase(); // click
        // react 16 之前 的事件是通过 事件代理来触发的
        $(document).on(eventType, `[data-reactid="${reactid}"]`, props[propName]);
      } else if (propName === "style") {
        // 处理 style样式
        const styleObj = props[propName];
        const styles = Object.entries(styleObj).map(([attr, value]) => {
          const key = attr.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
          return `${key}:${value}`
        }).join(";")

        tagStart += ` style="${styles}" `;
      } else if (propName === "className") {
        // 处理 类名
        tagStart += ` ${props[propName]} `;
      } else if (propName === "children") {
        // 当前的孩子，每个元素都是一个 unit 渲染单元
        childString = props[propName].map((childElement, idx) => {
          const subUnit = createUnit(childElement);
          return subUnit.getMarkUp(`${reactid}.${idx}`)
        }).join("");
      } else {
        // 一般属性
        tagStart += ` ${propName}=${props[propName]} `;
      }
    }
    return tagStart + ">" + childString + tagEnd;
  }
}

// class Component
class CompositeUnit extends Unit {
  // 负责处理组件的更新操作, nextElement 新的元素，partialState 新的子元素
  update(nextElement, partialState) {
    // 先获取最新的元素
    this._currentElement = nextElement || this._currentElement;
    // 获取新的状态, 不管要不要更新组件，组件的状态一定要修改
    const nextState = this._componentInstance.state = Object.assign(this._componentInstance.state, partialState);
    // 新的属性对象
    const nextProps = this._currentElement.props;

    if (this._componentInstance.shouldComponentUpdate && !this._componentInstance.shouldComponentUpdate(nextState, nextProps)) {
      return;
    }

    // 进行比较更新
    // 得到上次渲染的内容
    const preRenderedUnitInstance = this._renderedUnitInstance;
    // 得到上次渲染的元素
    const preRenderedElement = preRenderedUnitInstance._currentElement;
    // 得到这次渲染的元素
    const nextRendredElement = this._componentInstance.render();
    // 如果新旧两个元素的类型一样，则可以进行深度比较 ，如果不一样，直接移除老的元素，新建新的元素
    if (shouldDeepCompare(preRenderedElement, nextRendredElement)) {
      // 递归比较
      preRenderedUnitInstance.update(nextRendredElement);
      this._componentInstance.componentDidUpdate && this._componentInstance.componentDidUpdate();

    } else {
      this._renderedUnitInstance = createUnit(nextRendredElement)
      const nextMarkUp = this._renderedUnitInstance.getMarkUp(this._reactid);
      $(`[data-reactid="${this._reactid}"]`).replaceWith(nextMarkUp);
    }

  }
  getMarkUp(reactid) {
    this._reactid = reactid;
    // 得到 渲染的内容
    const { type: Component, props } = this._currentElement;
    const componentInstance = this._componentInstance = new Component(props);
    // 让组件的实例的 currentUnit 属性等于当前的 unit (用于组件的更新)
    componentInstance._currentUnit = this;
    // 如果 有 componentWillMount 就执行该方法
    componentInstance.componentWillMount && componentInstance.componentWillMount();
    // 调用组件 render 方法，获取要渲染的元素
    const renderElement = componentInstance.render();
    // 得到渲染元素的 unit, this._renderedUnitInstance 拥有自己的 _currentElement 属性
    const renderedUnitInstance = this._renderedUnitInstance = createUnit(renderElement);
    // 通过 unit 可以他的 html 方法
    const renderMarkUp = renderedUnitInstance.getMarkUp(reactid);
    $(document).on("mounted", () => {
      componentInstance.componentDidMount && componentInstance.componentDidMount();
    })

    return renderMarkUp
  }
}

function shouldDeepCompare() {

}

export function createUnit(element) {
  if (typeof element === "string" || typeof element === "number") {
    return new TextUnit(element);
  }

  // 如果 element 是原生 dom 节点
  if (element instanceof Element && typeof element.type === "string") {
    return new NativeUnit(element);
  }

  // class Component 
  if (element instanceof Element && typeof element.type === "function") {
    return new CompositeUnit(element);
  }
}