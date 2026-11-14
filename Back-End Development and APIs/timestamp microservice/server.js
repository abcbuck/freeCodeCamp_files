import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line
app.get("/api{/:date}", (req, res) => {
  let date = new Date(req.params.date); // works if date is in string format
  if(date.toString() == "Invalid Date")
    date = new Date(+(req.params.date ?? Date.now())); // works if date is in timestamp format or undefined
  if(date.toString() == "Invalid Date")
    res.json({
      error: "Invalid Date"
    });
  res.json({
    unix: date.valueOf(),
    utc: date.toUTCString()
  });
});
// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
