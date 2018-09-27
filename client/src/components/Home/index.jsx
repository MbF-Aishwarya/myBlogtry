import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';

import { Form } from '../../components/Article';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file:'',
      imageURL: ''
    }

    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

   componentWillMount(){
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    this.setState({x:x,y:y});
  }

  componentDidMount() {
    const { onLoad } = this.props;
    axios('http://localhost:8000/api/articles')
      .then((res) => onLoad(res.data));
     
  }

  handleDelete(id) {
    const { onDelete } = this.props;

    return axios.delete(`http://localhost:8000/api/articles/${id}`).then(() => onDelete(id));
  }

  handleEdit(article) {
    const { setEdit } = this.props;

    setEdit(article);
  }

  render() {
    const { articles } = this.props;

    return (
     <div><img className='bg' src= {'https://source.unsplash.com/'+this.state.x+'x'+this.state.y+'/?nature'} />
      <div className="container">
        <div className="content-bg">
          <div className="row">
            <div className="col-12">
              <h1 className="text-center">MakeBlog</h1>
            </div>
            <Form />
          </div>
          <div className="blogList pt-5">
            <div className="blogCard">
              {articles.map((article) => {
                return (
                  <div className="card my-3">
                    <div className="card-header">
                      {article.title}
                    </div>
                    <div className="card-body">
                       <div className="blogImage">
                        <img src={article.image} /> 
                       </div>
                        <br />
                      <div className="card-content">
                        {article.body}
                        <p className="mt-5 text-muted"><strong>{article.author}</strong> <span>{moment(new Date(article.createdAt)).fromNow()}</span></p>
                        <p className="mt-5"><strong>Related to :</strong> {article.related}</p>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="row">
                        <button onClick={() => this.handleEdit(article)} className="btn btn-primary mx-3">
                          Edit
                        </button>
                        <button onClick={() => this.handleDelete(article._id)} className="btn btn-danger">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  articles: state.home.articles,
});

const mapDispatchToProps = dispatch => ({
  onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
  onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
  setEdit: article => dispatch({ type: 'SET_EDIT', article }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);