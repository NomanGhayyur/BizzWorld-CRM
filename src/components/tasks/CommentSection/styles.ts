const mentionsInputStyle = {

    control: {
      backgroundColor: '#fff',
        fontSize: "11px",
        border: "1px solid lightgray",
        outline: "none",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "5px",
    },
    '&multiLine': {
        control: {
            display:"block",
            minHeight: "100%",
            outline: "none",
            border:"none"
      },
      highlighter: {
        padding: 9,
      },
      input: {
        padding: 9,
      },
    },
    
    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 12,
      },
      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',
        '&focused': {
          backgroundColor: '#cee4e5',
        },
      },
    },
}
  
export default mentionsInputStyle