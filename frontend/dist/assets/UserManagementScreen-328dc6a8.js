import{P as L,r as l,aP as v,aQ as I,j as e,B as u,l as o,Q as h,aR as T,A as F,e as N}from"./index-51727cb1.js";import{T as _}from"./Table-718aaeb2.js";import{M as m}from"./Modal-664f545f.js";const C=({users:x,setUsersData:c})=>{C.propTypes={users:L.array.isRequired};const[r,j]=l.useState(""),[i,a]=l.useState(!1),[d,y]=l.useState(null),[k,p]=l.useState(null),g=t=>{j(t.target.value)},U=x.filter(t=>t.name.toLowerCase().includes(r.toLowerCase())||t.email.toLowerCase().includes(r.toLowerCase())||t.mobile.toLowerCase().includes(r.toLowerCase())),[B,{isLoading:b}]=v(),[w,{isLoading:f}]=I(),S=async()=>{var t;try{await B({userId:d}),h.success("User Blocked Successfully."),y(null),a(!1),c(s=>s.map(n=>n._id===d?{...n,is_blocked:!0}:n))}catch(s){h.error(((t=s==null?void 0:s.data)==null?void 0:t.message)||(s==null?void 0:s.error))}},A=async()=>{var t;try{await w({userId:k}),h.success("User Un Blocked Successfully."),p(null),a(!1),c(s=>s.map(n=>n._id===k?{...n,is_blocked:!1}:n))}catch(s){h.error(((t=s==null?void 0:s.data)==null?void 0:t.message)||(s==null?void 0:s.error))}};return e.jsxs(e.Fragment,{children:[e.jsx(u,{children:e.jsxs(u.Group,{className:"mt-3",controlId:"exampleForm.ControlInput1",children:[e.jsx(u.Label,{children:"Search users:"}),e.jsx(u.Control,{style:{width:"500px"},value:r,type:"text",placeholder:"Enter Name or email........",onChange:g})]})}),e.jsxs(_,{className:"mt-3 mb-3",striped:!0,bordered:!0,hover:!0,responsive:!0,children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"SI No."}),e.jsx("th",{children:"Name"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"Phone"}),e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Manage"})]})}),e.jsx("tbody",{children:U.map((t,s)=>e.jsxs("tr",{children:[e.jsx("td",{children:s+1}),e.jsx("td",{children:t.name}),e.jsx("td",{children:t.email}),e.jsx("td",{children:t.mobile}),e.jsx("td",{children:t.is_blocked===!1?e.jsx("span",{className:"text-success",style:{fontWeight:"bold"},children:"Active"}):e.jsx("span",{className:"text-danger",style:{fontWeight:"bold"},children:"Blocked"})}),e.jsx("td",{children:t.is_blocked===!1?e.jsx(o,{type:"button",variant:"danger",onClick:()=>{y(t._id),a(!0)},children:"Block"}):e.jsx(o,{type:"button",variant:"success",onClick:()=>{p(t._id),a(!0)},children:"Unblock"})})]},s))})]}),e.jsxs(m,{show:i,onHide:()=>a(!1),children:[e.jsx(m.Header,{closeButton:!0,children:e.jsx(m.Title,{children:"Confirmation"})}),e.jsx(m.Body,{children:d?e.jsxs(e.Fragment,{children:["Are you sure you want to actually block this user?",e.jsx(o,{variant:"secondary",onClick:()=>a(!1),children:"Cancel"}),e.jsx(o,{variant:"danger",onClick:S,disabled:b,children:b?"Blocking...":"Block"})]}):k?e.jsxs(e.Fragment,{children:["Are you sure you want to unblock this user?",e.jsx(o,{variant:"secondary",onClick:()=>a(!1),children:"Cancel"}),e.jsx(o,{variant:"success",onClick:A,disabled:f,children:f?"Unblocking...":"Unblock"})]}):null})]})]})},P=()=>{const[x,c]=l.useState([]),[r,{isLoading:j}]=T();return l.useEffect(()=>{try{(async()=>{const d=(await r()).data.usersData;c(d)})()}catch(i){h.error(i),console.error("Error fetching users:",i)}},[r]),e.jsxs(F,{children:[e.jsx("h1",{className:"p-2",children:"Users List"}),j?e.jsx(N,{}):e.jsx(C,{users:x,setUsersData:c})]})};export{P as default};