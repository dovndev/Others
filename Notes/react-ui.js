const { useEffect, useState, useCallback, useRef } = React;
const rootElement = document.getElementById("root");
const metaElements = document.getElementsByTagName("meta");

const metaList = [
  "theme-color",
  "msapplication-TileColor",
  "apple-mobile-web-app-status-bar",
  "msapplication-navbutton-color",
  "mask-icon",
];

const useLocalStorage = (key, initialvalue) => {
  const [value, setvalue] = useState(() => {
    const savedvalue = JSON.parse(localStorage.getItem(key));
    return savedvalue || initialvalue;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, 1000);
    return clearTimeout(timeout);
  }, [value]);

  return [value, setvalue];
};

const Mapper = ({ notes, handledelete, HandleEdit }) => {
  if (notes.length !== 0) {
    return notes.map((item) => {
      return (
        <div className="notes" key={item.id}>
          <button
            onClick={(e) => HandleEdit(item.id)}
            class={`delete edit${item.completed ? " completed" : ""}`}
          >
            {item.completed ? "✕" : "✓"}
          </button>
          <p>
            {item.body.map((line) => (
              <div class="line">{line}</div>
            ))}
          </p>
          <button onClick={(e) => handledelete(e, item.id)} className="delete">
            ✕
          </button>
        </div>
      );
    });
  } else {
    return <div className="nonotes">No Saved Notes</div>;
  }
};

const App = () => {
  const [notes, setnotes] = useLocalStorage("Notes-React", []);
  const [theme, settheme] = useLocalStorage("Theme-React", true);
  const [newNote, setnewNote] = useLocalStorage("NewNote-React", "");
  const [EnterSend, setEnterSend] = useLocalStorage("EnterSend-React", false);
  const [isNote, setisNote] = useState(true);
  const [nav, setnav] = useState(false);
  const textarea = useRef();

  useEffect(() => {
    textarea.current.focus();
  }, []);

  useEffect(() => {
    CheckIsNote();
    updateInputSize();
  }, [newNote]);

  useEffect(() => {
    const themeColor = theme ? "#1976d2" : "#161b22";
    if (theme) rootElement.classList.remove("dark");
    else rootElement.classList.add("dark");
    for (let i = 0; i < metaElements.length; i++) {
      if (metaList.includes(metaElements[i].name)) {
        metaElements[i].content = themeColor;
      }
    }
  }, [theme]);

  function CheckIsNote() {
    setisNote(!/^\s*$/g.test(newNote));
  }

  const updateInputSize = useCallback(() => {
    const el = textarea.current;
    if (
      el.style.height.slice(0, -2) == el.scrollHeight ||
      el.scrollHeight > 170
    )
      return;
    el.style.height = "50px";
    el.style.height = el.scrollHeight + "px";
    el.style.overflowY = el.scrollHeight < 170 ? "hidden" : "auto";
  }, [newNote]);

  const saveNote = useCallback(() => {
    if (!/^\s*$/g.test(newNote)) {
      setnotes([
        {
          id: new Date().getTime(),
          body: newNote.trim().split(/\n/g),
          completed: false,
        },
        ...notes,
      ]);
      setnewNote("");
      textarea.current.focus();
    } else return;
  }, [isNote, newNote]);

  const handledelete = useCallback(
    (e, id) => {
      e.target.parentNode.classList.add("delete-anim");

      setTimeout(() => {
        setnotes(notes.filter((note) => note.id !== id));
      }, 500);
    },
    [notes]
  );

  const HandleEdit = useCallback(
    (id) => {
      const Newnotes = notes.map((item) => {
        if (item.id === id) {
          item.completed = !item.completed;
          return item;
        } else return item;
      });
      setnotes(Newnotes);
    },
    [notes]
  );

  const removeall = useCallback(() => {
    if (!confirm(`Delete All Notes`)) return;
    setnotes([]);
  }, []);

  const handleEnter = useCallback(() => {
    if (confirm(`Enter Key Will${EnterSend ? " Not" : ""} Save Your Note`))
      return;
    setEnterSend(!EnterSend);
  }, [EnterSend]);

  const handlechange = useCallback(
    (e) => {
      if (EnterSend) {
        let i = 0;
        let j = 0;
        let difference = "";
        while (j < e.target.value.length) {
          if (newNote[i] !== e.target.value[j] || i === newNote.length)
            difference += e.target.value[j];
          else i++;
          j++;
        }
        if (difference === "\n") saveNote();
        else setnewNote(e.target.value);
      } else setnewNote(e.target.value);
    },
    [EnterSend, newNote]
  );

  function handleNav() {
    setnav(!nav);
  }

  return (
    <div className={theme ? "html" : "html dark"}>
      <div className="header-cont">
        <div className="header">
          <p>Notebook</p>
          <span onClick={handleNav}>
            <svg viewBox="0 0 24 24">
              <path
                fill="white"
                d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
              ></path>
            </svg>
          </span>
        </div>
      </div>
      <div className="form" onSubmit={saveNote}>
        <textarea
          className={isNote ? "textarea" : "notextarea"}
          rows={1}
          ref={textarea}
          value={newNote}
          onChange={(e) => handlechange(e)}
        ></textarea>
        <span className="placeholder">Type a note</span>
        <button onClick={saveNote} className={isNote ? "save" : "nosave"}>
          <span>save</span>
        </button>
      </div>

      <div className="container">
        {notes && (
          <Mapper
            notes={notes}
            handledelete={handledelete}
            HandleEdit={HandleEdit}
          />
        )}
      </div>

      <div
        className={nav ? "nav-cont nav-cont-show" : "nav-cont"}
        onClick={handleNav}
      ></div>

      <div className={nav ? "nav nav-show" : "nav"}>
        <div onClick={handleEnter}>Enter is save</div>
        <div onClick={() => settheme(!theme)}>Theme</div>
        <div onClick={removeall}>Delete All Notes</div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, rootElement);
