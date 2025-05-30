"use client"
import Image from "next/image";
import { useState, useEffect} from 'react'
import axios from 'axios'
type FormData = { 
  title: string, 
  body: string,
  userId: string
}
type Post = {
  id: number 
  title: string, 
  body: string,
  userId: number
}
const url = process.env.NEXT_PUBLIC_URL;
export default function Home() {
  const [formData, setFormData] = useState<FormData>({title: "", body: "", userId: ""});
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => { 
    fetch('/api/users', {method: 'GET', headers: {
      'Content-Type': 'application/json'
    }}).then(async res => { 
      const posts = (await res.json()).posts;
      setPosts(posts.slice(0,4))
    })
    // axios.get(`${url}/api/users`).then(res => { 
    //   setPosts(res.data.posts.slice(0, 4))
    // }).catch(err => console.log(err)) 
  }, [])
  const handleUpload = async (e: any) => { 
    e.preventDefault()
    console.log(formData)
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({title: formData.title, body: formData.body, userId: parseInt(formData.userId)})
    })
    const data = await res.json();
    console.log(data)

    setPosts(p => ([{...data}, ...p]))
    setFormData({title: "", body: "", userId: ""})
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* upload a post   */}
      <div>
        <form>
          <label>title</label><input type="text" value={formData.title.toString()} onChange={e=>setFormData(f => ({...f, title: e.target.value}))}/>
          <label>body</label><input type="textarea" value={formData.body.toString()}onChange={e=>setFormData(f => ({...f, body: e.target.value}))}/>
          <label>user Id</label><input type="text" value={formData.userId.toString()} onChange={e=>setFormData(f => ({...f, userId: e.target.value}))}/>
          <button onClick={e=>handleUpload(e)}>upload</button>
        </form>
      </div>
      {/* show top 5 posts */ } 
      <div>
        <table>
          <thead>
            <tr>
            <th>title</th>
            <th>body</th>
            <th>userId</th>
            </tr>
          </thead>
          <tbody>
            {posts && posts.map(post => (<PostRow key={post.id} title={post.title} body={post.body} userId={post.userId.toString()}/>))}
          </tbody>
        </table>        
      </div>
    </div>
  );
}

const PostRow = ({title, body, userId} : FormData) => { 
  return <tr>
    <td>{title}</td>
    <td>{body}</td>
    <td>{userId}</td>
  </tr>  
}
