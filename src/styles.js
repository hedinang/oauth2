export default {
  container: {},
  inner: {
    padding: 20,
  },
  scrollList: {
    overflowY: "scroll",
    maxHeight: "calc(30vh)",
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: "left",
  },
  boxWrap: {
    width: "80%",
    display: "flex",
    flexDirection: "column",
    gap: "2%",
    margin: 5,
    padding: 5,
    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
    borderTop: "3px solid #838bc5",
    borderRadius: 3,
    fontSize: 13,
  },
  row: {
    display: "flex",
    gap: "4px"
  },
  rowContent:{
    overflowWrap: "break-word",
    overflow: "hidden"
  },
  box: {
    textAlign: "left",
    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
    borderTop: "3px solid #838bc5",
    borderRadius: 3,
    cursor: "pointer",
    boxSizing: "border-box",
    margin: 5,
    padding: 10,
    "&:hover": {
      borderTopColor: "#000",
    },
  },
  boxTitle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start"
  },
  text: {
    fontSize: 13,
  },
  textOver: {
    wordBreak: "break-all",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "70%",
    display: "inline-block",
    verticalAlign: "middle",
  },
  textName: {
    fontSize: 20,
    textAlign: "center",
    wordBreak: "break-all",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
  textIntro: {
    fontSize: 20,
  },
  textWarning: {
    fontSize: 18,
    color: "#f06027",
  },
  label: {
    display: "inline-block",
    marginRight: 3,
    width: 50,
  },
};
