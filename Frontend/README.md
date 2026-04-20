# Documate Frontend Setup

````shell
cd Frontend
````

````shell
npm install
````
````shell
npm run dev
````
<br>
If you want to create a production build , then run the following:

````shell
npm run build
````

After successful setup , u will see the following message on your terminal

````shell
VITE v8.0.8  ready in 290 ms

  ➜  Local:   http://localhost:5173/
````

---

# Routes Available

1. "/login" -> Redirects to the **Login** Page. Currently, only ***Google*** auth is working. **Gitlab** and **Github** authentication under development <br><br>
2. "/dashboard" -> **Dashboard** page , which the user will see after successful auth. Currently under development<br><br>
