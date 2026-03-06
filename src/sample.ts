export const sampleContent = `# Markdown Editor 示例

## 1. 标题和文本格式

支持 **粗体**、*斜体*、~~删除线~~、行内代码。

> 这是一个引用块

---

## 2. 列表

### 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

### 有序列表
1. 第一项
2. 第二项
3. 第三项

---

## 3. 代码块

### JavaScript
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Python
\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

### Rust
\`\`\`rust
fn main() {
    println!("Hello, world!");
}
\`\`\`

---

## 4. 表格

| 功能 | 支持 |
|------|------|
| 流程图 | ✅ |
| 时序图 | ✅ |
| 类图 | ✅ |
| 状态图 | ✅ |
| 甘特图 | ✅ |

---

## 5. Mermaid 图表

### 流程图 (Flowchart)
\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\`

### 时序图 (Sequence Diagram)
\`\`\`mermaid
sequenceDiagram
    participant User
    participant System
    participant Database
    User->>System: Send Request
    System->>Database: Query Data
    Database-->>System: Return Result
    System-->>User: Response
\`\`\`

### 类图 (Class Diagram)
\`\`\`mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat
\`\`\`

### 状态图 (State Diagram)
\`\`\`mermaid
stateDiagram-v2
    [*] --> Initial
    Initial --> Running: Execute Task
    Running --> Completed: Task Done
    Completed --> [*]
    Running --> Failed: Error
    Failed --> [*]
\`\`\`

### 甘特图 (Gantt Chart)
\`\`\`mermaid
gantt
    title Project Schedule
    dateFormat  YYYY-MM-DD
    section Phase 1
    Requirements :a1, 2024-01-01, 7d
    Design :a2, after a1, 5d
    section Phase 2
    Development :b1, after a2, 14d
    Testing :b2, after b1, 5d
    section Phase 3
    Integration :c1, after b2, 7d
    Acceptance :c2, after c1, 5d
\`\`\`

### 饼图 (Pie Chart)
\`\`\`mermaid
pie
    title User Distribution
    "East China" : 35
    "South China" : 25
    "North China" : 20
    "Southwest" : 12
    "Others" : 8
\`\`\`

### 实体关系图 (ER Diagram)
\`\`\`mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : included
    USER ||--o{ REVIEW : writes
    CATEGORY ||--o{ PRODUCT : categorizes

    USER {
        int id PK
        string username
        string email
    }
    ORDER {
        int id PK
        int user_id FK
        decimal total_amount
        string status
    }
    PRODUCT {
        int id PK
        string name
        decimal price
        int stock
        int category_id FK
    }
\`\`\`

---

## 6. 链接

[访问 GitHub](https://github.com)

---

> 试试编辑上面的内容，预览会实时更新！
`
