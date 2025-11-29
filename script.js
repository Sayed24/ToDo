/* Reset and basic styling */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.container {
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  letter-spacing: 1px;
}

.task-input {
  display: flex;
  margin-bottom: 20px;
}

.task-input input {
  flex: 1;
  padding: 10px 15px;
  border-radius: 50px 0 0 50px;
  border: none;
  outline: none;
  font-size: 1rem;
}

.task-input button {
  background-color: #fff;
  color: #2575fc;
  border: none;
  padding: 10px 20px;
  border-radius: 0 50px 50px 0;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-input button:hover {
  transform: scale(1.1);
  background-color: #e0e0e0;
}

ul {
  list-style: none;
}

li {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

li.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

li button {
  background: none;
  border: none;
  color: #ff4d4d;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

li button:hover {
  color: #ff0000;
}

footer {
  margin-top: 40px;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}
