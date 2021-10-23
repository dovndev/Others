const { useState } = React;

const App = () => {
  const [hello, sethello] = useState("RED");
  const h1style = {
    background: "linear-gradient(315deg, #90d5ec 0%,#6588ff 25%, #fc575e 74%",
    padding: "10px",
    margin: "30%",
    textAlign: "center",
    borderRadius: "5px",
    fontSize: '20px'
  };

  return <p style={h1style}>{hello}</p>;
};

ReactDOM.render(<App />, document.getElementById("app"));
