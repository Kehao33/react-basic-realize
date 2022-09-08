
class Component {
  constructor(props) {
    this.props = props;
  }
  // 更新状态在 setState 中
  setState(partialState) {
    //  第一个参数是新的元素， 第二个参数是新的状态
    this._currentUnit.update(null, partialState);
  }
}

export {
  Component
}