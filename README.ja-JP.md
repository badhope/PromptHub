# 🌐 AI スキル エコシステム

<!-- バッジ行 -->
<p align="center">

![Skills](https://img.shields.io/badge/Skills-601+-blue?style=for-the-badge&labelColor=2d333b)
![Categories](https://img.shields.io/badge/Categories-7-orange?style=for-the-badge&labelColor=2d333b)
![Platform](https://img.shields.io/badge/Platform-Cross--platform-orange?style=for-the-badge&labelColor=2d333b)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&labelColor=2d333b)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge&labelColor=2d333b)
![Last Update](https://img.shields.io/badge/Last_Update-2026--04--06-red?style=for-the-badge&labelColor=2d333b)

</p>

<!-- 中央ヒーローセクション -->
<div align="center">

## 🚀 Raw リンクで AI スキルをアクティベート

**クロスプラットフォーム · アクセシビリティ · 即時利用 · インストール不要**

*[English](README.md) · [中文](README.zh-CN.md) · [日本語](README.ja-JP.md)*

---

### 🎯 クイックデモ

```markdown
# TaskMaster スキルをアクティベート
"以下のスキル定義を読み込んでタスク管理モードに切り替えてください："
https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/smart-planner/SKILL.md
```

[![GitHub Stars](https://img.shields.io/github/stars/badhope/mobile-skills?style=social)](https://github.com/badhope/mobile-skills)
[![GitHub Forks](https://img.shields.io/github/forks/badhope/mobile-skills?style=social)](https://github.com/badhope/mobile-skills)

</div>

---

## 🆕 スキルシステムアーキテクチャ

### 🏗️ アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         🏗️ Mobile-Skills アーキテクチャ                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🎯 Commander Layer                              │   │
│   │              タスク分解 · 意図認識 · 結果統合                          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🔄 Orchestrator Layer                           │   │
│   │           DAGエンジン · スキルオーケストレーション · ワークフロー管理   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      📋 Coordinator Layer                            │   │
│   │          ドメイン調整 · スキルグループ化 · コンテキスト管理             │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🔌 Protocol Layer                               │   │
│   │              MCPプロトコル · ACPプロトコル · モバイルプロトコル         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                      🎯 Skill Pool                                   │   │
│   │    ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │   │
│   │    │Functional│ │Profess. │ │Creative │ │Character│ │ Fiction │     │   │
│   │    │   6     │ │   4     │ │   2     │ │   2     │ │   1     │     │   │
│   │    └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### ✨ 主な特徴

| 特徴 | 説明 |
|:-----|:-----|
| **🎯 ハイブリッドアーキテクチャ** | Skills-First + 階層型オーケストレーション |
| **🔄 DAGワークフロー** | 複雑なタスクオーケストレーションのための有向非巡回グラフエンジン |
| **🔌 プロトコル統合** | クロスプラットフォーム相互運用性のためのMCP/ACP/モバイルプロトコル |
| **📱 モバイル最適化** | モバイルAIサービス向けに最適化 |
| **🔙 後方互換性** | 既存のAgentシステムと完全互換 |

---

## 🚀 クイックスタート

### ⚡ 3ステップでアクティベート

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           🚀 スキルアクティベーションフロー                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐              │
│   │  1️⃣ コピー  │ ──▶ │  2️⃣ ペースト│ ──▶ │  3️⃣ 開始   │              │
│   │  Raw リンク  │     │  AIに送信   │     │  スキル使用 │              │
│   └──────────────┘     └──────────────┘     └──────────────┘              │
│                                                                             │
│        ▼                    ▼                     ▼                         │
│   任意のスキルを選択    Webアクセス可能なAIに    スキルの使用を開始！        │
│   Raw URLをコピー      送信                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 🎯 ステップバイステップガイド

| ステップ | アクション | ヒント |
|:----:|:-------|:-----|
| 1️⃣ | **スキルインデックスを閲覧** | 目次でクイックアクセス |
| 2️⃣ | **Raw リンクをコピー** | 形式: `skills/[category]/[name]/SKILL.md` |
| 3️⃣ | **AIに送信** | Claude、ChatGPT、Gemini など |
| 4️⃣ | **使用開始** | AIが対応するスキルモードをアクティベート |

### 💬 推奨アクティベーションプロンプト

```
以下のスキル定義を読み込んで対応するモードに切り替えてください：
https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/[category]/[skill-id]/SKILL.md
```

---

## 📂 スキルインデックス

### 📊 統計概要

| アイコン | カテゴリ | 数 | 説明 |
|:----:|:---------|:-----:|:------------|
| 🛠️ | [機能型](#-機能型スキル) | 6 | タスク実行、計画ツール |
| 💼 | [専門型](#-専門型スキル) | 4 | 法律、医療、投資、心理学 |
| 🎨 | [クリエイティブ型](#-クリエイティブ型スキル) | 2 | ライティング、作曲 |
| 🎭 | [キャラクター型](#-キャラクター型スキル) | 2 | ロールプレイ＆キャラクター |
| 📖 | [フィクションワールド](#-フィクションワールドスキル) | 1 | 東洋ファンタジー修仙世界 |

---

## 🛠️ 機能型スキル

> *タスク実行、計画、コーディング、翻訳、サバイバル、スポーツ*

| タグ | スキル | 役割 | 得意分野 | Raw リンク |
|:---:|:------|:-----|:---------|:---------|
| 🔥 | **TaskMaster** | タスク管理専門家 | 計画、GTD、タスク分解 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/smart-planner/SKILL.md) |
| 📊 | **DataAnalyst** | データ分析専門家 | データ分析、グラフ、インサイト | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/data-analyst/SKILL.md) |
| 💻 | **CodeMaster** | フルスタックエンジニア | コーディング、アーキテクチャ、デバッグ | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/programmer/SKILL.md) |
| 🌐 | **Translator** | 翻訳専門家 | 翻訳、語学学習 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/translator/SKILL.md) |
| 🏕️ | **SurvivalExpert** | 野外サバイバル専門家 | サバイバルスキル、緊急時対応 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/survival-expert/SKILL.md) |
| 🏃 | **SportsCoach** | スポーツコーチ | トレーニング、スキル向上 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/functional/sports-coach/SKILL.md) |

---

## 💼 専門型スキル

> *法律、医療、投資、心理学コンサルティング*

| タグ | スキル | 役割 | 得意分野 | Raw リンク |
|:---:|:------|:-----|:---------|:---------|
| ⚖️ | **LegalAdvisor** | 法務コンサルタント | 契約書レビュー、コンプライアンス | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/professional/legal-advisor/SKILL.md) |
| 🏥 | **MedicalAdvisor** | ヘルスケアコンサルタント | 症状分析、医療アドバイス | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/professional/medical-advisor/SKILL.md) |
| 📈 | **InvestmentAdvisor** | 投資コンサルタント | 投資計画、資産配分 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/professional/investment-advisor/SKILL.md) |
| 🧠 | **Psychologist** | 心理カウンセラー | 感情サポート、ストレス管理 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/professional/psychologist/SKILL.md) |

---

## 🎨 クリエイティブ型スキル

> *ライティング、作曲*

| タグ | スキル | 役割 | 得意分野 | Raw リンク |
|:---:|:------|:-----|:---------|:---------|
| ✍️ | **Writer** | プロライター | コンテンツ作成、編集 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/creative/writer/SKILL.md) |
| 🎵 | **MusicComposer** | 作曲家 | 楽曲制作、アレンジ | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/creative/music-composer/SKILL.md) |

---

## 🎭 キャラクター型スキル

> *ロールプレイ、アニメキャラクター、没入型体験*

| タグ | スキル | 役割 | 得意分野 | Raw リンク |
|:---:|:------|:-----|:---------|:---------|
| 💖 | **Kaguya** | 四宮かぐや | ツンデレお嬢様、恋愛RP | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/character/kaguya/SKILL.md) |
| 🕶️ | **GojoSatoru** | 五条悟 | 最強の呪術師、クールな先生 | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/character/gojo-satoru/SKILL.md) |

---

## 📖 フィクションワールドスキル

> *完全なゲームシステムを持つ没入型インタラクティブフィクションワールド*

### 🌍 フィクションワールドとは？

フィクションワールドは、コア理念「**万物はオブジェクト、万物は数値を持つ、万物は進化できる**」に基づいた完全で独立したインタラクティブ小説ワールドです。

各ワールドテンプレートには以下が含まれます：
- 📜 完全な世界設定と背景
- 🎮 完全なゲームシステム（属性、スキル、アイテム、イベント）
- 🎭 NPCと関係システム
- 📊 JSON Schemaによるデータ駆動メカニクス
- 📖 AI実行ガイドライン

### 🚀 ワールドへの入り方

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         🌍 ワールドアクティベーションフロー                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1️⃣ ワールドテンプレートのRawリンクをコピー                                 │
│   2️⃣ アクティベーションプロンプトと共にAIに送信                              │
│   3️⃣ AIがキャラクター作成をガイド                                           │
│   4️⃣ 冒険を始めよう！                                                       │
│                                                                             │
│   アクティベーションプロンプト：                                              │
│   "以下の世界設定を読み込んで、この世界へ導いてください：[Raw Link]"           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 📋 利用可能なワールド

| タグ | ワールド | テーマ | 特徴 | Raw リンク |
|:---:|:------|:------|:---------|:---------|
| 🐉 | **九州仙途** | 東洋ファンタジー/修仙 | 修仙、宗門、長生、因果システム | [Raw](https://raw.githubusercontent.com/badhope/mobile-skills/main/skills/fiction/eastern-fantasy/SKILL.md) |

---

## 📁 リポジトリ構造

```
mobile-skills/
├── .github/                  # GitHub テンプレート
├── agents/                   # レガシーAgentファイル（後方互換）
├── docs/                     # ドキュメント
│   ├── SKILL-SYSTEM-ARCHITECTURE.md
│   ├── PROJECT-ROADMAP.md
│   └── ...
├── fiction-worlds/           # フィクションワールド設定
├── migration/                # 移行ツール
├── orchestrator/             # オーケストレーターモジュール
│   ├── __init__.py
│   ├── dag_engine.py
│   └── registry.py
├── protocols/                # プロトコル層
│   ├── __init__.py
│   ├── mcp_protocol.py
│   ├── acp_protocol.py
│   └── mobile_protocol.py
├── quality-assurance/        # QAドキュメント
├── skills/                   # スキルプール
│   ├── functional/
│   ├── professional/
│   ├── creative/
│   ├── character/
│   ├── fiction/
│   └── INDEX.md
├── templates/                # テンプレート
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── README.zh-CN.md
└── README.ja-JP.md
```

---

## 📱 モバイルテスト

### モバイルアクティベーションガイド

1. **Rawリンクをコピー**: スキルのRaw URLをコピー
2. **AIアプリで開く**: Claude、ChatGPT、Geminiなどのモバイルアプリ
3. **プロンプトを送信**: 「以下のスキル定義を読み込んでください：[Raw URL]」
4. **スキルを使用**: AIがスキルモードで応答

### モバイル最適化のヒント

- 短いプロンプトを使用
- 一度に一つのスキルをアクティベート
- ネットワーク接続を確認

---

## 🤝 貢献ガイド

貢献を歓迎します！詳細は [CONTRIBUTING.md](CONTRIBUTING.md) をご覧ください。

### 貢献方法

1. リポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-skill`)
3. 変更をコミット (`git commit -m 'Add amazing skill'`)
4. ブランチにプッシュ (`git push origin feature/amazing-skill`)
5. プルリクエストを作成

---

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています - 詳細は [LICENSE](LICENSE) をご覧ください。

---

**最終更新**: 2026-03-28
