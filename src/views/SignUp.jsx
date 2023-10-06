import logo from "../assets/logo.png";
import cover from "../assets/cover.jpg";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

console.log(import.meta.env)

const {VITE_APP_HOST} = import.meta.env
//09/20 註冊頁面剩下錯誤提示訊息

function SignUp() {
    const [email, setEmail]=useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState ('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const formData = {
            email,
            nickname,
            password,
        }

    const navigate = useNavigate();

    async function handleSign(){
      if (!email || !nickname ||!password){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: '請完整輸入您的資料',
        })
        return;
      }
        if(password !== confirmPassword){
            
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: '密碼不一致',
                    
                  })
                  setPassword('');
                  setConfirmPassword('');
            return; //提前結束
        };
        
        try{
        const res = await axios.post(`${VITE_APP_HOST}/users/sign_up`, formData);
            Swal.fire(
                '註冊成功',
                'Login right now to get things done!',
                'success'
              );
            console.log("回應", res);
            navigate("/");
        }catch(error){
           console.log(error)
        }
    }

  return (
    <>
      <div id="signUpPage" className="bg-yellow">
        <div className="conatiner signUpPage vhContainer">
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
              <h2 className="formControls_txt">註冊帳號</h2>
              <label className="formControls_label" htmlFor="email">
                Email
              </label>
              <input
                className="formControls_input"
                type="text"
                id="email"
                name="email"
                placeholder="請輸入 email"
                onChange={(e)=>{setEmail(e.target.value)}}
                required
              />
              <label className="formControls_label" htmlFor="name">
                您的暱稱
              </label>
              <input
                className="formControls_input"
                type="text"
                name="name"
                id="name"
                placeholder="請輸入您的暱稱"
                onChange={(e)=>{setNickname(e.target.value)}}
              />
              <label className="formControls_label" htmlFor="pwd">
                密碼
              </label>
              <input
                className="formControls_input"
                type="password"
                name="password"
                id="password"
                placeholder="請輸入密碼"
                value={password} 
                onChange={(e)=>{setPassword(e.target.value)}}
                required
              />
              <label className="formControls_label" htmlFor="pwd">
                再次輸入密碼
              </label>
              <input
                className="formControls_input"
                type="password"
                name="password"
                id="confirmPassword"
                placeholder="請再次輸入密碼"
                value={confirmPassword} 
                onChange={(e)=>{setConfirmPassword(e.target.value)}}
                required
              />
              <button
                className="formControls_btnSubmit"
                type="button"
                onClick={handleSign}
                value="註冊帳號">
                    註冊
              </button>
              <a className="formControls_btnLink" href="#">
                登入
              </a>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
