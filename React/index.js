const { useState, useEffect, useMemo } = React;

const useFetch = (url) => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setData(undefined);
    setLoading(true);
    setError(false);
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  return [loading, error, data, loadData];
};

const Posts = ({ posts }) => {
  return (
    <div className="post-list">
      {posts.map((post) => {
        return (
          <div className="post" key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        );
      })}
    </div>
  );
};

const useToggle = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const toggleValue = () => {
    setValue(!value);
  };

  return [value, toggleValue];
};

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState();

  useEffect(() => {
    const savedData = localStorage.getItem(key);
    if (savedData) setValue(JSON.parse(savedData));
    else setValue(initialValue);
  }, []);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  const removevalue = () => {
    localStorage.removeItem(key);
  };

  return [value, setValue, removevalue, key];
};

const App = () => {
  const [name, setName, removeName] = useLocalStorage("name", "noel");
  const [age, setAge, removeAge] = useLocalStorage("age", 15);
  const [darktheme, toggleTheme] = useToggle(false);
  const [loading, error, posts, reload] = useFetch(
    "https://jsonplaceholder.typicode.com/posts"
  );

  const style = useMemo(() => {
    return {
      backgroundColor: darktheme ? "black" : "white",
      color: darktheme ? "white" : "black",
    };
  }, [darktheme]);

  useEffect(() => {
    console.log("changed");
  }, [style]);

  return (
    <div style={style} className="cont">
      <h1>
        Hello, ninja {name} at {age}
      </h1>
      Name
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <button onClick={removeName}>remove name</button>
      <br />
      Age
      <input
        type="number"
        onChange={(e) => setAge(e.target.value)}
        value={age}
      />
      <button onClick={removeAge}>remove Age</button>
      <br />
      <button onClick={toggleTheme}>{darktheme ? "light" : "dark"}theme</button>
      {!loading && <button onClick={reload}>reload data</button>}
      {loading && <h3>Loading...</h3>}
      {posts && <Posts posts={posts} />}
      {error && <div>error occured</div>}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
