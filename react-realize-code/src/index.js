import React from "./react";

// 文本类 渲染 START
// React.render("hello", document.getElementById("root"))
// 文本类 渲染 END


// *** start *** 原生 dom 标签 <div></div> <button></button>
// jsx 浏览器不能识别，需要 babel 转换成为 javascript
// function sayHello() {
//   console.log("say hello >>>> ");
// }

// const element = (
//   <button id="sayHello" onClick={sayHello} style={{ color: "red", backgroundColor: "green" }}>
//     say <b>hello</b>
//   </button>
// )


/**
element jsx 元素 被 babel 转化为
 React.createElement("button",
  {
    id: "sayHello", style: { color: "red", backgroundColor: "green", onClick: sayHello },
  },
  "say", React.createElement("b", {}, "hello")
)

虚拟 dom 就是 使用 js 对象来描述 dom， dom-diff 就是比较 js 描述 dom 的 对象
 {
  "type": "button",
  "props": {
    "id": "sayHello",
    "style": {
      "color": "red",
      "backgroundColor": "green"
    },
    "children": [
      "say",
      {
        "type": "b",
        "props": {
          "children": [
            "hello"
          ]
        }
      }
    ]
  }
}
描述如下
<button id="sayHello" onClick={sayHello} style={{ color: "red", backgroundColor: "green" }}>
  say <b>hello</b>
</button>
 */

// const jsxElement = React.createElement("button",
//   {
//     id: "sayHello",
//     onClick: sayHello,
//     style: { color: "red", backgroundColor: "green" },
//   },
//   "say", React.createElement("b", {}, "hello")
// )

// // console.log("jsxElement:", JSON.stringify(jsxElement, null, 2))

// React.render(jsxElement, document.getElementById("root"))
// *** end *** 原生 dom 标签 <div></div> <button></button>



// ***************** 类组件渲染 Demo START ***************/
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 1 };
  }

  componentWillMount() {
    console.log("component will Mount [parnent]")
  }

  componentDidMount() {
    console.log("component did Mount[parent]");
    setInterval(() => {
      this.setState({ number: this.state.number + 1 })
    })
  }

  // 决定组件是否需要更新
  shouldComponentUpdate(nextState, nextProps) {
    return true;
  }

  componentDidUpdate() {
    console.log("component did update...")
  }

  increment = () => {
    this.setState({
      number: this.state.number + 1
    })
  }

  render() {
    // console.log("render....")
    // const p = React.createElement("p", { style: { color: "red" } }, this.props.name, this.state.number)
    // const button = React.createElement("button", { onClick: this.increment }, "+")
    // return React.createElement("div", { id: 'counter', }, p, button)
    return this.state.number;
  }
}

const element = React.createElement(Counter, { name: "计数器" });

React.render(element, document.getElementById("root"))
// ***************** 类组件渲染 Demo END ***************/