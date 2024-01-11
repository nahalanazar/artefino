import{d as x,g as h,h as m,u as g,r as f,j as s,C as c,i as j,U as y,L as P}from"./index-6686ab90.js";import{C as v}from"./ChatButton-fe0c04aa.js";import{F as C}from"./FollowButton-320fe43c.js";const w=()=>{const{userInfo:r}=x(e=>e.userAuth),{id:n}=h(),[d,{data:o,isLoading:a}]=m(),u=g();f.useEffect(()=>{r&&(async()=>{try{const t=String(n||r.id),l=await d(t)}catch(t){console.error("Error fetching user posts:",t)}})()},[n,r,d]);const i=e=>{u(`/postDetails/${e}`)};return s.jsxs("div",{className:"user-posts-container",children:[a&&s.jsx("p",{children:"Loading posts..."}),o&&Array.isArray(o.userPosts)&&o.userPosts.length>0?o.userPosts.map(e=>s.jsx(c,{className:"user-post-card",children:e.isRemoved?s.jsx("div",{className:"removed-post-message text-center",children:"Post removed by admin"}):s.jsxs(s.Fragment,{children:[s.jsx(c.Img,{variant:"top",src:e.images[0].url,onClick:()=>i(e._id)}),s.jsxs(c.Body,{children:[s.jsx(c.Title,{style:{cursor:"pointer"},onClick:()=>i(e._id),children:e.title}),s.jsx(c.Text,{children:e.description})]})]})},e._id)):s.jsx("p",{className:"center-message",children:"No posts available."})]})},b=()=>{const{id:r}=h(),[n]=j(),[d,o]=f.useState({}),{userInfo:a}=x(t=>t.userAuth),u=!r;f.useEffect(()=>{a&&i()},[n,r,a]);const i=async()=>{try{const t=String(r||a.id),l=await n(t).unwrap();o(l.user)}catch(t){console.error("Error fetching user details:",t)}},e=t=>{o(l=>({...l,followers:l.followers.filter(p=>p._id!==t)}))};return s.jsx("div",{children:s.jsxs("div",{style:{display:"flex"},children:[s.jsxs("div",{children:[s.jsx(y,{UserDetails:d,fetchUserDetails:i,updateFollowersCountOnRemove:e}),u?s.jsx(P,{to:"/updateProfile",children:s.jsx("div",{style:{paddingLeft:85.85,paddingTop:20,flexDirection:"column",justifyContent:"flex-start",alignItems:"flex-start",display:"inline-flex",cursor:"pointer"},children:s.jsx("button",{style:{color:"white",backgroundColor:"#007BFF",fontSize:16,fontFamily:"Roboto",fontWeight:"700",wordWrap:"break-word",padding:"8px 16px",border:"none",borderRadius:"4px",cursor:"pointer"},children:"Edit Profile"})})}):s.jsxs("div",{style:{paddingLeft:60.85,paddingTop:20,display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",cursor:"pointer"},children:[s.jsx(C,{artistId:r,fetchUserDetails:i}),s.jsx(v,{userId:r})]})]}),s.jsx(w,{})]})})};export{b as default};