import{r as o,u as P,a as k,b as C,c as G,d as A,j as e,L as w,e as V,s as j,Q as d}from"./index-11072bc1.js";import{l as f,a as b,G as _,b as D,j as q}from"./validation-53fd90f4.js";const T=()=>{const[i,v]=o.useState(""),[c,N]=o.useState(""),[m,g]=o.useState(""),[u,x]=o.useState(""),l=P(),p=k(),[y,{isLoading:E}]=C(),[L]=G(),{userInfo:h}=A(s=>s.userAuth),S="https://www.nahalasm.shop/websiteImages/registerImage.png";o.useEffect(()=>{h&&l("/")},[l,h]);const I=async s=>{var n;s.preventDefault();const r=f(i);g(r);const t=b(c);if(x(t),!r&&!t)try{const a=await y({email:i,password:c}).unwrap();a?(p(j({...a})),l("/")):d.error(a.error.data.message)}catch(a){d.error(((n=a==null?void 0:a.data)==null?void 0:n.message)||a.console.error())}},R=async s=>{var r;try{const t=s.given_name,n=s.email,a=await L({name:t,email:n}).unwrap();p(j({...a})),l("/")}catch(t){d.error(((r=t==null?void 0:t.data)==null?void 0:r.message)||t.error)}};return e.jsx("div",{className:"min-h-screen py-20",children:e.jsx("div",{className:"container mx-auto",children:e.jsxs("div",{className:"flex flex-col lg:flex-row w-10/12 lg:w-11/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden",children:[e.jsx("div",{className:"w-full lg:w-1/2 flex flex-col items-centre justify-centre p-12 bg-no-repeat bg-center",style:{backgroundImage:`url(${S})`}}),e.jsxs("div",{className:"w-full lg:w-1/2 py-10 px-12",children:[e.jsx("h2",{className:"text-3xl mb-3",children:"Login"}),e.jsxs("form",{onSubmit:I,children:[e.jsxs("div",{className:"mt-4",children:[e.jsx("input",{type:"text",placeholder:"Email",className:"border border-grey-400 py-1 px-2 w-full",value:i,onChange:s=>{v(s.target.value),g(f(s.target.value))}}),m&&e.jsx("p",{className:"text-red-500",children:m})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("input",{type:"password",placeholder:"Password",className:"border border-grey-400 py-1 px-2 w-full",value:c,onChange:s=>{N(s.target.value),x(b(s.target.value))}}),u&&e.jsx("p",{className:"text-red-500",children:u})]}),e.jsx("div",{className:"mt-3",children:e.jsx("span",{children:e.jsx(w,{to:"/forgotPassword",className:"btn btn-link",children:"Forgot Password"})})}),E&&e.jsx(V,{}),e.jsx("div",{className:"mt-3",children:e.jsx("button",{className:"w-full py-3 text-center text-white",type:"submit",style:{backgroundColor:"#ffbe55"},children:"Login"})}),e.jsx("div",{className:"mt-4 mb-3",children:e.jsxs("span",{children:["New Customer? ",e.jsx(w,{to:"/register",className:"font-semibold text-blue-500",children:"Register"})]})}),e.jsx(_,{clientId:"915783098784-vqrg4q9jh52kbfrh7u085shb3u4tqk45.apps.googleusercontent.com",children:e.jsx(D,{onSuccess:s=>{const r=q(s.credential);R(r)},onError:()=>{console.log("Login Failed")}})})]})]})]})})})};export{T as default};
