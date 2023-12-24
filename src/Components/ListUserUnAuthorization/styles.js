export default {
  container: {
  },
  inner: {
    padding: 20,
  },
  scrollList: {
    overflowY: 'scroll',
    maxHeight: 'calc(30vh)',
  },
  wrap: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  boxWrap: {
    // display: 'inline-grid',
    // boxSizing: 'border-box',
    width: '50%',
  },
  box: {
    textAlign: 'left',
    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
    borderTop: '3px solid #838bc5',
    borderRadius: 3,
    cursor: 'pointer',
    boxSizing: 'border-box',
    margin: 5,
    padding: 10,
    "&:hover": {
      borderTopColor: '#000',
    }
  },
  text: {
    fontSize: 13,
  },
  textOver: {
    wordBreak: 'break-all',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '70%',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  textName: {
    fontSize: 20,
    textAlign: 'center',
    wordBreak: 'break-all',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  textIntro: {
    fontSize: 20,
  },
  textWraning: {
    fontSize: 18,
    color: '#f06027'
  },
  label: {
    display: 'inline-block',
    marginRight: 3,
    width: 50,
  }
}