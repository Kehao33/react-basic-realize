# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### diff 策略

- Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计；
- 拥有相同类型的两个组件会生成相似的属性结构，拥有不同类型的两个组件会生成不同的树形结构
- 对于同一层级的子节点，他们可以通过唯一的 key 进行区分

#### tree diff

- React 对树的算法进行了简洁明了的优化，即对树进行分层比较，两棵树只会对同一层次的节点进行比较
- 当出现节点跨层移动的时候，不会出现代码上移动的操作，而是进行其下整棵树的重建

#### component diff

- 如果是同一类型的组件，按照原策略继续比较 Virtual Dom tree
- 如果不是同一类型的组件，则将该组件判断为 dirty component ,从而替换整个组件下的所有子节点
