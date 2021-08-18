const useEffect = React.useEffect;
const useState = React.useState;
const useCallback = React.useCallback;
const useMemo = React.useMemo;

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


const Mapper = ({ impid, setref, diaryPage, data, handledelete }) => {
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
      return data.map((item, index) => {
        let time = item.time.split(':');
        let body = item.body.length >= 50 ? item.body.slice(0, 50) + '...': item.body;
        return (
        <div ref={item.id === impid ? setref: null} key={item.id} className={
        index === data.length - 1 ? 'tables': 'tables last'}>
          <div><span>{time[0]}:{time[1]}</span><span>{time[2]}</span></div>
          <p>{body}</p>
          <i onClick={e => handledelete(e, item.id)}  className="fa fa-trash"></i>
        </div>);
      })
    }
  }else {
    return <div className="nonotes">No Saved {diaryPage ? 'notes': 'events'}</div>;
  }
}


const Header = ({ scroller, diaryTheme, handletheme, diaryPage, handlepage }) => {
  return (
    <div className="header">
      <p>{diaryPage ? 'Notebook': 'Time-Table'}</p>
      {!diaryPage && <i onClick={scroller} className="fa fa-play"></i>}
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
  const [scroll, setscroll] = useState(true);
  
  const getcurrent = () => {
    const data = (diaryTable.length !== 0) ? diaryTable: JSON.parse(localStorage.getItem('diaryTable'));
    if (data === null) return;
    if (data.length === 0) return;
    if (data) {
      let array = [];
      let closest;
      let nowmin;
      data.forEach(item => {
        let itemmin = Number(item.time.split(':')[3])
        let now = new Date();
        nowmin = now.getHours() * 60 + now.getMinutes();
        array.push(itemmin);
      });
      closest = array.filter(x => x <= nowmin);
      closest = Math.max(...closest);
      let elmnt = data[array.indexOf(closest)];
      return elmnt ? elmnt.id : 10;
    }
  }
  
  const [impid, setimpid] = useState(getcurrent());
  const setref = useCallback(node => {
    if (node) {
      node.scrollIntoView({block: "center", inline: "center"});
      node.classList.add('imp');
      setTimeout(() => node.classList.remove('imp'), 2000)
      console.log('ran');
    }
  }, [impid, scroll]);
 
  const validate = (page) => {
    const pattern = /^\s*$/g;
    const alrt = (txt) => {
      alert(`please enter ${txt}`);
      return false;
    }
    if (page) {
      if (pattern.test(newNote)) alrt('a note');
      else return true;
    }else {
      if (pattern.test(newTable)) alrt('an event');
      else if (pattern.test(newTime)) alrt('time');
      else return true;
    }
  }
  
  const saveNote = (e) => {
    e.preventDefault();
    if (validate(true)) {
      setdiaryNotes([...diaryNotes, {
        id: new Date().getTime(),
        body: newNote.trim()
      }]);
      setnewNote('');
    }else return;
  }
  
  const saveTable = (e) => {
    e.preventDefault();
    if (validate(false)) {
      let arr = newTime.split(':');
      let h = Number(arr[0]);
      let totalmin = h * 60 + Number(arr[1]);
      let ampm = h > 11 ? 'PM' : 'AM';
      if (h === 0) h = 12;
      h = h > 12 ? h - 12 : h;
      h = '0' + h;
      let time = `${h.slice(-2)}:${arr[1]}:${ampm}:${totalmin}`;
      let id = new Date().getTime();
      let newdiaryTable = [...diaryTable, {
        id,
        body: newTable.trim(),
        time
      }].sort((a, b) => {
        return a.time.split(':')[3] - b.time.split(':')[3];
      });
      setdiaryTable(newdiaryTable);
      setimpid(id);
      setnewTable('');
      setnewTime('');
    }else return;
  }

  const handledelete = (e, id) => {
    e.target.parentNode.classList.add('delete-anim');
    
    setTimeout(() => {
      if (diaryPage) {
        setdiaryNotes(diaryNotes.filter(note => note.id !== id));
      }else {
        setdiaryTable(diaryTable.filter(table => table.id !== id));
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
    if (diaryPage) {
      setimpid(getcurrent());
    }
    setdiaryPage(!diaryPage);
  }
  
  const handletheme = () => {
    setdiaryTheme(!diaryTheme);
  }
  
  const scroller = () => {
    setscroll(!scroll);
  }
  
  return (
    <div className={diaryTheme ? 'html' : 'html dark'}>
      <Header scroller={scroller} diaryTheme={diaryTheme} handletheme={handletheme} diaryPage={diaryPage} handlepage={handlepage}/>
      <form className="form" onSubmit={diaryPage ? saveNote: saveTable}>
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
       {impid &&
        <Mapper impid={impid} setref={setref} diaryPage={diaryPage} data={diaryPage ? diaryNotes: diaryTable} handledelete={handledelete}/>
       }
      </div>
      <div className="form">
        <div onClick={removeall} className="remove">Remove All</div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
  
  
