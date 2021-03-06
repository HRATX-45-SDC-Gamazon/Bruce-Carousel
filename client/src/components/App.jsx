import React from "react";
import axios from "axios";
import Images from "./Images.jsx";
import ButtonLeft from "./ButtonLeft.jsx";
import ButtonRight from "./ButtonRight.jsx";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
            currentProduct: 1,
            recommendedID: [],
            recommendedPrices: [],
            recommendedNames: [],
            recommendedRatings: [],
            allData: [],
            allRatings: []
        };
        
        this.clickLeft = this.clickLeft.bind(this);
        this.clickRight = this.clickRight.bind(this);
        this.findRecommendedLeft = this.findRecommendedLeft.bind(this);
        this.findRecommendedRight = this.findRecommendedRight.bind(this);
        this.recommended = this.recommended.bind(this);
        this.next5 = this.next5.bind(this);
        this.next8 = this.next8.bind(this);
        this.getData = this.getData.bind(this);
        this.parseData1 = this.parseData1.bind(this);
        this.parseData2 = this.parseData2.bind(this);
        this.clickRecommended = this.clickRecommended.bind(this);
        this.defaultState = this.defaultState.bind(this);
        this.getRatings = this.getRatings.bind(this);
        // this.getId = this.getId.bind(this);
    }    
    
    componentDidMount() {
        let idText = window.location.search;
        if (idText) {
            let croppedId = idText.substring((idText.indexOf('=') + 1));
            croppedId = Number(croppedId);
            this.defaultState(croppedId);
        } else {
            this.defaultState();
        }
    }

    defaultState(id = 1) {
        this.setState({
            currentProduct: id
        }, () => {
            this.recommended();
        });
    }

    clickLeft () {
        // this.findRecommendedLeft();
        this.findRecommendedLeft8();
    }

    clickRight() {
        // this.findRecommendedRight();
        this.findRecommendedRight8();
    }

    // grabs next 5 products based on currentProductID
    next5() {
        let newList = [];
        let start = this.state.currentProduct;
        if (start < 6) {
            for (let i = 1; i < 101; i++) {
                if (i !== start) {
                    newList.push(i);
                }
                if (newList.length === 5) {
                    break;
                }
            }
        } else if (start > 96) {
            for (let i = start + 1; i < 101; i++) {
                newList.push(i);
            }
            for (let j = 1; newList.length < 5; j++) {
                newList.push(j);
            }
        } else {
            for (let k = start + 1; newList.length < 5; k++) {
                newList.push(k);
            }
        }
        return newList;
    }

    // grabs next 8 products based on currentProductID
    next8() {
        let newList = [];
        let start = this.state.currentProduct;
        if (start < 9) {
            for (let i = 1; i < 101; i++) {
                if (i !== start) {
                    newList.push(i);
                }
                if (newList.length === 8) {
                    break;
                }
            }
        } else if (start > 93) {
            for (let i = start + 1; i < 101; i++) {
                newList.push(i);
            }
            for (let j = 1; newList.length < 8; j++) {
                newList.push(j);
            }
        } else {
            for (let k = start + 1; newList.length < 8; k++) {
                newList.push(k);
            }
        }
        return newList;
    }

    
    recommended() {
    // let newList = this.next5();
    let newList = this.next8();
        this.setState({
            recommendedID: newList
        }, () => {
            this.getData();
        });
    }

    parseData1(resultArray, refArray, category) {
        let resultObj = {};
        for (let i = 0; i < refArray.length; i++) {
            let index = refArray[i] - 1;
            resultObj[refArray[i]] = resultArray[index][category];
        }
        return resultObj;
    }

    parseData2(obj) {
        let array = this.state.recommendedID;
        let elements = [];
        for (let i = 0; i < array.length; i++) {
            elements.push(obj[array[i]]);
        }
        return elements;
    }

    // ! streamline ratings from Tim
    getRatings() {
        axios.get('http://gammazonreviews.us-east-2.elasticbeanstalk.com/comments/1')
        .then(response => {
            // array of objs
            let temp = response.data[0].totalCounter;
            this.setState({
                allRatings: temp
            })
        })
        .then(() => {
            return this.parseData1(this.state.allRatings, this.state.recommendedID, "average");
        })
        .then(result => {
            return this.parseData2(result);
        })
        .then(result => {
            this.setState({
                recommendedRatings: result
            })
        })
        .catch(error => {
            console.log(error);
        })
    }

    // retrieves data of recommended items from database
    getData() {
        axios.post("http://carousel.us-east-2.elasticbeanstalk.com/data", {
            recommendedID: this.state.recommendedID
        })
        .then(response => {
            this.setState({
                allData: response.data
            });
            // setState productNames
            return this.parseData1(response.data, this.state.recommendedID, "productName");
        })
        .then(result => {
            return this.parseData2(result);
        })
        .then(result => {
            this.setState({
                recommendedNames: result
            })
        })
        .then(()=> {
            return this.parseData1(this.state.allData, this.state.recommendedID, "productPrice");
        })
        .then(result => {
            return this.parseData2(result);
        })
        .then(result => {
            this.setState({
                recommendedPrices: result  
            });
        })
        .then(() => {
            this.getRatings();
        })
        // ! for db ratings
        // .then(()=> {
        //     return this.parseData1(this.state.allData, this.state.recommendedID, "productRating");
        // })
        // .then(result => {
        //     return this.parseData2(result);
        // })
        // .then(result => {
        //     this.setState({
        //         recommendedRatings: result  
        //     }, () => {
        //         console.log(this.state.recommendedRatings);
        //     })
        // })
        .catch(error => {
            console.log(error);
        });
    }

    // determines previous 5 recommended product IDs from current product
    findRecommendedLeft() {
        let currentProduct = this.state.currentProduct;
        let newList = [];
        let start = this.state.recommendedID[0];
        if (start < 6) {
            for (let i = 1; i < start; i++) {
                if (i !== currentProduct) {
                    newList.push(i);
                }
            }
            let length = newList.length;
            if (length < 5) {
                for (let j = 100; j >= 100 - (5 - length); j--) {
                    if (j !== currentProduct) {
                        newList.unshift(j);
                    }
                }
            }
        } else if (start > 95) {
            for (let i = start - 5; i < start; i++) {
                if (i !== currentProduct) {
                    newList.push(i);
                }
            }
            let length = newList.length;
            if (length < 5) {
                for (let j = start - (5 + (5 - length)); newList.length < 5; j++) {
                    if (j !== currentProduct) {
                        newList.unshift(j);
                    }
                }
            }
        } else {
            for (let k = start - 1; k >= start - 5; k--) {
                if (k !== currentProduct) {
                    newList.unshift(k);
                }
            }
            for (let m = start - 6; newList.length < 5; m--) {
                if (m !== currentProduct) {
                    newList.unshift(m);
                }
            }
        }
        this.setState({
            recommendedID: newList
        }, () => {
            this.getData();
        });
    }

    // determines next 5 recommended product IDs from current product
    findRecommendedRight() {
        let currentProduct = this.state.currentProduct;
        let newList = [];
        let end = this.state.recommendedID[4];
        if (end > 95) {
            for (let i = end + 1; i < 101; i++) {
                if (i !== currentProduct) {
                    newList.push(i);
                }
            }
            for (let j = 1; newList.length < 5; j++) {
                if (j !== currentProduct) {
                    newList.push(j);
                }
            }
        } else {
            for (let k = (end + 1); newList.length < 5; k++) {
                if (k !== currentProduct) {
                    newList.push(k);
                }
            }
        }

        this.setState({
            recommendedID: newList
        }, () => {
            this.getData();
        });
    }

    // determines previous 8 recommended product IDs from current product
    findRecommendedLeft8() {
        let currentProduct = this.state.currentProduct;
        let newList = [];
        let start = this.state.recommendedID[0];
        if (start < 9) {
            for (let i = 1; i < start; i++) {
                if (i !== currentProduct) {
                    newList.push(i);
                }
            }
            let length = newList.length;
            if (length < 8) {
                for (let j = 100; j >= 100 - (8 - length); j--) {
                    if (j !== currentProduct) {
                        newList.unshift(j);
                    }
                }
            }
        } else if (start > 92) {
            for (let i = start - 8; i < start; i++) {
                if (i !== currentProduct) {
                    newList.push(i);
                }
            }
            let length = newList.length;
            if (length < 8) {
                for (let j = start - (8 + (8 - length)); newList.length < 8; j++) {
                    if (j !== currentProduct) {
                        newList.unshift(j);
                    }
                }
            }
        } else {
            for (let k = start - 1; k >= start - 8; k--) {
                if (k !== currentProduct) {
                    newList.unshift(k);
                }
            }
            for (let m = start - 9; newList.length < 8; m--) {
                if (m !== currentProduct) {
                    newList.unshift(m);
                }
            }
        }
        this.setState({
            recommendedID: newList
        }, () => {
            this.getData();
        });
    }

    // determines next 8 recommended product IDs from current product
    findRecommendedRight8() {
        let currentProduct = this.state.currentProduct;
        let newList = [];
        let end = this.state.recommendedID[7];
        if (end > 92) {
            for (let i = end + 1; i < 101; i++) {
                if (i !== currentProduct) {
                    newList.push(i);
                }
            }
            for (let j = 1; newList.length < 8; j++) {
                if (j !== currentProduct) {
                    newList.push(j);
                }
            }
        } else {
            for (let k = (end + 1); newList.length < 8; k++) {
                if (k !== currentProduct) {
                    newList.push(k);
                }
            }
        }

        this.setState({
            recommendedID: newList
        }, () => {
            this.getData();
        });
    }

    // gets productID of recommended product
    clickRecommended(e) {
        let id = Number(e.target.dataset.productid);
        this.setState({
            currentProduct: id
        }, () => {
                window.location.replace(`http://gammazon-env.edv8rtj88x.us-west-2.elasticbeanstalk.com/?id=${id}`);
        });
    }

	render() {
		return( 
            <div>
                <h1 className='header'>Customers who bought this item also bought</h1>
                <div className='frame'>
                    <ButtonLeft clickLeft={this.clickLeft} />
                    <Images 
                        currentProduct={this.state.currentProduct} 
                        recommendedID={this.state.recommendedID} 
                        recommendedNames={this.state.recommendedNames} 
                        recommendedPrices={this.state.recommendedPrices} 
                        clickRecommended={this.clickRecommended} 
                        recommendedRatings={this.state.recommendedRatings}
                        />
                    <ButtonRight clickRight={this.clickRight} />    
                </div>
            </div>
        );
	}
};

export default App;
