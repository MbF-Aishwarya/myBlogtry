import React from 'react';

class Imgupload extends React.Component {
	constructor(props){
		super(props),
		this.state={
			image:'',
			imageURL: '',
		}
		this.onImageChange = this.onImageChange.bind(this);
	}

	onImageChange(event) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({image: e.target.result});
            };
            reader.readAsDataURL(event.target.files[0]);
        }

        const data = new FormData();
	    data.append('file', this.uploadInput.files[0]);

	    fetch('http://localhost:8000/api/articles', {
	      method: 'POST',
	      body: data,
	    }).then((response) => {
	      response.json().then((body) => {
	        this.setState({ imageURL: `http://localhost:8000/api/articles/${body.file}` });
	      });
	    });
    }
	render(){
		return(
			<div>
			<div >
				<input type="file" ref={(ref) => { this.uploadInput = ref; }} onChange={this.onImageChange.bind(this)} name="myimage" className="form-control my-3" id="group_image"/>
	     		<img id="target" src={this.state.image}/>
	     		<img src={this.state.imageURL} />
     		</div>
			</div>
		);
	}
	
}


export default Imgupload;