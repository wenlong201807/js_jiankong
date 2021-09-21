import React, {Component} from 'react';
import ReactDOM from 'react-dom';

let AppComponent =  class extends Component {
    constructor (props) {
        super(props);
    }

  componentDidMount () {
      // 测试错误变量
      vue = 'vanilla' + 'react'
    }

    render () {
        return (
            <div>
              react app666
            </div>
        )
    }
};

ReactDOM.render(<AppComponent/>, document.querySelector('.react-area'));
