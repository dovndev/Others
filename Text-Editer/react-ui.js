const { useEffect, useState, useCallback, useRef } = React;

const useLocalStorage = (key, initialvalue) => {
  const [value, setvalue] = useState(initialvalue);

  useEffect(() => {
    const savedvalue = JSON.parse(localStorage.getItem(key));
    if (savedvalue != null) setvalue(savedvalue);
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [value]);

  return [value, setvalue];
};

const HeaderButton = ({ className, func, text, Display }) => {
  return (
    <div
      className={className}
      onClick={func}
      style={{ display: Display ? "block" : "none" }}
    >
      {text}
    </div>
  );
};

const Header = ({ openNav, run, setEditing, editing, live, layout }) => {
  const data = [
    {
      func: () => setEditing(0),
      text: "HTML",
      id: 0,
    },
    {
      func: () => setEditing(1),
      text: "CSS",
      id: 1,
    },
    {
      func: () => setEditing(2),
      text: "JS",
      id: 2,
    },
    {
      func: () => {
        run();
        setEditing(3);
      },
      text: "Result",
      id: 3,
    },
    {
      func: run,
      text: "Run",
      id: 4,
    },
  ];
  return (
    <div className="systemheader">
      <div className="inputcontrols">
        {layout == 5 && <h2>Text-Editer</h2>}
        {data.map((item) => (
          <HeaderButton
            className={`swiftbtn${editing === item.id ? " swiftbtn2" : ""}`}
            func={item.func}
            text={item.text}
            Display={
              item.id === 4 ? !live : item.id === 3 ? layout == 0 : layout != 5
            }
          />
        ))}
      </div>
      <div onClick={openNav} className="systemnavbtn" id="nav-btn">
        <i className="fas fa-bars icon" id="nav-btn"></i>
      </div>
    </div>
  );
};

const NavBtn = ({ type, func, icon, text, checked, name, value }) => {
  return (
    <label onClick={func} className="tooltip" id="nav-btn">
      {type === 0 && (
        <div className="systembtn" id="nav-btn">
          <i className={icon} id="nav-btn"></i>
        </div>
      )}
      {type === 1 && (
        <input
          type="radio"
          name={name}
          value={value}
          id="nav-btn"
          checked={checked}
        />
      )}
      {type === 3 && (
        <div id="nav-btn" className="systembtn systemcheckbtn">
          <input
            type="checkbox"
            checked={checked}
            id="nav-btn"
            className="liveprev"
          />
          <span className="theball" id="nav-btn"></span>
        </div>
      )}
      <span className="tooltiptext" id="nav-btn">
        {text}
      </span>
    </label>
  );
};

const NavBar = ({
  setLive,
  live,
  setWrap,
  wrap,
  setTheme,
  theme,
  setNav2Open,
  isFullScreen,
  setIsFullScreen,
}) => {
  const data = [
    {
      type: 0,
      func: () => setNav2Open(1),
      icon: "far fa-clipboard icon",
      text: "Copy your code",
    },
    {
      type: 0,
      func: () => setIsFullScreen(!isFullScreen),
      icon: isFullScreen ? "fas fa-compress icon" : "fas fa-expand icon",
      text: isFullScreen ? "Exit fullscreen" : "Fullscreen",
    },
  ];
  const data2 = [
    {
      type: 0,
      func: () => setNav2Open(2),
      icon: "fas fa-text-height icon",
      text: "Font-size",
    },
    {
      type: 0,
      func: () => setNav2Open(3),
      icon: "fas fa-font",
      text: "Font-family",
    },
    {
      type: 0,
      func: () => setTheme(!theme),
      icon: "fas fa-adjust icon",
      text: "Change theme",
    },
    {
      type: 3,
      func: (e) => {
        if (e.target.tagName === "INPUT") setLive(!live);
      },
      checked: live,
      text: "Live preview",
    },
    {
      type: 3,
      func: (e) => {
        if (e.target.tagName === "INPUT") setWrap(!wrap);
      },
      checked: wrap,
      text: "Line Wrap",
    },
    {
      type: 0,
      func: () => setNav2Open(4),
      icon: "fa fa-table icon",
      text: "Editor Layout",
    },
  ];
  return (
    <div id="systemnavbar" class="systemnavbar no-scroll-bar">
      {data.map((item) => (
        <NavBtn {...item} />
      ))}
      <div className="settings" id="nav-btn">
        Settings
      </div>
      {data2.map((item) => (
        <NavBtn {...item} />
      ))}
    </div>
  );
};

const CopyCode = ({ copyCode }) => {
  const data = [
    {
      func: () => copyCode(0),
      icon: "far fa-clipboard icon",
      text: "Copy HTML",
    },
    {
      func: () => copyCode(1),
      icon: "far fa-clipboard icon",
      text: "Copy CSS",
    },
    {
      func: () => copyCode(2),
      icon: "far fa-clipboard icon",
      text: "Copy JS",
    },
    {
      func: () => copyCode(3),
      icon: "far fa-clipboard icon",
      text: "Copy the whole code as html file",
    },
  ];
  return (
    <div className="extratool" id="copy-tool">
      {data.map((item) => (
        <NavBtn type={0} {...item} />
      ))}
    </div>
  );
};

const FontSize = ({ fontSizeValue, setFontSizeValue }) => {
  return (
    <div className="extratool" id="fontsize-tool">
      <label htmlFor="font-input">font-size</label>
      <div className="rangecont">
        <input
          onChange={(e) => setFontSizeValue(e.target.value)}
          type="range"
          name="font-input"
          id="font-input"
          value={fontSizeValue}
          max={40}
          min={10}
        />
      </div>
      <span id="font-value">{fontSizeValue}px</span>
    </div>
  );
};

const FontFamily = ({ setFontFam, fontFam }) => {
  const data = [
    { value: "sans-serif" },
    { value: "monospace" },
    { value: "Times" },
    { value: "Arial" },
    { value: "Helvetica" },
    { value: "serif" },
    { value: "Verdana" },
  ];

  return (
    <div class="extratool" id="fontfam-tool">
      {data.map((item) => (
        <NavBtn
          type={1}
          func={(e) => setFontFam(e.target.value)}
          value={item.value}
          checked={fontFam === item.value}
          text={item.value}
        />
      ))}
    </div>
  );
};

const LayoutBtn = ({ value, name, layout, func, Layouts }) => {
  return (
    <label className="layout_cont">
      <input
        onChange={func}
        type="radio"
        value={value}
        id={value}
        name={name}
        checked={layout == value}
      />
      <img src={`images/layout_${value + 1}.png`} className="layout_radio" />
      <div className="back"></div>
      <span className="labeltxt">{Layouts[value]}</span>
    </label>
  );
};

const Layout = ({ setLayout, layout, Layouts }) => {
  const data = [
    { value: 0 },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ];
  return (
    <div id="layout-tool" className="extratool no-scroll-bar">
      {data.map((item) => (
        <LayoutBtn
          layout={layout}
          func={(e) => setLayout(e.target.value)}
          name="layout"
          value={item.value}
          Layouts={Layouts}
        />
      ))}
    </div>
  );
};

const Textarea = ({
  fontFam,
  fontSizeValue,
  wrap,
  placeholder,
  value,
  updateFunc,
}) => {
  return (
    <div className="pages" id="htmlinputcont">
      <iframe className="systemiframe"></iframe>
      <textarea
        placeholder={placeholder}
        autocomplete={true}
        spellcheck={false}
        value={value}
        onChange={(e) => updateFunc(e.target.value)}
        style={{
          fontSize: fontSizeValue + "px",
          fontFamily: fontFam,
          whiteSpace: wrap ? "normal" : "nowrap",
        }}
      ></textarea>
    </div>
  );
};

const App = () => {
  //   All State
  const [html, setHtml] = useLocalStorage(
    "html",
    `<!DOCTYPE html>
<html>
<head>
 <title> </title>
</head>
<body>
 
</body>
</html>`
  );
  const [css, setCss] = useLocalStorage("css", "");
  const [js, setJs] = useLocalStorage("js", "");
  const [layout, setLayout] = useLocalStorage("layout", 0);
  const [theme, setTheme] = useLocalStorage("live-theme", false);
  const [live, setLive] = useLocalStorage("live", false);
  const [wrap, setWrap] = useLocalStorage("wrap", false);
  const [fontSizeValue, setFontSizeValue] = useLocalStorage("font-size", 12);
  const [fontFam, setFontFam] = useLocalStorage("font-fam", "monospace");

  const Types = ["html", "css", "js"];
  const direction = [
    "column",
    "column",
    "row",
    "column-reverse",
    "row-reverse",
    "column",
  ];
  const Layouts = [
    "Full Page",
    "column",
    "row",
    "column-reverse",
    "row-reverse",
    "Four Column",
  ];

  const [navOpen, setNavOpen] = useState(false);
  const [editing, setEditing] = useState(0);
  const [nav2Open, setNav2Open] = useState(0);
  const [code, setCode] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);

  //   Functions

  function copyCode(type) {
    const allCodes = [html, css, js, code];
    navigator.clipboard
      .writeText(allCodes[type])
      .then(() => alert(`copied \n ${allCodes[type]}`));
  }

  const createCode = useCallback(() => {
    let headstart = html.indexOf("<head>") + 6;
    let bodystart = html.indexOf("<body>") + 6;
    let bodyend = html.lastIndexOf("</body>");
    return (
      html.slice(0, headstart) +
      `\n<style type="text/css" media="all">\n${css}\n</style>` +
      html.slice(headstart, bodystart) +
      html.slice(bodystart, bodyend) +
      `<script type="text/javascript" charset="utf-8">\n${js}\n</script>\n` +
      html.slice(bodyend)
    );
  }, [html, css, js]);

  //   useEffects

  useEffect(() => {
    if (document.fullscreenElement === null && isFullScreen)
      document.documentElement.requestFullscreen();
    if (document.fullscreenElement !== null && !isFullScreen)
      document.exitFullscreen();
  }, [isFullScreen]);

  useEffect(() => {
    setCode(createCode());

    document.addEventListener("click", (e) => {
      if (e.target.id !== "nav-btn") {
        setNavOpen(false);
      }
      if (e.target.id === "nav-close") {
        setNav2Open(0);
      }
    });
  }, []);

  useEffect(() => {
    if (live && layout != 0) {
      let timeout = setTimeout(() => {
        setCode(createCode());
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [html, css, js]);

  return (
    <div className={theme ? "lighttheme" : "darktheme"}>
      <Header
        {...{
          openNav: () => setNavOpen(true),
          run: () => setCode(createCode()),
          setEditing,
          editing,
          live,
          layout,
        }}
      />
      <div
        id="systeminputcont"
        class="systeminputcont"
        style={{
          flexDirection: direction[layout],
          display: layout == 5 ? "grid" : "flex",
        }}
      >
        {(layout == 0 ? editing !== 3 : true) && layout != 5 && (
          <Textarea
            fontFam={fontFam}
            fontSizeValue={fontSizeValue}
            wrap={wrap}
            placeholder={`write ${Types[editing]} here`}
            value={editing === 0 ? html : editing === 1 ? css : js}
            updateFunc={
              editing === 0 ? setHtml : editing === 1 ? setCss : setJs
            }
          />
        )}
        {layout == 5 && (
          <>
            <Textarea
              fontFam={fontFam}
              fontSizeValue={fontSizeValue}
              wrap={wrap}
              placeholder={`write ${Types[0]} here`}
              value={html}
              updateFunc={setHtml}
            />
            <Textarea
              fontFam={fontFam}
              fontSizeValue={fontSizeValue}
              wrap={wrap}
              placeholder={`write ${Types[1]} here`}
              value={css}
              updateFunc={setCss}
            />
            <Textarea
              fontFam={fontFam}
              fontSizeValue={fontSizeValue}
              wrap={wrap}
              placeholder={`write ${Types[2]} here`}
              value={js}
              updateFunc={setJs}
            />
          </>
        )}
        {(editing === 3 || layout != 0) && (
          <div className="pages">
            <iframe className="systemiframe" srcdoc={code}></iframe>
          </div>
        )}
      </div>
      {navOpen && (
        <NavBar
          {...{
            setLive,
            live,
            setWrap,
            wrap,
            setTheme,
            theme,
            setNav2Open,
            isFullScreen,
            setIsFullScreen,
          }}
        />
      )}
      {nav2Open !== 0 && (
        <div className="extracont" id="nav-close">
          {nav2Open === 1 && <CopyCode copyCode={copyCode} />}
          {nav2Open === 2 && (
            <FontSize {...{ fontSizeValue, setFontSizeValue }} />
          )}
          {nav2Open === 3 && (
            <FontFamily setFontFam={setFontFam} fontFam={fontFam} />
          )}
          {nav2Open === 4 && (
            <Layout setLayout={setLayout} layout={layout} Layouts={Layouts} />
          )}
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
