import { DBCon } from "./db/index.js";
import express from "express";
const app = express();
app.use(express.json()); 
import { userRouter } from "./router/user.routes.js"
app.use("/continent", userRouter)
app.use(express.urlencoded({ extended: true })); 

DBCon()
  .then(() => {
    app.post("/", async (req, res) => {
      const data = req.body;
      console.log("api REsponose : ", data);
      if (data) {
        res.json({
          success: "ok",
        });
      }
      else {
        res.json({
          failure : "failure occured"
        })
      }
    });
    app.listen(3000, () => {
      console.log("server is running on port :", 3000);
    });
  })
  .catch((error) => {
    console.log("This is an server side error : ", error);
  });

 export {app}
