class Element {
  // 使用类来判断 创建的元素是不是 element 实例对象
  constructor(type, props) {
    this.type = type;
    this.props = props;
  }
}

function createElement(type, props, ...children) {
  // 用对象来描述元素 ,這就是虚拟dom
  props = props || {};
  props.children = children;
  // 通过类来标识对象
  return new Element(type, props);

}

// 返回 虚拟 dom ，用对象来描述元素 
export default createElement;