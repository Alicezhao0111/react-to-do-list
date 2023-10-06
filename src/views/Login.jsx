import logo from '../assets/logo.png';
import cover from '../assets/cover.jpg';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const {VITE_APP_HOST} = import.meta.env

function Login() {
    const [email, setEmail] = useState ('');
    const [password, setPassword] = useState ('');
    const [isTyping, setIsTyping] = useState(false);

    const loginData = {
            email: email,
            password: password,
        }
    const handleFocus = ()=>{
        setIsTyping(true)
    }

    const navigate = useNavigate()


    async function handleLogin(){

        try{
            const res = await axios.post(`${VITE_APP_HOST}/users/sign_in`, loginData);
            console.log(res)
            const {token} = res.data;
            document.cookie = `token=${token}`; // 設定名為 'token' 的 cookie
            document.cookie = "test2=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure"; 
            // 設定名為 'test2' 的 cookie
            console.log(document.cookie);
            navigate('/to-do');

        }catch(err){
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${err.response.data.message}`,   
              })

        }
    }

  return (
    <>
      <div id="loginPage" className="bg-yellow">
        <div className="conatiner loginPage vhContainer ">
          <div className="side">
            <a href="#">
              <img
                className="logoImg"
                src={logo}
                alt=""
              />
            </a>
            <img
              className="d-m-n"
              src={cover}
              alt="workImg"
            />
          </div>
          <div>
            <form className="formControls" action="index.html">
              <h2 className="formControls_txt">Do it now. You'll thank yourself later</h2>
              <label className="formControls_label" htmlFor="email">
                Email
              </label>
              <input
                className="formControls_input"
                type="text"
                id="email"
                name="email"
                placeholder="請輸入 email"
                onChange={(e)=> setEmail(e.target.value)
                } 
                onFocus={handleFocus}
                required
              />
              {!isTyping && <span className='noticeWord'>此欄位不可留空</span>}
              
              <label className="formControls_label" htmlFor="pwd">
                密碼
              </label>
              <input
                className="formControls_input"
                type="password"
                name="pwd"
                id="pwd"
                placeholder="請輸入密碼"
                onChange={(e)=> setPassword(e.target.value)}
                required
              />
              <button
                className="formControls_btnSubmit"
                type="button"
                onClick={()=>{handleLogin()}}
                value="登入">登入
              </button>
              <a className="formControls_btnLink" href="#sign-up">
                註冊帳號
              </a>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
