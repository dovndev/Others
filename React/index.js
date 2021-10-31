const { useState } = React;

const App = () => {
  const Name = "M4tech";

  return (
    <div className="page">
      <Header />
    </div>
  );
};

const Header = () => {
  const icon =
    "https://yt3.ggpht.com/ytc/AKedOLS-Asy0HhW7tk9pJ-q4ZJo1sKPRaKdMkKH6490GxA=s176-c-k-c0x00ffffff-no-rj-mo";
  const Name = "M4tech";

  return (
    <div className="header">
      <div className="left">
        <img src={icon}></img>
        <p>{Name}</p>
      </div>

      <div className="right">
        <ul>
          <li>Home</li>
          <li>Home</li>
          <li>Home</li>
          <li>Home</li>
          <li>Home</li>
        </ul>
      </div>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
