const useEffect = React.useEffect;
const useState = React.useState;
const useCallback = React.useCallback;
const useRef = React.useRef;

const useLocalStorage = (key, initialvalue) => {
  const [value, setvalue] = useState(initialvalue);
  useEffect(() => {
    const savedvalue = JSON.parse(localStorage.getItem(key));
    if (savedvalue != null) setvalue(savedvalue);
  }, []);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setvalue];
};

const Mapper = ({ notes, handledelete, HandleEdit }) => {
  if (notes.length !== 0) {
    return notes.map((item) => {
      return (
        <div className="notes" key={item.id}>
          <button
            onClick={e => HandleEdit(item.id)}
            class={`delete edit${item.completed ? ' completed':''}`}
            style={{fontSize: `${item.completed ? 24 : 30}px`}}
          >
            {item.completed ? '\u2715' : '\u2713'}
          </button>
          <p>
            {item.body.map((line) => (
              <div class="line">{line}</div>
            ))}
          </p>
          <button onClick={(e) => handledelete(e, item.id)} className="delete">
            &times;
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

  function CheckIsNote() {
    setisNote(!/^\s*$/g.test(newNote));
  }

  const updateInputSize = useCallback(() => {
    const el = textarea.current;
    el.style.height = "25px";
    el.style.height = el.scrollHeight + "px";
    el.style.overflowY = el.scrollHeight < 130 ? "hidden" : "auto";
  }, [newNote]);

  const saveNote = useCallback(() => {
    if (!/^\s*$/g.test(newNote)) {
      setnotes([
        {
          id: new Date().getTime(),
          body: newNote.trim().split(/\n/g),
          completed: false
        },
        ...notes,
      ]);
      setnewNote("");
    } else return;
  }, [isNote, newNote]);

  const handledelete = useCallback(
    (e, id) => {
      e.target.parentNode.classList.add("delete-anim");

      setTimeout(() => {
        setnotes(notes.filter((note) => note.id !== id));
      }, 300);
    },
    [notes]
  );

  const HandleEdit = useCallback((id) => {
    const Newnotes = notes.map(item => {
      if (item.id === id) {
        item.completed = !item.completed;
        return item;
      }else return item;
    });
    setnotes(Newnotes);
  }, [notes])

  const removeall = useCallback(() => {
    if (confirm(`Delete All Notes`)) {
      setnotes([]);
    } else {
      return;
    }
  }, []);

  const handleEnter = useCallback(() => {
    if (confirm(`Enter Key Will${EnterSend ? " Not" : ""} Save Your Note`)) {
      setEnterSend(!EnterSend);
    } else {
      return;
    }
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
      <div className="header">
        <p>Notebook</p>
        <span onClick={handleNav}>&#9776;</span>
      </div>
      <div className="form" onSubmit={saveNote}>
        <textarea
          className={isNote ? "textarea" : "notextarea"}
          rows={1}
          ref={textarea}
          placeholder="Type a note"
          value={newNote}
          onChange={(e) => handlechange(e)}
        ></textarea>
        <button onClick={saveNote} className={isNote ? "save" : "nosave"}>
          <span>save</span>
        </button>
      </div>

      <div className="container">
        {notes && <Mapper notes={notes} handledelete={handledelete} HandleEdit={HandleEdit} />}
      </div>

      <div className="nav-cont" onClick={handleNav} style={{display: nav ? "block" : "none"}}></div>

      <div className="nav" style={{display: nav ? "block" : "none"}}>
        <div onClick={handleEnter}>Enter is save</div>
        <div onClick={() => settheme(!theme)}>Theme</div>
        <div onClick={removeall}>Clear storage</div>
      </div>

    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
