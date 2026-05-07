# 🥑 アボカド熟度判定アプリ

AIがアボカドの画像から熟度を判定するWebアプリです。
ブラウザ上で完結するため、サーバーへの画像送信は一切不要です。

---

## 📱 デモ

https://avocadocchi.vercel.app/

---

## 🖼️ スクリーンショット

<table style="table-layout: fixed; width: 100%;">
<tr>
  <th>トップ画面</th>
  <th>判定中</th>
  <th>判定結果(完熟)</th>
  <th>判定結果(未熟)</th>
</tr>
<tr>
<td><video src="https://github.com/user-attachments/assets/9025b52b-bd39-4dd7-98eb-577dd808daf4"></td>
<td><video src="https://github.com/user-attachments/assets/dbef94ab-81f2-4b2f-8699-01c95c328a0e"></td>
<td><video src="https://github.com/user-attachments/assets/43fec265-cffe-4a96-8ae5-1fa4d21d781e"></td>
<td><video src="https://github.com/user-attachments/assets/3497e115-237d-4f17-bff8-eed5af009f00"></td>
</tr>
</table>

---

## ✨ 機能

- 📸 カメラ撮影 / ファイル選択 / ドラッグ&ドロップで画像をアップロード
- 🤖 TensorFlow.jsによるブラウザ上でのAI推論（サーバーレス）
- 📊 判定結果を信頼度スコア（%）で表示
- 🎊 完熟判定時は紙吹雪エフェクト
- 😵 未熟判定時はコミカルなアニメーション
- 🥑 ランダムなアボカド豆知識を表示

---

## 🛠️ 技術スタック

### フロントエンド

| 技術          | 用途                 |
| ------------- | -------------------- |
| Vue 3         | UIフレームワーク     |
| Vite          | ビルドツール         |
| TensorFlow.js | ブラウザ上でのAI推論 |
| Tailwind CSS  | スタイリング         |

### AI モデル

| 技術                    | 用途       |
| ----------------------- | ---------- |
| Python / TensorFlow     | モデル学習 |
| Keras / VGG16           | 転移学習   |
| TensorFlow.js Converter | モデル変換 |
| Google Colab            | 学習環境   |

### インフラ

| 技術   | 用途                       |
| ------ | -------------------------- |
| Vercel | ホスティング・自動デプロイ |
| GitHub | ソースコード管理           |

---

## 🏗️ アーキテクチャ

```
src/
├── components/
│   ├── HomeView.vue       # メイン画面（画像アップロード・推論処理）
│   ├── ImageUploader.vue  # 画像アップロードコンポーネント
│   ├── LoadingView.vue    # ローディング画面
│   ├── ResultView.vue     # 判定結果画面
│   ├── ErrorView.vue      # エラー画面
│   └── MascotHello.vue   # マスコットコンポーネント
├── composables/
│   └── useModel.js        # TFJSモデルのロード・管理
└── assets/
    └── main.css           # グローバルスタイル

public/
└── model/                 # TFJSモデルファイル
    ├── model.json
    └── group1-shard*.bin
```

---

## 💡 技術的な工夫・こだわり

### Vue3 Composition API + Composables

モデルのロードと状態管理を`useModel.js`に切り出し、UIロジックと分離しました。

```javascript
// useModel.js
let model = null; // TFJSモデルはrefではなく普通の変数で管理
export function useModel() {
    async function loadModel() {
        await tf.setBackend("webgl");
        await tf.ready();
        model = await tf.loadGraphModel("/model/model.json");
    }
    function getModel() {
        return model;
    }
    return { loadModel, getModel };
}
```

> **ポイント:** TFJSのモデルを`ref()`でラップするとエンジンの参照がずれてエラーになるため、通常の変数で管理しています。

---

### ブラウザ上でのサーバーレス推論

画像をサーバーに送信せず、TensorFlow.jsを使ってブラウザ上で完結させました。プライバシーに配慮した設計です。

```javascript
// 画像の前処理
function preprocess(img) {
    return tf.browser
        .fromPixels(img)
        .resizeNearestNeighbor([100, 100]) // モデルの入力サイズに合わせてリサイズ
        .toFloat()
        .div(tf.scalar(255)) // 0〜1に正規化
        .expandDims(0); // バッチ次元を追加
}
```

---

### Promise.allで UX を改善

推論処理と最低表示時間（2秒）を並行実行し、処理が速くてもローディング画面を必ず表示します。

```javascript
const [imgEl] = await Promise.all([
    loadImage(image.value),
    new Promise((resolve) => setTimeout(resolve, 2000)), // 最低2秒表示
]);
```

---

### ドラッグ&ドロップの実装

ブラウザのデフォルト動作（新タブで画像を開く）を防ぐため、イベントのキャプチャフェーズで処理を行いました。

```javascript
uploadZone.value.addEventListener(
    "drop",
    (e) => {
        e.preventDefault();
        e.stopPropagation();
        const f = e.dataTransfer.files[0];
        if (f) loadPreview(f);
    },
    true,
); // キャプチャフェーズで捕捉
```

---

### Keras3 × TFJSの互換性問題を解決

Google ColabでKeras3（v3.14）を使って学習したモデルをTFJSに変換する際、`batch_shape`キーの非互換問題が発生。SavedModel経由でGraphModel形式に変換することで解決しました。

```python
# tf_kerasを使うことでKeras3との互換性問題を回避
import tf_keras
model.save('model.h5')

# GraphModel形式に変換
!tensorflowjs_converter \
  --input_format=keras \
  --output_format=tfjs_graph_model \
  model.h5 \
  tfjs_model_graph
```

---

## 🤖 モデルについて

### 学習データ

- アボカドの画像（完熟 / 未熟）を各クラス200枚以上使用

### モデル構成

- ベースモデル: VGG16（ImageNetで事前学習済み）
- 転移学習: VGG16の全層を固定し、全結合層のみ学習
- 出力: 2クラス分類（完熟 / 未熟）

```python
base_model = VGG16(include_top=False, weights='imagenet', input_shape=(100, 100, 3))
x = Flatten()(base_model.output)
x = Dense(256, activation='relu')(x)
x = Dense(128, activation='relu')(x)
x = Dense(2, activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=x)
```

---

## 🚀 ローカルでの実行方法

```bash
# リポジトリをクローン
git clone https://github.com/ユーザー名/リポジトリ名.git
cd リポジトリ名

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

---

## 📝 今後の改善案

- [ ] 判定履歴の保存
- [ ] PWA対応（オフラインでも動作）
- [ ] より多くのデータでモデルの精度向上
- [ ] Fine-tuningによる精度改善

---

## 👤 作者

> 名前・GitHubリンク・ポートフォリオリンクをここに記載してください
