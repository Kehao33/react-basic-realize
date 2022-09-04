import $ from "jquery";
class Unit {  // 通过父类保存参数
  constructor(element) {
    this.currentElement = element;
  }
}

// 文本标签类
class ReactTextUnit extends Unit {
  getMarkUp(rootId) { // 保存当前元素的 Id
    this._rootId = rootId;
    return `<span data-reactid="${rootId}">${this.currentElement}</span>`
  }
}

// jsx 标签
class ReactNativeUnit extends Unit {
  getMarkUp(rootId) {
    this._rootId = rootId;
    const { type, props } = this.currentElement;
    let tagStart = `<${type} data-reactid="${rootId}"`
    const tagEnd = `</${type}>`
    let contentStr = "";

    for (let propName in props) {
      if (
        /on[A-Z]/.test(propName)  // onClick
      ) {
        const eventType = propName.slice(2).toLowerCase(); // click
        $(document).on(eventType, `[data-reactid="${rootId}"]`, props[propName])
      } else if (propName === "children") {
        // ['<span>hello</span>','<div>word</div>]
        contentStr = props[propName].map((child, idx) => {
          // 递归循环子节点
          const childInstance = createReactUnit(child)
          return childInstance.getMarkUp(`${rootId}.${idx}`);
        }).join("");
      } else {
        tagStart += ` ${propName}=${props[propName]}`
      }
    }
    return tagStart + ">" + contentStr + tagEnd
  }
}
// 负责渲染 react 类组件的
class ReactCompositUnit extends Unit {
  getMarkUp(rootId) {
    this._rootId = rootId;
    const { type: Component, props } = this.currentElement;
    const componentInstance = new Component(props);

    // 调用 类组件中的 componentWillMount() {} 方法
    componentInstance.componentWillMount && componentInstance.componentWillMount();

    // 调用 render 得到 其返回的结果
    const reactCompoentRenderer = componentInstance.render();
    // render 返回的结果 可能是 其他类型 的非 文本，所以需要递归渲染 组件 render 后的返回结果
    const reactCompositUnitInstance = createReactUnit(reactCompoentRenderer);
    const markUp = reactCompositUnitInstance.getMarkUp(rootId);
    // 递归后绑定的事件， 儿子先绑定成功后，再绑定父亲的
    $(document).on("mounted", () => {
      componentInstance.componentDidMount && componentInstance.componentDidMount();
    })

    return markUp;
  }
}

// 这是一个工厂函数，会返回一个 元素实例，然后 render 的时候调用getmarkUp 来获取元素对应的边标签，挂载到对应的父级元素上（container 上）
function createReactUnit(element) {
  // 文本 标签
  if (typeof element == "string" || typeof element === "number") {
    return new ReactTextUnit(element);
  }

  // jsx 标签 可以使用
  if (typeof element === "object" && typeof element.type === "string") {
    return new ReactNativeUnit(element);
  }

  // 类 元素
  if (typeof element === "object" && typeof element.type === "function") {
    return new ReactCompositUnit(element); // {type: ClassCompName, props}
  }
}

export default createReactUnit;