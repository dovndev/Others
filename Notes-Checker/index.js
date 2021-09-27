const useEffect = React.useEffect;
const useState = React.useState;
const useCallback = React.useCallback;
const useRef = React.useRef

const useLocalStorage = (key, initialvalue) => {
  const [value, setvalue] = useState(initialvalue);
  useEffect(() => {
    const savedvalue = JSON.parse(localStorage.getItem(key));
    if (savedvalue != null) setvalue(savedvalue);
  }, [])
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
    console.log('ran')
  }, [value]);
  
  return [value, setvalue];
}


const Mapper = ({ notes, Addednote, handledelete/* , handleEdit*/ }) => {
  if (notes.length !== 0) {
    return notes.map((item, index) => {
      return (<div ref={(notes.length - 1 === index) ? Addednote : null } className="notes" key={item.id}>
        <span className="num">{ index + 1 }</span>
        <p>{item.body.map((line) => (
          <div class="line">{line}</div>
        ))}</p>
        <form className="check">
          <input type="checkbox" /*checked={item.checked} onChange={(e) => handleEdit(item.id)}*//>
        </form>
        <button onClick={e => handledelete(e, item.id)} className="delete">&times;</button>
      </div>
      )
    })
  }else {
    return <div className="nonotes">No Saved Notes</div>;
  }
}

const App = () => {
  const [notes, setnotes] = useLocalStorage('notes-checker', []);
  const [theme, settheme] = useLocalStorage('theme-checker', true);
  const [newNote, setnewNote] = useState('');
  const [EnterSend, setEnterSend] = useLocalStorage('EnterSend-checker', false);
  const [isNote, setisNote] = useState(true);
  const [nav, setnav] = useState(false);
  const textarea = useRef();
  const Addednote = useCallback((node) => {
    if (node) {
      node.scrollIntoView();
      node.classList.add('show');
      setTimeout(() => {
        node.classList.remove('show');
      }, 800);
    }
  },[])
  
  useEffect(() => {
    textarea.current.focus();
  }, []);

  
  useEffect(() => {
    CheckIsNote();
    updateInputSize();
  }, [newNote]);
  
  function CheckIsNote() {
    let check = /^\s*$/g.test(newNote);
    setisNote(!check);
  }
  
  const updateInputSize = useCallback(() => {
    const el = textarea.current;
    el.style.height = '25px';
    el.style.height = el.scrollHeight + 'px';
    el.style.overflowY = (el.scrollHeight < 130) ? 'hidden' : 'auto';
  },[newNote])
  
  const saveNote = useCallback(() => {
    if (isNote) {
      setnotes([...notes, {
        id: new Date().getTime(),
        body: newNote.trim().split(/\n/g),
        checked: false
      }]);
      setnewNote('');
    }else return;
  }, [isNote, newNote])
  
    const handledelete = useCallback((e, id) => {
      e.target.parentNode.classList.add('delete-anim');
      
      setTimeout(() => {
        setnotes(notes.filter(note => note.id !== id));
      }, 300);
    }, [notes])

    const removeall = useCallback(() => {
      if (confirm(`delete all notes from storage`)) {
          setnotes([]);
      } else {
      return;
    }
  }, [])

  // const handleEdit = useCallback((id) => {
  //   const index = notes.indexOf(notes.find((i) => i.id === id));
  //   let newNotes = notes;
  //   newNotes[index].checked = true;
  //   console.log(newNotes)
  //   setnotes(newNotes);
  // }, [notes])
  
  const handleEnter = useCallback(() => {
    let text = EnterSend ? 'Enter key will not save note' : 'Enter key will save note';
    if (confirm(text)) {
      setEnterSend(!EnterSend);
    } else {
      return;
    }
  }, [EnterSend])
  
  const handlechange = useCallback((e) => {
    if (EnterSend) {
      let i = 0; 
      let j = 0;
      let difference = "";
      while (j < e.target.value.length){
        if (newNote[i] !== e.target.value[j] || i === newNote.length) difference += e.target.value[j];
        else i++;
        j++;
      }
      if (difference === '\n') saveNote();
      else setnewNote(e.target.value);
    }
    else setnewNote(e.target.value);
  }, [EnterSend, newNote])
  
  function handleNav() {
    setnav(!nav);
  }
  
  return (
    <div className={theme ? 'html' : 'html dark'}>
      <div className="header">
        <p>Notebook</p>
        <i onClick={handleNav} className="fa fa-bars"></i>
      </div>
      <div className="form" onSubmit={saveNote}>
        <textarea className={isNote ? "textarea" : "notextarea"} rows={1} ref={textarea} placeholder="Type a note" value={newNote}
        onChange={(e) => handlechange(e)}></textarea>
        <button onClick={saveNote} className={isNote ? "save": "nosave"}><span>save</span></button>
      </div>

      <div className="container">
       {notes &&
        <Mapper notes={notes} Addednote={Addednote} handledelete={handledelete} /*handleEdit={handleEdit}*/ />
       }
      </div>
      {nav && 
      <>
        <div className="nav-cont" onClick={handleNav}></div>
        <div className="nav">
          <div onClick={handleEnter}>Enter is save</div>
          <div onClick={() => settheme(!theme)}>Theme</div>
          <div onClick={removeall}>Clear storage</div>
        </div>
      </>
      }
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
  
  
