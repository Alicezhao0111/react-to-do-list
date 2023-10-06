import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { VITE_APP_HOST } = import.meta.env;

function Todo() {
  const [name, setName] = useState("");
  const [todos, setTodos] = useState([]);
  const [addTodo, setAddtodo] = useState("");
  const [todoType, setTodoType] = useState("all"); //定義三種事件狀態
  const [isEditing, setIsEditing] = useState(null);
  const [editTodo, setEditTodo] = useState("");

  const navigate = useNavigate();

  // 取得 Cookie
  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    console.log(cookieValue);

    // 預設 axios 的表頭
    axios.defaults.headers.common["Authorization"] = cookieValue;

    //驗證登入
    axios
      .get(`${VITE_APP_HOST}/users/checkout`)
      .then((response) => {
        console.log(response);
        setName(response.data.nickname);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "發生錯誤，請重新登入",
        });
        navigate("/");
      });
  }, []);

  // 驗證結束

  //登出
  async function SignOut(e) {
    e.preventDefault();

    try {
      const res = await axios.post(`${VITE_APP_HOST}/users/sign_out`);
      console.log("登出", res);
      Swal.fire("已成功登出");
      navigate("/");
    } catch (err) {
      console.log("登出錯誤", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "發生錯誤，請再試一次",
      });
    }
  }

  //取得所有代辦事項
  async function getTodo() {
    const res = await axios.get(`${VITE_APP_HOST}/todos/`);
    console.log("取得事項", res);
    setTodos(res.data.data);
  }

  useEffect(() => {
    getTodo();
  }, []); //渲染一次就好

  async function addItems() {
    if (!addTodo) return;
    const todo = { content: addTodo };
    console.log("新增", todo);
    await axios.post(`${VITE_APP_HOST}/todos/`, todo);
    setAddtodo(""); //清空
    getTodo();
  }

  //更新事情
  async function UpdateTodo(id, content) {
    try {
      const res = await axios.put(`${VITE_APP_HOST}/todos/${id}`, { content });
      console.log(res);
      if (res.status === 200) {
        setEditTodo("");
        setIsEditing(false); //退出編輯模式
        getTodo();
        return;
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: `${err.response.data.message}`,
      });
      setIsEditing(false);
    }
  }

  //刪除事項

  async function deleteItems(id) {
    await axios.delete(`${VITE_APP_HOST}/todos/${id}`);
    getTodo();
  }

  //更新狀態
  async function toggleStatus(id) {
    await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`);
    getTodo();
  }

  const todoTypeChange = (e, status) => {
    e.preventDefault();
    setTodoType(status);
  }; //允許改變 todoType 的值，以便過濾待辦事項

  //根據todoType，決定要顯示的事情
  const filterTodo = todos.filter((item) => {
    console.log("todoType", todoType);
    console.log("item.status:", item.status);

    if (todoType === "completed") {
      return item.status; //返回true
    }
    if (todoType === "active") {
      return !item.status; //返回false
    }
    return true; //返回所有
  });

  console.log("Filtered todos:", filterTodo);

  //計算已完成事項

  const activeItems = todos.filter((item) => {
    return item.status;
  });

  //刪除已完成事項

  const clearCompleted = async (e) => {
    e.preventDefault();

    const deleteCompleted = todos.filter((item) => {
      return item.status;
    });

    if (deleteCompleted.length === 0) return;

    try {
      for (let i = 0; i < deleteCompleted.length; i++) {
        await axios.delete(`${VITE_APP_HOST}/todos/${deleteCompleted[i].id}`);
      }
      Swal.fire("清除成功");
      getTodo();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "清除失敗",
      });
      console.log(err);
    }
  };

  return (
    <>
      <div id="todoListPage" className="bg-half">
        <nav className="todo_nav">
          <ul>
            <li className="todo_sm">
              <span>Welcome back, {name}</span>
            </li>
            <li>
              <a onClick={SignOut}>Log out</a>
            </li>
          </ul>
        </nav>
        <div className="conatiner todoListPage vhContainer">
          <div className="todoList_Content">
            <div className="inputBox">
              <input
                type="text"
                placeholder="請輸入待辦事項"
                value={addTodo}
                onChange={(e) => {
                  setAddtodo(e.target.value);
                  console.log(e.target.value);
                }}
              />
              <button type="button" onClick={addItems}>
                <i className="fa fa-plus">+</i>
              </button>
            </div>
            <div className="todoList_list">
              <ul className="todoList_tab">
                <li>
                  <a
                    href="#"
                    className={todoType === "all" ? "active" : ""}
                    onClick={(e) => todoTypeChange(e, "all")}
                  >
                    全部
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={todoType === "active" ? "active" : ""}
                    onClick={(e) => todoTypeChange(e, "active")}
                  >
                    待完成
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={todoType === "completed" ? "active" : ""}
                    onClick={(e) => todoTypeChange(e, "completed")}
                  >
                    已完成
                  </a>
                </li>
              </ul>
              <div className="todoList_items">
                <ul className="todoList_item">
                  {todos.length === 0 ? (
                    <div className="add_box">
                        <p>
                        - 請新增事項 -
                        </p>
                    </div>
                  ) : (
                    filterTodo.map((item) => (
                      <li key={item.id}>
                        {isEditing === item.id ? (
                          //渲染編輯輸入框
                          <>
                            <label className="todoList_label">
                              <input
                                type="text"
                                value={editTodo}
                                onChange={(e) => setEditTodo(e.target.value)}
                              />
                            </label>
                            <button
                              className="update-btn"
                              onClick={() => UpdateTodo(item.id, editTodo)}
                            >
                              確認
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => setIsEditing(null)}
                            >
                              取消
                            </button>
                          </>
                        ) : (
                          <>
                            <label className="todoList_label">
                              <input
                                className="todoList_input"
                                type="checkbox"
                                checked={item.status}
                                onChange={() =>
                                  toggleStatus(item.id, !item.status)
                                }
                              />
                              <span>{item.content}</span>
                            </label>
                            <button
                              className="update-btn"
                              onClick={() => setIsEditing(item.id)}
                            >
                              更改
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => deleteItems(item.id)}
                            >
                              刪除
                            </button>
                          </>
                        )}
                        <a href="#">
                          <i className="fa fa-times"></i>
                        </a>
                      </li>
                    ))
                  )}
                </ul>

                <div className="todoList_statistics">
                  <p> {activeItems.length}個已完成項目</p>
                  <a href="#" onClick={clearCompleted}>
                    清除已完成項目
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Todo;
