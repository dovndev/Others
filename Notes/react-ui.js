const { useEffect, useState, useCallback, useRef } = React;
const rootElement = document.getElementById("root");
const metaElements = document.getElementsByTagName("meta");

const { STORE_KEYS, ACTIONS, META_LIST } = window.APP;

const stringToArray = (text) => {
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
};

const arrayToString = (arr) => {
  let text = "";
  arr.forEach((i) => (text += i.body));
  return text;
};

const useLocalStorage = (key, initialvalue, stale) => {
  const [staled, setStaled] = stale;

  const load = () => {
    const savedvalue = JSON.parse(localStorage.getItem(key));
    if (savedvalue !== null) return savedvalue;
    return initialvalue;
  };

  const [value, setvalue] = useState(load());

  const refresh = () => setvalue(load());

  useEffect(() => {
    if (staled === key) refresh();
  }, [staled]);

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem(key))) {
      if (staled === "") {
        localStorage.setItem(key, JSON.stringify(value));
        window.APP.sendMessage({ action: ACTIONS.RELOAD_DATA, key });
      } else setStaled("");
    } else sessionStorage.setItem(key, true);
  }, [value]);

  return [value, setvalue, refresh];
};

const Note = ({
  showLinks,
  note,
  handleEdit,
  handleDelete,
  setEditing,
  editing,
  setAlert,
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
      <p
        title="Double click to copy note"
        onDoubleClick={async () => {
          await window.APP.copyToClipBoard(arrayToString(note.body));
          setAlert("Copied note ✓");
        }}
      >
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
        <img src="/Others/Notes/icons/pen.svg" />
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
  const stale = useState("");
  const [staled, setStaled] = stale;
  const [notes, setNotes] = useLocalStorage(STORE_KEYS.NOTES, [], stale);
  const [theme, setTheme] = useLocalStorage(STORE_KEYS.THEME, false, stale);
  const [newNote, setNewNote] = useLocalStorage(STORE_KEYS.NEWNOTE, "", stale);
  const [enterSend, setEnterSend] = useLocalStorage(
    STORE_KEYS.ENTERSEND,
    false,
    stale
  );
  const [isNote, setIsNote] = useState(false);
  const [alert, setAlert] = useState("");
  const [undo, setUndo] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showLinks, setShowLinks] = useState(true);
  const [nav, setNav] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [version, setVersion] = useState(0);
  const [updating, setUpdating] = useState(false);
  const textarea = useRef();
  const undoTimeoutRef = useRef();

  useEffect(async () => {
    textarea.current.focus();
    window.APP.init()
      .then((reg) => {
        navigator.serviceWorker.addEventListener("message", (event) => {
          switch (event.data.action) {
            case ACTIONS.RELOAD_DATA: {
              setStaled(event.data.key);
              break;
            }
            case ACTIONS.UPDATE_AVAILABLE: {
              if (window.APP.newServiceWorker) setUpdateAvailable(true);
              break;
            }
            case ACTIONS.REINSTALL: {
              localStorage.removeItem("notFirst");
              window.APP.registration
                .unregister()
                .then(() => window.location.reload());
              break;
            }
            case ACTIONS.VERSION: {
              setVersion(event.data.version);
              break;
            }
          }
        });
        return reg;
      })
      .then((reg) => {
        window.APP.sendMessage({ action: ACTIONS.VERSION });
      });
  }, []);

  useEffect(() => {
    setIsNote(!/^\s*$/g.test(newNote));
    updateInputSize();
  }, [newNote]);

  useEffect(() => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    if (undo === false) undoTimeoutRef.current = false;
    else undoTimeoutRef.current = setTimeout(() => setUndo(false), 5000);
  }, [undo]);

  useEffect(() => {
    if (alert !== "") setTimeout(() => setAlert(""), 3000);
  }, [alert]);

  useEffect(() => {
    if (!nav) document.activeElement.blur();
  }, [nav]);

  useEffect(() => {
    const themeColor = theme ? "#1976d2" : "#161b22";
    if (theme) rootElement.classList.remove("dark");
    else rootElement.classList.add("dark");
    for (let i = 0; i < metaElements.length; i++) {
      if (META_LIST.includes(metaElements[i].name)) {
        metaElements[i].content = themeColor;
      }
    }
  }, [theme]);

  useEffect(() => {
    setTimeout(() => {
      if (notes.some((i) => i.new === true)) {
        setNotes(
          notes.map((i) => {
            if (i.new) return { ...i, new: undefined };
            return i;
          })
        );
      }
    }, 400);
  }, [notes]);

  const SetNotes = useCallback(
    (newNotes, undoText) => {
      const oldNotes = notes;
      setUndo({ text: undoText, func: () => setNotes(oldNotes) });
      setNotes(newNotes);
    },
    [notes]
  );

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

  useEffect(() => {
    if (editing) {
      setNewNote(arrayToString(notes.find((i) => i.id === editing).body));
    } else {
      setNewNote("");
    }
  }, [editing]);

  const saveEditedNote = useCallback(() => {
    if (isNote) {
      setNotes(
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
      setAlert("Note edited");
      textarea.current.focus();
    } else return;
  }, [isNote, newNote, textarea.current, notes]);

  const saveNewNote = useCallback(() => {
    if (isNote) {
      setNotes([
        {
          id: new Date().getTime(),
          body: stringToArray(newNote.trim()),
          completed: false,
          new: true,
        },
        ...notes,
      ]);
      setNewNote("");
      textarea.current.focus();
    } else return;
  }, [isNote, newNote, textarea.current, notes]);

  const handleDelete = useCallback(
    (e, id) => {
      e.target.parentNode.classList.add("delete-anim");
      if (editing === id) setEditing(false);
      setTimeout(() => {
        SetNotes(
          notes.filter((note) => note.id !== id),
          "Note deleted"
        );
      }, 500);
    },
    [notes, editing, undoTimeoutRef.current, SetNotes]
  );

  const handleEdit = useCallback(
    (id) => {
      const Newnotes = notes.map((item) => {
        if (item.id === id) {
          item.completed = !item.completed;
          return item;
        } else return item;
      });
      setNotes(Newnotes);
    },
    [notes]
  );

  const handleChange = useCallback(
    (e) => {
      if (
        enterSend &&
        e.target.value.slice(0, textarea.current.selectionStart).slice(-1) ===
          "\n"
      ) {
        if (editing) saveEditedNote();
        else saveNewNote();
      } else setNewNote(e.target.value);
    },
    [enterSend, textarea.current, saveNewNote, saveEditedNote, editing]
  );

  const removeall = useCallback(() => {
    if (confirm("Delete All Notes")) {
      SetNotes([], "Deleted all Notes");
      setNav(false);
    }
  }, [SetNotes]);

  const reInstall = useCallback(() => {
    if (confirm("Reinstall Notebook")) {
      window.APP.sendMessage({
        action: window.APP.ACTIONS.REINSTALL,
      });
    }
  }, []);

  if (updating) return <span class="preloader">Updating</span>;
  else {
    return (
      <div className={theme ? "html" : "html dark"}>
        <div className="header-cont">
          <div className="header">
            <p>Notebook</p>
            <button onClick={() => setNav(!nav)} title="Menu">
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
            if (e.target.id === "nav-cont") setNav(false);
          }}
          id="nav-cont"
        >
          <div className={nav ? "nav nav-show" : "nav"}>
            <button onClick={() => setEnterSend(!enterSend)}>
              'Enter' key is save {enterSend && "✓"}
            </button>
            <button onClick={() => setShowLinks(!showLinks)}>
              Show Url's as Links {showLinks && "✓"}
            </button>
            <button onClick={() => setTheme(!theme)}>
              Dark theme {!theme && "✓"}
            </button>
            <button onClick={removeall}>Delete All Notes</button>
            <button onClick={reInstall}>Reinstall Notebook</button>
            <p className="about">version : {version}</p>
            <p className="about">dev : JP</p>
          </div>
        </div>

        <div className="popup-cont">
          {alert !== "" && (
            <div className="popup">
              <span>{alert}</span>
            </div>
          )}

          {undo.func && (
            <div className="popup">
              <span>{undo.text}</span>
              <button
                onClick={() => {
                  undo.func();
                  setUndo(false);
                }}
              >
                undo
              </button>
            </div>
          )}

          {updateAvailable && (
            <div className="popup">
              <span>Update available for Notebook</span>
              <button
                onClick={() => {
                  setUpdating(true);
                  window.APP.sendMessage(
                    { action: ACTIONS.UPDATE },
                    window.APP.newServiceWorker
                  );
                }}
              >
                update
              </button>
            </div>
          )}
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
                setAlert={setAlert}
              />
            ))
          ) : (
            <div className="nonotes">No Saved Notes ☹️</div>
          )}
        </div>
      </div>
    );
  }
};

ReactDOM.render(<App />, rootElement);
