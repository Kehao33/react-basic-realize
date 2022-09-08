class Element {

  constructor(type, props) {
    this.type = type;
    this.props = props;
  }
}

function createElement(type, props, ...children) {
  props.children = children || []; // children 也是 props 的属性
  // 使用 js 来描述 dom
  return new Element(type, props);
}

export {
  Element,
  createElement
}