import { BrowserRouter, Route, Routes } from "react-router"
import Layout from "./components/Layout"
import Home from "./components/Home"
import NotFound from "./components/NotFound"

function App() {
  return <>
  <BrowserRouter>
    <Routes>
      <Route element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
  </>
}

export default App
