# XState v5 入門教學

## 1. XState 是什麼？

XState 是一個用於建構有限狀態機（Finite State Machine, FSM）與狀態圖（Statecharts）的 JavaScript 函式庫。v5 版本語法更簡潔、現代化，提升開發體驗。

---

## 2. 基本概念

- **State（狀態）**：系統當下所處的情境（如 idle、loading、success、error）。
- **Event（事件）**：觸發狀態轉換的動作（如 CLICK、SUBMIT）。
- **Context（上下文）**：儲存狀態機的資料（如表單內容、計數器數值）。
- **Actions（動作）**：狀態轉換時執行的副作用（如 log、API 呼叫、context 更新）。
- **Guards（守衛）**：條件判斷，決定是否允許狀態轉換。
- **Actors（舊稱 services）**：非同步邏輯（如 API 請求、計時器），可與狀態機互動。

---

## 3. 基本語法與範例（v5）

### 安裝
```bash
npm install xstate@latest
```

### 建立簡單狀態機
```js
import { createMachine } from 'xstate';

const toggleMachine = createMachine({
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        TOGGLE: { target: 'active' }
      }
    },
    active: {
      on: {
        TOGGLE: { target: 'inactive' }
      }
    }
  }
});
```

### 使用 context 與 assign
```js
import { createMachine, assign } from 'xstate';

const counterMachine = createMachine({
  context: { count: 0 },
  on: {
    INCREMENT: {
      actions: assign({
        count: ({ context }) => context.count + 1
      })
    }
  }
});
```
> v5 assign 語法：`assign({ key: ({ context, event }) => newValue })`

### 加入 guards（守衛）
```js
const machine = createMachine({
  context: { count: 0 },
  on: {
    INCREMENT: {
      guard: ({ context }) => context.count < 5,
      actions: assign({ count: ({ context }) => context.count + 1 })
    }
  }
});
```
> v5 將 `cond` 改為 `guard`，語法更直覺。

### 加入 actors（非同步邏輯）
```js
const fetchMachine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: { target: 'loading' }
      }
    },
    loading: {
      invoke: {
        src: 'fetchData',
        onDone: { target: 'success' },
        onError: { target: 'failure' }
      }
    },
    success: {},
    failure: {}
  }
});
```
> v5 將 services 改名為 actors，`invoke.src` 可直接用字串或函式。

---

## 4. 常見用法與進階技巧

- **嵌套狀態（Nested States）**：可描述更複雜的流程。
- **平行狀態（Parallel States）**：多個子狀態同時運作。
- **狀態機視覺化**：可用 [Stately](https://stately.ai/viz) 工具視覺化設計。
- **與 React 整合**：可搭配 `@xstate/react` 使用 hooks 控制 UI。

---

## 5. XState v5：Actor 全面概念補充

### 什麼是 Actor？

在 XState v5 中，**所有狀態機、子機、Promise、Observable、Callback、甚至外部服務都被統一稱為 Actor**。Actor 是一個可以接收事件、處理事件、並根據事件產生狀態或回應的獨立單元。

---

### v5 與 v4 的差異

- **v4**：只有 service（服務）是可被啟動的單元，狀態機本身不是 actor。
- **v5**：每個狀態機本身就是一個 actor，所有子機、非同步任務、甚至 parent/child 機器都以 actor 概念統一。
- **溝通方式**：actor 之間可用 `send` 互相傳遞事件，彼此獨立、解耦。

---

### Actor 的特性

- **獨立性**：每個 actor 有自己的狀態與 context。
- **可組合**：actor 可以 spawn（產生）其他 actor，形成樹狀結構。
- **訊息傳遞**：actor 之間用 `send` 傳遞事件，不直接呼叫彼此方法。
- **可觀察**：actor 可被觀察（subscribe），適合整合到 React 等框架。

---

### 在狀態機中運用 Actor

#### 1. 狀態機本身就是 Actor
```js
import { createMachine } from 'xstate';
const machine = createMachine({ ... });
// machine 是一個 actor
```

#### 2. 使用 invoke 產生子 Actor
```js
const parentMachine = createMachine({
  states: {
    loading: {
      invoke: {
        src: someChildMachine, // 這也是一個 actor
        onDone: { target: 'success' }
      }
    }
  }
});
```

#### 3. Actor 之間傳遞事件
```js
// 在 actor 內部
send({ type: 'SOME_EVENT' }, { to: childActorRef });
```

#### 4. 監聽 Actor 狀態
```js
import { createActor } from 'xstate';
const actor = createActor(machine);
actor.subscribe((state) => {
  console.log(state.value);
});
```

---

### 小結

- XState v5 將所有可互動單元統一為 Actor，提升彈性與可組合性。
- Actor 之間透過事件傳遞，彼此獨立、易於測試。
- 這種設計讓狀態機更容易擴展、整合非同步任務與多層級邏輯。

---

## 6. 參考資源

- [XState v5 官方文件](https://stately.ai/docs/xstate/v5/)
- [Stately 視覺化工具](https://stately.ai/viz)
- [XState Patterns](https://xstate.js.org/patterns/)

---

如需更進階範例或有任何問題，歡迎隨時提問！ 