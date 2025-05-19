import React from "react";
import InputList from "./InputList";
import Button from "./Button";

function Home() {
  const [count, setCount] = React.useState(0);
  const [tags, setTags] = React.useState<string[]>([]);

  const onSubmit = React.useCallback((e:React.FormEvent) => {
    e.preventDefault()
    setCount((c) => c + 1);
  }, []);

  return (
    <div>
      <h1>{count}</h1>
      <InputList
        tags={tags}
        setTags={setTags}
        labelText="Tags:"
      />
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}

export default Home;
