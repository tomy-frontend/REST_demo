const express = require("express");
const app = express();
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");
uuid();

// // パースしてデータ形式を変更してあげる
app.use(express.urlencoded({ extended: true })); // フォームからだけ送られてきたデータをパースできる
app.use(express.json()); // JSONもパースする
app.set("view engine", "ejs");
app.use(methodOverride("_method")); // methodOverrideを使用する

// REST fulなルーティングを作成する
// /comments をベースとする、用途に合わせてhttpメソッドを変える
// GET /comments - コメント一覧を取得
// POST /comments - 新しいコメントを作成
// GET /comments/:id - 特定のコメントを一つ取得
// PATCH /comments/:id - 特定のコメントを更新
// DELETE /comments/:id - 特定のコメントを削除

let comments = [
  { id: uuid(), username: "Dave", comment: "Happy!!" },
  { id: uuid(), username: "鈴木", comment: "幸せですか？" },
  { id: uuid(), username: "田中", comment: "ワロス" },
  { id: uuid(), username: "さんちゃん", comment: "ミラクルワンダフル！！！" },
  { id: uuid(), username: "三日月", comment: "タンバリン" },
];

// コメントを取得
app.get("/comments", (req, res) => {
  res.render("comments/index", { comments }); //viewsからのファイルパスが間違っていると表示されないので注意
});

// 新規コメントを作成するルーティング
app.get("/comments/new", (req, res) => {
  res.render("comments/new");
});

// コメントをPOSTで /comments へ送信し、配列に格納する
app.post("/comments", (req, res) => {
  const { username, comment } = req.body; // req.bodyからusernameとcommentだけを取得
  comments.push({ username, comment, id: uuid() }); // 取得したusername,commentを配列commentsにpush、本来はデータベース
  res.redirect("/comments"); // commentsにリダイレクトする、何も指定しなければ302リダイレクト
});

// コメントを取得して表示する
app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id); // findで一つだけ取得する
  res.render("comments/show", { comment });
});

// コメントをformから変更可能にする
app.get("/comments/:id/edit", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  res.render("comments/edit", { comment });
});

// コメントを部分的に更新する、更新する内容しかreq.bodyに送らない
app.patch("/comments/:id", (req, res) => {
  const { id } = req.params;
  const newCommentText = req.body.comment; // bodyのcommentの中にコメントの中身が入ってくる
  const foundComment = comments.find((c) => c.id === id);
  foundComment.comment = newCommentText; // 新しいコメントで更新する
  res.redirect("/comments");
});

// 選択したコメントを削除する
app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;
  comments = comments.filter((c) => c.id !== id); // filterで一致するものが弾かれるので、結果的に削除されるコメントが絞れる
  res.redirect("/comments");
});

// サーバー立ち上げ
app.listen(3000, () => {
  console.log("ポート3000で待受中。。。");
});
