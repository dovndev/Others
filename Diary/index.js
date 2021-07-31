const useEffect = React.useEffect;
const useState = React.useState;
const useCallback = React.useCallback;

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


const Header = ({ diaryTheme, handletheme, diaryPage, handlepage }) => {
  return (
    <div className="header">
      <p>{diaryPage ? 'Notebook': 'Time-Table'}</p>
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
  const [newTime, setnewTime] = useState('00:00');
  
  function getcurrent() {
    let data = JSON.parse(localStorage.getItem('diaryTable'));
    if (data === null) return;
    if (data.length === 0) {
      return 'noid';
    }else {
    let array = [];
    let goal = 0;
    let closest;
    data.forEach((item, index) => {
      let itemmin = Number(item.time.split(':')[3])
      let now = new Date();
      let nowmin = now.getHours() * 60 + now.getMinutes();
      let diff = nowmin - itemmin;
      array.push(diff);
      closest = array.reduce(function(prev, curr) {
        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
      });
    });
    let elmnt = data[array.indexOf(closest)];
    return elmnt.id;
    }
  }
  
  const [impid, setimpid] = useState(getcurrent());
  const setref = useCallback(node => {
    if (node) {
      node.scrollIntoView({block: "center", inline: "center"});
      node.classList.add('imp');
      setTimeout(() => node.classList.remove('imp'), 2000)
    }
  }, []);
 
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
      if (pattern.test(newTable) || newTime === '') {
        alert('please enter all details');
      }else {
        let arr = newTime.split(':');
        let hours = Number(arr[0]);
        let totalmin = hours * 60 + Number(arr[1]);
        let ampm = hours > 11 ? 'PM': 'AM';
        if (hours === 0) hours = 12;
        hours = hours > 12 ? hours - 12: hours;
        hours = '0' + hours;
        let time = `${hours.slice(-2)}:${arr[1]}:${ampm}:${totalmin}`;
        let id = new Date().getTime();
        let newdiaryTable = [...diaryTable, {
          id,
          body: newTable,
          time
        }].sort((a, b) => {
            return a.time.split(':')[3] - b.time.split(':')[3];
          });
        setdiaryTable(newdiaryTable);
        setimpid(id);
        setnewTime('');
        setnewTable('');
      }
    }
  }

  const handledelete = (e, id) => {
    e.target.parentNode.classList.add('delete-anim');
    
    setTimeout(() => {
      if (diaryPage) {
        setdiaryNotes(diaryNotes.filter(note => note.id !== id));
      }else {
        setdiaryTable(diaryTable.filter(table => table.id !== id).sort((a, b) => {return a.time.split(':')[3] - b.time.split(':')[3];}
        ));
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
    <div className={diaryTheme ? 'html' : 'html dark'}>
      <Header diaryTheme={diaryTheme} handletheme={handletheme} diaryPage={diaryPage} handlepage={handlepage}/>
      <form className="form" onSubmit={saveitem}>
        {diaryPage &&
        <input type="text" placeholder="write a note" onChange={(e) => setnewNote(e.target.value.trim())} value={newNote}/> ||
        <>
        <input type="time" placeholder="ok" onChange={(e) => setnewTime(e.target.value)} value={newTime}/>
        <input type="text" placeholder="write an event" onChange={(e) => setnewTable(e.target.value.trim())} value={newTable}/>
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
  
  