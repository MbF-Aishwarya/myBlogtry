import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      author: '',
      related: '',
      file:''
    }

    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.articleToEdit) {
      this.setState({
        title: nextProps.articleToEdit.title,
        body: nextProps.articleToEdit.body,
        author: nextProps.articleToEdit.author,
        related: nextProps.articleToEdit.related,
      });
    }
  }

  handleSubmit(){
    const { onSubmit, articleToEdit, onEdit } = this.props;
    const { title, body, author, related, file } = this.state;

    if(!articleToEdit) {
      return axios.post('http://localhost:8000/api/articles', {
        title,
        body,
        author,
        related,
        file
      })
        .then((res) => onSubmit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '', related: '', file:'' }));
    } else {
      return axios.patch(`http://localhost:8000/api/articles/${articleToEdit._id}`, {
        title,
        body,
        author,
        related
      })
        .then((res) => onEdit(res.data))
        .then(() => this.setState({ title: '', body: '', author: '', related: '' }));
    }
  }

  handleChangeField(key, event) {
    this.setState({
      [key]: event.target.value,
    });
  }

  render() {
    const { articleToEdit } = this.props;
    const { title, body, author, related, file } = this.state;

    return (
      <div className="col-6 col-lg-6 offset-lg-3">
        <input onChange={(ev) => this.handleChangeField('title', ev)} value={title} className="form-control my-3" placeholder="Title"
        />
        <input onChange={(ev) => this.handleChangeField('file', ev)} value={file} type="file" className="form-control my-3"/>
        <textarea onChange={(ev) => this.handleChangeField('body', ev)} className="form-control my-3 blogContent" placeholder="Blog Content" value={body}>
        </textarea>
        <input onChange={(ev) => this.handleChangeField('author', ev)} value={author} className="form-control my-3" placeholder="Author"
        />
        <input onChange={(ev) => this.handleChangeField('related', ev)} value={related} className="form-control my-3" placeholder="Related to"/>
        <button onClick={this.handleSubmit} className="btn btn-primary">{articleToEdit ? 'Update' : 'Submit'}</button>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onSubmit: data => dispatch({ type: 'SUBMIT_ARTICLE', data }),
  onEdit: data => dispatch({ type: 'EDIT_ARTICLE', data }),
});

const mapStateToProps = state => ({
  articleToEdit: state.home.articleToEdit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);