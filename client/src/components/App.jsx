import React from "react";
import axios from "axios";
import Images from "./Images.jsx";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
            currentProduct: 1,
            recommended: [2, 3, 4, 5, 6]
        };
    }
    
    componentDidMount() {}

	render() {
		return( 
            <div>
                Hello World
                <Images currentProduct={this.state.currentProduct} recommended={this.state.recommended} />
            </div>
        );
	}
};

export default App;
