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
    if (savedvalue !== null) return savedvalue;
    return initialvalue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setvalue];
};

const Note = ({ note, handleEdit, handleDelete }) => {
  const { id, completed } = note;
  return (
    <div className={note.new ? "note enter-anim" : "note"} key={id}>
      <button
        title={completed ? "Mark as not done" : "Mark as done"}
        onClick={() => handleEdit(id)}
        class={`delete edit${completed ? " completed" : ""}`}
      >
        {completed ? "✕" : "✓"}
      </button>
      <p>
        {note.body.map((content) =>
          content.type === "text" ? (
            <>{content.body}</>
          ) : (
            <a
              href={content.link}
              title={content.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.body}
            </a>
          )
        )}
      </p>
      <button
        onClick={(e) => handleDelete(e, id)}
        className="delete"
        title="Delete"
      >
        ✕
      </button>
    </div>
  );
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
    setisNote(!/^\s*$/g.test(newNote));
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

  useEffect(() => {
    setTimeout(() => {
      if (notes.some((i) => i.new === true)) {
        setnotes(
          notes.map((i) => {
            if (i.new) return { ...i, new: undefined };
            return i;
          })
        );
      }
    }, 400);
  }, [notes]);

  const updateInputSize = useCallback(() => {
    const el = textarea.current;
    if (
      el.style.height.slice(0, -2) == el.scrollHeight ||
      (el.scrollHeight > 170
        ? el.style.height.slice(0, -2) === 170
          ? true
          : false
        : false)
    )
      return;
    el.style.height = "50px";
    el.style.height = el.scrollHeight + "px";
    el.style.overflowY = el.scrollHeight < 170 ? "hidden" : "auto";
  }, [textarea.current]);

  const saveNote = useCallback(() => {
    if (!/^\s*$/g.test(newNote)) {
      let body = [];
      let text = newNote.trim();
      const matches = text.match(
        /(https?\:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm
      );
      if (matches) {
        matches.forEach((match) => {
          const pos = text.indexOf(match);
          if (pos !== 0) body.push({ type: "text", body: text.slice(0, pos) });
          body.push({
            type: "link",
            link: match.includes("http") ? match : `http://${match}`,
            body: match,
          });
          text = text.slice(pos + match.length);
        });
        if (text.length !== 0) body.push({ type: "text", body: text });
      } else {
        body.push({ type: "text", body: text });
      }
      setnotes([
        {
          id: new Date().getTime(),
          body,
          completed: false,
          new: true,
        },
        ...notes,
      ]);
      setnewNote("");
      textarea.current.focus();
    } else return;
  }, [isNote, newNote]);

  const handleDelete = useCallback(
    (e, id) => {
      e.target.parentNode.classList.add("delete-anim");

      setTimeout(() => {
        setnotes(notes.filter((note) => note.id !== id));
      }, 500);
    },
    [notes]
  );

  const handleEdit = useCallback(
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

  const handleChange = useCallback(
    (e) => {
      if (
        EnterSend &&
        e.target.value.slice(0, textarea.current.selectionStart).slice(-1) ===
          "\n"
      ) {
        saveNote();
      } else setnewNote(e.target.value);
    },
    [EnterSend, textarea.current, saveNote]
  );

  const removeall = useCallback(() => {
    if (!confirm(`Delete All Notes`)) return;
    setnotes([]);
  }, []);

  return (
    <div className={theme ? "html" : "html dark"}>
      <div className="header-cont">
        <div className="header">
          <p>Notebook</p>
          <button onClick={() => setnav(!nav)} title="Menu">
            <svg viewBox="0 0 24 24">
              <path
                fill="white"
                d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="form">
        <textarea
          title="Type a note"
          className={isNote ? "textarea" : "notextarea"}
          rows={1}
          ref={textarea}
          value={newNote}
          onChange={handleChange}
        ></textarea>
        <span className="placeholder">Type a note</span>
        <button
          title="Save Note"
          onClick={saveNote}
          className={isNote ? "save" : "nosave"}
          tabIndex={isNote ? 0 : -1}
        >
          save
        </button>
      </div>

      <div className="container">
        {notes && notes.length !== 0 ? (
          notes.map((item) => (
            <Note
              note={item}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="nonotes">No Saved Notes ☹️</div>
        )}
      </div>
      <div
        className={nav ? "nav-cont nav-cont-show" : "nav-cont"}
        onClick={(e) => {
          if (e.target.id === "nav-cont") setnav(false);
        }}
        id="nav-cont"
      >
        <div className={nav ? "nav nav-show" : "nav"}>
          <button onClick={() => setEnterSend(!EnterSend)}>
            'Enter' is{EnterSend ? "" : " not"} save
          </button>
          <button onClick={() => settheme(!theme)}>Theme</button>
          <button onClick={removeall}>Delete All Notes</button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, rootElement);
