
import React from "./react";

// ********************* 类组件 标签类型 demo START *********************

class SubCounter2 {
  render() {
    return "subcounter content2 "
  }
}


class SubCounter {

  componentWillMount() {
    console.log("counter[subCounter] componentWillMount running....")
  }

  componentDidMount() {
    console.log("counter[subCounter] componentDidMount")
  }

  render() {
    return <div>
      <p>subcounter content</p>
      {React.createElement(SubCounter2, { name: "sucounter" })}

    </div>
  }
}

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 1 }
  }

  componentWillMount() {
    console.log("counter[parent] componentWillMount running....")
  }

  componentDidMount() {
    console.log("counter[parent] componentDidMount")
  }


  render() {
    // 
    console.log(this.props.name, "comp")
    return <div>
      {this.state.number}
      <p>ni hao</p>
      <SubCounter name="123" />
    </div>
  }
}

/**
 * Counter 将会被转化为 React.createElement(Counter, {name: "jakequc"});
 */
React.render(<Counter name="jakequc" />, document.getElementById("root"))

// ********************* 类组件 标签类型 demo END *********************


// ********************* 原生 标签类型 demo START *********************
// demo1  ** 绑定 事件， react 做了事件代理
// function say() {
//   console.log("jakequc");
// }

// const element = React.createElement("div", { name: "xxx" }, "hello", React.createElement("button", { onClick: say }, "123"));

// // 渲染的可能不是字符串、jsx语法、组件
// React.render(element, document.getElementById("root"));
// ********************* 原生 标签类型 demo END *********************




// eslint-disable-next-line no-lone-blocks
{/* <di name="xxx">hello <span>123</span></div> */ }
// {
//   "type": "div",
//   "props": {
//       "name": "xxx",
//       "children": [
//           "hello",
//           {
//               "type": "span",
//               "props": {
//                   "children": [
//                       "123"
//                   ]
//               }
//           }
//       ]
//   }
// }