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

const Note = ({
  showLinks,
  note,
  handleEdit,
  handleDelete,
  setEditing,
  editing,
}) => {
  const { id, completed } = note;
  return (
    <div className={note.new ? "note enter-anim" : "note"} key={id}>
      <button
        title={completed ? "Mark as not done" : "Mark as done"}
        onClick={() => handleEdit(id)}
        class={`button mark${completed ? " completed" : ""}`}
      >
        {completed ? "✕" : "✓"}
      </button>
      <p>
        {note.body.map((content) => {
          if (showLinks) {
            if (content.type === "text") return <>{content.body}</>;
            else {
              return (
                <a
                  href={content.link}
                  title={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content.body}
                </a>
              );
            }
          } else return <>{content.body}</>;
        })}
      </p>
      <button
        onClick={
          editing === id ? () => setEditing(false) : () => setEditing(id)
        }
        className={`button edit${editing === id ? " editing" : ""}`}
        title={editing === id ? "Stop editing" : "Edit"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 490.273 490.273"
        >
          <g>
            <path
              d="M313.548,152.387l-230.8,230.9c-6.7,6.7-6.7,17.6,0,24.3c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5l230.8-230.8
				c6.7-6.7,6.7-17.6,0-24.3C331.148,145.687,320.248,145.687,313.548,152.387z"
            ></path>
            <path
              d="M431.148,191.887c4.4,0,8.8-1.7,12.1-5l25.2-25.2c29.1-29.1,29.1-76.4,0-105.4l-34.4-34.4
				c-14.1-14.1-32.8-21.8-52.7-21.8c-19.9,0-38.6,7.8-52.7,21.8l-25.2,25.2c-6.7,6.7-6.7,17.6,0,24.3l115.6,115.6
				C422.348,190.187,426.748,191.887,431.148,191.887z M352.948,45.987c7.6-7.6,17.7-11.8,28.5-11.8c10.7,0,20.9,4.2,28.5,11.8
				l34.4,34.4c15.7,15.7,15.7,41.2,0,56.9l-13.2,13.2l-91.4-91.4L352.948,45.987z"
            ></path>
            <path
              d="M162.848,467.187l243.5-243.5c6.7-6.7,6.7-17.6,0-24.3s-17.6-6.7-24.3,0l-239.3,239.5l-105.6,14.2l14.2-105.6
				l228.6-228.6c6.7-6.7,6.7-17.6,0-24.3c-6.7-6.7-17.6-6.7-24.3,0l-232.6,232.8c-2.7,2.7-4.4,6.1-4.9,9.8l-18,133.6
				c-0.7,5.3,1.1,10.6,4.9,14.4c3.2,3.2,7.6,5,12.1,5c0.8,0,1.5-0.1,2.3-0.2l133.6-18
				C156.748,471.587,160.248,469.887,162.848,467.187z"
            ></path>
          </g>
        </svg>
      </button>
      <button
        onClick={(e) => handleDelete(e, id)}
        className="button delete"
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
  const [undo, setUndo] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showLinks, setshowLinks] = useState(true);
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
    if (undo !== false) {
      setTimeout(() => setUndo(false), 5000);
    }
  }, [undo]);

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

  const stringToArray = useCallback((text) => {
    let body = [];
    const matches = text.match(
      /(https?\:\/\/)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm
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
    return body;
  }, []);

  const arrayToString = useCallback((arr) => {
    let text = "";
    arr.forEach((i) => (text += i.body));
    return text;
  }, []);

  useEffect(() => {
    if (editing) {
      setnewNote(arrayToString(notes.find((i) => i.id === editing).body));
    } else {
      setnewNote("");
    }
  }, [editing]);

  const saveEditedNote = useCallback(() => {
    if (isNote) {
      setnotes(
        notes.map((i) => {
          if (i.id === editing) {
            return {
              ...i,
              body: stringToArray(newNote),
            };
          }
          return i;
        })
      );
      setEditing(false);
      textarea.current.focus();
    } else return;
  }, [isNote, newNote]);

  const saveNewNote = useCallback(() => {
    if (isNote) {
      setnotes([
        {
          id: new Date().getTime(),
          body: stringToArray(newNote.trim()),
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
        setUndo(notes);
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
        if (editing) saveEditedNote();
        else saveNewNote();
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

      <div
        className={nav ? "nav-cont nav-cont-show" : "nav-cont"}
        onClick={(e) => {
          if (e.target.id === "nav-cont") setnav(false);
        }}
        id="nav-cont"
      >
        <div className={nav ? "nav nav-show" : "nav"}>
          <button onClick={() => setEnterSend(!EnterSend)}>
            'Enter' key is save {EnterSend && "✓"}
          </button>
          <button onClick={() => setshowLinks(!showLinks)}>
            Show Url's as Links {showLinks && "✓"}
          </button>
          <button onClick={() => settheme(!theme)}>
            Dark theme {!theme && "✓"}
          </button>
          <button onClick={removeall}>Delete All Notes</button>
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
          onClick={editing ? saveEditedNote : saveNewNote}
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
              showLinks={showLinks}
              note={item}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              setEditing={setEditing}
              editing={editing}
            />
          ))
        ) : (
          <div className="nonotes">No Saved Notes ☹️</div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, rootElement);
