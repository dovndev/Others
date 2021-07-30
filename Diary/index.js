const useEffect = React.useEffect;
const useState = React.useState;

const useLocalStorage = (key, initialvalue) => {
  const [value, setvalue] = useState(initialvalue);
  useEffect(() => {
    const savedvalue = JSON.parse(localStorage.getItem(key));
    if (savedvalue != null) setvalue(savedvalue);
  }, [])
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);
  
  return [value, setvalue];
}


const Mapper = ({ diaryPage, data, handledelete }) => {
  if (data.length !== 0) {
    if (diaryPage) {
    return data.map((item, index) => (
      <div className="notes" key={item.id}>
        <span className="num">{ index + 1 }</span>
        <p>{item.body}</p>
        <button onClick={e => handledelete(e, item.id)} className="delete">&times;</button>
      </div>
    ))
    }else {
      return data.map((item, index) => (
        <div key={item.id} className={
        index === data.length - 1 ? 'tables': 'tables last'}>
          <div>{item.time}</div>
          <p>{item.body}</p>
          <i onClick={e => handledelete(e, item.id)}  className="fa fa-trash"></i>
        </div>
      ))
    }
  }else {
    return <div className="nonotes">No Saved {diaryPage ? 'notes': 'events'}</div>;
  }
}


const Header = ({ diaryTheme, handletheme, diaryPage, handlepage }) => {
  return (
    <div className="header">
      <p>{diaryPage ? 'Notebook': 'Time-Table'}</p>
      {!diaryPage && <i onClick={handletheme} className="fa fa-play"></i>
      }
      <i onClick={handletheme} className={diaryTheme ? 'fa fa-moon': 'fa fa-sun'}></i>
      <i onClick={handlepage} className={diaryPage ? 'fa fa-th-list': 'fa fa-sticky-note'}></i>
    </div>
  );
}

const App = () => {
  const [diaryNotes, setdiaryNotes] = useLocalStorage('diaryNotes', []);
  const [diaryTable, setdiaryTable] = useLocalStorage('diaryTable', []);
  const [diaryPage, setdiaryPage] = useLocalStorage('diaryPage', true);
  const [diaryTheme, setdiaryTheme] = useLocalStorage('diaryTheme', true);
  const [newNote, setnewNote] = useState('');
  const [newTable, setnewTable] = useState('');
  const [newTime, setnewTime] = useState('');
  
  const saveitem = (e) => {
    e.preventDefault();
    const pattern = /^\s*$/g;
    if (diaryPage) {
      if (pattern.test(newNote)) {
        alert('please write something');
      }else {
        setdiaryNotes([...diaryNotes, {
          id: new Date().getTime(),
          body: newNote
        }]);
        setnewNote('');
      }
    }else {
      if (pattern.test(newTable)) {
        alert('please write something');
      }else if (newTime === '') {
        alert('please enter time');
      }else {
        setdiaryTable([...diaryTable, {
          id: new Date().getTime(),
          body: newTable,
          time: newTime
        }])
      }
      setnewTime('');
      setnewTable('');
    }
    
  }

  const handledelete = (e, id) => {
    e.target.parentNode.classList.add('delete-anim');
    
    setTimeout(() => {
      if (diaryPage) {
        setdiaryNotes(diaryNotes.filter(note => note.id !== id));
      }else {
        setdiaryTable(diaryTable.filter(table => table.id !== id))
      }
    }, 300);
  }

  const removeall = () => {
    if (confirm(`delete all ${diaryPage ? 'notes': 'items'} from storage`)) {
      if (diaryPage) {
        setdiaryNotes([]);
      }else {
        setdiaryTable([]);
      }
    } else {
      return;
    }
  }

  const handlepage = () => {
    setdiaryPage(!diaryPage);
  }
  
  const handletheme = () => {
    setdiaryTheme(!diaryTheme);
  }
  
  
  return (
    <div className={diaryTheme ? 'notes-html' : 'notes-html dark'}>
      <Header diaryTheme={diaryTheme} handletheme={handletheme} diaryPage={diaryPage} handlepage={handlepage}/>
      <form className="form" onSubmit={saveitem}>
        {diaryPage &&
        <input type="text" placeholder="write a note" onChange={(e) => setnewNote(e.target.value)} value={newNote}/> ||
        <>
        <input type="time" placeholder="ok" onChange={(e) => setnewTime(e.target.value)} value={newTime}/>
        <input type="text" placeholder="write an event" onChange={(e) => setnewTable(e.target.value)} value={newTable}/>
        </>
        }
        
        <input type="submit" className="save" value="save"/>
      </form>
      <div className="container">
        <Mapper diaryPage={diaryPage} data={diaryPage ? diaryNotes: diaryTable} handledelete={handledelete}/>
      </div>
      <div className="form">
        <div onClick={removeall} className="remove">Remove All</div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
  
  