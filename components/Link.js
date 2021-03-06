import React from 'react'
import md5 from 'md5'
import styled from 'styled-components'

const Url = styled.div`
  font-size: 24px;
  color: #1d4877;
  font-family: 'Trebuchet Ms', Verdana;
  a {
    text-decoration: none;
    color:inherit;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
  }
  a:hover {
    text-decoration: underline;
  }
`

const Text = styled.div`
  font-size: 14px;
  margin: 10px 0;
`

// use a span to be able to use :first-of-type
const Tag = styled.span`
  display: inline-block;
  font-size: 12px;
  padding: 2px 10px;
  border-radius:3px;
  margin: 5px;
  background: #fbb021;
  border:1px solid #f68838;
  cursor:pointer;

  &:first-of-type {
    margin-left: 0;
  }

  transition: opacity 0.1s ease-in;
  &:hover {
    opacity: 0.7
  }
`

const getScreenshotUrl = url => `/static/screenshots/${md5(url)}.png`;

const Screenshot = styled.div`
  width: 160px;
  height: 120px;
  margin: 0 auto;
  background-image: ${props => `url(${getScreenshotUrl(props.url)})` };
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #aaa;
  border: 1px solid #ccc;
  margin-bottom:10px;
`

// simpler url
const simplify = url => url.replace(/https?\:\/\//,'').replace(/\/$/,'').replace(/^www\./,'')

const Star = styled.div`
  cursor:pointer;
  display: inline-block;
  right: 5px;
  position: absolute;
  margin-left: auto;
  top: 5px;

  &::after {
    content: '⭐';
    font-size: 25px;
    filter: ${props => props.starred ? '' : 'grayscale(100%)'}
  }
`

// higher-order-component
// add props.onStar and props.starred
// use @id as a key to store bookmark status
//
// Cmp = makeStarrable(Whatever)
// <Cmp id="xxx" />
//
//
const makeStarrable = Component => class Starrable extends React.Component {
  state = {
    starred: false
  }
  componentWillMount() {
    this.setState({
      starred: this.isStarredInStorage()
    })
  }
  isStarredInStorage = () => {
    // read from local storage
    return (typeof window !== 'undefined') && !!window.localStorage.getItem(this.props.id) || false
  }
  onStar = () => {
    this.setState(state => ({
      starred: !state.starred
    }), () => {
      // save data in local storage
      if (typeof window !== 'undefined') {
        if (!this.state.starred) {
          window.localStorage.removeItem(this.props.id);
        } else {
          window.localStorage.setItem(this.props.id, ''+true);
        }
      }
    })
  }
  render() {
    return <Component onClick={ this.onStar } starred={ this.state.starred } { ...this.props }/>
  }
}

const StarContainer = makeStarrable(Star)

const Link = ({ className, url, text, tags, onTagClick }) => (
  <div className={ className }>
    <StarContainer id={ url }/>
    <Screenshot url={ url }/>
    <Url><a title={ url } href={ url }>{ simplify(url) }</a></Url>
    <Text>{ text }</Text>
    { tags.map(tag => <Tag onClick={ () => onTagClick(tag) } key={ tag }>{ tag }</Tag>) }
  </div>
)

const StyledLink = styled(Link)`
  display: inline-block;
  box-sizing: border-box;
  width: calc(50% - 22px);
  border: 1px solid #f68838;
  margin: 10px;
  padding: 20px;
  vertical-align: top;
  position: relative;

  &:nth-child(even) {
    background: #fffcf5;
  }
  &:nth-child(odd) {
    background: #fff6e9;
  }

  @media screen and (max-width: 640px) {
    width: calc(100% - 22px);
  }

  @media screen and (min-width: 1024px) {
    width: calc(33% - 22px);
  }
`

export default StyledLink